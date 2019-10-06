<template lang="pug">
  list-item-component.minota-note-list-item(v-on:primary-action="$emit('primary-action')")
    //- Leaf item
    template(v-if="note")
      div(
        slot="title"
        v-if="note.topic") {{ noteTopic }}
      div(
        slot="description"
        v-if="note.content"
        v-bind:class="contentClass") {{ note.content }}
    //- Group item
    template(v-if="group")
      div(slot="overline") {{ item.key }} ({{ item.children.length }})
</template>

<script>
import { mapGetters } from 'vuex'
import Group from '@/models/group'
import Note from '@/models/note'
import { topicDelimiter } from '@/store/ui'
import ListItemComponent from '@/components/ListItem'

export default {
  name: 'NoteListItem',

  components: {
    ListItemComponent
  },

  props: {
    item: {
      type: [Group, Note],
      required: true
    }
  },

  computed: {
    note () {
      return this.item.leaf
    },
    noteTopic () {
      if (this.note) {
        return this.note.path
          .slice(this.getContextArray.length)
          .join(topicDelimiter)
      } else {
        return ''
      }
    },
    group () {
      if (!this.item.leaf) {
        return this.item
      }
    },
    contentClass () {
      const hasTopic = Boolean(this.note.topic)
      const hasContent = Boolean(this.note.content)
      return {
        'two-lines': hasContent && hasTopic,
        'three-lines': hasContent && !hasTopic
      }
    },
    ...mapGetters([
      'getContextArray'
    ])
  }
}
</script>

<style lang="stylus">
.minota-note-list-item
  cursor pointer
</style>
