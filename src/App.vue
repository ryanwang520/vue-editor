<template>
  <div id="app">
    <Editor v-model="data" :image-provider="imageProvider" :width="width" />
    <pre>{{ data }}</pre>
  </div>
</template>

<script>
import Editor from '@/index.js'
// import Editor from '../dist/vue-editor.min'

export default {
  data() {
    return {
      data:
        '<p><video controls><source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"></video></p>',
      imageProvider: {
        name: 'aliyun',
        signature: 'G/xnzpwourfgMiFBPEJNbbuOG7g=',
        policy:
          'eyJleHBpcmF0aW9uIjogIjIwMjAtMDYtMTRUMDY6MDk6MjVaIiwgImNvbmRpdGlvbnMiOiBbWyJlcSIsICIkYnVja2V0IiwgInlvdWp1YW4tc3RhZ2luZyJdXX0=',
        domain: 'youjuan-staging.oss-cn-hangzhou.aliyuncs.com',
        OSSAccessKeyId: 'LTAI4G3mTGD1eKGFqCJnrvNL',
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
