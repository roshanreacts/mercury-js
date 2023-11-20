import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import terser from '@rollup/plugin-terser';

const folderBuilds = ['packages/extendModelTypes', 'packages/rateLimiter'].map(
  (folder) => ({
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
  })
);

export default [
  {
    input: 'src/mercury.ts',
    external: ['mongoose'],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'dist/types',
        rootDir: 'src/',
      }), // so Rollup can convert TypeScript to JavaScript
      commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto', // <---- this solves default issue
      }),
      // terser(),
    ],
    output: [
      { dir: 'dist/cjs/', format: 'cjs' },
      { dir: 'dist/esm/', format: 'es' },
    ],
  },
  ...folderBuilds,
];
