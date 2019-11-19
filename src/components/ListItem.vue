<template lang="pug">
  .minota-list-item(
    v-bind:disabled="disabled"
    v-long-click="375"
    v-on:normal-click="$emit('primary-action')"
    v-on:long-click="$emit('menu-action')"
  )
    //- Left
    .left.primary-activation
      slot(name="primary-activation")
    .left.primary-action
      slot(name="primary-action")

    //- Right
    .right.meta.text-caption.medium-emphasis
      slot(name="meta")
    .right.secondary-action
      slot(name="secondary-action")

    //- Body
    .body
      .overline.text-overline
        slot(name="overline")
      .title.text-h6
        slot(name="title")
      .description.text-body-smaller
        slot(name="description")
</template>

<script>
import longClick from '@/directives/long-click'

export default {
  name: 'ListItem',

  directives: {
    longClick
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handlePrimaryAction (event) {
      this.$emit('primary-action')
    },
    handleContextAction (event) {
      this.$emit('context-action')
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/variables"

.minota-list-item
  line-height 1.375rem
  position relative
  display flex
  align-items top
  padding-left 1rem
  padding-right 1rem
  box-sizing border-box

  @media (min-width screen-sm)
    padding-left 0.5rem
    padding-right 0.5rem

  @media (min-width screen-md)
    margin-left -0.5rem
    margin-right -0.5rem
    padding-left 0.5rem
    padding-right 0.5rem
    width calc(100% + 1rem)

  // &:not([disabled])
  //   cursor pointer

  // &:hover:not([disabled])
    // background-color alpha(gainsboro, low-emphasis)

  // &[disabled]
  //   pointer-events none

  // &[disabled] > *
  //   opacity low-emphasis

  &:after
    content ''
    display block
    height 1px
    position absolute
    bottom 0
    left 0
    right 0
    background-color border-color
  &:last-child:after
    content none

  .left:empty
  .right:empty
    display none

  .left
    order 1
    &:not(:empty)
      margin-right 0.5rem

  .right
    order 3

  .body
    order 2
    margin 1rem 0
    flex-grow 1
    min-width 0

  .primary-action:not(:empty)
    align-self center
    .button
    .material-icons
      display block

  .secondary-action:not(:empty)
    align-self center
    margin-left 1rem
    .material-icons
    .text-button
      display block
      color alpha(black, medium-emphasis)

  .meta
    margin-top 1rem

  .overline
    color alpha(black, low-emphasis)
    font-weight 500
    &:empty
      display none

  .title
    position relative
    top -1px
    color alpha(black, high-emphasis)
    font-weight 500
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    line-height 1.5em
    // margin-bottom 0.25rem
    & > div
      overflow hidden
      text-overflow ellipsis
    &:empty
      display none
    & ~ .description:not(:empty)
      margin-top 0.25rem

  .description
    overflow hidden
    color alpha(black, medium-emphasis)
    font-weight 400
    line-height 1.5em
    & > [class*="-line"]
      overflow hidden
    .one-line
      white-space nowrap
      text-overflow ellipsis
    .two-lines
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      max-height 3em
    .three-lines
      display -webkit-box
      -webkit-line-clamp 3
      -webkit-box-orient vertical
      max-height 4.5em
</style>
