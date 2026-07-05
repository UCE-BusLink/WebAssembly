// ============================================================
// WebAssembly Demo - AssemblyScript Module
// Funciones compiladas a .wasm para máximo rendimiento
// ============================================================

// 1. Factorial iterativo (sin recursión para evitar stack overflow)
export function factorial(n: i32): i64 {
  let result: i64 = 1;
  for (let i: i32 = 2; i <= n; i++) {
    result *= i as i64;
  }
  return result;
}

// 2. Fibonacci con memoization en memoria lineal WASM
export function fibonacci(n: i32): i64 {
  if (n <= 1) return n as i64;
  let a: i64 = 0;
  let b: i64 = 1;
  for (let i: i32 = 2; i <= n; i++) {
    const tmp: i64 = a + b;
    a = b;
    b = tmp;
  }
  return b;
}

// 3. Verificador de número primo (O(√n))
export function esPrimo(n: i32): bool {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  let i: i32 = 3;
  while (i * i <= n) {
    if (n % i === 0) return false;
    i += 2;
  }
  return true;
}

// 4. Suma de array en memoria lineal WASM
//    ptr = puntero al inicio del array de i32 en memoria lineal
//    len = cantidad de elementos
export function sumaArray(ptr: i32, len: i32): i64 {
  let total: i64 = 0;
  for (let i: i32 = 0; i < len; i++) {
    total += load<i32>(ptr + i * 4) as i64;
  }
  return total;
}

// 5. Potencia entera (base^exp)
export function potencia(base: i64, exp: i32): i64 {
  let resultado: i64 = 1;
  for (let i: i32 = 0; i < exp; i++) {
    resultado *= base;
  }
  return resultado;
}
