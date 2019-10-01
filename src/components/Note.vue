<template lang="pug">
  .minota-note(elevation="2" v-on:click="onNoteClick($event)")
    editor-component(
      v-model="content"
      v-bind:focus-on="focusEventName"
      v-bind:cursor="cursor")
</template>

<script>
import { mapActions } from 'vuex'
import EditorComponent from '@/components/Editor'
import bus from '@/event-bus'

export default {
  name: 'Note',

  components: {
    EditorComponent
  },

  props: {
    note: {
      type: Object,
      required: false,
      default () {
        return null
      }
    }
  },

  data () {
    return {
      focusEventName: 'focus' + parseInt(Math.random() * 10000, 10),
      content: '',
      cursor: {
        line: 0,
        ch: 0
      }
    }
  },

  watch: {
    'content' (value) {
      this.note.editableContent = value
      this.saveNoteAction({ note: this.note })
    }
  },

  mounted () {
    this.content = this.note.editableContent
    // Set cursor to edit content (2nd line), not topic
    if (this.note.topic) {
      this.cursor = {
        line: 2,
        ch: 0
      }
    }
  },

  methods: {
    onNoteClick (event) {
      bus.$emit(this.focusEventName)
    },
    ...mapActions([
      'saveNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-note
  background-color white
  border-radius 3px
  max-width 52rem
  min-width: 320px
  z-index 1
  position relative
  box-sizing border-box
  padding 1rem
  cursor text
  @media (min-width screen-sm)
    padding 2rem
  @media (min-width screen-md)
    padding 3rem
</style>
