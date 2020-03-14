<template lang="pug">
  .minota-note(
    elevation="2"
    v-long-click="375"
    v-on:normal-click="onNormalClick($event)"
    v-on:long-click="$emit('mode', 'menu')")
    //- Actions
    .minota-note-actions
      button.button.icon-button(
        title="Unpin"
        v-if="note.config.pinned"
        v-on:click="unpinNote()")
        i.material-icons star
      button.button.icon-button(
        title="Menu"
        v-on:click="openMenu()")
        i.material-icons more_vert

    //- Editor
    editor-component.minota-note-editor(
      v-model="content"
      v-bind:focus-on="focusEventName"
      v-bind:cursor="cursor")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { topicDelimiter } from '@/store/ui'
import EditorComponent from '@/components/Editor'
import longClick from '@/directives/long-click'
import bus from '@/event-bus'

export default {
  name: 'Note',

  components: {
    EditorComponent
  },

  directives: {
    longClick
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

  created () {
    // React to context change
    const mutations = {
      setContext (payload) {
        console.log('setContext', payload)
      }
    }
    this.unsubscribeMutations = this.$store.subscribe(mutation => {
      if (mutations[mutation.type]) {
        mutations[mutation.type](mutation.payload)
      }
    })
  },

  beforeDestroy () {
    this.unsubscribeMutations()
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
      clearTimeout(this.updateNoteActionTimeout)
      this.updateNoteActionTimeout = setTimeout(() => {
        const update = this.note.clone()
        update.editableContent = value
        if (this.getContext) {
          update.topic = `${this.getContext}${update.topic ? topicDelimiter + update.topic : ''}`
        }
        this.updateNoteAction({ note: update })
      }, 1000)
    },

    setContentFromNote () {
      this.content = this.getContentFromNote()
    },

    openMenu () {
      this.$emit('open-menu', this.note)
    },

    unpinNote () {
      const update = this.note.clone()
      update.config.pinned = false
      this.updateNoteAction({ note: update })
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

    onNormalClick ($event) {
      bus.$emit(this.focusEventName)
    },

    ...mapActions([
      'updateNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/material'

.minota-note
  background-color white
  border-radius 0.5rem
  max-width 46rem
  box-sizing content-box
  min-width: 320px
  z-index 1
  position relative
  box-sizing border-box
  padding 1rem 1rem 1.5rem 1.5rem
  cursor text
  @media (min-width screen-sm)
    max-width 48rem
    padding 2.5rem 3rem
  @media (min-width screen-md)
    max-width 52rem
    padding 3rem 4rem
  @media (min-width screen-lg)
    max-width 56rem
    padding 4rem 5rem

  .minota-note-editor
    position relative
    z-index 1

  .minota-note-actions
    display none
    text-align right
    justify-content flex-end
    align-items center
    z-index 2
    @media (min-width screen-sm)
      display flex
      margin-top calc(-2.5rem + 12px)
      margin-right calc(-3rem + 12px)
    @media (min-width screen-md)
      // display flex
      margin-top calc(-3rem + 12px)
      margin-right calc(-4rem + 12px)
    @media (min-width screen-lg)
      // display flex
      margin-top calc(-4rem + 12px)
      margin-right calc(-5rem + 12px)
</style>
