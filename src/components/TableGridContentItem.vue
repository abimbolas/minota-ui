<template lang="pug">
  .minota-table-grid__content-item(v-on:scroll="onScroll($event)")
    slot
</template>

<script>
import bus from '@/event-bus'
import analyzeScrollMixin from '@/utils/analyze-scroll'

export default {
  name: 'TableGridContentItem',

  props: {
    updateScrollDataOn: {
      type: String,
      required: false,
      default: 'update-scroll-data'
    }
  },

  data () {
    return {
      scrollData: {},
      isVisible: false
    }
  },

  watch: {
    'scrollData' (scrollData) {
      if (this.isVisible) {
        bus.$emit('table-grid-content-item-scroll', scrollData)
        if (
          scrollData.scrollBottom < scrollData.scrollTop &&
          scrollData.scrollBottom < window.innerHeight * 0.25
        ) {
          this.$emit('stick-content-item', 'bottom')
        } else if (
          scrollData.scrollTop < scrollData.scrollBottom &&
          scrollData.scrollTop < window.innerHeight * 0.25
        ) {
          this.$emit('stick-content-item', 'top')
        } else {
          this.$emit('stick-content-item', '')
        }
      }
    },

    'isVisible' (visible) {
      if (visible) {
        this.$emit('enter-view')
        bus.$emit('table-grid-content-item-scroll', Object.assign({}, this.scrollData))
      } else {
        this.$emit('exit-view')
      }
    }
  },

  created () {
    this.listeners = {
      onAnalyzeScroll: this.onAnalyzeScroll.bind(this)
    }
  },

  mounted () {
    this.scrollData = this.analyzeScrollInit(this.$el)
    // Notify when got into view
    if (this.observer) {
      this.observer.disconnect()
    }
    this.observer = new IntersectionObserver(entries => {
      if (entries.length > 1) {
        console.warn('TableGridContentItemComponent intersections > 2', entries)
      }
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting
      })
    }, {
      threshold: 0.625
    })
    this.observer.observe(this.$el)
    // update scroll on resize and other events
    window.removeEventListener('resize', this.listeners.onAnalyzeScroll)
    window.addEventListener('resize', this.listeners.onAnalyzeScroll)
    bus.$off(this.updateScrollDataOn, this.listeners.onAnalyzeScroll)
    bus.$on(this.updateScrollDataOn, this.listeners.onAnalyzeScroll)
  },

  beforeDestroy () {
    this.observer.disconnect()
    bus.$off(this.updateScrollDataOn, this.listeners.onAnalyzeScroll)
    window.removeEventListener('resize', this.listeners.onAnalyzeScroll)
  },

  methods: {
    onScroll (event) {
      this.analyzeScrollTick(this.scrollData, this.$el, data => {
        this.scrollData = Object.assign(data, { event })
      })
    },

    onAnalyzeScroll () {
      this.scrollData = this.analyzeScrollInit(this.$el)
    },

    ...analyzeScrollMixin
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/common'

.minota-table-grid__content-item
  overflow auto
  scroll-snap-align center
  scroll-snap-stop always
  box-sizing border-box
</style>
