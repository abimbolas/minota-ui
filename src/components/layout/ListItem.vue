<template lang="pug">
  .minota-list-item(
    v-bind:disabled="disabled"
    v-on:click="handlePrimaryAction($event)"
  )

    .left.primary-activation
      slot(name="primary-activation")
    .left.primary-action
      slot(name="primary-action")

    .right.meta.text-caption.medium-emphasis
      slot(name="meta")
    .right.secondary-action
      slot(name="secondary-action")

    .body
      .overline.text-overline
        slot(name="overline")
      .title.text-subtitle
        slot(name="title")
      .description.text-caption
        slot(name="description")

</template>

<script>
export default {
  name: 'ListItem',

  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handlePrimaryAction (event) {
      this.$emit('primary-action')
    }
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/variables"

.minota-list-item
  line-height 1.25rem
  position relative
  display flex
  width calc(100% + 2rem)
  align-items top
  margin-left -1rem
  margin-right -1rem
  padding-left 1rem
  padding-right 1rem
  box-sizing border-box

  @media (min-width 768px)
    margin-left 0rem
    margin-right 0rem
    padding-left 0rem
    padding-right 0rem
    width 100%

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
    background-color gainsboro
  &:last-child:after
    content none

  .left:empty
  .right:empty
    display none

  .left
    order 1
    &:not(:empty)
      margin-left -0.75rem
      & ~ .body
        margin-left 0.25rem

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

  .title
    position relative
    top -1px
    color alpha(black, high-emphasis)
    font-weight 500
    white-space nowrap
    overflow hidden
    text-overflow ellipsis

  .description
    overflow hidden
    color alpha(black, medium-emphasis)
    font-weight 400
    & > [class*="-line"]
      overflow hidden
    .one-line
      white-space nowrap
      text-overflow ellipsis
    .two-lines
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      max-height 2.5rem
    .three-lines
      display -webkit-box
      -webkit-line-clamp 3
      -webkit-box-orient vertical
      max-height 3.75rem
</style>
