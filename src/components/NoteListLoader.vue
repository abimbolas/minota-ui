<template lang="pug">
  .minota-note-list-loader
    note-list-component(v-bind:notes="notes" order-by="'date'" order-direction="'desc'")
</template>

<script>
import { mapActions } from 'vuex'
import NoteListComponent from '@/components/NoteList'

export default {
  name: 'NoteListLoader',

  components: {
    NoteListComponent
  },

  data () {
    return {
      notes: []
    }
  },

  created () {
    this.getNotesAction().then(notes => {
      this.notes = notes
    })
  },

  methods: {
    ...mapActions([
      'getNotesAction'
    ])
  }
}
</script>
