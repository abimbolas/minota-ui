<template lang="pug">
  .minota-note
    editor-component(
      v-if="mode === 'edit'"
      v-bind:value="content"
      v-on:input="updateContent($event)"
      v-bind:autofocus="autofocus"
      v-bind:cursor="editCursor"
      v-on:editor-esc="onEditorEsc($event)")
    viewer-component(
      v-else
      v-model="content"
      v-on:click="onViewerClick($event)")
</template>

<script>
import { NoteReference } from '@/store/reference'
import Note from '@/models/note'
import EditorComponent from '@/components/Editor'
import ViewerComponent from '@/components/Viewer'

export default {
  name: 'Note',

  components: {
    EditorComponent,
    ViewerComponent
  },

  props: {
    mode: {
      type: String,
      required: false,
      default: 'edit'
    },

    noteId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      autofocus: true,
      content: '(Write down your mind)',
      editCursor: { line: 0, ch: 0 }
    }
  },

  computed: {
    note () {
      return NoteReference[this.noteId]
    }
  },

  watch: {
    mode (val) {
      this.autofocus = (val === 'edit')
      // reset cursor position after finishing editing
      if (val === 'view') {
        this.editCursor = { line: 0, ch: 0 }
      }
    }
  },

  created () {
    this.content = this.note.content
  },

  methods: {
    updateContent (content) {
      this.content = content
      const note = new Note(this.note)
      note.content = content
      this.$emit('update', note)
    },
    onViewerClick ($event) {
      this.editCursor = $event.cursor
      this.$emit('viewer-click')
    },
    onEditorEsc () {
      this.$emit('editor-esc')
    }
  }
}
</script>
