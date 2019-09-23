<template lang="pug">
  list-item-component.minota-note-list-item(v-on:primary-action="$emit('primary-action')")
    div(slot="overline" v-if="config.topic") {{ config.topic}}
    div(slot="title" v-if="title") {{ title }}
    div(slot="description" v-bind:class="descriptionClass")
      | {{ description }}
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
    config () {
      return this.note.config
    },
    content () {
      return this.note.content
    },
    title () {
      const match = this.note.content.match(/^#.*($|\n)/g)
      return match ? match[0].replace(/^#+/, '').trim() : ''
    },
    description () {
      const lines = this.note.content.split('\n')
      if (lines[0].match(/^#.+$/)) {
        return lines.slice(1).join('\n')
      } else {
        return lines.join('\n')
      }
    },
    descriptionClass () {
      const topic = this.note.config.topic
      const title = this.title
      return {
        'one-line': topic && title,
        'two-lines': (topic && !title) || (!topic && title),
        'three-lines': !topic && !title
      }
    }
  }
}
</script>

<style lang="stylus">
.minota-note-list-item
  cursor pointer
</style>
