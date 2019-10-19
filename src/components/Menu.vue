<template lang="pug">
  .minota-menu
    .backdrop(v-on:click="$emit('close')")
    ul.menu(elevation="4")
      slot
</template>

<script>
export default {
  name: 'Menu'
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-menu
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index menu-index
  display flex
  .backdrop
    position absolute
    left 0
    right 0
    bottom 0
    top 0
    z-index 1
    background-color backdrop-color
  .menu
    position relative
    z-index 2
    background-color white
    width 100%
    max-width 256px
    margin 0 0 0 auto
    padding 0
    list-style none
  .action:first-child
      margin-left -12px
  .menu-header
    height 56px
    box-sizing border-box
    padding 0px 16px
    line-height 56px
    box-shadow inset 0px -1px 0px 0px gainsboro
    margin-bottom 8px
    display flex
    align-items center
  .menu-item
    padding 0px 16px
    line-height 48px
    cursor pointer
    display flex
    align-items center
    &:hover
      background-color primary-dark-color
      color alpha(white, high-emphasis)
    &:last-child
      margin-bottom 8px
</style>
