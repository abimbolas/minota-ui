<template lang="pug">
  .minota-notespace
    note-component(v-bind:note="note")
    component(
      v-for="note in note.notes"
      v-bind:key="note.id"
      v-bind:note="note"
      v-bind:is="switchComponent(note)")
</template>

<script>
import Note from '@/models/note'
import Notespace from '@/models/notespace'
import NoteComponent from '@/components/Note'

export default {
  name: 'Notespace',

  components: {
    NoteComponent
  },

  props: {
    note: {
      type: Object,
      required: true,
      default () {
        return new Notespace()
      }
    }
  },

  methods: {
    switchComponent (note) {
      if (note instanceof Note) {
        return NoteComponent
      }
      if (note instanceof Notespace) {
        return 'Notespace'
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-notespace
  .minota-note + .minota-note
    margin-top 0.5rem
</style>
