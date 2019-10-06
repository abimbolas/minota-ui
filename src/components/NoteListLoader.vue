<template lang="pug">
  .minota-note-list-loader
    note-list-component(v-bind:list="list")
</template>

<script>
import { mapActions } from 'vuex'
import { NoteGroup } from '@/store/plugins/list-plugin'
import NoteListComponent from '@/components/NoteList'

export default {
  name: 'NoteListLoader',

  components: {
    NoteListComponent
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
      list: NoteGroup
    }
  },

  watch: {
    'topic' (topic) {
      this.loadPoolAction({ topic })
    }
  },

  created () {
    this.loadPoolAction({ topic: this.topic })
  },

  methods: {
    ...mapActions([
      'loadPoolAction'
    ])
  }
}
</script>
