<template lang="pug">
  .minota-app
    router-view
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapGetters(['storages'])
  },

  created () {
    console.log('Minotá UI created')

    this.addStorage({
      href: 'file:///Users/antivitla/Projects/Personal/Minota/.minota-002'
    })

    this.addStorage({
      href: 'file:///Users/antivitla/Projects/Personal/Minota/.minota',
      isActive: false
    })

    this.addStorage({
      href: 'file:///Users/antivitla/Dropbox/Notes',
      isActive: false
    })

    this.addStorage({
      href: 'localstorage://minota/antivitla',
      isActive: false
    })
  },

  beforeDestroy () {
    console.log('Minotá UI destroyed')
  },

  methods: {
    ...mapMutations([
      'addStorage'
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
