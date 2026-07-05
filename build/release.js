async function instantiate(module, imports = {}) {
  const { exports } = await WebAssembly.instantiate(module, imports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    esPrimo(n) {
      // assembly/index/isPrime(i32) => bool
      return exports.isPrime(n) != 0;
    },
    power(base, exp) {
      // assembly/index/power(i64, i32) => i64
      base = base || 0n;
      return exports.power(base, exp);
    },
  }, exports);
  return adaptedExports;
}
export const {
  memory,
  factorial,
  fibonacci,
  isPrime,
  sumArray,
  power,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("release.wasm", import.meta.url));
