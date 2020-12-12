<template lang="pug">
  .minota-note
    .minota-note-editor(
      ref="editor"
      contenteditable
      placeholder="(Заметка девственно чиста)"
      @input="onUpdate($event)")
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Note',
  computed: {
    ...mapState('note', ['note'])
  },
  watch: {
    note: {
      handler (note) {
        if (this.$refs.editor.innerText !== note.content) {
          this.$refs.editor.innerText = note.content || ''
        }
      },
      deep: true
    }
  },
  mounted () {
    this.$refs.editor.innerText = this.note.content || ''
  },
  methods: {
    onUpdate (event) {
      this.$store.commit('note/update', {
        content: event.target.innerText
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/variables'

.minota-note
  min-height 100%
  background-color white
  box-sizing border-box
  padding var(--note-padding, 3rem 3rem)
  border-radius var(--note-border-radius, 0.25rem)
  box-shadow var(--note-box-shadow, 0px 1px 5px 0px alpha(black, 0.1))

//
// Editor
//

.minota-note-editor
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
