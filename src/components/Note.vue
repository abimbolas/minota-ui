<template lang="pug">
  .minota-note(elevation="2" v-on:click="onNoteClick($event)")
    editor-component(
      v-model="note.editableContent"
      v-bind:focus-on="focusEventName")
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
      focusEventName: 'focus' + parseInt(Math.random() * 10000, 10)
    }
  },

  watch: {
    'note.editableContent' () {
      this.saveNoteAction({ note: this.note })
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
  z-index 1
  position relative
  box-sizing border-box
  padding 3rem
  cursor text
</style>
