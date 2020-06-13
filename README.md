# vue-editor

A full-fledged rich-text editor for Vue.js

## Installation

```
npm install @baoshishu/vue-editor tiptap tiptap-extensions v-tooltip
```

or

```
yarn add @baoshishu/vue-editor tiptap tiptap-extensions v-tooltip
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
import Editor from '@baoshishu/vue-editor'

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
import Editor from '@baoshishu/vue-editor'

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
        host: 'https://your-bucket.oss-cn-hangzhou.aliyuncs.com',
        accessKeyId: 'LTAI4G3mTGD1eKGFqCJnrvNL',
      },
    }
  },
}
```
