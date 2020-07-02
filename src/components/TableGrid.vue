<template lang="pug">
  .minota-table-grid(v-on:scroll="onGridScroll($event)")
    .minota-table-grid__actions.minota-table-grid__actions_top(
      v-bind:class="{'minota-table-grid__actions_sticky-top': sticky.top }")
      slot(name="actions-top")
    .minota-table-grid__actions.minota-table-grid__actions_bottom(
      v-bind:class="{'minota-table-grid__actions_sticky-bottom': sticky.bottom }")
      slot(name="actions-bottom")
    .minota-table-grid__actions.minota-table-grid__actions_left(
      v-bind:class="{'minota-table-grid__actions_sticky-left': sticky.left }")
      slot(name="actions-left")
    .minota-table-grid__actions.minota-table-grid__actions_right(
      v-bind:class="{'minota-table-grid__actions_sticky-right': sticky.right }")
      slot(name="actions-right")
    .minota-table-grid__content(
      v-on:scroll="onGridContentScroll($event)"
      v-bind:scroll-content-disabled="scrollContentDisabled")
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
      scrollContentDisabled: false,
      sticky: {
        bottom: false,
        top: false
      }
    }
  },

  watch: {
    'scrollGrid' (data) {
      // Disable content-item scroll to let grid
      // if (data.velocityY > 0 && data.scrollTop >= this.actions.top * 0.5) {
      //   this.releaseScrollContent()
      // }
      // if (data.velocityY < 0 && data.scrollBottom >= this.actions.bottom * 0.5) {
      //   this.releaseScrollContent()
      // }
      // if (data.velocityX > 0 && data.scrollLeft >= this.actions.left * 0.5) {
      //   this.releaseScrollContent()
      // }
      // if (data.velocityX < 0 && data.scrollRight >= this.actions.right * 0.5) {
      //   this.releaseScrollContent()
      // }
      // if (data.scrollTop === 0 || data.scrollBottom === 0 || data.scrollLeft === 0 || data.scrollRight === 0) {
      //   this.releaseScrollContent()
      // }
      // Set sticky style of actions
      if (this.scrollContentItem.scrollBottom > 0 && data.scrollBottom === 0) {
        this.sticky.bottom = true
      } else {
        this.sticky.bottom = false
      }
      if (this.scrollContentItem.scrollTop > 0 && data.scrollTop === 0) {
        this.sticky.top = true
      } else {
        this.sticky.top = false
      }
      if (this.scrollContentItem.scrollLeft > 0 && data.scrollLeft === 0) {
        this.sticky.left = true
      } else {
        this.sticky.left = false
      }
      if (this.scrollContentItem.scrollRight > 0 && data.scrollRight === 0) {
        this.sticky.right = true
      } else {
        this.sticky.right = false
      }
    },

    'scrollContent' (data) {
      if (data.velocityX > 0 && this.scrollGrid.scrollLeft < this.actions.left) {
        this.disableScrollContent()
        if (data.scrollLeft < this.actions.left) {
          data.element.scrollLeft = 0
        }
      }
      if (data.velocityX < 0 && this.scrollGrid.scrollRight < this.actions.right) {
        this.disableScrollContent()
        if (data.scrollRight < this.actions.right) {
          data.element.scrollRight = data.scrollWidth
        }
      }
    },

    'scrollContentItem' (data) {
      if (data.velocityY > 0 && this.scrollGrid.scrollTop < this.actions.top) {
        this.disableScrollContent()
        if (data.scrollTop < this.actions.top) {
          data.element.scrollTop = 0
        }
      }
      if (data.velocityY < 0 && this.scrollGrid.scrollBottom < this.actions.bottom) {
        this.disableScrollContent()
        if (data.scrollBottom < this.actions.bottom) {
          data.element.scrollTop = data.scrollHeight
        }
      }
    }
  },

  created () {
    this.listeners = {
      onGridContentItemScroll: this.onGridContenItemScroll.bind(this)
    }
    bus.$on('table-grid-content-item-scroll', this.listeners.onGridContentItemScroll)

    // Ctrl
    document.addEventListener('keydown', event => {
      if (event.key === 'Control') {
        this.disableScrollContent()
      }
    })
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
  },

  methods: {
    onGridScroll (event) {
      this.analyzeScrollTick(this.scrollGrid, event.target, data => {
        this.scrollGrid = data
      })
    },

    onGridContentScroll (event) {
      this.analyzeScrollTick(this.scrollContent, event.target, data => {
        this.scrollContent = data
      })
    },

    onGridContenItemScroll (data) {
      this.scrollContentItem = data
    },

    scrollHome () {
      setTimeout(() => {
        this.$el.querySelector('.minota-table-grid__content').scrollIntoView()
      }, 100)
    },

    disableScrollContent () {
      this.scrollContentDisabled = true
      clearTimeout(this.releaseScrollContentTimeout)
      this.releaseScrollContentTimeout = setTimeout(() => {
        this.scrollContentDisabled = false
        console.log('release')
      }, 300)
    },

    ...analyzeScrollMixin
  }
}
</script>

<style lang="stylus">
.minota-table-grid
  display grid
  grid-template-rows auto auto auto
  grid-template-columns auto auto auto
  grid-template-areas 'top-right top top-left' 'left main right' 'bottom-right bottom bottom-left'
  height 100vh
  width 100vw
  overflow scroll
  scroll-snap-type both mandatory

.minota-table-grid__actions
  scroll-snap-stop always
  display flex
  justify-content space-between
  padding 1rem
  box-sizing border-box
  transition all 0.3s ease-out
  &:empty
    display none

.minota-table-grid__actions_top
  grid-area top
  scroll-snap-align end
  // background-color alpha(blue, 0.125)
  // padding-top 1.25rem
  padding-bottom 0.5rem

.minota-table-grid__actions_bottom
  grid-area bottom
  scroll-snap-align end
  // background-color alpha(green, 0.125)
  // padding-bottom 1.25rem
  padding-top 0.5rem

.minota-table-grid__actions_left
  grid-area left
  scroll-snap-align start
  // background-color alpha(yellow, 0.125)

.minota-table-grid__actions_right
  grid-area right
  scroll-snap-align end
  // background-color alpha(pink, 0.125)

.minota-table-grid__content
  grid-area main
  display flex
  flex-direction row
  height 100vh
  width 100vw
  // align-items flex-start
  overflow scroll
  scroll-snap-type both proximity
  scroll-snap-align center start
  scroll-snap-stop always
  &[scroll-content-disabled]
    background-color alpha(red, 0.125)
    pointer-events none

// .minota-table-grid__actions_sticky-top
// .minota-table-grid__actions_sticky-bottom
// .minota-table-grid__actions_sticky-left
// .minota-table-grid__actions_sticky-right
//   background-color white
//   box-shadow 0px 0.125rem 20px 0px alpha(black, 0.375)
//   z-index 1
//   position relative
// .minota-table-grid__actions_sticky-top
//   &:after
//     content ' '
//     position absolute
//     left 0
//     bottom -0.5rem
//     height 0.75rem
//     width 100%
//     background-color: white
//     display block
// .minota-table-grid__actions_sticky-bottom
//   &:after
//     content ' '
//     position absolute
//     left 0
//     top -0.5rem
//     height 0.75rem
//     width 100%
//     background-color: white
//     display block
</style>
