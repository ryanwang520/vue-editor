import { Node } from 'tiptap'
import { findParentNode, findSelectedNodeOfType } from 'prosemirror-utils'
import { setBlockType, textblockTypeInputRule } from 'tiptap-commands'

import { ParagraphAttrs } from './Paragraph'
import { getParagraphNodeAttrs, toParagraphDOM } from './Paragraph'

export default class Heading extends Node {
  get name() {
    return 'heading'
  }

  get defaultOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
    }
  }

  get schema() {
    return {
      attrs: {
        ...ParagraphAttrs,
        level: {
          default: 1,
        },
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: this.options.levels.map(level => {
        return {
          tag: `h${level}`,
          getAttrs: dom => {
            const attrs = getParagraphNodeAttrs(dom)
            attrs.level = level
            return attrs
          },
        }
      }),
      toDOM: node => {
        const dom = toParagraphDOM(node)
        const level = node.attrs.level || 1
        dom[0] = `h${level}`
        return dom
      },
    }
  }

  commands({ type, schema }) {
    return attrs => {
      // debugger
      return (state, dispatch, view) => {
        const predicate = node => node.type === type
        const node =
          findSelectedNodeOfType(type)(state.selection) ||
          findParentNode(predicate)(state.selection)
        if (!node) {
          const current =
            findSelectedNodeOfType(() => true)(state.selection) ||
            findParentNode(() => true)(state.selection)

          return setBlockType(type, { ...current.node.attrs, ...attrs })(
            state,
            dispatch,
            view
          )
        }
        const { level, ...otherAttrs } = node.node.attrs

        if (level != attrs.level) {
          return setBlockType(type, { ...otherAttrs, level: attrs.level })(
            state,
            dispatch,
            view
          )
        } else {
          return setBlockType(schema.nodes.paragraph, otherAttrs)(
            state,
            dispatch,
            view
          )
        }
      }
    }
  }

  keys({ type }) {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
        },
      }),
      {}
    )
  }

  inputRules({ type }) {
    return this.options.levels.map(level =>
      textblockTypeInputRule(new RegExp(`^(#{1,${level}})\\s$`), type, () => ({
        level,
      }))
    )
  }
}
