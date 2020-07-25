<template lang="pug">
  .minota-note(v-on:click="onClick($event)")
    .minota-note__editor(
      contenteditable
      v-on:input="onInput($event)")
    .minota-note__config
      pre(style="font-size: 13px;") {{ note.config }}
</template>

<script>
import { mapActions } from 'vuex'
import bus from '@/event-bus'
import Note from '@/models/note'

export default {
  name: 'Note',

  props: {
    note: {
      type: Object,
      required: true,
      default () {
        return new Note()
      }
    }
  },

  watch: {
    'note' (note) {
      this.syncEditor()
    },

    'note.content' (content) {
      let innerText = this.$el.querySelector('[contenteditable]').innerText
      if (content !== innerText) {
        console.warn('note out of sync', content, innerText)
      }
    }
  },

  created () {
    bus.$on(`focus-note-${this.note.id}`, this.onFocusNote.bind(this))
  },

  mounted () {
    this.syncEditor()
  },

  methods: {
    onInput (event) {
      this.updateNoteAction({
        note: this.note,
        update: {
          content: event.target.innerText
        }
      })
    },

    onClick (event) {
      this.$emit('click', event)
    },

    onFocusNote () {
      this.$el.querySelector('[contenteditable]').focus()
      setTimeout(() => {
        this.$el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        })
      })
    },

    syncEditor () {
      this.$el.querySelector('[contenteditable]').innerText = this.note.content || ''
    },

    ...mapActions([
      'updateNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-note
  display flex
  flex-direction column
  position relative
  border-radius 0.25rem
  font-family sans-family
  font-size 18px
  width 100%
  min-height 100%
  padding 8vh 8% 10vh 8%
  max-width calc(42rem + 16%)
  background-color white
  box-sizing border-box
  box-shadow 0px 0px 0px 2px alpha(black, 0.05)

.minota-note__editor
  width 100%
  flex-grow 1
  outline none
  &:empty:before
    content '(Заметка девственно чиста)'
    opacity low-emphasis
</style>
