export function setTextAlign(tr, schema, alignment) {
  const { selection, doc } = tr
  if (!selection || !doc) {
    return tr
  }
  const { from, to } = selection
  const { nodes } = schema

  const blockquote = nodes.blockquote
  const listItem = nodes.list_item
  const heading = nodes.heading
  const paragraph = nodes.paragraph

  const tasks = []
  alignment = alignment || null

  const allowedNodeTypes = new Set([heading, paragraph, blockquote, listItem])

  doc.nodesBetween(from, to, (node, pos) => {
    const nodeType = node.type
    const align = node.attrs.align || null
    if (align !== alignment && allowedNodeTypes.has(nodeType)) {
      tasks.push({
        node,
        pos,
        nodeType,
      })
    }
    return true
  })

  if (!tasks.length) {
    return tr
  }

  tasks.forEach(job => {
    const { node, pos, nodeType } = job
    let { attrs } = node
    if (alignment) {
      attrs = {
        ...attrs,
        align: alignment,
      }
    } else {
      attrs = {
        ...attrs,
        align: null,
      }
    }
    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks)
  })
  tr = tr.scrollIntoView()

  return tr
}

export const isActive = (state, align) => {
  const { selection, doc } = state
  const { from, to } = selection
  let keepLooking = true
  let active = false
  doc.nodesBetween(from, to, node => {
    if (keepLooking && node.attrs.align === align) {
      keepLooking = false
      active = true
    }
    return keepLooking
  })
  return active
}
