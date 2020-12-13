<template lang="pug">
  .minota-app
    router-view
    modals-component
</template>

<script>
import ModalsComponent from '@/components/Modal'

export default {
  name: 'Minota',
  components: {
    ModalsComponent
  },
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

html
  background-color background-main
</style>

<style scoped lang="stylus">
.minota-app
  height 100vh
  width 100vw
  // margin-top 5vh
  // margin-left 5vw
  // box-shadow 0px 0px 0px 1px alpha(black, 0.1)
  // overflow auto
</style>
