import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import sourcemaps from "rollup-plugin-sourcemaps";
import resolve from "@rollup/plugin-node-resolve";
import summary from "rollup-plugin-summary";
import visualizer from "rollup-plugin-visualizer";
import minifyHTML from "rollup-plugin-minify-html-literals";
import copy from "rollup-plugin-copy";

let plugins = [
  typescript({ sourceMap: true, inlineSourceMap: true, inlineSources: true }),
  resolve(),
  minifyHTML(),
  terser({
    ecma: 2020,
    module: true,
    mangle: {
      properties: {
        regex: /^(#|__)/,
      },
      toplevel: true,
    },
    keep_classnames: false,
    safari10: false,
  }),
  copy({
    targets: [{ src: "static/**/*", dest: "build" }],
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
      sourcemap: "inline",
      file: "build/bundle.js",
      format: "es",
    },
  },
  {
    plugins,
    input: "src/net/resources/service-worker.ts",
    output: {
      sourcemap: true,
      file: "build/service-worker.js",
      format: "es",
    },
  },
];
