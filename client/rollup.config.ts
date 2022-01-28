import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import summary from "rollup-plugin-summary";
import visualizer from "rollup-plugin-visualizer";
import minifyHTML from "rollup-plugin-minify-html-literals";

let plugins = [
  typescript(),
  resolve(),
  minifyHTML(),
  terser({
    ecma: 2020,
    module: true,
    compress: true,
    mangle: {
      properties: {
        regex: /^(#|__)/,
      },
      toplevel: true,
    },
  }),
  visualizer(),
  // Print bundle summary
  summary({}),
];

export default [
  {
    plugins,
    input: "src/main.ts",
    output: {
      sourcemap: true,
      file: "build/bundle.js",
      format: "es",
    },
  },
];
