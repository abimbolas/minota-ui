<template lang="pug">
  .minota-screen-placeholder
    .placeholder-text {{ text }}
    img.placeholder-image(v-if="image" v-bind:src="image")
</template>

<script>
export default {
  name: 'ScreenPlaceholder',

  props: {
    text: {
      required: true,
      type: String,
      default: 'Пусто'
    },
    image: {
      required: false,
      type: String,
      default: null
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/typography'

.minota-screen-placeholder
  position absolute
  pointer-events none
  left 0
  height 160px
  width 100%
  top calc(50% - 80px)
  text-align center
  color alpha(black, low-emphasis)
  box-sizing border-box
  padding 16px
  margin-top
  background-position center center
  background-size auto 110px
  background-repeat no-repeat
  // opacity low-emphasis
  z-index 0
  .placeholder-text
    max-width 30em
    margin-left auto
    margin-right auto
    @extend .text-overline

  .placeholder-image
    margin 1.5rem auto 0rem auto
    display block
    max-width 320px
    width 90%

  &[placeholder="0"]
    background-image url('~@/assets/images/signature-dostoevsky.png')
  &[placeholder="1"]
    background-image url('~@/assets/images/signature-lenin.png')
  &[placeholder="2"]
    background-image url('~@/assets/images/signature-marx.png')
  &[placeholder="3"]
    background-image url('~@/assets/images/signature-pushkin.png')
  &[placeholder="4"]
    background-image url('~@/assets/images/signature-tolstoy.png')
</style>
