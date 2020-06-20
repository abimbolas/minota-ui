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
  padding 1rem
</style>
