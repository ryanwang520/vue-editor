import { Node, Plugin } from 'tiptap'
import { nodeInputRule } from 'tiptap-commands'

/**
 * Matches following attributes in Markdown-typed image: [, alt, src, title]
 *
 * Example:
 * ![Lorem](image.jpg) -> [, "Lorem", "image.jpg"]
 * ![](image.jpg "Ipsum") -> [, "", "image.jpg", "Ipsum"]
 * ![Lorem](image.jpg "Ipsum") -> [, "Lorem", "image.jpg", "Ipsum"]
 */
const IMAGE_INPUT_REGEX = /!\[(.+|:?)\]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']

export default class Image extends Node {
  get name() {
    return 'image'
  }
  upload(file) {
    const { token, domain } = this.options.provider
    return new Promise((resolve, reject) => {
      const data = new FormData()
      data.append('file', file)
      data.append('token', token)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://upload.qiniup.com')
      xhr.send(data)
      xhr.onload = () => {
        if (xhr.status === 200) {
          const { key } = JSON.parse(xhr.responseText)
          resolve(`https://${domain}/${key}`)
        } else {
          reject()
        }
      }
    })
  }

  uploadImage(file, view, pos) {
    const { schema } = view.state
    this.upload(file, this.options.provider.token).then(src => {
      const node = schema.nodes.image.create({
        src,
      })
      const transaction = view.state.tr.insert(pos, node)
      view.dispatch(transaction)
    })
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: {
          default: null,
        },
        title: {
          default: null,
        },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: dom => ({
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
          }),
        },
      ],
      toDOM: node => ['img', node.attrs],
    }
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor
        ? selection.$cursor.pos
        : selection.$to.pos
      const node = type.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }

  inputRules({ type }) {
    return [
      nodeInputRule(IMAGE_INPUT_REGEX, type, match => {
        const [, alt, src, title] = match
        return {
          src,
          alt,
          title,
        }
      }),
    ]
  }

  get plugins() {
    const that = this
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            paste(view, event) {
              const { selection } = view.state
              const pos = selection.$cursor
                ? selection.$cursor.pos
                : selection.$to.pos

              for (const item of event.clipboardData.items) {
                if (item.kind === 'file') {
                  if (!IMAGE_TYPES.includes(item.type)) {
                    return Promise.reject('不支持该文件类型')
                  }
                  event.preventDefault()
                  const blob = item.getAsFile()
                  that.uploadImage(blob, view, pos)
                }
              }
            },

            drop(view, event) {
              const hasFiles =
                event.dataTransfer &&
                event.dataTransfer.files &&
                event.dataTransfer.files.length

              if (!hasFiles) {
                return
              }

              const images = Array.from(event.dataTransfer.files).filter(file =>
                /image/i.test(file.type)
              )

              if (images.length === 0) {
                return
              }

              event.preventDefault()

              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })

              images.forEach(image => {
                that.uploadImage(image, view, coordinates.pos)
              })
            },
          },
        },
      }),
    ]
  }
}
