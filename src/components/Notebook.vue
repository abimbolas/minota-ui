<template lang="pug">
  .minota-notepad

    //- Top actions
    .minota-actions.top
      .minota-action Switch to notebook

    //- Notes
    .minota-row
      .minota-cell(
        v-for="note in notes"
        :key="note.id"
        :ref="note.id"
        v-observe-view
        @enter-view="onFocusNote(note)")
        note-component.minota-notepad-note(:note-id="note.id")

      //- Right actions
      .minota-cell.minota-actions.right(
        v-observe-view:threshold="0.75"
        @enter-view="observe.rightActions = true"
        @exit-view="observe.rightActions = false")
        .minota-action.create(@click="onCreateNote")
          .minota-action-image

    //- Bottom actions
    .minota-actions.bottom
      .minota-action.delete.hover(
        danger
        primary
        v-observe-view:threshold="[0, 0.2, 1]"
        @change-view="observe.bottomActions = $event.detail.ratio")
        | Delete {{ observe.rightActions ? 'all notes in notepad' : 'note'}}
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { Note } from '@/domain/user/note'
import NoteComponent from '@/components/Note'
import { observeView } from '@/directives'

export default {
  name: 'Notpad',
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
      background: {
        danger: false
      },
      observe: {
        rightActions: false,
        bottomActions: 0
      },
      charge: {
        delete: false,
        background: false
      }
    }
  },
  computed: {
    ...mapState({
      focusedNote: state => state['note'].note,
      notes: state => state['notepad'].notes
    }),
    ...mapGetters('notepad', ['noteById'])
  },
  watch: {
    'observe.bottomActions' (ratio) {
      // Bottom Actions === Delete note(s)
      if (ratio === 1) {
        this.charge.delete = true
        this.charge.background = true
      } else if (this.charge.delete) {
        setTimeout(() => {
          Promise.all([
            this.observe.rightActions
              ? this.onDeleteNotes()
              : this.onDeleteNote()
          ]).finally(() => {
            this.background.danger = false
            this.charge.background = false
          })
        }, 150)
        this.charge.delete = false
      }

      // Setup ui
      if (ratio === 1) {
        this.background.danger = true
      } else if (!this.charge.background) {
        this.background.danger = false
      }
    }
  },
  updated () {
    // Initially show focused note
    if (this.task.initialFocusNote && this.$refs[this.focusedNote.id]) {
      this.scrollToNote(this.focusedNote, true) // instant focus
      this.task.initialFocusNote = false
    }
    // Defer focus note
    if (this.task.focusNote && this.$refs[this.task.focusNote.id]) {
      this.scrollToNote(this.task.focusNote)
      this.task.focusNote = null
    }
  },
  methods: {
    onCreateNote () {
      const note = new Note()
      this.$store.commit('notepad/add', note)
      this.$store.commit('note/replace', this.noteById(note.id))
      // Scroll to created note
      setTimeout(() => {
        this.scrollToNote(note)
      }, 100)
      // Focus note editor after animation
      setTimeout(() => {
        this.focusNoteEditor(note)
      }, 1000)
    },
    onDeleteNotes () {
      return this.openModalAction({
        modal: {
          component: 'PromptModal',
          header: 'Delete Notepad Notes',
          description: [
            `<p>Delete ${this.notes.length} notes in notepad?</p>`
          ].join('\n'),
          ok: `Yes, delete ${this.notes.length} notes`,
          cancel: 'Oh no, cancel',
          danger: true,
          primary: true
        }
      }).then(() => {
        this.$store.commit('notepad/delete', this.notes.slice(0))
      }).catch(() => {
        console.warn('Cancel delete all')
      })
    },
    onDeleteNote () {
      return this.openModalAction({
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
        this.$store.commit('notepad/delete', this.focusedNote)
        if (this.notes.length) {
          this.scrollToNote(this.notes[noteIndex])
        }
      }).catch(error => {
        console.warn('Cancel delete', error)
      })
    },
    onFocusNote (note) {
      clearTimeout(this.timeoutFocus)
      this.timeoutFocus = setTimeout(() => {
        this.$store.commit('note/replace', this.noteById(note.id))
      }, 150)
    },
    scrollToNote (note, instant) {
      requestAnimationFrame(() => {
        if (this.$refs[note.id] && this.$refs[note.id][0]) {
          this.$refs[note.id][0].scrollIntoView({
            behavior: (instant ? 'auto' : 'smooth')
          })
        } else {
          // Delay focus until note is added to DOM
          this.task.focusNote = note
        }
      })
    },
    focusNoteEditor (note) {
      if (this.$refs[note.id] && this.$refs[note.id][0]) {
        this.$refs[note.id][0]
          .querySelector('.minota-notepad-note')
          .dispatchEvent(new CustomEvent('focus-note-editor'))
      } else {
        console.warn(`focusNoteEditor: note ${note.id} not found`)
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

.minota-notepad
  height 100%
  width 100%
  overflow auto
  scroll-snap-type block mandatory

  &.danger
    background-color color-danger

.minota-row
  scroll-snap-align center

.minota-cell
  padding 0.5rem

//
// Last cell click action
//

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
      box-shadow shadow-note

    .minota-action-image
      width 100%
      height 100%
      margin 25%
      max-width 480px
      background url('~@/assets/images/book-hegel.png') no-repeat center
      background-size contain

//
// Bottom scroll action
//

.minota-actions.bottom
  padding 0.5rem 0.5rem 0 0.5rem
  box-sizing border-box
  height 7.5rem

  .minota-action
    flex-grow 1
    background-color brown
    border-bottom-left-radius 0
    border-bottom-right-radius 0
    box-shadow shadow-button
    border-bottom solid darken(brown, 12.5%) 4px

//
// Top scroll action
//

.minota-actions.top
  padding 0 0.5rem 0.5rem 0.5rem
  box-sizing border-box
  height 7.5rem

  .minota-action
    flex-grow 1
    // background-color white
    // border-top-left-radius 0
    // border-top-right-radius 0
    // box-shadow shadow-button
    // border-top solid darken(brown, 12.5%) 4px
</style>
