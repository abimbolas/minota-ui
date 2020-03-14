<template lang="pug">
  .minota-app
    router-view
    modal-stack-component
</template>

<script>
import ModalStackComponent from '@/components/ModalStack'
import InitialCheckCreateStorage from '@/mixins/initial-check-create-storage'
import { persistedModules } from '@/store'

export default {
  name: 'App',

  components: {
    ModalStackComponent
  },

  mixins: [
    InitialCheckCreateStorage
  ],

  created () {
    // Recreate states of store modules, which we persist previously
    Object.keys(persistedModules).forEach(key => {
      this.$store.commit(persistedModules[key], this.$store.state[key])
    })
    console.log('Minota App created!')
  },

  beforeDestroy () {
    console.log('Minota App destroyed...')
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
  background-color background-color

.minota-app
  position relative
  min-height 100%
  overflow hidden
  color alpha(black, high-emphasis)
</style>
