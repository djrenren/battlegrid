import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import summary from "rollup-plugin-summary";

export default {
  plugins: [
    typescript(),
    resolve(),
    terser({
      ecma: 2020,
      module: true,
    }),
    // Print bundle summary
    summary({}),
  ],
  input: "src/main.ts",
  output: {
    file: "build/bundle.js",
    format: "es",
  },
};
