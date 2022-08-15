# vue-editor

A full-fledged rich-text editor for Vue.js

## Installation

```
npm install @ryanwang520/vue-editor tiptap tiptap-extensions v-tooltip prosemirror-utils
```

or

```
yarn add @ryanwang520/vue-editor tiptap tiptap-extensions v-tooltip prosemirror-utils
```

## Demo

See the live [demo](https://vue-editor.netlify.com)

## Basic Setup

```vue
<template>
  <Editor v-model="data" :image-provider="imageProvider" />
</template>

<script>
// Import the editor
import Editor from '@ryanwang520/vue-editor'

export default {
  components: {
    Editor,
  },
  data() {
    return {
      data: '',
      imageProvider: {
        name: 'qiniu', // provider name
        token:
          '-qWchT63mkZEJch0ygm3bN9h3peInHqCcSAEMtvV:9YAz4dCiB3EAdYuoDVO0YvObtqY=:eyJzY29wZSI6InRlc3QiLCJkZWFkbGluZSI6MTkwMjAyODY1NX0=', // upload token
        domain: 'cdn-testing.zanquan.net', // upload domain
        modifier: ({ width, height, url }) => {
          if (width < 750) {
            return url
          } else {
            return `${url}?imageMogr2/thumbnail/750x/`
          }
        },
      },
    }
  },
}
</script>
```

`imageProvider` could also be a function returning a Promise, thus `imageProvider` would be lazily resolved when user upload image first time.

```javascript
function resolveProvider() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name,
        token,
        domain,
      })
    }, 1000)
  })
}

{
  imageProvider: resolveProvider
}
```

## AliOSSProvider

```javascript
import Editor from '@ryanwang520/vue-editor'

export default {
  components: {
    Editor,
  },
  data() {
    return {
      data: '',
      imageProvider: {
        name: 'aliyun',
        signature: 'DQdDwZMymx9SKS1HHNFxFbFauVc=',
        policy:
          'eyJleHBpcmF0aW9uIjogIjIwMjAtMDYtMTNUMDU6MTQ6MzVaIiwgImNvbmRpdGlvbnMiOiBbWyJlcSIsICIkYnVja2V0IiwgInlvdWp1YW4tc3RhZ2luZyJdXX0=',
        domain: 'your-bucket.oss-cn-hangzhou.aliyuncs.com',
        OSSAccessKeyId: 'LTAI4G3mD1eKGFqCJnrvNL',
      },
    }
  },
}
```
