import { Node } from 'tiptap'

export default class Video extends Node {
  get name() {
    return 'video'
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        controls: {
          default: true,
        },
      },

      group: 'inline',
      draggable: false,
      parseDOM: [
        {
          tag: 'video',
          getAttrs: dom => ({
            src: dom.firstElementChild.getAttribute('src'),
            controls: dom.hasAttribute('controls'),
          }),
        },
      ],
      toDOM: node => {
        const video = document.createElement('video')
        video.controls = node.attrs.controls
        const source = document.createElement('source')
        video.appendChild(source)
        source.src = node.attrs.src
        return video
      },
    }
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos
      const node = type.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }
}
