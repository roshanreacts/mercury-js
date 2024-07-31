import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import terser from '@rollup/plugin-terser';

const folderBuilds = [
  'packages/redisCache',
  'packages/rateLimiter',
  'packages/trpcServer',
  'packages/salesCloud',
  'packages/recordOwner',
  'packages/historyTracking',
  'packages/platform',
  'plugins/logify'
].map((folder) => ({
  input: `src/${folder}/index.ts`,
  output: [
    {
      file: `dist/cjs/${folder}/index.js`,
      sourcemap: true,
      format: 'cjs',
    },
    {
      file: `dist/esm/${folder}/index.js`,
      sourcemap: true,
      format: 'es',
    },
  ],
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    generatePackageJson({
      baseContents: {
        name: `@mercury-js/core/${folder}`,
        private: false,
        main: `../../dist/cjs/${folder}/index.js`,
        module: `../../dist/esm/${folder}/index.js`,
        types: './index.d.ts',
      },
      outputFolder: `./${folder}/`,
    }),
    // terser(),
  ],
}));

export default [
  {
    input: 'src/mercury.ts',
    external: ['mongoose'],
    plugins: [
      typescript({
        declaration: true,
        rootDir: 'types/',
      }), // so Rollup can convert TypeScript to JavaScript
      commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto', // <---- this solves default issue
      }),
      // json(),
      // terser(),
    ],
    output: [
      { dir: 'dist/cjs/', format: 'cjs' },
      { dir: 'dist/esm/', format: 'es' },
    ],
  },
  ...folderBuilds,
];
