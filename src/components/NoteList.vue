<template lang="pug">
  .minota-note-list
    //- Not sorted
    note-list-item-component(
      v-for="item in mixedItems"
      v-bind:key="item.id"
      v-bind:item="item"
      v-bind:mode="mode"
      v-bind:selected="isSelected(item)"
      v-on:primary-action="primaryAction(item)"
      v-on:menu-action="menuAction(item)")
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
    },
    mode: {
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
          let result = sortPropA > sortPropB ? 1 : (sortPropA < sortPropB ? -1 : 0)
          return this.orderAsc ? (-1 * result) : result
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
          if (a.leaf) {
            sortPropA = a.leaf.config[this.orderBy]
          } else {
            sortPropA = a.calcItemProp(item => item.config[this.orderBy])
          }
          if (b.leaf) {
            sortPropB = b.leaf.config[this.orderBy]
          } else {
            sortPropB = b.calcItemProp(item => item.config[this.orderBy])
          }
          let result = sortPropA > sortPropB ? 1 : (sortPropA < sortPropB ? -1 : 0)
          return this.orderAsc ? (-1 * result) : result
        })
    }
  },

  methods: {
    primaryAction (item) {
      // On non-menu just open notes
      if (this.mode !== 'menu') {
        // 1. If this is leaf note, open it
        if (item.leaf) {
          this.openNoteAction({ note: item.leaf })
        }
        // 2. Else it is group, enter it's context
        else {
          this.openContextAction({ context: item.fullGroup.path.join(topicDelimiter) })
        }
      }
      // On menu mode, select items
      else {
        this.selectionChange(item)
        setTimeout(() => {
          if (!this.selection.length) {
            this.modeChange('')
          }
        })
      }
    },
    menuAction (item) {
      this.modeChange('menu')
      setTimeout(() => {
        this.selectionChange(item)
      })
    },
    isSelected (item) {
      return this.selection.findIndex(s => s.id === item.id) > -1
    },
    modeChange (mode) {
      this.$emit('mode-change', mode || '')
    },
    selectionChange (item) {
      let s = this.selection.slice(0, this.selection.length)
      const id = s.findIndex(s => s.id === item.id)
      if (id > -1) {
        s.splice(id, 1)
      } else {
        s.push(item)
      }
      this.$emit('selection-change', s)
    },
    ...mapActions([
      'openNoteAction',
      'openContextAction'
    ])
  }
}
</script>
