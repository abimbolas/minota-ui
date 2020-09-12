<template lang="pug">
  .minota-app
    router-view
    modal-component
</template>

<script>
import { mapActions } from 'vuex'
import ModalComponent from '@/components/Modal'

export default {
  name: 'App',

  components: {
    ModalComponent
  },

  created () {
    this.addStorageAction({
      url: 'file:///Users/antivitla/Projects/Personal/Minota/.minota-002'
    })

    this.addStorageAction({
      url: 'file:///Users/antivitla/Projects/Personal/Minota/.minota'
    })

    this.addStorageAction({
      url: 'file:///Users/antivitla/Dropbox/Notes'
    })

    this.addStorageAction({
      url: 'file:///Users/antivitla/zok'
    })

    console.log('Minotá UI created')
  },

  beforeDestroy () {
    console.log('Minotá UI destroyed')
  },

  methods: {
    ...mapActions([
      'addStorageAction',
      'removeStorageAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/common'

.minota-app
  box-sizing border-box
  min-height 100vh
</style>
