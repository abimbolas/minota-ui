<template lang="pug">
  .minota-drawer(v-bind:class="{ 'active': opened }")
    .minota-drawer-backdrop(v-on:click="closeDrawer()")
    .minota-drawer-body(v-bind:position="position" v-bind:id="id")
      slot
</template>

<script>
export default {
  name: 'Drawer',

  props: {
    position: {
      type: String,
      required: false,
      default: 'left'
    },
    opened: {
      type: Boolean,
      required: false,
      default: false
    },
    id: {
      type: String,
      required: true
    }
  },

  methods: {
    closeDrawer () {
      this.$emit('opened', false)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/everything'

.minota-drawer
  visibility hidden
  pointer-events none
  &.active
    pointer-events all
    visibility visible
  .minota-drawer-backdrop
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    z-index drawer-index - 1
    background-color backdrop-color

  .minota-drawer-body
    @extend .elevation-8
    position fixed
    z-index drawer-index
    background-color background-color
    overflow-y auto

    &[position="left"]
      left 0
      top 0
      bottom 0
      max-width 480px
      width 100%
      @media (max-width screen-sm)
        max-width none

    &[position="right"]
      right 0
      top 0
      bottom 0
      max-width 480px
      width 100%
      @media (max-width screen-sm)
        max-width none

    &[position="top"]
      left 0
      right 0
      top 0
      min-height 1rem

    &[position="bottom"]
      left 0
      right 0
      bottom 0
      min-height 1rem
</style>
