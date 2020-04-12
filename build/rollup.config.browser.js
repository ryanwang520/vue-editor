import base from './rollup.config.base'

import { terser } from 'rollup-plugin-terser'

const config = Object.assign({}, base, {
  output: {
    globals: {
      'v-tooltip': 'vTooltip',
      'prosemirror-utils': 'prosemirrorUtils',
      'tiptap-extensions': 'tiptapExtensions',
      'tiptap-commands': 'tiptapCommands',
      tiptap: 'tiptap',
    },
    name: 'VueEditor',
    file: 'dist/vue-editor.min.js',
    format: 'iife',
  },
})
config.plugins.push(terser())

export default config
