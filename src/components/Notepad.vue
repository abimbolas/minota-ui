<template lang="pug">
  .minota-notepad
    .minota-row
      .minota-cell(
        v-for="note in notes"
        :key="note.id"
        :ref="note.id"
        v-observe-view
        :class="{focused: focusedNote.id === note.id, pending: charge.pending && focusedNote.id === note.id }"
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
        primary
        danger
        v-observe-view:threshold="[0, 0.2, 1]"
        @change-view="observe.bottomActions = $event.detail.ratio")
        | Delete {{ observe.rightActions ? 'all notes in notepad' : 'note'}}
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { Note } from '@/domain/user/note';
import NoteComponent from '@/components/Note';
import { observeView } from '@/directives';

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
        prepare: false,
        pending: false,
        decided: false
      },
      freeze: false
    };
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
      if (ratio === 1) {
        this.charge.decided = true;
        this.charge.pending = true;
      } else if (this.charge.decided) {
        setTimeout(() => {
          Promise.all([
            this.observe.rightActions
              ? this.onDeleteNotes()
              : this.onDeleteNote()
          ]).finally(() => {
            this.charge.pending = false;
          });
        }, 150);
        this.charge.decided = false;
      }
    }
  },
  updated () {
    // Initially show focused note
    if (this.task.initialFocusNote && this.$refs[this.focusedNote.id]) {
      this.scrollToNote(this.focusedNote, true); // instant focus
      this.task.initialFocusNote = false;
    }
    // Defer focus note
    if (this.task.focusNote && this.$refs[this.task.focusNote.id]) {
      this.scrollToNote(this.task.focusNote);
      this.task.focusNote = null;
    }
  },
  methods: {
    onCreateNote () {
      const note = new Note();
      this.$store.commit('notepad/add', note);
      this.$store.commit('note/replace', this.noteById(note.id));
      // Scroll to created note
      setTimeout(() => {
        this.scrollToNote(note);
      }, 100);
      // Focus note editor after animation
      setTimeout(() => {
        this.focusNoteEditor(note);
      }, 1000);
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
        this.$store.commit('notepad/delete', this.notes.slice(0));
      }).catch(() => {
        console.warn('Cancel delete all');
      });
    },
    onDeleteNote () {
      return this.openModalAction({
        modal: {
          component: 'PromptModal',
          header: 'Delete the note?',
          // description: [
          //   `<p style="font-size: smaller;">${this.focusedNote.config.date.toDateString()}</p>`,
          //   `<p><em><q>${this.focusedNote.content.slice(0, 100)}...</q></em></p>`
          // ].join('\n'),
          ok: 'Delete',
          cancel: 'Cancel',
          danger: true,
          primary: true
        }
      }).then(() => {
        let noteIndex = this.notes.findIndex(note => note.id === this.focusedNote.id);
        noteIndex = Math.max(0, noteIndex - 1);
        noteIndex = Math.max(0, Math.min(noteIndex, this.notes.length - 2));
        this.$store.commit('notepad/delete', this.focusedNote);
        if (this.notes.length) {
          this.scrollToNote(this.notes[noteIndex]);
        }
      }).catch(error => {
        console.warn('Cancel delete', error);
      });
    },
    onFocusNote (note) {
      clearTimeout(this.timeoutFocus);
      this.timeoutFocus = setTimeout(() => {
        this.$store.commit('note/replace', this.noteById(note.id));
      }, 150);
    },
    scrollToNote (note, instant) {
      requestAnimationFrame(() => {
        if (this.$refs[note.id] && this.$refs[note.id][0]) {
          this.$refs[note.id][0].scrollIntoView({
            behavior: (instant ? 'auto' : 'smooth')
          });
        } else {
          // Delay focus until note is added to DOM
          this.task.focusNote = note;
        }
      });
    },
    focusNoteEditor (note) {
      if (this.$refs[note.id] && this.$refs[note.id][0]) {
        this.$refs[note.id][0]
          .querySelector('.minota-notepad-note')
          .dispatchEvent(new CustomEvent('focus-note-editor'));
      } else {
        console.warn(`focusNoteEditor: note ${note.id} not found`);
      }
    },
    ...mapActions(['openModalAction'])
  }
};
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

  --note-border-radius: 1rem;

  &.danger
    background-color color-danger

.minota-row
  scroll-snap-align center

.minota-cell
  padding 1rem

  &.pending .minota-notepad-note
    background-color brown
    color alpha(white, high-emphasis)
    transition all 0.1s ease-out

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
      background url('~@/assets/images/signature-pushkin.png') no-repeat center
      background-size contain

//
// Bottom scroll action
//

.minota-actions.bottom
  padding 1rem
  padding-bottom 0
  box-sizing border-box
  height 25vh;

  .minota-action
    flex-grow 1
    // background-color brown
    border-top-left-radius 1rem
    border-top-right-radius 1rem

    border-bottom-left-radius 0
    border-bottom-right-radius 0
    box-shadow shadow-button
    // border-top solid darken(brown, 12.5%) 8px
</style>
