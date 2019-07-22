import { Mark } from 'tiptap'

export default class FontSize extends Mark {
  get name() {
    return 'fontsize'
  }
  get defaultOptions() {
    return {
      sizes: [14, 16, 20],
    }
  }

  get schema() {
    return {
      attrs: {
        size: {
          default: 16,
        },
      },
      parseDOM: [
        {
          style: 'font-size',
          //getAttrs: mark => ({ fontSize: 'fontSize' in mark.style ? mark.style.fontSize : '' })
          getAttrs: mark => {
            // debugger
            let r = this.options.sizes.includes(+mark.slice(0, mark.length - 2))
            return r
              ? {
                  size: +mark.slice(0, mark.length - 2),
                }
              : null
          },
        },
      ],
      toDOM: node => [
        'span',
        node.attrs.size != 16
          ? {
              style: `font-size: ${node.attrs.size}px`,
            }
          : {},
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
