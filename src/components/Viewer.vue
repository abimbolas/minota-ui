<template lang="pug">
  .minota-viewer(v-html="content")
</template>

<script>
import marked from 'marked'

export default {
  name: 'Viewer',

  props: {
    value: {
      type: String,
      required: true,
      default: '(no content)'
    }
  },

  computed: {
    content () {
      return marked(this.value)
    }
  }
}
</script>

<style lang="stylus">
.minota-viewer
  font-size 14px
  padding-top 4px
  padding-bottom 4px
  p
  ul
  ol
    margin 1.5em 0
    &:first-child
      margin-top 0
    &:last-child
      margin-bottom 0
  ul
  ol
    padding-left 1em
  p + ul,
  p + ol
    margin-top -1.5em
  strong
    font-weight 500
  a
    word-break break-word
    
  h6
  h5
  h4
  h3
  h2
  h1
    font-weight 400
    line-height 1.5
    
  h6
    font-size 1em
  h5
    font-size 1em
  h4
    font-size 1em
  h3
    font-size 1.125em
  h2
    font-size 1.25em
    line-height 1.375
  h1
    font-size 1.5em
    line-height 1.375
    
    
</style>
