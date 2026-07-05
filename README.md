# WebAssembly Demo — TypeScript + Node.js

Implementación práctica de WebAssembly usando **AssemblyScript** (TypeScript → .wasm) y un runner en **TypeScript/Node**.

## Estructura

```
wasm-demo/
├── assembly/
│   └── index.ts        # Código fuente AssemblyScript → compilado a .wasm
├── build/
│   └── release.wasm    # Módulo WebAssembly compilado
├── src/
│   └── main.ts         # Runner TypeScript que carga y ejecuta el módulo
├── tsconfig.json
└── package.json
```

## Funciones implementadas en WASM

| Función | Descripción |
|---|---|
| `factorial(n)` | Factorial iterativo con i64 |
| `fibonacci(n)` | Fibonacci iterativo optimizado |
| `esPrimo(n)` | Verificación de primalidad O(√n) |
| `sumaArray(ptr, len)` | Suma de array vía memoria lineal |
| `potencia(base, exp)` | Potencia entera |

## Cómo ejecutar

```bash
npm install
npm run build:wasm    # Compila AssemblyScript → .wasm
npm run start         # Ejecuta el demo con ts-node
# o todo junto:
npm run demo
```

## Concepto clave: memoria lineal

La función `sumaArray` demuestra el acceso a memoria lineal compartida entre JS y WASM:

```typescript
// JS escribe datos en la memoria del módulo WASM
const memoria = new Int32Array(wasm.memory.buffer);
memoria.set(datos, 0);
// WASM lee directamente desde esa memoria (cero copias)
const suma = wasm.sumaArray(0, datos.length);
```
