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
@import '~@/assets/styles/variables'
html
body
  font-size 16px
  line-height 1.5
  font-family sans-family
  margin 0
  padding 0

textarea
  display block
  font-family mono-family
  font-size inherit
  line-height inherit
  outline none
  width 100%
  max-width 45rem
  padding 0.5rem
  border solid gainsboro 1px
  box-sizing border-box
  min-height 300px
input
button
  display block
  font-family mono-family
  font-size inherit
  line-height inherit
  outline none
  box-sizing border-box
  cursor pointer

input
  cursor text

// App

.minota-app
  padding 1rem

// Action

.minota-actions
  display flex
  margin-bottom 1rem
  justify-content space-between

.minota-actions__action + .minota-actions__action
  margin-left 1rem

.minota-section-left
  margin-left 0
  margin-right auto
  display flex
  align-items center
.minota-section-right
  margin-right 0
  margin-left auto
  display flex
  align-items center

</style>
