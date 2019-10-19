<template lang="pug">
  .minota-app
    router-view
    modal-stack-component
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ModalStackComponent from '@/components/ModalStack'
import InitialCheckCreateStorage from '@/mixins/initial-check-create-storage'

export default {
  name: 'App',

  components: {
    ModalStackComponent
  },

  mixins: [
    InitialCheckCreateStorage
  ],

  computed: {
    ...mapGetters([
      'getContext'
    ])
  },

  created () {
    console.log('Minota App created!')
  },

  beforeDestroy () {
    console.log('Minota App destroyed...')
  },

  methods: {
    ...mapMutations([
      'setContext',
      'clearContext'
    ])
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/index"
@import "~@/assets/styles/variables"

html
body
  margin 0
  padding 0
  height 100% // Hack parent container

.minota-app
  position relative
  min-height 100%
  overflow hidden
  background-color background-color
  color alpha(black, high-emphasis)
</style>
