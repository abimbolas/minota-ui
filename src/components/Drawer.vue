<template lang="pug">
  .minota-drawer(v-bind:class="{ 'active': opened }")
    transition(name="fade")
      .minota-drawer-backdrop(v-on:click="closeDrawer()" v-show="opened")
    transition(name="slide")
      .minota-drawer-body(v-bind:position="position" v-bind:id="id" v-show="opened")
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
  .minota-drawer-backdrop
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    z-index drawer-index - 1
    background-color backdrop-color
    &.fade-enter
    &.fade-leave-to
      opacity 0
    &.fade-enter-to
    &.fade-leave
      opacity 1
    &.fade-enter-active
    &.fade-leave-active
      transition all 0.2s ease-out

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

    &.slide-enter[position="left"]
    &.slide-leave-to[position="left"]
      transform translateX(-100%)
    &.slide-enter[position="right"]
    &.slide-leave-to[position="right"]
      transform translateX(100%)
    &.slide-enter[position="top"]
    &.slide-leave-to[position="top"]
      transform translateY(-100%)
    &.slide-enter[position="bottom"]
    &.slide-leave-to[position="bottom"]
      transform translateY(100%)
    &.slide-enter-to[position="left"]
    &.slide-leave[position="left"]
    &.slide-enter-to[position="right"]
    &.slide-leave[position="right"]
      transform translateX(0%)
    &.slide-enter-to[position="top"]
    &.slide-leave[position="top"]
    &.slide-enter-to[position="bottom"]
    &.slide-leave[position="bottom"]
      transform translateY(0%)
    &.slide-enter-active
      transition transform 0.15s ease
    &.slide-leave-active
      transition transform 0.1s ease
</style>
