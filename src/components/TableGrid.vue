<template lang="pug">
  .minota-table-grid(v-on:scroll="onGridScroll($event)")
    .minota-table-grid__actions.minota-table-grid__actions_top(
      v-bind:class="{ 'minota-table-grid__actions_overflow_top': contentOverflow.top }")
      slot(name="actions-top")
    .minota-table-grid__actions.minota-table-grid__actions_bottom(
      v-bind:class="{ 'minota-table-grid__actions_overflow_bottom': contentOverflow.bottom }")
      slot(name="actions-bottom")
    .minota-table-grid__actions.minota-table-grid__actions_left(
      v-bind:class="{ 'minota-table-grid__actions_overflow_left': contentOverflow.left }")
      slot(name="actions-left")
    .minota-table-grid__actions.minota-table-grid__actions_right(
      v-bind:class="{ 'minota-table-grid__actions_overflow_right': contentOverflow.right }")
      slot(name="actions-right")
    .minota-table-grid__content(v-on:scroll="onGridContentScroll($event)")
      slot(name="content")
</template>

<script>
import bus from '@/event-bus'
import analyzeScrollMixin from '@/utils/analyze-scroll'

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
    'scrollGrid' (data) {
      // // Vertical stick scroll conditions
      // let scrollDown = data.velocityY > 0
      // let scrollUp = data.velocityY < 0
      // let actionsTopVisible = data.scrollTop < this.actions.top
      // let actionsBottomVisible = data.scrollBottom < this.actions.bottom
      // if ((scrollDown && actionsTopVisible) || (scrollUp && actionsBottomVisible)) {
      //   this.stick.vertical = true
      //   clearTimeout(this.stickVerticalTimeout)
      //   this.stickVerticalTimeout = setTimeout(() => {
      //     data.element.style.pointerEvents = null
      //     this.stick.vertical = false
      //   }, 400)
      // }
      // if (this.stick.vertical) {
      //   let actionsTopHidden = data.scrollTop >= this.actions.top
      //   let actionsBottomHidden = data.scrollBottom >= this.actions.bottom
      //   if ((scrollDown && actionsTopHidden) || (scrollUp && actionsBottomHidden)) {
      //     data.element.style.pointerEvents = 'none'
      //     data.element.scrollTop = this.actions.top
      //   }
      // }
      // // Horizontal stick scroll conditions
      // let scrollRight = data.velocityX > 0
      // let scrollLeft = data.velocityX < 0
      // let actionsLeftVisible = data.scrollLeft < this.actions.left
      // let actionsRightVisible = data.scrollRight < this.actions.right
      // if ((scrollRight && actionsLeftVisible) || (scrollLeft && actionsRightVisible)) {
      //   this.stick.horizontal = true
      //   clearTimeout(this.stickHorizontalTimeout)
      //   this.stickHorizontalTimeout = setTimeout(() => {
      //     data.element.style.pointerEvents = null
      //     this.stick.horizontal = false
      //   }, 400)
      // }
      // if (this.stick.horizontal) {
      //   let actionsLeftHidden = data.scrollLeft >= this.actions.left
      //   let actionsRightHidden = data.scrollRight >= this.actions.right
      //   if ((scrollRight && actionsLeftHidden) || (scrollLeft && actionsRightHidden)) {
      //     data.element.style.pointerEvents = 'none'
      //     data.element.scrollLeft = this.actions.left
      //   }
      // }
      console.log(data.scrollTop)
    },

    'scrollContent' (data) {
      this.contentOverflow.left = data.scrollLeft > 0
      this.contentOverflow.right = data.scrollRight > 0
      clearTimeout(this.contentOverflowHorizontalTimeout)
      this.contentOverflowHorizontalTimeout = setTimeout(() => {
        this.contentOverflow.left = false
        this.contentOverflow.right = false
      }, 200)
    },

    'scrollContentItem' (data) {
      this.contentOverflow.top = data.scrollTop > 0
      this.contentOverflow.bottom = data.scrollBottom > 0
    }
  },

  created () {
    this.listeners = {
      onGridContentItemScroll: this.onGridContentItemScroll.bind(this)
    }
    bus.$on('table-grid-content-item-scroll', this.listeners.onGridContentItemScroll)
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
  },

  mounted () {
    this.scrollGrid = this.analyzeScrollInit(this.$el)
    this.scrollContent = this.analyzeScrollInit(this.$el.querySelector('.minota-table-grid__content'))
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
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {
    onGridScroll (event) {
      this.analyzeScrollTick(this.scrollGrid, event.target, data => {
        // this.scrollGrid = Object.assign(data, { event })
      })
    },

    onGridContentScroll (event) {
      this.analyzeScrollTick(this.scrollContent, event.target, data => {
        this.scrollContent = data
      })
    },

    onGridContentItemScroll (data) {
      this.scrollContentItem = data
    },

    scrollHome () {
      setTimeout(() => {
        this.$el.querySelector('.minota-table-grid__content').scrollIntoView()
      }, 100)
    },

    stickContent (data) {
      data.element.style.pointerEvents = 'none'
      data.element.style.overflow = 'hidden'
      data.element.style.backgroundColor = 'red'
      clearTimeout(this.stickContentTimeout)
      this.stickContentTimeout = setTimeout(() => {
        data.element.style.pointerEvents = null
        data.element.style.overflow = null
        data.element.style.backgroundColor = null
      }, 300)
    },

    stickContentItem (data) {
      data.element.style.pointerEvents = 'none'
      data.element.style.overflow = 'hidden'
      clearTimeout(this.stickContentItemTimeout)
      this.stickContentItemTimeout = setTimeout(() => {
        data.element.style.pointerEvents = null
        data.element.style.overflow = null
      }, 300)
    },

    onKeyDown (event) {
      if (event.key === 'Control') {
        this.stick.content = true
      }
    },

    onKeyUp (event) {
      if (event.key === 'Control') {
        this.stick.content = false
      }
    },

    ...analyzeScrollMixin
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/common'

.minota-table-grid
  display grid
  grid-template-rows auto 100vh auto
  grid-template-columns auto 1fr auto
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
  scroll-snap-type both proximity
  scroll-snap-align center
  scroll-snap-stop always
  display grid
  overflow auto
  grid-auto-columns 100%
  grid-auto-flow column

.minota-table-grid__actions_overflow_top
  position relative
  z-index 1
  &:before
    content ' '
    border-radius 30%
    width calc(100% - 1rem)
    max-width 46rem
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
    max-width 48rem
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
    max-width 46rem
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
    max-width 48rem
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
    box-shadow 0px 0px 10px 0px alpha(black, 0.5)
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
    width 2rem
    background-color background-main
    bottom 0
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
    box-shadow 0px 0px 10px 0px alpha(black, 0.5)
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
    width 2rem
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
