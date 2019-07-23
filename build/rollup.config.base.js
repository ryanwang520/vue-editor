import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import cjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'

const config = require('../package.json')

export default {
  // external: ['prosemirror-utils', 'v-tooltipo', 'tiptap',],
  external: ['vue'],
  input: 'src/index.js',
  plugins: [
    resolve({
      mainFields: ['module', 'jsnext:main', 'main', 'browser'],
    }),
    vue({
      css: true,
      compileTemplate: true, // Explicitly convert template to render function
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    cjs({
      exclude: 'src/**',
    }),
    replace({
      VERSION: JSON.stringify(config.version),
    }),
    postcss(),
  ],
}
