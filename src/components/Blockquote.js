import { ParagraphAttrs } from './Paragraph'
import { getParagraphNodeAttrs, toParagraphDOM } from './Paragraph'
import { Blockquote as BQ } from 'tiptap-extensions'

export default class Blockquote extends BQ {
  get schema() {
    return {
      attrs: ParagraphAttrs,
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,

      parseDOM: [
        {
          tag: 'blockquote',
          getAttrs: dom => {
            const attrs = getParagraphNodeAttrs(dom)
            return attrs
          },
        },
      ],
      toDOM: node => {
        const dom = toParagraphDOM(node)
        dom[0] = 'blockquote'
        return dom
      },
    }
  }
}
