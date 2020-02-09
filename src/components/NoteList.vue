<template lang="pug">
  .minota-note-list
    //- Not sorted
    note-list-item-component(
      v-for="item in mixedItems"
      v-bind:key="item.id"
      v-bind:item="item"
      v-bind:mode="mode"
      v-bind:topic="topic"
      v-bind:selected="isSelected(item)"
      v-on:primary-action="onPrimaryAction(item)"
      v-on:menu-action="onMenuAction(item)")
    //- //- Leaf notes
    //- note-list-item-component(
    //-   v-for="item in leafItems"
    //-   v-bind:key="item.id"
    //-   v-bind:item="item"
    //-   v-bind:mode="mode"
    //-   v-bind:selected="isSelected(item)"
    //-   v-on:primary-action="primaryAction(item)"
    //-   v-on:menu-action="menuAction(item)")
    //-
    //- //- Group items
    //- note-list-item-component(
    //-   v-for="item in groupItems"
    //-   v-bind:key="item.id"
    //-   v-bind:item="item"
    //-   v-bind:mode="mode"
    //-   v-bind:selected="isSelected(item)"
    //-   v-on:primary-action="primaryAction(item)"
    //-   v-on:menu-action="menuAction(item)")
</template>

<script>
/* eslint-disable brace-style */
import Group from '@/models/group'
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
    },
    mode: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      required: false,
      default: ''
    },
    selection: {
      type: Array,
      required: false,
      default: () => []
    },
    orderBy: {
      type: String,
      required: false,
      default: 'date'
    },
    orderAsc: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    leafItems () {
      return this.list.children
        .filter(child => child.leaf)
        .sort((a, b) => {
          const sortPropA = a.leaf.config[this.orderBy]
          const sortPropB = b.leaf.config[this.orderBy]
          console.log('sort', a.leaf.config.pinned, b.leaf.config.pinned)
          if (a.leaf.config.pinned && !b.leaf.config.pinned) {
            return -1
          } else if (!a.leaf.config.pinned && b.leaf.config.pinned) {
            return 1
          } else {
            let result = sortPropA > sortPropB ? 1 : (sortPropA < sortPropB ? -1 : 0)
            return this.orderAsc ? (-1 * result) : result
          }
        })
    },

    groupItems () {
      return this.list.children
        .filter(child => !child.leaf)
        .sort((a, b) => {
          const sortPropA = a.calcItemProp(item => item.config[this.orderBy])
          const sortPropB = b.calcItemProp(item => item.config[this.orderBy])
          let result = sortPropA > sortPropB ? 1 : (sortPropA < sortPropB ? -1 : 0)
          return this.orderAsc ? (-1 * result) : result
        })
    },

    mixedItems () {
      return this.list.children
        .filter(child => child)
        .sort((a, b) => {
          let sortPropA
          let sortPropB
          let pinnedA
          let pinnedB
          if (a.leaf) {
            sortPropA = a.leaf.config[this.orderBy]
            pinnedA = a.leaf.config.pinned
          } else {
            sortPropA = a.calcItemProp(item => item.config[this.orderBy])
          }
          if (b.leaf) {
            sortPropB = b.leaf.config[this.orderBy]
            pinnedB = b.leaf.config.pinned
          } else {
            sortPropB = b.calcItemProp(item => item.config[this.orderBy])
          }
          if (pinnedA && !pinnedB) {
            return -1
          } else if (!pinnedA && pinnedB) {
            return 1
          } else {
            let result = sortPropA > sortPropB ? 1 : (sortPropA < sortPropB ? -1 : 0)
            return this.orderAsc ? (-1 * result) : result
          }
        })
    }
  },

  methods: {
    onPrimaryAction (item) {
      if (this.mode === 'menu') {
        this.toggleSelection(item)
      } else {
        if (item.leaf) {
          this.$emit('open-note', item.leaf)
        } else {
          this.$emit('open-context', item.fullGroup.path.join(topicDelimiter))
        }
      }
    },
    onMenuAction (item) {
      this.$emit('mode', 'menu')
      this.toggleSelection(item)
    },
    isSelected (item) {
      return this.selection.findIndex(s => s.id === item.id) > -1
    },
    toggleSelection (item) {
      const updatedSelection = this.selection.slice(0, this.selection.length)
      const id = updatedSelection.findIndex(selected => selected.id === item.id)
      if (id > -1) {
        updatedSelection.splice(id, 1)
      } else {
        updatedSelection.push(item)
      }
      this.$emit('selection', updatedSelection)
    }
  }
}
</script>
