<template lang="pug">
  .minota-note
    //- Editor
    .minota-note__editor(
      ref="editor"
      contenteditable
      placeholder="(Заметка девственно чиста)"
      @input="$emit('update', $event.target.innerText)")
</template>

<script>
export default {
  name: 'Note',
  props: {
    content: String,
    required: false,
    default: ''
  },
  watch: {
    'content' (content) {
      this.$refs.editor.innerText = content
    }
  },
  mounted () {
    this.$refs.editor.innerText = this.content
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/variables'

.minota-note
  background-color white
  box-sizing border-box

//
// Editor
//

.minota-note__editor
  outline none
  font-family sans-family
  font-size var(--editor-font-size, 18px)
  max-width var(--editor-max-width, 40em)
  width 100%
  margin-left auto
  margin-right auto
  min-height var(--editor-min-height, 0)

  &:empty:before
    content attr(placeholder)
    color alpha(black, low-emphasis)
</style>
