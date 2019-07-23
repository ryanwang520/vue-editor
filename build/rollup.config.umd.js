import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    globals: {
      vue: 'Vue',
    },
    exports: 'named',
    name: 'vue-editor',
    file: 'dist/vue-editor.umd.js',
    format: 'umd',
  },
})

export default config
