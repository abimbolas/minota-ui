<template lang="pug">
  .minota-menu-item(v-on:click="onClick($event)")
    .icon
      slot(name="icon")
    .title.text-body
      slot(name="title")
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
  padding-left 16px
  padding-right 16px
  cursor pointer
  font-family sans-family
  height 48px
  display flex
  align-items center
  &:hover
    background-color background-hover-color
  &:first-child
    margin-top 8px
  &:last-child
    margin-bottom 8px

  .icon:not(:empty)
    font-size 24px
    height 24px
    width 24px
    line-height 24px
    padding-left 8px
    padding-right 20px

</style>
