<template lang="pug">
  .minota-note
    //- Editor
    .minota-note__editor(
      ref="editor"
      contenteditable
      placeholder="(Заметка девственно чиста)"
      @input="onUpdate($event)")
</template>

<script>
import { Note } from '@/domain/user/note'

export default {
  name: 'Note',
  props: {
    note: {
      type: Note,
      required: false,
      default () {
        return new Note()
      }
    }
  },
  watch: {
    'note.content' (content) {
      console.log('note.content changed', content, this.note.id, this.note.content)
      // 1. save cursor position
      // 2. insert text
      if (this.$refs.editor.innerText !== content) {
        this.syncToEditor(content || '')
      }
    }
  },
  methods: {
    syncToEditor (content) {
      this.$refs.editor.innerText = content
    },
    onUpdate (event) {
      this.$emit('update', event.target.innerText)
    }
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
