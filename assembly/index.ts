// ============================================================
// WebAssembly Demo - AssemblyScript Module
// Functions compiled to .wasm for maximum performance
// ============================================================

// 1. Iterative factorial (without recursion to avoid stack overflow)
export function factorial(n: i32): i64 {
  let result: i64 = 1;
  for (let i: i32 = 2; i <= n; i++) {
    result *= i as i64;
  }
  return result;
}

// 2. Fibonacci with memoization in WASM linear memory
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

// 3. Prime number checker (O(√n))
export function isPrime(n: i32): bool {
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

// 4. Sum of array in linear memory WASM
//    ptr = pointer to the beginning of the i32 array in linear memory
//    len = number of elements
export function sumArray(ptr: i32, len: i32): i64 {
  let total: i64 = 0;
  for (let i: i32 = 0; i < len; i++) {
    total += load<i32>(ptr + i * 4) as i64;
  }
  return total;
}

// 5. Integer power (base^exp)
export function power(base: i64, exp: i32): i64 {
  let result: i64 = 1;
  for (let i: i32 = 0; i < exp; i++) {
    result *= base;
  }
  return result;
}
