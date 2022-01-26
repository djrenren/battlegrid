import typescript from "@rollup/plugin-typescript";
import {terser} from 'rollup-plugin-terser';
import summary from 'rollup-plugin-summary';

export default {
  plugins: [
    typescript(),
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
