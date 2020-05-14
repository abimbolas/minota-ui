<template lang="pug">
  .minota-menu-item(v-on:click="onClick($event)")
    .icon
      slot(name="icon")
    .title.text-body
      slot(name="title")
    .indicator
      slot(name="indicator")
</template>

<script>
export default {
  name: 'MenuItem',

  methods: {
    onClick ($event) {
      this.$emit('click', $event)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/everything'

.minota-menu-item
  padding-left 24px
  padding-right 24px
  cursor pointer
  font-family sans-family
  height 48px
  display flex
  align-items center
  &:hover
    background-color hover-layer-color
  &:first-child
    margin-top 8px
  &:last-child
    margin-bottom 8px

  .icon:not(:empty)
    font-size 24px
    height 24px
    width 24px
    line-height 24px
    // padding-left 8px
    padding-right 20px

  .indicator:not(:empty)
    font-size 24px
    height 24px
    width 24px
    line-height 24px
    padding-left 20px
    margin-left auto

.minota-menu-item__divider
  height 1px
  display block
  font-size 0px
  line-height 0px
  background-color border-color
  margin 0.5rem 0

</style>
