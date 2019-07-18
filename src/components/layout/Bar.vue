<template lang="pug">
  .minota-bar-placeholder
    .minota-bar(v-scroll="handleScroll" v-bind:class="classes")
      slot
        i.material-icons menu
</template>

<script>
import Scroll from '@/directives/scroll'

export default {
  name: 'Bar',

  directives: {
    Scroll
  },

  props: {
    toggle: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      classes: {
        'sticky': false,
        'no-shadow': false,
        'hidden': false,
        'switch': false
      },
      breakpoint: 56
    }
  },

  watch: {
    toggle () {
      this.classes['hidden'] = !this.classes['hidden']
    }
  },

  methods: {
    handleScroll (event) {
      if (
        event.scrollTop > this.breakpoint &&
        event.scrollTop - event.delta <= this.breakpoint
      ) {
        this.classes['sticky'] = true
        this.classes['hidden'] = true
        this.classes['switch'] = true
      } else {
        this.classes['switch'] = false
      }

      if (event.delta > 5) {
        this.classes['hidden'] = true
      } else if (event.delta < -5) {
        this.classes['hidden'] = false
      }

      if (event.scrollTop < 2 && event.delta < 0) {
        this.classes['sticky'] = false
        this.classes['hidden'] = false
      }

      if (event.scrollTop < this.breakpoint * 0.25) {
        this.classes['no-shadow'] = true
      } else {
        this.classes['no-shadow'] = false
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-bar-placeholder
  height 56px
.minota-bar
  box-sizing border-box
  transition transform 0.25s, box-shadow 0.25s
  // padding 0px 16px
  padding-left 4px
  padding-right 4px
  min-height 56px
  background-color background-color
  box-shadow 0px 2px 10px 0px alpha(black, 0.0)
  display flex
  align-items center
  z-index 100

  &.sticky
    box-shadow 0px 2px 10px 0px alpha(black, 0.25)
    position fixed
    left 0px
    top 0px
    right 0px
    transform translateY(0)
  &.hidden
    transform translateY(-100%)
  &.switch
    transition none !important
  &.no-shadow
    box-shadow 0px 2px 10px 0px alpha(black, 0.0) !important

  .title
    flex-grow 1
    padding 0 16px
    // text-align center

  .icon-button
    flex-basis 48px
    flex-shrink 0
    cursor pointer
    & + .icon-button
      margin-left 0

</style>
