import { ParagraphAttrs } from './Paragraph'
import { getParagraphNodeAttrs, toParagraphDOM } from './Paragraph'
import { ListItem as L } from 'tiptap-extensions'

export default class ListItem extends L {
  get schema() {
    return {
      attrs: ParagraphAttrs,
      content: 'paragraph block*',
      defining: true,
      draggable: false,
      parseDOM: [
        {
          tag: 'li',
          getAttrs: dom => {
            const attrs = getParagraphNodeAttrs(dom)
            return attrs
          },
        },
      ],
      toDOM: node => {
        const dom = toParagraphDOM(node)
        dom[0] = 'li'
        return dom
      },
    }
  }
}
