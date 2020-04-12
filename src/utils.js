import { findParentNode, findSelectedNodeOfType } from 'prosemirror-utils'

export function nodeIsActive(state, type, attrs = {}) {
  const predicate = node => node.type === type
  const node =
    findSelectedNodeOfType(type)(state.selection) ||
    findParentNode(predicate)(state.selection)

  if (!Object.keys(attrs).length || !node) {
    return !!node
  }

  function nodeHasAttrs(node, attrs) {
    return Object.keys(attrs).every(
      attrName => attrs[attrName] == node.attrs[attrName]
    )
  }

  return node.node.type == type && nodeHasAttrs(node.node, attrs)
}
