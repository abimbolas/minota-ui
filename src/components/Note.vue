<template lang="pug">
  .minota-note(elevation="2" v-on:click="onNoteClick($event)")
    //- .minota-note-actions
      .button.icon-button
        i.material-icons more_vert
    editor-component(
      v-model="content"
      v-bind:focus-on="focusEventName"
      v-bind:cursor="cursor")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { topicDelimiter } from '@/store/ui'
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

  computed: {
    ...mapGetters([
      'getContext'
    ])
  },

  watch: {
    'note' (note) {
      this.setContentFromNote()
      this.resetCursor()
      bus.$emit(this.focusEventName)
    },
    'content' (value) {
      this.setContentToNote(value)
    }
  },

  mounted () {
    this.setContentFromNote()
    this.resetCursor()
  },

  methods: {
    getContentFromNote () {
      if (this.getContext) {
        const clone = this.note.clone()
        clone.topic = clone.topic.replace(
          new RegExp(`^${this.getContext}(${topicDelimiter})?`),
          ''
        )
        return clone.editableContent
      } else {
        return this.note.editableContent
      }
    },
    setContentToNote (value) {
      if (this.getContext) {
        const clone = this.note.clone()
        clone.editableContent = value
        clone.topic = `${this.getContext}${clone.topic ? topicDelimiter + clone.topic : ''}`
        this.note.editableContent = clone.editableContent
      } else {
        this.note.editableContent = value
      }
      this.saveNoteAction({ note: this.note })
    },
    setContentFromNote () {
      this.content = this.getContentFromNote()
    },
    resetCursor () {
      // Set cursor to edit content (2nd line), not topic
      if (this.note.topic) {
        this.cursor = {
          line: 2,
          ch: 0
        }
      } else {
        this.cursor = {
          line: 0,
          ch: 0
        }
      }
    },
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
