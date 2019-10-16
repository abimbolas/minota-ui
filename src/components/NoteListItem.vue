<template lang="pug">
  list-item-component.minota-note-list-item(
    v-on:primary-action="$emit('primary-action')"
    v-on:menu-action="$emit('menu-action')"
    v-bind:class="{ 'selected': selected }")
    //- Leaf item
    template(v-if="note")
      div(
        slot="title"
        v-if="noteTopic") {{ noteTopic }}
      div(
        slot="description"
        v-if="note.content"
        v-bind:class="contentClass") {{ note.content }}
      div(slot="secondary-action" v-if="isMenuMode")
        i.material-icons(v-if="selected") check_circle
        i.material-icons(v-else) radio_button_unchecked
    //- Group item
    template(v-if="group")
      div(slot="overline") {{ groupTopic }} ({{ group.children.length }})
      div(slot="secondary-action" v-if="isMenuMode")
        i.material-icons(v-if="selected") check_circle
        i.material-icons(v-else) radio_button_unchecked
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
    },
    mode: {
      type: String,
      required: false,
      default: ''
    },
    selected: {
      type: Boolean,
      required: false,
      default: false
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
        return this.item.fullGroup
      } else {
        return ''
      }
    },
    groupTopic () {
      if (this.group) {
        return this.group.path.join(topicDelimiter)
      } else {
        return ''
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
    isMenuMode () {
      return this.mode === 'menu'
    },
    ...mapGetters([
      'getContextArray'
    ])
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/variables"
@import "~@/assets/styles/material"

.minota-note-list-item
  cursor pointer
  &.selected
    background-color white
    @extend .elevation-2
</style>
