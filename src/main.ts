import * as fs from "fs";

interface WasmExports {
  factorial: (n: number) => bigint;
  fibonacci: (n: number) => bigint;
  isPrime:   (n: number) => number;
  sumArray: (ptr: number, len: number) => bigint;
  power:  (base: bigint, exp: number) => bigint;
  memory:    WebAssembly.Memory;
}

async function loadWasm(): Promise<WasmExports> {
  const wasmPath = new URL("../build/release.wasm", import.meta.url).pathname;
  const bytes    = fs.readFileSync(wasmPath);
  const { instance } = await WebAssembly.instantiate(bytes, {
    env: {
      abort: (_msg: unknown, _file: unknown, line: number, col: number) => {
        console.error(`WASM abort at ${line}:${col}`);
      },
    },
  });
  return instance.exports as unknown as WasmExports;
}

function bench(label: string, fn: () => unknown): void {
  const t0     = performance.now();
  const result = fn();
  const t1     = performance.now();
  console.log(`  [OK] ${label}: ${result}  (${(t1 - t0).toFixed(4)} ms)`);
}

function factorialJS(n: number): bigint {
  let r = 1n;
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}

async function main(): Promise<void> {
  console.log("\n==============================================");
  console.log("     WebAssembly Demo - TypeScript / Node     ");
  console.log("==============================================\n");

  const wasm = await loadWasm();
  console.log("[>>] Module .wasm loaded and instantiated successfully\n");

  // 1. Factorial
  console.log("-- 1. Factorial --");
  bench("factorial(20)", () => wasm.factorial(20));
  bench("factorial(50)", () => wasm.factorial(50));

  // 2. Fibonacci
  console.log("\n-- 2. Fibonacci --");
  bench("fibonacci(40)", () => wasm.fibonacci(40));
  bench("fibonacci(80)", () => wasm.fibonacci(80));

  // 3. Primos
  console.log("\n-- 3. Prime verification --");
  for (const n of [7919, 104729, 1000003, 999983]) {
    bench(`isPrime(${n})`, () => wasm.isPrime(n) ? "PRIME" : "no prime");
  }

  // 4. Array summation via linear memory WASM
  console.log("\n-- 4. Array sum (linear memory WASM) --");
  const N = 50_000;
  const datos = Int32Array.from({ length: N }, (_, i) => i + 1);

  // Write data directly to the WASM module memory
  const memView = new Int32Array(wasm.memory.buffer);
  memView.set(data, 0); // offset 0, no collision with AssemblyScript heap

  bench(`sumArray WASM (${N.toLocaleString()} elements)`, () => wasm.sumArray(0, N));

  // Same calculation in pure JS for comparison
  const t0 = performance.now();
  let sumJS = 0n;
  for (let i = 0; i < N; i++) sumJS += BigInt(data[i]);
  const t1 = performance.now();
  console.log(`  [JS] sumArray JS pure:      ${sumJS}  (${(t1 - t0).toFixed(4)} ms)`);

  // 5. Power
  console.log("\n-- 5. Power --");
  bench("power(2n, 62)", () => wasm.power(2n, 62));

  // Benchmark: WASM vs JS puro
  console.log("\n==============================================");
  console.log("  Benchmark: WASM vs JS pure (factorial x1M)");
  console.log("==============================================");

  const M = 18;
  const ITER = 1_000_000;

  const t2 = performance.now();
  for (let i = 0; i < ITER; i++) factorialJS(M);
  const t3 = performance.now();

  const t4 = performance.now();
  for (let i = 0; i < ITER; i++) wasm.factorial(M);
  const t5 = performance.now();

  const jsMs   = (t3 - t2).toFixed(2);
  const wasmMs = (t5 - t4).toFixed(2);
  const ratio  = ((t3 - t2) / (t5 - t4)).toFixed(2);

  console.log(`\n  factorial(${M}) x ${ITER.toLocaleString()} iterations:`);
  console.log(`  JavaScript : ${jsMs} ms`);
  console.log(`  WebAssembly: ${wasmMs} ms`);
  console.log(`  -> WASM was ${ratio}x ${Number(ratio) >= 1 ? "faster than JS" : "similar (overhead of call dominates)"}\n`);
}

main().catch(console.error);
