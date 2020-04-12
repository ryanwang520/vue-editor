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
      imageProvider: {
        name: 'qiniu',
        token:
          '-qWchT63mkZEJch0ygm3bN9h3peInHqCcSAEMtvV:9YAz4dCiB3EAdYuoDVO0YvObtqY=:eyJzY29wZSI6InRlc3QiLCJkZWFkbGluZSI6MTkwMjAyODY1NX0=',
        domain: 'cdn-testing.zanquan.net',
      },
    }
  },
}
</script>
```
