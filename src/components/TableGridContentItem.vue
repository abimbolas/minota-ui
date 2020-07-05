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
      scrollData: {}
    }
  },

  watch: {
    'scrollData' (scrollData) {
      bus.$emit('table-grid-content-item-scroll', scrollData)
    }
  },

  mounted () {
    this.scrollData = this.analyzeScrollInit(this.$el)
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.$emit('enter-view')
          bus.$emit('table-grid-content-item-scroll', Object.assign({}, this.scrollData))
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
      this.analyzeScrollTick(this.scrollData, this.$el, data => {
        this.scrollData = Object.assign(data, { event })
      })
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
