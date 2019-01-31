<template lang="pug">
  .minota-config
    h1 Settings
    h3 Server
    p {{ serverUrl }}
    div(v-if="storageConfig")
      h3 Storage
      p {{ mainStorageSetting }}
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Config',

  filters: {
    stripProtocol (value) {
      return value.replace(/https?:\/\//, '')
    }
  },

  data () {
    return {
      storageConfig: null
    }
  },

  computed: {
    mainStorageSetting () {
      let setting
      let settingName
      if (this.storageConfig.type === 'file') {
        setting = this.storageConfig.file.path
        settingName = 'File path'
      }
      return `${settingName}: ${setting}`
    },
    parseServerUrl () {
      let url = this.serverUrl
      if (url.match(/https?:\/\/localhost/)) {
        url = `${url}`
      }
      return url
    },
    ...mapGetters(['serverUrl'])
  },

  mounted () {
    axios.get('http://localhost:7777/config').then(response => {
      if (response.status === 200) {
        this.storageConfig = response.data
      }
    })
  }
}
</script>
