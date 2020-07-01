<template lang="pug">
  .minota-app
    router-view
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'App',

  created () {
    console.log('Minotá UI created')
  },

  beforeDestroy () {
    console.log('Minotá UI destroyed')
  },

  methods: {
    ...mapMutations([
      'addToDrawer'
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
