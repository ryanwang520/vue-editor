# vue-editor

A full-fledged rich-text editor for Vue.js

## Installation

```
npm install @baoshishu/vue-editor
```

or

```
yarn add @baoshishu/vue-editor
```

## Demo

See the live [demo](https://gifted-liskov-8e35ae.netlify.com)

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
          '-qWchT63mkZEJch0ygm3bN9h3peInHqCcSAEMtvV:0PSey7kMtMFbU84mrM4WYeVzfgA=:eyJzY29wZSI6InRlc3QiLCJkZWFkbGluZSI6MTU2NTY4OTM3MH0=',
        domain: 'cdn-testing.zanquan.net',
      },
    }
  },
}
</script>
```
