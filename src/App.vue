<template lang="pug">
  .minota-app
    router-view
    modal-component
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ModalComponent from '@/components/Modal'

export default {
  name: 'App',

  components: {
    ModalComponent
  },

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
      isActive: true
    })

    this.addStorage({
      href: 'file:///Users/antivitla/Dropbox/Notes',
      isActive: true,
      isDefault: true
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
