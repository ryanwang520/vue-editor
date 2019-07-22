import { Mark } from 'tiptap'

export default class ColorFill extends Mark {
  get name() {
    return 'fill'
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: '#ffffff',
        },
      },
      parseDOM: [
        {
          style: 'background-color',
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
          style: `background-color: ${node.attrs.color}`,
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
        }

        tr = state.tr.addStoredMark(type.create(attrs))
        dispatch(tr.scrollIntoView())
        return true
      }
    }
  }
}
