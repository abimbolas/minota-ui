<template lang="pug">
  .minota-table-grid__content-item(v-on:scroll="onScroll($event)")
    slot
</template>

<script>
import bus from '@/event-bus'
import analyzeScrollMixin from '@/utils/analyze-scroll'

export default {
  name: 'TableGridContentItem',

  data () {
    return {
      scroll: {}
    }
  },

  watch: {
    'scroll' (scroll) {
      bus.$emit('table-grid-content-item-scroll', scroll)
    }
  },

  mounted () {
    this.scroll = this.analyzeScrollInit(this.$el)
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.$emit('enter-view')
          bus.$emit('table-grid-content-item-scroll', scroll)
        } else {
          this.$emit('exit-view')
        }
      })
    }, {
      threshold: 0.75
    })
    this.observer.observe(this.$el)
  },

  beforeDestroy () {
    this.observer.disconnect()
  },

  methods: {
    onScroll (event) {
      this.analyzeScrollTick(this.scroll, this.$el, data => {
        this.scroll = data
      })
    },

    ...analyzeScrollMixin
  }
}
</script>

<style lang="stylus">
.minota-table-grid__content-item
  height 100vh
  width 100vw
  flex-basis 100vw
  flex-shrink 0
  box-sizing border-box
  scroll-snap-align start
  scroll-snap-stop always
  // scroll-snap-type both proximity
  position relative
  overflow scroll
  // & > *:before
  //   content ' '
  //   position absolute
  //   left 0
  //   top 0
  //   width 100%
  //   height 50%
  //   // background-color alpha(red, 0.125)
  //   scroll-snap-align start
  //   scroll-snap-stop always
  //   scroll-margin-top 0.5rem
  //   pointer-events none
  // & > *:after
  //   content ' '
  //   position absolute
  //   left 0
  //   bottom 0
  //   width 100%
  //   height 50%
  //   // background-color alpha(blue, 0.125)
  //   scroll-snap-align end
  //   scroll-snap-stop always
  //   scroll-margin-bottom 0.5rem
  //   pointer-events none
</style>
