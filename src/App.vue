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
      data: 'hello',
      imageProvider: {
        name: 'qiniu',
        token:
          '-qWchT63mkZEJch0ygm3bN9h3peInHqCcSAEMtvV:8lM-4tOO3g9IipeFyLloLN6xvvE=:eyJzY29wZSI6InRlc3QiLCJkZWFkbGluZSI6MTU2MzgwMzUyOX0=',
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
