<template lang="pug">
  .minota-app
    .minota-actions
      a(v-on:click.prevent="onCreateNote" href) Создать заметку

      a(v-if="focus.length === 1" v-on:click.prevent="onRemoveNotes" href)
        span Убрать заметку

      a(v-if="focus.length > 1" v-on:click.prevent="onRemoveNotes" href)
        span Убрать заметки

      a(v-if="blur.length === 1" v-on:click.prevent="onGetNotes" href)
        span Достать заметку

      a(v-if="blur.length > 1" v-on:click.prevent="onGetNotes" href)
        span Достать заметки ({{ blur.length }})

    note-component(
      v-if="focus.length"
      v-for="note in focus"
      v-bind:key="note.id"
      v-bind:note="note"
      v-on:click="onFocusNote(note)")
</template>

<script>
import NoteComponent from '@/components/Note'
export default {
  name: 'App',

  components: {
    NoteComponent
  },

  data () {
    return {
      focus: [],
      blur: []
    }
  },

  created () {
    console.log('Minotá UI created')
  },

  beforeDestroy () {
    console.log('Minotá UI destroyed')
  },

  methods: {
    onCreateNote () {
      this.onRemoveNotes()
      this.focus.push({
        content: ``,
        id: parseInt(Math.random() * 1000000, 10)
      })
      console.log('Note created', this.note)
    },

    onRemoveNotes () {
      while (this.focus.length) {
        this.blur.push(this.focus.pop())
      }
      console.log('Note(s) removed')
    },

    onGetNotes () {
      this.onRemoveNotes()
      while (this.blur.length) {
        this.focus.push(this.blur.pop())
      }
      console.log('Note(s) got')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
html
body
  font-size 16px
  line-height 1.5rem
  font-family sans-family
  // margin 0
  padding 0

textarea
input
button
  display block
  font-family mono-family
  font-size inherit
  line-height inherit
  outline none
  width 100%
  max-width 45rem
  padding 0.5rem
  border solid gainsboro 1px
  box-sizing border-box
  min-height 300px

.minota-actions
  margin 1rem 0
  a
    margin 0 0.5rem

</style>
