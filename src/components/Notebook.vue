<template lang="pug">
  .minota-grid.notebook

    //- Main
    .minota-grid-main.minota-row
      .minota-cell(
        v-for="id in table"
        :key="id"
        :ref="id"
        v-observe-view
        :class="getActionClass(id)"
        @enter-view="onFocusNote(id)")
        note-component.minota-notebook-note(:note-id="id")

      .minota-cell
        .minota-action.create(@click="onCreate")
          .minota-action-image

    //- Top
    .minota-grid-top.panel
      .minota-action(
        v-observe-view:threshold="[0, 0.2, 1]"
        @change-view="observeAction('top', $event.detail.ratio)")
        span Organize

    //- Left
    //- .minota-grid-left.panel
      .minota-action(
        v-observe-view:threshold="[0, 0.2, 1]"
        @change-view="observeAction('left', $event.detail.ratio)")
        span Get

    //- Right
    //- .minota-grid-right.panel
      .minota-action(
        v-observe-view:threshold="[0, 0.2, 0.9999, 1]"
        @change-view="observeAction('right', $event.detail.ratio)")
        span New

    //- Bottom
    .minota-grid-bottom.panel
      .minota-action(
        v-observe-view:threshold="[0, 0.2, 0.75, 1]"
        @change-view="observeAction('bottom', $event.detail.ratio)")
        span Delete
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
      action: {
        type: '',
        charged: false,
        pending: false
      },
      actionMap: {
        'top': 'Organize',
        'right': 'Create',
        'bottom': 'Delete',
        'left': 'Get'
      }
    };
  },
  computed: {
    table () {
      return this['notebook/table'];
    },
    ...mapState({
      focusedNote: state => state['note'].note,
      notes: state => state['notepad'].notes
    }),
    ...mapGetters('notepad', ['noteById']),
    ...mapGetters(['notebook/table'])
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
    observeAction (type, ratio) {
      if (ratio === 1) {
        this.action.pending = true;
        this.action.charged = true;
        this.action.type = type;
      } else if (this.action.charged) {
        setTimeout(() => {
          this[`on${this.actionMap[this.action.type]}`]().finally(() => {
            this.action.pending = false;
          });
        }, 150);
        this.action.charged = false;
      }
    },
    onGet () {
      console.log('Get');
      return Promise.resolve();
    },
    onOrganize () {
      return this.openModalAction({
        modal: {
          component: 'PromptModal',
          header: 'Organize the note?',
          ok: 'Organize',
          primary: true
        }
      }).then(() => {
        let noteIndex = this.table.findIndex(id => id === this.focusedNote.id);
        noteIndex = Math.max(0, noteIndex - 1);
        noteIndex = Math.max(0, Math.min(noteIndex, this.table.length - 2));
        this.$store.commit('notebook/removeFromTable', this.focusedNote);
        if (this.table.length) {
          this.scrollToNote(this.noteById(this.table[noteIndex]));
        }
      }).catch(() => {
        console.warn('Organize canceled');
      });
    },
    onCreate () {
      return new Promise(resolve => {
        const note = new Note();
        this.$store.commit('notepad/add', note);
        this.$store.commit('note/replace', this.noteById(note.id));
        this.$store.commit('notebook/addToTable', note);
        // Scroll to created note
        setTimeout(() => {
          this.scrollToNote(note);
        }, 100);
        // Focus note editor after animation
        setTimeout(() => {
          this.focusNoteEditor(note);
        }, 1000);
      });
    },
    onDelete () {
      return this.openModalAction({
        modal: {
          component: 'PromptModal',
          header: 'Delete the note?',
          ok: 'Delete',
          danger: true,
          primary: true
        }
      }).then(() => {
        let noteIndex = this.table.findIndex(id => id === this.focusedNote.id);
        noteIndex = Math.max(0, noteIndex - 1);
        noteIndex = Math.max(0, Math.min(noteIndex, this.table.length - 2));
        this.$store.commit('notepad/delete', this.focusedNote);
        this.$store.commit('notebook/removeFromTable', this.focusedNote);
        if (this.table.length) {
          this.scrollToNote(this.noteById(this.table[noteIndex]));
        }
      }).catch(() => {
        console.warn('Delete canceled');
      });
    },
    onFocusNote (id) {
      clearTimeout(this.timeoutFocus);
      this.timeoutFocus = setTimeout(() => {
        this.$store.commit('note/replace', this.noteById(id));
      }, 150);
    },
    scrollToNote (note, instant) {
      console.log(this.$refs[note.id]);
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
          .querySelector('.minota-note')
          .dispatchEvent(new CustomEvent('focus-note-editor'));
      } else {
        console.warn(`focusNoteEditor: note ${note.id} not found`);
      }
    },
    getActionClass (noteId) {
      if (this.action.pending && this.focusedNote.id === noteId) {
        return {
          [`pending-${this.actionMap[this.action.type].toLowerCase()}`]: true
        };
      } else return {};
    },
    ...mapActions(['openModalAction'])
  }
};
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/actions'
@import '~@/assets/styles/grid'

