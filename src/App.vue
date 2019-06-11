<template lang="pug">
  .minota-app
    router-view
</template>

<script>
import { mapGetters } from 'vuex'
import TableComponent from '@/components/screens/Table'

export default {
  name: 'App',

  components: {
    TableComponent
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
  // background-color ghostwhite
  // box-shadow inset 0px 0px 0px 10px green

.minota-app
  position relative
  min-height 100%
  overflow hidden
  display flex
  flex-direction column
  
  background-color ghostwhite
  color alpha(black, high-emphasis)
  // box-shadow inset 0px 0px 0px 5px lightblue
</style>
