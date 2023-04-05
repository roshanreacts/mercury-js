import multi from '@rollup/plugin-multi-entry';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import dts from 'rollup-plugin-dts';
import path from 'path';

const folderBuilds = ['packages/extendModelTypes'].map((folder) => ({
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
        name: '@mercury-js/core/packages/extendModelTypes',
        private: true,
        main: '../../dist/cjs/packages/extendModelTypes/index.js',
        module: '../../dist/esm/packages/extendModelTypes/index.js',
        types: '../../dist/esm/packages/extendModelTypes/index.d.ts',
      },
      outputFolder: `./${folder}/`,
    }),
  ],
}));

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
    ],
    output: [
      { dir: 'dist/cjs/', format: 'cjs' },
      { dir: 'dist/esm/', format: 'es' },
    ],
  },
  //   {
  //     input: 'types/mercury.d.ts',
  //     plugins: [dts()],
  //     output: [{ file: pkg.types, format: 'es' }],
  //   },
  ...folderBuilds,
];
