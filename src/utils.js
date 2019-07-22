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

export function upload(file, obj) {
  return new Promise((resolve, reject) => {
    const data = new FormData()
    data.append('file', file)
    data.append('token', obj.token)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://upload.qiniup.com')
    xhr.send(data)
    xhr.onload = () => {
      if (xhr.status === 200) {
        const { key } = JSON.parse(xhr.responseText)
        resolve(`https://${obj.domain}/${key}`)
      } else {
        reject()
      }
    }
  })
}
