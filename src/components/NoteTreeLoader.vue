<template lang="pug">
  .minota-note-tree-loader
    note-tree-component(v-bind:tree="tree")
</template>

<script>
import { mapActions } from 'vuex'
import NoteTreeComponent from '@/components/NoteTree'

export default {
  name: 'NoteTreeLoader',

  components: {
    NoteTreeComponent
  },

  props: {
    topic: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      tree: {
        children: []
      }
    }
  },

  watch: {
    topic (topic) {
      this.fetchTree(topic)
    }
  },

  created () {
    this.fetchTree(this.topic)
  },

  methods: {
    fetchTree (topic) {
      this.getNotesAction().then(notes => {
        if (!topic) {
          return notes
        } else {
          return notes.filter(note => {
            return note.topic.toLowerCase().indexOf(topic.toLowerCase()) === 0
          })
        }
      }).then(notes => {
        this.tree.children = notes
      })
    },
    ...mapActions([
      'getNotesAction'
    ])
  }
}
</script>
