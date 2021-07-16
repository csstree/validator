const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const { terser } = require("rollup-plugin-terser");

module.exports = {
  input: "lib/validate.js",
  output: [
    {
      name: "csstreeValidator",
      format: "esm",
      sourcemap: true,
      file: "dist/csstree-validator.js",
    },
  ],
  plugins: [resolve({ browser: true }), commonjs(), json(), terser()],
};
