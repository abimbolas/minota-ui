<template lang="pug">
  .minota-notes(:class="styleClass")
    .minota-row
      .minota-cell(
        v-for="note in notes"
        :key="note.id"
        :ref="note.id"
        v-observe-view
        @enter-view="onFocusNote(note)")
        note-component(:note-id="note.id")

      //- Right actions
      .minota-cell.minota-actions.right(
        v-observe-view:threshold="0.75"
        @enter-view="action.createNote = true"
        @exit-view="action.createNote = false")
        .minota-action(@click="onCreateNote")
          .minota-action-image &nbsp;

    //- Bottom actions
    .minota-actions.bottom
      .minota-action(
        v-observe-view:threshold="[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]"
        @change-view="onDeleteChangeView") &nbsp;
      //- .minota-action(
        v-else
        v-observe-view:threshold="[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]"
        @change-view="onCreateChangeView") &nbsp;
      </template>
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
        createNote: false,
        deleteNote: false
      },
      change: {
        delete: false,
        create: false
      },
      styleNotes: {
        backgroundColor: 'transparent'
      },
      styleClass: {
        warning: false,
        danger: false
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
    onDeleteNotes () {
      this.openModalAction({
        modal: {
          component: 'PromptModal',
          header: 'Delete All Notes',
          description: [
            `<p>Delete all ${this.notes.length} notes?</p>`
          ].join('\n'),
          ok: `Yes, delete ${this.notes.length} notes`,
          cancel: 'Oh no, cancel',
          danger: true,
          primary: true
        }
      }).then(() => {
        this.$store.commit('notes/delete', this.notes.slice(0))
      }).catch(() => {
        console.warn('Cancel delete all')
      })
    },
    onDeleteNote () {
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
        let noteIndex = this.notes.findIndex(note => note.id === this.focusedNote.id)
        noteIndex = Math.max(0, noteIndex - 1)
        noteIndex = Math.max(0, Math.min(noteIndex, this.notes.length - 2))
        this.$store.commit('notes/delete', this.focusedNote)
        if (this.notes.length) {
          this.focusNote(this.notes[noteIndex])
        }
      }).catch(error => {
        console.warn('Cancel delete', error)
      })
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
    onDeleteChangeView (event) {
      const ratio = event.detail.ratio < 0.1 ? 0 : event.detail.ratio
      if (ratio > 0 && ratio <= 0.5) {
        this.styleClass.warning = true
        this.styleClass.danger = false
        // this.styleNotes.backgroundColor = 'sandybrown'
      } else if (ratio > 0.5 && ratio <= 1) {
        this.styleClass.warning = false
        this.styleClass.danger = true
      } else {
        this.styleClass.warning = false
        this.styleClass.danger = false
      }
      // 'Charge' deletion at 1, release at any lower
      if (ratio === 1) {
        this.change.delete = true
      } else if (this.change.delete) {
        setTimeout(() => {
          if (this.action.createNote) {
            this.onDeleteNotes()
          } else {
            this.onDeleteNote() // go-go-go
          }
        }, 150)
        this.change.delete = false
      }
    },
    ...mapActions(['openModalAction'])
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/actions'
@import '~@/assets/styles/grid'

.minota-notes
  height 100%
  width 100%
  overflow auto
  scroll-snap-type block mandatory

  &.warning
    background-color color-danger
  &.danger
    background-color color-danger

.minota-row
  scroll-snap-align center

.minota-cell
  padding 0.5rem

.minota-actions.right
  justify-content center
  align-items stretch

  .minota-action
    flex-direction column
    flex-grow 1
    display flex
    border-radius 0.25rem

    &:hover
      background-color transparent
    &:active
      background-color white
      box-shadow note-shadow

    .minota-action-image
      width 100%
      height 100%
      margin 5%
      max-width 480px
      background url('~@/assets/images/book-hegel.png') no-repeat center
      background-size contain

.minota-actions.bottom
  padding 0.5rem
  box-sizing border-box
  height: 7rem
  .minota-action
    flex-grow 1
</style>
