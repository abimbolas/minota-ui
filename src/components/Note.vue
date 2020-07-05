<template lang="pug">
  .minota-note
    .minota-note__editor(
      contenteditable
      v-on:input="onInput($event)")
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
    'note.content' () {
      this.$emit('update', this.note)
      this.updateNoteAction({ note: this.note })
    }
  },

  created () {
    bus.$on(`focus-start-${this.note.id}`, this.onFocusStart.bind(this))
  },

  mounted () {
    this.$el.querySelector('[contenteditable]').innerText = this.note.content || ''
  },

  methods: {
    onInput (event) {
      this.note.content = event.target.innerText
    },

    onFocusStart () {
      this.$el.querySelector('[contenteditable]').focus()
      setTimeout(() => {
        this.$el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        })
      })
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
  padding 2rem
  max-width 42rem
  padding-bottom 3rem
  background-color white
  box-sizing border-box
  box-shadow 0px 1px 2px 0px alpha(black, 0.25), 0px 0px 10px 0px alpha(black, 0.1)

  @media (min-width screen-md)
    padding 4rem 3rem
    max-width 44rem

.minota-note__editor
  width 100%
  flex-grow 1
  outline none
</style>
