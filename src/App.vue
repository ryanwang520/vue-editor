<template>
  <div id="app">
    <Editor v-model="data" :image-provider="imageProvider" />
    <pre>{{ data }}</pre>
  </div>
</template>

<script>
import Editor from '@/index.js'

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
  components: {
    Editor,
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
