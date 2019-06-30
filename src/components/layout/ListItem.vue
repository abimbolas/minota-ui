<template lang="pug">
  .minota-list-item(
    v-bind:disabled="disabled"
    v-on:click="handlePrimaryAction($event)"
  )
    .left
      .primary-activation
        slot(name="primary-activation")
      .primary-action
        slot(name="primary-action")
    .body
      .overline.text-overline
        slot(name="overline")
      .title.text-subtitle
        slot(name="title")
      .description.text-caption
        slot(name="description")
    .right
      .meta.text-caption.medium-emphasis
        slot(name="meta")
      .secondary-action
        slot(name="secondary-action")
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
  overflow hidden
  position relative
  display flex
  width 100%
  align-items top

  &:not([disabled])
    cursor pointer

  // &:hover:not([disabled])
    // background-color alpha(gainsboro, low-emphasis)

  &[disabled]
    pointer-events none

  &[disabled] > *
    opacity low-emphasis

  // divider
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

  .body
    margin 1rem
    flex-grow 1

  .left
  .right
    display flex

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
    [class*="-line"]
      overflow hidden
      // display -webkit-box
      // -webkit-line-clamp 2
      // -webkit-box-orient vertical
      // max-height 2.5rem
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
