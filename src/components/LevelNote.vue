<template lang="pug">
  .minota-level-note
    note-component(
      v-if="content !== null"
      @update="onUpdate($event)"
      :content="content")
</template>

<script>
import { mapActions } from 'vuex'
import { Note } from '@/domain/user/note'
import NoteComponent from '@/components/Note'

export default {
  name: 'LevelNote',
  components: {
    NoteComponent
  },
  data () {
    return {
      content: null
    }
  },
  created () {
    this.getNoteAction({ id: 'single-note' }).then(note => {
      this.content = note.content
    })
  },
  methods: {
    onUpdate (content) {
      // save note to inner note storage
      // since we already have it, just have special
      // predefined id.
      clearTimeout(this.onUpdateTimeout)
      this.onUpdateTimeout = setTimeout(() => {
        this.updateNoteAction({
          id: 'single-note',
          content
        }).catch(error => {
          console.warn('LevelNote: onUpdate:', error)
        })
      }, 300)
    },
    ...mapActions([
      'getNoteAction',
      'updateNoteAction'
    ])
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/variables'

.minota-level-note
  width 100vw
  height 100vh
  overflow auto

  .minota-note
    padding 1rem 1rem
    --editor-font-size 16px
    --editor-min-height calc(100vh - 2rem)
    @media (min-width screen-sm)
      padding 2rem
      --editor-font-size 17px
      --editor-min-height calc(100vh - 4rem)
    @media (min-width screen-md)
      padding 3rem 1rem
      --editor-font-size 18px
      --editor-min-height calc(100vh - 6rem)
    @media (min-width screen-lg)
      padding 4rem 1rem
      --editor-font-size 20px
      --editor-min-height calc(100vh - 8rem)
</style>
