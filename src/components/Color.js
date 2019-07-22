import { Mark } from 'tiptap'

export default class Color extends Mark {
  get name() {
    return 'color'
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: '#000000',
        },
      },
      parseDOM: [
        {
          style: 'color',
          getAttrs: mark => {
            return {
              color: mark,
            }
          },
        },
      ],
      toDOM: node => [
        'span',
        {
          style: `color: ${node.attrs.color}`,
        },
        0,
      ],
    }
  }

  commands({ type }) {
    return attrs => {
      return (state, dispatch) => {
        const { from, to, empty } = state.selection
        var tr
        if (!empty) {
          tr = state.tr.addMark(from, to, type.create(attrs))
        } else {
          tr = state.tr.addStoredMark(type.create(attrs))
        }
        dispatch(tr.scrollIntoView())

        return true
      }
    }
  }
}
