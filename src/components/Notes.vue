<template lang="pug">
  .minota-view
    .minota-row
      .minota-cell(
        v-for="note in notes"
        :ref="note.id"
        v-observe-view
        @enter-view="onFocusNote(note)")
        note-component(:note-id="note.id")
      .minota-cell
        .minota-action(outline @click="onCreateNote") Create Note
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Note } from '@/domain/user/note'
import NoteComponent from '@/components/Note'
import { observeView } from '@/directives'

export default {
  name: 'Notes',
  directives: {
    observeView,
  },
  components: {
    NoteComponent
  },
  data () {
    return {
      task: {
        focusNote: true
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
    // Focus note once at init, when note is in DOM
    if (this.task.focusNote && this.$refs[this.focusedNote.id]) {
      this.focusNote(this.focusedNote)
      delete this.task.focusNote
    }
  },
  methods: {
    onCreateNote () {
      const note = new Note()
      this.$store.commit('notes/add', note)
      this.$store.commit('note/replace', this.byNoteId(note.id))
    },
    onFocusNote (note) {
      this.$store.commit('note/replace', this.byNoteId(note.id))
    },
    focusNote (note) {
      if (this.$refs[note.id]) {
        this.$refs[note.id][0].scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/action'

.minota-view
  height 100%
  width 100%

.minota-row
  display grid
  grid-auto-columns 100%
  grid-auto-flow column
  height 100%
  overflow auto
  scroll-snap-type inline mandatory

.minota-cell
  padding 0.5rem
  overflow auto
  scroll-snap-align center
</style>
