<template lang="pug">
  .minota-note
    .minota-note-editor(
      ref="editor"
      contenteditable
      placeholder="(Заметка девственно чиста)"
      @input="onUpdate($event)")
</template>

<script>
import { mapGetters } from 'vuex'
import { Note } from '@/domain/user/note'

export default {
  name: 'Note',
  props: {
    noteId: {
      type: String,
      required: false,
      default: null
    },
    noteModel: {
      type: Note,
      required: false,
      default: null
    }
  },
  computed: {
    focusedNote () {
      return this.$store.state['note'].note
    },
    note () {
      if (this.noteModel) {
        return this.noteModel
      } else if (this.noteId) {
        return this.byNoteId(this.noteId)
      } else {
        return this.focusedNote
      }
    },
    ...mapGetters('notes', ['byNoteId'])
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
      if (this.noteId || this.noteModel) {
        this.$store.commit('notes/update', {
          id: this.note.id,
          content: event.target.innerText
        })
      } else {
        this.$store.commit('note/update', {
          content: event.target.innerText
        })
      }
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
  box-shadow var(--note-box-shadow, note-shadow)

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
  cursor text

  &:empty:before
    content attr(placeholder)
    color alpha(black, low-emphasis)
    user-select none
</style>
