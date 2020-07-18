<template lang="pug">
  .minota-table-grid__content-item(
    v-bind:scroll-overflow="scrollOverflow"
    v-on:scroll-overflow="scrollOverflow = $event.detail"
    v-scroll-overflow)
    slot
</template>

<script>
import scrollOverflow from '@/directives/scroll-overflow'

export default {
  name: 'TableGridContentItem',

  directives: {
    scrollOverflow
  },

  data () {
    return {
      scrollOverflow: '',
      isVisible: null
    }
  },

  watch: {
    'isVisible' (isVisible) {
      this.$emit(`${isVisible ? 'enter' : 'exit'}-view`)
    }
  },

  mounted () {
    if (this.observer) {
      this.observer.disconnect()
    }
    this.observer = new IntersectionObserver(entries => {
      this.isVisible = entries.find(entry => entry.isIntersecting) || false
    }, { threshold: 0.625 })
    this.observer.observe(this.$el)
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/table'

.minota-table-grid__content-item
  &[scroll-overflow*="top"]:before
    content ' '
    z-index 1
    display block
    position sticky
    top -0.5rem
    margin-left -0.25rem
    width calc(100% + 0.5rem)
    height 0px
    box-shadow 0px 0px 0px 2px alpha(black, 0.125)
    @media (min-width 55rem)
      margin-left calc(50% - 23.5rem - 4vw - 1rem)
      width calc(47rem + 8vw + 2rem)
  &[scroll-overflow*="bottom"]:after
    content ' '
    z-index 1
    display block
    position sticky
    bottom -0.5rem
    margin-left -0.25rem
    width calc(100% + 0.5rem)
    height 0px
    box-shadow 0px 0px 0px 2px alpha(black, 0.125)
    @media (min-width 55rem)
      margin-left calc(50% - 23.5rem - 4vw - 1rem)
      width calc(47rem + 8vw + 2rem)
</style>
