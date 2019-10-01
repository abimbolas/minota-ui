<template lang="pug">
  list-item-component.minota-note-list-item(v-on:primary-action="$emit('primary-action')")
    div(slot="title"
      v-if="note.topic") {{ note.topic }}
    div(slot="description"
      v-if="note.content"
      v-bind:class="contentClass") {{ note.content }}
</template>

<script>
import ListItemComponent from '@/components/ListItem'

export default {
  name: 'NoteListItem',

  components: {
    ListItemComponent
  },

  props: {
    note: {
      type: Object,
      required: true
    }
  },

  computed: {
    contentClass () {
      const hasTopic = Boolean(this.note.topic)
      const hasContent = Boolean(this.note.content)
      return {
        'two-lines': hasContent && hasTopic,
        'three-lines': hasContent && !hasTopic
      }
    }
  }
}
</script>

<style lang="stylus">
.minota-note-list-item
  cursor pointer
</style>
