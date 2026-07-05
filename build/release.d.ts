/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * assembly/index/factorial
 * @param n `i32`
 * @returns `i64`
 */
export declare function factorial(n: number): bigint;
/**
 * assembly/index/fibonacci
 * @param n `i32`
 * @returns `i64`
 */
export declare function fibonacci(n: number): bigint;
/**
 * assembly/index/esPrimo
 * @param n `i32`
 * @returns `bool`
 */
export declare function isPrime(n: number): boolean;
/**
 * assembly/index/sumaArray
 * @param ptr `i32`
 * @param len `i32`
 * @returns `i64`
 */
export declare function sumArray(ptr: number, len: number): bigint;
/**
 * assembly/index/power
 * @param base `i64`
 * @param exp `i32`
 * @returns `i64`
 */
export declare function power(base: bigint, exp: number): bigint;
