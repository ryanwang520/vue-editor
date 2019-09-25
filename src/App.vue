<template>
  <div id="app">
    <Editor v-model="data" :image-provider="imageProvider" :width="width" />
    <pre>{{ data }}</pre>
  </div>
</template>

<script>
import Editor from '@/index.js'
// import Editor from '../dist/vue-editor.umd'

export default {
  data() {
    return {
      data:
        '<p><video controls><source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"></video></p>',
      imageProvider: {
        name: 'qiniu',
        token:
          '-qWchT63mkZEJch0ygm3bN9h3peInHqCcSAEMtvV:0PSey7kMtMFbU84mrM4WYeVzfgA=:eyJzY29wZSI6InRlc3QiLCJkZWFkbGluZSI6MTU2NTY4OTM3MH0=',
        domain: 'cdn-testing.zanquan.net',
      },
    }
  },
  name: 'app',
  props: {
    width: {
      type: String,
      required: false,
    },
  },
  components: {
    Editor,
  },
}
</script>

<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 300px;
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  /* justify-content: center; */
}
</style>
