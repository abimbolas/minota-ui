<template lang="pug">
  .minota-notepad
    //- Editable list of notes?
    //- Notes with menu?
    //- Edit something in notes list?
    //- Editor
    //- But anyway somehow a list
    //- Or note as front-note with back-notes
    //- Or front/back notes это форма бытия всей пачки?
    //- <item/><item/>
    //- <front-note>
    //- <back-notes>
    //- note as front and note as back.
    //- <note id="xxx" front="true" /> vs <note id="xxx" />
    //- Что с различным представлением? Разные способы смотреть на
    //- пачку заметок?
</template>

<script>
import { mapState } from 'vuex'

// Storage: pad, current, ui details
// UI: reorder, change view
// Actions: create, delete, edit, get(focus).

// Each note gets id
// File Storage gets another method of getting notes
// How they are stored on disk? Does this matter currently?
// Multiple views (forms) of pad, what are they? Should we save them?

// Current note - is changing form of pad. If we save it, why not save UI details.

// NotePad module knows how to save and load notepad (and it's ui),
// it is all in store

export default {
  name: 'Notepad',
  computed: {
    ...mapState('notepad', ['pad'])
  },
  // watch: {
  //   note: {
  //     handler (note) {
  //       if (this.$refs.editor.innerText !== note.content) {
  //         this.$refs.editor.innerText = note.content || ''
  //       }
  //     },
  //     deep: true
  //   }
  // },
  mounted () {
    console.log('pad', this.pad)
  }
}
</script>

<style scoped lang="stylus">
@import '~@/assets/styles/variables'

.minota-note
  background-color white
  box-sizing border-box

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
