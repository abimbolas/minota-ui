<template lang="pug">
  .minota-table-grid(v-on:scroll="onGridScroll($event)")
    //- Top
    .minota-table-grid__actions.minota-table-grid__actions_top(
      v-on:click="closeBar($event)")
      slot(name="actions-top")

    //- Bottom
    .minota-table-grid__actions.minota-table-grid__actions_bottom(
      v-on:click="closeBar($event)")
      slot(name="actions-bottom")

    //- Left
    .minota-table-grid__actions.minota-table-grid__actions_left(
      v-on:click="closeBar($event)")
      slot(name="actions-left")

    //- Right
    .minota-table-grid__actions.minota-table-grid__actions_right(
      v-on:click="closeBar($event)")
      slot(name="actions-right")
    //- Content
    //- .minota-table-grid__content(v-on:scroll="onGridContentScroll($event)")
    slot(name="content")
</template>

<script>
import bus from '@/event-bus'
import analyzeScrollMethods from '@/utils/analyze-scroll'

function truncDelta (num) {
  let ratio = Math.abs(num - Math.trunc(num))
  return Math.min(ratio, Math.abs(ratio - 1))
}

export default {
  name: 'TableGrid',

  data () {
    return {
      scrollGrid: {},
      scrollContent: {},
      scrollContentItem: {},
      stick: {
        content: false,
        vertical: false,
        horizontal: false
      },
      contentOverflow: {
        top: false,
        bottom: false,
        left: false,
        right: false
      }
    }
  },

  watch: {
    'scrollContent' (data) {
      this.contentOverflow.left = data.scrollLeft > 5
      this.contentOverflow.right = data.scrollRight > 5
      clearTimeout(this.contentOverflowHorizontalTimeout)
      this.contentOverflowHorizontalTimeout = setTimeout(() => {
        if (truncDelta(data.scrollLeft / data.offsetWidth) < 0.02) {
          this.contentOverflow.left = false
          this.contentOverflow.right = false
        }
      }, 200)
    },

    'scrollContentItem' (data) {
      this.contentOverflow.top = data.scrollTop > 5
      this.contentOverflow.bottom = data.scrollBottom > 5
    }
  },

  created () {
    this.listeners = {
      onGridContentItemScroll: this.onGridContentItemScroll.bind(this)
    }
    bus.$on('table-grid-content-item-scroll', this.listeners.onGridContentItemScroll)
  },

  mounted () {
    this.scrollGrid = this.analyzeScrollInit(this.$el)
    // this.scrollContent = this.analyzeScrollInit(this.$el.querySelector('.minota-table-grid__content'))
    this.actions = {
      top: this.$el.querySelector('.minota-table-grid__actions_top').offsetHeight,
      bottom: this.$el.querySelector('.minota-table-grid__actions_bottom').offsetHeight,
      left: this.$el.querySelector('.minota-table-grid__actions_left').offsetWidth,
      right: this.$el.querySelector('.minota-table-grid__actions_right').offsetWidth
    }
    this.scrollHome()
  },

  beforeDestroy () {
    bus.$off('table-grid-content-item-scroll', this.listeners.onGridContentItemScroll)
  },

  methods: {
    onGridContentScroll (event) {
      this.analyzeScrollTick(this.scrollContent, event.target, data => {
        this.scrollContent = data
      })
    },

    onGridContentItemScroll (data) {
      this.scrollContentItem = data
    },

    scrollHome () {
      // setTimeout(() => {
      //   this.$el.querySelector('.minota-table-grid__content').scrollIntoView({
      //     behavior: 'smooth'
      //   })
      // }, 50)
    },

    closeBar (event) {
      if (
        event.target.classList.contains('minota-table-grid__actions') ||
        event.target.classList.contains('minota-sections_note-width')
      ) {
        this.scrollHome()
      }
    },

    ...analyzeScrollMethods
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/common'

.minota-table-grid
  display grid
  grid-template-rows auto 100vh auto
  grid-template-columns auto 100vw auto
  grid-template-areas 'top-left top top-right' 'left main right' 'bottom-right bottom bottom-left'
  height 100vh
  width 100vw

.minota-table-grid__actions
  display flex
  &:empty
    display none

.minota-table-grid__actions_top
  // background-color alpha(grey, 0.25)
  grid-area top
  scroll-snap-align start
  scroll-snap-stop always

.minota-table-grid__actions_bottom
  // background-color alpha(blue, 0.25)
  grid-area bottom
  scroll-snap-align end
  scroll-snap-stop always

.minota-table-grid__actions_left
  // background-color alpha(yellow, 0.25)
  grid-area left
  scroll-snap-align start
  scroll-snap-stop always

.minota-table-grid__actions_right
  // background-color alpha(green, 0.25)
  grid-area right
  scroll-snap-align end
  scroll-snap-stop always

.minota-table-grid__content
  grid-area main
  scroll-snap-type inline proximity
  scroll-snap-align center
  scroll-snap-stop always
  display grid
  overflow auto
  grid-auto-columns 100%
  // grid-auto-flow column

.minota-table-grid__actions_overflow_top
  position relative
  z-index 1
  &:before
    content ' '
    border-radius 30%
    width calc(100% - 1rem)
    max-width 54rem
    height 1.5rem
    left 50%
    bottom 0
    transform translateX(-50%)
    box-shadow 0px 0px 7px 0px alpha(black, 0.5)
    position absolute
    z-index -2
    pointer-events none
  &:after
    content ' '
    position absolute
    left 50%
    bottom 0
    transform translateX(-50%)
    height 100%
    width 100%
    max-width 56rem
    background-color background-main
    z-index -1
    pointer-events none
    box-shadow 0px 1px 0px 0px alpha(black, 0.075)

.minota-table-grid__actions_overflow_bottom
  position relative
  z-index 1
  &:before
    content ' '
    border-radius 30%
    position absolute
    width calc(100% - 1rem)
    max-width 54rem
    height 1.5rem
    top 0px
    left 50%
    transform translateX(-50%)
    box-shadow 0px 0px 7px 0px alpha(black, 0.5)
    z-index -2
    pointer-events none
  &:after
    content ' '
    position absolute
    left 50%
    top 0
    transform translateX(-50%)
    height 100%
    width 100%
    max-width 56rem
    background-color background-main
    z-index -1
    pointer-events none
    box-shadow 0px -1px 0px 0px alpha(black, 0.075)

.minota-table-grid__actions_overflow_left
  position relative
  box-shadow 1px 0px 0px 0px alpha(black, 0.075)
  z-index 1
  &:before
    content ' '
    border-radius 30%
    height calc(100% - 1rem)
    width 1rem
    box-shadow 0px 0px 10px 0px alpha(black, 0.25)
    position absolute
    top 0.5rem
    right 0
    z-index -2
    pointer-events none
  &:after
    content ' '
    position absolute
    right 0
    top 0
    width 100%
    height 100%
    background-color background-main
    z-index -1
    pointer-events none

.minota-table-grid__actions_overflow_right
  position relative
  box-shadow -1px 0px 0px 0px alpha(black, 0.075)
  z-index 1
  &:before
    content ' '
    border-radius 30%
    height calc(100% - 1rem)
    width 1rem
    box-shadow 0px 0px 10px 0px alpha(black, 0.25)
    position absolute
    top 0.5rem
    left 0
    z-index -2
    pointer-events none
  &:after
    content ' '
    position absolute
    left 0
    top 0
    width 100%
    background-color background-main
    bottom 0
    z-index -1
    pointer-events none

@media (max-width screen-md)
  .minota-table-grid__actions_overflow_top:after
  .minota-table-grid__actions_overflow_bottom:after
  .minota-table-grid__actions_overflow_left:after
  .minota-table-grid__actions_overflow_right:after
    background-color white
</style>
