import * as fs from "fs";

interface WasmExports {
  factorial: (n: number) => bigint;
  fibonacci: (n: number) => bigint;
  esPrimo:   (n: number) => number;
  sumaArray: (ptr: number, len: number) => bigint;
  potencia:  (base: bigint, exp: number) => bigint;
  memory:    WebAssembly.Memory;
}

async function cargarWasm(): Promise<WasmExports> {
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

  const wasm = await cargarWasm();
  console.log("[>>] Modulo .wasm cargado e instanciado correctamente\n");

  // 1. Factorial
  console.log("-- 1. Factorial --");
  bench("factorial(20)", () => wasm.factorial(20));
  bench("factorial(50)", () => wasm.factorial(50));

  // 2. Fibonacci
  console.log("\n-- 2. Fibonacci --");
  bench("fibonacci(40)", () => wasm.fibonacci(40));
  bench("fibonacci(80)", () => wasm.fibonacci(80));

  // 3. Primos
  console.log("\n-- 3. Verificacion de primos --");
  for (const n of [7919, 104729, 1000003, 999983]) {
    bench(`esPrimo(${n})`, () => wasm.esPrimo(n) ? "PRIMO" : "no primo");
  }

  // 4. Suma de array via memoria lineal WASM
  console.log("\n-- 4. Suma de array (memoria lineal WASM) --");
  const N = 50_000;
  const datos = Int32Array.from({ length: N }, (_, i) => i + 1);

  // Escribir datos directamente en la memoria del modulo WASM
  const memView = new Int32Array(wasm.memory.buffer);
  memView.set(datos, 0); // offset 0, sin colision con heap de AssemblyScript

  bench(`sumaArray WASM (${N.toLocaleString()} elementos)`, () => wasm.sumaArray(0, N));

  // Mismo calculo en JS puro para comparar
  const t0 = performance.now();
  let sumaJS = 0n;
  for (let i = 0; i < N; i++) sumaJS += BigInt(datos[i]);
  const t1 = performance.now();
  console.log(`  [JS] sumaArray JS puro:      ${sumaJS}  (${(t1 - t0).toFixed(4)} ms)`);

  // 5. Potencia
  console.log("\n-- 5. Potencia --");
  bench("potencia(2n, 62)", () => wasm.potencia(2n, 62));

  // Benchmark: WASM vs JS puro
  console.log("\n==============================================");
  console.log("  Benchmark: WASM vs JS puro (factorial x1M)");
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

  console.log(`\n  factorial(${M}) x ${ITER.toLocaleString()} iteraciones:`);
  console.log(`  JavaScript : ${jsMs} ms`);
  console.log(`  WebAssembly: ${wasmMs} ms`);
  console.log(`  -> WASM fue ${ratio}x ${Number(ratio) >= 1 ? "mas rapido que JS" : "similar (overhead de llamada domina)"}\n`);
}

main().catch(console.error);
