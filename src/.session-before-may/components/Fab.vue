<template lang="pug">
  button.minota-fab.bottom-right(
    elevation="8"
    v-scroll:[scrollTarget]="handleScroll"
    v-bind:class="classes"
  )
    slot
      i.material-icons unknown
</template>

<script>
import Scroll from '@/directives/scroll'

export default {
  name: 'Fab',

  directives: {
    Scroll
  },

  props: {
    toggle: {
      type: Boolean,
      required: false,
      default: false
    },
    scrollTarget: {
      type: String,
      required: false,
      default: 'window'
    }
  },

  data () {
    return {
      classes: {
        'hidden': false
      }
    }
  },

  watch: {
    toggle () {
      this.classes['hidden'] = !this.classes['hidden']
    }
  },

  methods: {
    handleScroll (event) {
      if (event.delta > 5) {
        this.classes['hidden'] = true
      } else if (event.delta < -5) {
        this.classes['hidden'] = false
      }

      if (event.scrollTop < 2 && event.delta < 0) {
        this.classes['hidden'] = false
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-fab
  background-color primary-dark-color
  color alpha(white, high-emphasis)
  height 56px
  width 56px
  text-align center
  line-height 56px
  display block
  border none
  padding 0
  border-radius 50%
  user-select none
  appearance none
  outline none
  opacity 1
  transform translateY(0%)
  transition opacity 0.125s, transform 0.25s
  a
    text-decoration none
    color inherit
  &.bottom-right
    position fixed
    z-index fab-index
    bottom 16px
    right 16px
  &.hidden
    opacity 0
    transform translateY(50%)
    pointer-events none
  .material-icons
    line-height 56px
    display block
</style>
