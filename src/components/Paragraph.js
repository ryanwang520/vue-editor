import { setBlockType } from 'tiptap-commands'
import { Node } from 'tiptap'
const ALIGN_PATTERN = /(left|right|center|justify)/

export const ParagraphAttrs = {
  align: { default: null },
}

export default class Paragraph extends Node {
  get name() {
    return 'paragraph'
  }

  get schema() {
    return {
      attrs: ParagraphAttrs,
      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: [
        {
          tag: 'p',
          getAttrs,
        },
      ],
      toDOM,
    }
  }

  commands({ type }) {
    return () => setBlockType(type)
  }
}

function getAttrs(dom) {
  const { textAlign } = dom.style

  let align = dom.getAttribute('align') || textAlign || ''
  align = ALIGN_PATTERN.test(align) ? align : null
  return { align }
}

function toDOM(node) {
  const { align } = node.attrs
  const attrs = {}

  let style = ''
  if (align && align !== 'left') {
    style += `text-align: ${align};`
  }

  style && (attrs.style = style)

  return ['p', attrs, 0]
}
export const toParagraphDOM = toDOM
export const getParagraphNodeAttrs = getAttrs
