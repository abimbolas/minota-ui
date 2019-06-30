<template lang="pug">
  list-item-component(v-on:primary-action="$emit('primary-action')")
    div(slot="overline") {{ config.topic}}
    div(slot="title") {{ title }}
    div(slot="description" v-bind:class="descriptionClass")
      | {{ description }}
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import bus from '@/event-bus'
import { NoteReference } from '@/store/reference'
import ListItemComponent from '@/components/layout/ListItem'

export default {
  name: 'ArchiveNote',

  components: {
    ListItemComponent
  },

  props: {
    note: {
      type: [String, Object],
      required: true
    }
  },

  computed: {
    computedNote () {
      return typeof this.note === 'string' ? NoteReference[this.note] : this.note
    },
    config () {
      return this.computedNote.config
    },
    content () {
      return this.computedNote.content
    },
    title () {
      const match = this.computedNote.content.match(/^#.*($|\n)/g)
      return match ? match[0].replace(/^#+/, '').trim() : ''
    },
    description () {
      const lines = this.computedNote.content.split('\n')
      if (lines[0].match(/^#.+$/)) {
        return lines.slice(1).join('\n')
      } else {
        return lines.join('\n')
      }
    },
    descriptionClass () {
      const topic = this.computedNote.config.topic
      const title = this.title
      return {
        'one-line': topic && title,
        'two-lines': (topic && !title) || (!topic && title),
        'three-lines': !topic && !title
      }
    }
  },

  methods: {
    openNote () {
      bus.$emit('scroll-top')
      bus.$emit('scroll-start')
      this.setView({ view: 'table' })
      this.focusNoteAction({ note: this.computedNote })
    },
    ...mapMutations([
      'setView'
    ]),
    ...mapActions([
      'focusNoteAction'
    ])
  }
}
</script>
