<template lang="pug">
  .minota-note-tree-item
    note-list-component(v-bind:notes="tree.children")
</template>

<script>
import NoteListComponent from '@/components/NoteList'

export default {
  name: 'NoteTree',

  components: {
    NoteListComponent
  },

  props: {
    tree: {
      type: Object,
      required: true
    }
  }
}
</script>
