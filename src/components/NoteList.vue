<template lang="pug">
  .minota-note-list
    note-list-item-component(
      v-for="note in byDateDsc"
      v-bind:key="note.config.id"
      v-bind:note="note"
      v-on:primary-action="openNote(note.config.id)")
</template>

<script>
import NoteListItemComponent from '@/components/NoteListItem'

export default {
  name: 'NoteList',

  components: {
    NoteListItemComponent
  },

  props: {
    notes: {
      type: Array,
      required: true
    },
    orderBy: {
      type: String,
      required: false,
      default: 'date'
    },
    orderDirection: {
      type: String,
      required: false,
      default: 'dsc'
    }
  },

  computed: {
    byDateDsc () {
      return this.notes.slice(0).sort((a, b) => (b.config.date - a.config.date))
    }
  },

  methods: {
    openNote (id) {
      this.$router.push(`/note/${id}`)
    }
  }
}
</script>
