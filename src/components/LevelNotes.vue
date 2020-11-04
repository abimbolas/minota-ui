<template lang="pug">
  .minota-level-notes
    note-component(
      @update="onUpdate($event)"
      :note="current")
    .minota-actions
      .minota-action(
        v-if="other.length"
        @click="onGetPrevious()") Get previous
      .minota-action(
        v-if="current"
        style="margin-left: auto"
        @click="onCreateNew()") Create note
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import { Note } from '@/domain/user/note'
import NoteComponent from '@/components/Note'

export default {
  name: 'LevelNote',
  components: {
    NoteComponent
  },
  data () {
    return {
      current: null,
      other: []
    }
  },
  computed: {
    ...mapGetters(['getNote'])
  },
  created () {
    // this.getNoteAction({ id: 'single-note' }).then(note => {
    //   this.current = note
    // })
    this.getNotesAction().then(notes => {
      notes.forEach(note => {
        this.other.push(note)
      })
    })
    // console.log(this.other)
  },
  methods: {
    onUpdate (content) {
      // save note to inner note storage
      // since we already have it, just have special
      // predefined id.
      clearTimeout(this.onUpdateTimeout)
      this.onUpdateTimeout = setTimeout(() => {
        this.updateNoteAction({
          id: this.current.id,
          content
        }).catch(error => {
          console.warn('LevelNote: onUpdate:', error)
        })
      }, 300)
    },

    onCreateNew () {
      this.other.push(this.getNote(this.current.id))
      this.createNoteAction().then(note => {
        this.current = note
      })
      // save current state of app (current/other)
    },

    onGetPrevious () {
      if (this.other.length) {
        let current = this.current
        let previous = this.other.pop()
        this.current = this.getNote(previous.id)
        if (current) {
          this.other.push(this.getNote(current.id))
        }
        console.log(this.current.id)
      } else {
        console.warn('no notes')
      }
      // save current state of app (current/other)
    },

    ...mapActions([
      'getNoteAction',
      'getNotesAction',
      'updateNoteAction',
      'createNoteAction'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/variables'

.minota-level-notes
  width 100vw
  height 100vh
  overflow auto

  .minota-note
    padding 1rem 1rem
    --editor-font-size 16px
    --editor-min-height calc(100vh - 2rem)
    @media (min-width screen-sm)
      padding 2rem
      --editor-font-size 18px
      --editor-min-height calc(100vh - 4rem)
    @media (min-width screen-md)
      padding 3rem 1rem
      --editor-font-size 18px
      --editor-min-height calc(100vh - 6rem)
    @media (min-width screen-lg)
      padding 4rem 1rem
      --editor-font-size 20px
      --editor-min-height calc(100vh - 8rem)

  .minota-actions
    position absolute
    right 0rem
    padding 0 1rem
    bottom 1rem
    display flex
    width 100%
    box-sizing border-box
    justify-content space-between

  .minota-action
    cursor pointer
    padding 5px 10px
    border solid rgba(0, 0, 0, 0.1) 1px
    user-select none
    &:active
      background-color alpha(black, high-emphasis)
      color white
</style>
