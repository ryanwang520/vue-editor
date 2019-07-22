<template>
  <div id="app">
    <Editor />
  </div>
</template>

<script>
import Editor from '@/index.js'

export default {
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
  justify-content: center;
}
</style>
