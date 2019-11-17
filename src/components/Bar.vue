<template lang="pug">
  .minota-bar-placeholder
    .minota-bar(
      v-scroll:[target]="handleScroll"
      v-bind:style="styles"
      v-bind:class="classes")
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
    },
    target: {
      type: String,
      required: false,
      default: 'window'
    },
    position: {
      type: String,
      required: false,
      default: 'left'
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
      breakpoint: 56,
      lastScroll: 0,
      styles: {
        width: '100%',
        left: '0px',
        right: 'auto'
      }
    }
  },

  watch: {
    toggle () {
      if (this.lastScroll > this.breakpoint) {
        this.classes['hidden'] = !this.classes['hidden']
      }
    }
  },

  created () {
    // Watch bar toggling
    this.unwatchClassesHidden = this.$watch(() => this.classes['hidden'], isHidden => {
      this.$emit('bar-toggle', !isHidden)
    })
  },

  beforeDestroy () {
    this.unwatchClassesHidden()
  },

  methods: {
    handleScroll (event) {
      this.lastScroll = event.scrollTop
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

      if (this.target !== 'window') {
        this.styles.width = document.getElementById(this.target).getBoundingClientRect().width + 'px'
      }

      if (this.position === 'right') {
        this.styles.left = 'auto'
        this.styles.right = '0px'
      }

      if (this.position === 'left') {
        this.styles.left = '0px'
        this.styles.right = 'auto'
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
  padding-left 4px
  padding-right 4px
  min-height 56px
  background-color transparent
  box-shadow 0px 2px 10px 0px alpha(black, 0.0)
  display flex
  align-items center
  z-index bar-index

  &.sticky
    box-shadow 0px 2px 10px 0px alpha(black, 0.25)
    position fixed
    left 0px
    top 0px
    right 0px
    transform translateY(0)
    background-color white
  &.hidden
    transform translateY(-100%)
  &.switch
    transition none !important
  &.no-shadow
    box-shadow 0px 2px 10px 0px alpha(black, 0.0) !important

  .title
    flex-grow 1
    padding 0 16px
    &:first-child
      padding-left 12px

  .icon-button
    flex-basis 48px
    flex-shrink 0
    cursor pointer
    & + .icon-button
      margin-left 0

</style>
