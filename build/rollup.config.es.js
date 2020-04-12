import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vue-editor',
    file: 'dist/vue-editor.es.js',
    format: 'es',
  },
})

export default config
