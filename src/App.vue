<template lang="pug">
  .minota-app
    router-view
</template>

<script>
export default {
  name: 'Minota',
  mounted () {
    console.log('Minotá created')
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
  overflow auto
  min-height 100vh
  min-width 100vw
  scroll-snap-type both proximity

html
  background-color background-main
</style>

<style scoped lang="stylus">
.minota-app
  box-sizing border-box
  min-height 100vh
  min-width 100vw
  padding 1rem
  --editor-min-height calc(100vh - 2rem)
</style>
