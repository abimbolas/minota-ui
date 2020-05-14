<template lang="pug">
  .minota-screen
    header.minota-screen-header
      bar-component(v-bind:toggle="isBarVisible")
        slot(name="bar")
    main.minota-screen-main
      slot(name="content")
    footer.minota-screen-footer
      slot(name="footer")
</template>

<script>
import BarComponent from '@/components/Bar'

export default {
  name: 'Screen',

  components: {
    BarComponent
  },

  data () {
    return {
      isBarVisible: true
    }
  },

  methods: {
    onScreenClick (event) {
      this.isBarVisible = !this.isBarVisible
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/variables"

.minota-screen
  position relative
  min-height 100vh
  .minota-screen-main
    display flex
    min-height calc(100vh - 56px)
    box-sizing border-box
    // @media (min-width screen-sm)
    padding 0.125rem 0.5rem 0.5rem 0.5rem
    @media (min-width screen-md)
      padding 0.25rem 1rem 1rem 1rem
</style>
