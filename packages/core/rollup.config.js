import { withNx } from '@nx/rollup/with-nx.js';

export default withNx(
  {
    main: './src/index.ts',
    outputPath: '../../dist/packages/core',
    tsConfig: './tsconfig.lib.json',
    compiler: 'tsc',
    format: ['cjs', 'esm'],
  },
  {
    // Additional rollup configuration here
    // Example: output: { sourcemap: true },
  }
);
