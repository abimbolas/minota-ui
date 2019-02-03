<template lang="pug">
  .minota-app-bar(v-scroll="scrollHandler" v-bind:class="classes")
    div 
      i.material-icons(style="vertical-align: bottom") menu
      span &nbsp; Hello, world! I am App Bar
</template>

<script>
import Scroll from '@/directives/scroll'

export default {
  name: 'AppBar',

  directives: {
    Scroll
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

  methods: {
    scrollHandler (event) {
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

      if (event.scrollTop < 2) {
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
.minota-app-bar
  box-sizing border-box
  transition transform 0.25s, box-shadow 0.25s
  padding 16px
  min-height 56px
  background-color ghostwhite
  box-shadow 0px 2px 10px 0px alpha(black, 0.0)
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
    
  &.sticky + *
    padding-top 56px
</style>