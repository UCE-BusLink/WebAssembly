# WebAssembly Demo — TypeScript + Node.js

Practical implementation of WebAssembly using **AssemblyScript** (TypeScript → .wasm) and a runner in **TypeScript/Node**.

## Structure

```
wasm-demo/
├── assembly/
│   └── index.ts        # AssemblyScript source → compiled to .wasm
├── build/
│   └── release.wasm    # Compiled WebAssembly module
├── src/
│   └── main.ts         # TypeScript runner that loads and executes the module
├── tsconfig.json
└── package.json
```

## Functions implemented in WASM

| Function | Description |
|---|---|
| `factorial(n)` | Iterative factorial using i64 |
| `fibonacci(n)` | Optimized iterative Fibonacci |
| `isPrime(n)` | O(√n) primality check |
| `sumArray(ptr, len)` | Array sum via linear memory |
| `power(base, exp)` | Integer power |

## How to run

```bash
npm install
npm run build:wasm    # Compile AssemblyScript → .wasm
npm run start         # Run the demo with ts-node
# or all together:
npm run demo
```

## Key concept: linear memory

The `sumaArray` function demonstrates access to linear memory shared between JS and WASM:

```typescript
// JS writes data into the WASM module memory
const memory = new Int32Array(wasm.memory.buffer);
memory.set(data, 0);
// WASM reads directly from that memory (zero copies)
const sum = wasm.sumaArray(0, data.length);
```
