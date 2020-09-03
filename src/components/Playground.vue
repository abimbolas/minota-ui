<template lang="pug">
  .minota-playground
    div Hey
    note-point-component Hello point of note
    note-line-component Hello line of notes
    note-plane-component Hello plane of notes
    note-space-component Hello space of notes
</template>

<script>
import NotePointComponent from '@/components/NotePoint'
import NoteLineComponent from '@/components/NoteLine'
import NotePlaneComponent from '@/components/NotePlane'
import NoteSpaceComponent from '@/components/NoteSpace'

export default {
  name: 'Playground',

  components: {
    NotePointComponent,
    NoteLineComponent,
    NotePlaneComponent,
    NoteSpaceComponent
  }
}
</script>

<style lang="stylus">
.minota-playground
  padding 1rem
</style>
