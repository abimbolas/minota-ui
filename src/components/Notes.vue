<template lang="pug">
  .minota-notes
    .minota-row
      .minota-cell(
        v-for="note in notes"
        :key="note.id"
        :ref="note.id"
        v-observe-view
        @enter-view="onFocusNote(note)")
        note-component(:note-id="note.id")

      //- Right actions
      .minota-cell.minota-actions.right
        .minota-action(
          outline
          v-observe-view:threshold="0.75"
          @enter-view="action.createNote = true"
          @exit-view="action.createNote = false"
          @click="onCreateNote") Create Note

    //- Bottom actions
    .minota-actions.bottom
      .minota-action(
        danger
        primary
        v-if="!action.createNote"
        v-observe-view:threshold="1"
        @enter-view="action.deleteNote = true"
        @exit-view="onDeleteNote") Delete Note
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { Note } from '@/domain/user/note'
import NoteComponent from '@/components/Note'
import { observeView } from '@/directives'

export default {
  name: 'Notes',
  directives: {
    observeView
  },
  components: {
    NoteComponent
  },
  data () {
    return {
      task: {
        initialFocusNote: true
      },
      timeout: {
        focus: null
      },
      action: {
        createNote: false
      }
    }
  },
  computed: {
    ...mapState({
      focusedNote: state => state['note'].note,
      notes: state => state['notes'].notes
    }),
    ...mapGetters('notes', ['byNoteId'])
  },
  updated () {
    // Initially show focused note
    if (this.task.initialFocusNote && this.$refs[this.focusedNote.id]) {
      this.focusNote(this.focusedNote, true) // instant focus
      this.task.initialFocusNote = false
    }
    // Defer focus note
    if (this.task.focusNote && this.$refs[this.task.focusNote.id]) {
      this.focusNote(this.task.focusNote)
      this.task.focusNote = null
    }
  },
  methods: {
    onCreateNote () {
      const note = new Note()
      this.$store.commit('notes/add', note)
      this.$store.commit('note/replace', this.byNoteId(note.id))
      setTimeout(() => {
        this.focusNote(note)
      }, 100)
    },
    onDeleteNote () {
      if (this.action.deleteNote) {
        this.openModalAction({
          modal: {
            component: 'PromptModal',
            header: 'Delete Note',
            description: [
              `<p style="font-size: smaller;">${this.focusedNote.config.date.toDateString()}</p>`,
              `<p><em><q>${this.focusedNote.content.slice(0, 100)}...</q></em></p>`
            ].join('\n'),
            ok: 'Delete',
            cancel: 'Cancel',
            danger: true
          }
        }).then(() => {
          this.$store.commit('notes/delete', this.focusedNote)
          this.focusNote(this.notes.slice(-1)[0])
        }).catch(() => {
          console.warn('Cancel delete')
        })
        this.action.deleteNote = false
      }
    },
    onFocusNote (note) {
      clearTimeout(this.timeout.focus)
      this.timeout.focus = setTimeout(() => {
        this.$store.commit('note/replace', this.byNoteId(note.id))
      }, 150)
    },
    focusNote (note, instant) {
      requestAnimationFrame(() => {
        if (this.$refs[note.id] && this.$refs[note.id][0]) {
          this.$refs[note.id][0].scrollIntoView({
            behavior: (instant ? 'auto' : 'smooth')
          })
        } else {
          this.task.focusNote = note
        }
      })
    },
    ...mapActions(['openModalAction'])
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/actions'
@import '~@/assets/styles/grid'

.minota-notes
  height 100%
  width 100%
  overflow auto
  scroll-snap-type block mandatory

.minota-row
  scroll-snap-align center

.minota-cell
  padding 0.5rem

.minota-actions.right
  .minota-action
    flex-grow 1

.minota-actions.bottom
  padding 0.5rem
  box-sizing border-box
  height: 9rem
  .minota-action
    flex-grow 1
</style>
