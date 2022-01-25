import typescript from '@rollup/plugin-typescript';
import node_resolve from '@rollup/plugin-node-resolve';

export default {
    plugins: [typescript(), node_resolve()],
    input: 'src/main.ts',
    output: {
      file: 'bundle.js',
      format: 'es'
    }
  };