.notebook
  overflow auto

  .panel
    padding 1rem
    &.minota-grid-top
      padding-top 0
    &.minota-grid-right
      padding-right 0
    &.minota-grid-left
      padding-left 0
    &.minota-grid-bottom
      padding-bottom 0.5px /* strange bug */

  .minota-action
    border-radius 1rem
    box-sizing border-box
    box-shadow var(--shadow-note)
    font-size 120%

  // Get (left) action
  .minota-grid-left .minota-action
    background-color var(--color-fill-green)
    color var(--color-text-invert)
    border-top-left-radius 0
    border-bottom-left-radius 0
    width 10vw
    height 100%
    justify-content flex-end
    padding-right 3rem

  // Organize (top) action
  .minota-grid-top .minota-action
    background-color var(--color-fill-invert)
    color var(--color-text-invert)
    border-top-left-radius 0
    border-top-right-radius 0
    height 7.5rem
    width 100%
    align-items flex-end
    padding-bottom 3rem

  // Create (right) action
  .minota-grid-right .minota-action
    background-color var(--color-fill-blue)
    color var(--color-text-invert)
    border-top-right-radius 0
    border-bottom-right-radius 0
    width 10vw
    height 100%
    justify-content flex-start
    padding-left 3rem

  // Delete (bottom) action
  .minota-grid-bottom .minota-action
    background-color var(--color-fill-red)
    color var(--color-text-invert)
    border-bottom-left-radius 0
    border-bottom-right-radius 0
    width 100%
    height 7.5rem
    align-items flex-start
    padding-top 3rem

  .minota-cell
    padding 1rem

  .minota-notebook-note
    --note-border-radius: 1rem;

  .pending-delete .minota-notebook-note
    background-color var(--color-red)
    color var(--color-text-invert)
    transition all 0.1s ease-out
    --color-text-muted var(--color-text-muted-invert)

  .pending-organize .minota-notebook-note
    background-color var(--color-fill-invert)
    color var(--color-text-invert)
    transition all 0.1s ease-out

  .pending-get .minota-notebook-note
    background-color var(--color-fill-green)
    color var(--color-text-invert)
    transition all 0.1s ease-out

  .minota-action.create
    width 100%
    height 100%
    box-shadow none
    &:hover
      background-color transparent

    .minota-action-image
      width 100%
      height 100%
      margin 25%
      max-width 480px
      background url('~@/assets/images/signature-pushkin.png') no-repeat center
      background-size contain

// .notebook.top
//   background-color var(--color-fill-invert)
//   .minota-action
//     background-color transparent
//     box-shadow none
// .notebook.right
//   background-color var(--color-fill-blue)
//   .minota-action
//     background-color transparent
//     box-shadow none
// .notebook.bottom
//   background-color var(--color-fill-red)
//   .minota-action
//     background-color transparent
//     box-shadow none
// .notebook.left
//   background-color var(--color-fill-green)
//   .minota-action
//     background-color transparent
//     box-shadow none
</style>
