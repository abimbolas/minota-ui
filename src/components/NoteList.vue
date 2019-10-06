<template lang="pug">
  .minota-note-list
    //- //- Not sorted
    //- note-list-item-component(
    //-   v-for="item in list.children"
    //-   v-bind:key="item.id"
    //-   v-bind:item="item"
    //-   v-on:primary-action="primaryAction(item)")
    //- Leaf notes
    note-list-item-component(
      v-for="item in leafItems"
      v-bind:key="item.id"
      v-bind:item="item"
      v-on:primary-action="primaryAction(item)")

    //- Group items
    note-list-item-component(
      v-for="item in groupItems"
      v-bind:key="item.id"
      v-bind:item="item"
      v-on:primary-action="primaryAction(item)")
</template>

<script>
/* eslint-disable brace-style */
import { mapActions } from 'vuex'
import Group from '@/models/group'
// import Note from '@/models/note'
import { topicDelimiter } from '@/store/ui'
import NoteListItemComponent from '@/components/NoteListItem'

export default {
  name: 'NoteList',

  components: {
    NoteListItemComponent
  },

  props: {
    list: {
      type: Group,
      required: true
    }
  },

  computed: {
    leafItems () {
      return this.list.children.filter(child => child.leaf)
    },

    groupItems () {
      return this.list.children.filter(child => !child.leaf)
    }
  },

  methods: {
    primaryAction (item) {
      // 1. If this is leaf note, open it
      if (item.leaf) {
        this.openNoteAction({ note: item.leaf })
      }
      // 2. Else it is group, enter it's context
      else {
        this.openContextAction({ context: item.fullGroup.path.join(topicDelimiter) })
      }
    },
    ...mapActions([
      'openNoteAction',
      'openContextAction'
    ])
  }
}
</script>
