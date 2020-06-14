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

function getEtag(buffer, callback) {
  // 判断传入的参数是buffer还是stream还是filepath
  var mode = 'buffer'

  if (typeof buffer === 'string') {
    buffer = require('fs').createReadStream(buffer)
    mode = 'stream'
  } else if (buffer instanceof require('stream')) {
    mode = 'stream'
  }

  // sha1算法
  var sha1 = function(content) {
    var crypto = require('crypto')
    var sha1 = crypto.createHash('sha1')
    sha1.update(content)
    return sha1.digest()
  }

  // 以4M为单位分割
  var blockSize = 4 * 1024 * 1024
  var sha1String = []
  var prefix = 0x16
  var blockCount = 0

  switch (mode) {
    case 'buffer':
      var bufferSize = buffer.length
      blockCount = Math.ceil(bufferSize / blockSize)

      for (var i = 0; i < blockCount; i++) {
        sha1String.push(sha1(buffer.slice(i * blockSize, (i + 1) * blockSize)))
      }
      process.nextTick(function() {
        callback(calcEtag())
      })
      break
    case 'stream':
      var stream = buffer
      stream.on('readable', function() {
        var chunk
        while ((chunk = stream.read(blockSize))) {
          sha1String.push(sha1(chunk))
          blockCount++
        }
      })
      stream.on('end', function() {
        callback(calcEtag())
      })
      break
  }

  function calcEtag() {
    if (!sha1String.length) {
      return 'Fto5o-5ea0sNMlW_75VgGJCv2AcJ'
    }
    var sha1Buffer = Buffer.concat(sha1String, blockCount * 20)

    // 如果大于4M，则对各个块的sha1结果再次sha1
    if (blockCount > 1) {
      prefix = 0x96
      sha1Buffer = sha1(sha1Buffer)
    }

    sha1Buffer = Buffer.concat(
      [new Buffer([prefix]), sha1Buffer],
      sha1Buffer.length + 1
    )

    return sha1Buffer
      .toString('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-')
  }
}

class ImageHandler {
  constructor(provider) {
    this.provider = provider
  }
}

class Qiniuhandler extends ImageHandler {
  constructor(provider) {
    super(provider)
    this.uploadUrl = 'https://upload.qiniup.com'
  }
  makeForm(file) {
    const data = new FormData()
    data.append('file', file)
    data.append('token', this.provider.token)
    return data
  }
  urlFromResponse(xhr) {
    const { key } = JSON.parse(xhr.responseText)
    return `https://${this.provider.domain}/${key}`
  }
}

class AliHandler extends ImageHandler {
  constructor(provider) {
    super(provider)
    this.uploadUrl = 'https://' + provider.domain
  }
  makeForm(file, key) {
    const data = new FormData()
    data.append('name', file.name)
    data.append('key', key)
    data.append('policy', this.provider.policy)
    data.append('OSSAccessKeyId', this.provider.OSSAccessKeyId)
    data.append('signature', this.provider.signature)
    data.append('file', file)

    return data
  }
  urlFromResponse(_, formData) {
    return `${this.uploadUrl}/${formData.get('key')}`
  }
}

function getHandler(provider) {
  if (provider.name == 'aliyun') {
    return new AliHandler(provider)
  }
  if (provider.name == 'qiniu') {
    return new Qiniuhandler(provider)
  }
  throw `Un supported provider ${provider.name}`
}

export default class Image extends Node {
  get name() {
    return 'image'
  }
  constructor(options) {
    super(options)
    if (typeof options.provider != 'function') {
      this.provider = options.provider
    } else {
      this.provider = null
    }
  }
  _upload(file) {
    const uploadHandler = getHandler(this.provider)

    return new Promise((resolve, reject) => {
      getEtag(file, key => {
        const xhr = new XMLHttpRequest()
        const data = uploadHandler.makeForm(file, key)
        xhr.open('POST', uploadHandler.uploadUrl)
        xhr.send(data)
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status == 204) {
            resolve(uploadHandler.urlFromResponse(xhr, data))
          } else {
            reject()
          }
        }
      })
    })
  }

  upload(file) {
    if (this.provider) {
      return this._upload(file)
    }
    let { provider } = this.options

    if (typeof provider == 'function') {
      const result = provider()
      if (result.then) {
        return result.then(res => {
          this.provider = res
          return this._upload(file)
        })
      } else {
        this.provider = result
      }
    }
    return this._upload(file)
  }

  uploadImage(file, view, pos) {
    const { schema } = view.state
    this.upload(file).then(src => {
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
