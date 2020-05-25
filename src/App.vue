<template lang="pug">
  .minota-app
    .minota-actions
      a(
        v-on:click.prevent="onCreate"
        href) Создать

      a(
        v-if="notespace.focus.length"
        v-on:click.prevent="onRemove"
        href) Убрать

      a(
        v-if="notespace.blur.length"
        v-on:click.prevent="onGet"
        href) Достать ({{ notespace.blur.length }})

    note-component(
      v-if="notespace.focus.length"
      v-for="note in notespace.focus"
      v-bind:key="note.id"
      v-bind:note="note"
      v-on:update="onUpdate"
      v-on:focus="onFocus"
      v-on:delete="onDelete")
</template>

<script>
import Notespace from '@/models/notespace'
import Note from '@/models/note'
import NoteComponent from '@/components/Note'
import Backend from '@/backend'

const backend = new Backend({
  baseURL: 'http://localhost:1234'
})

export default {
  name: 'App',

  components: {
    NoteComponent
  },

  data () {
    return {
      notespace: new Notespace(),
      behaviorType: {
        create: 'replace'
      }
    }
  },

  computed: {
    emptyFocus () {
      return this.notespace.focus.every(item => !item.content)
    }
  },

  created () {
    backend
      .getNotes()
      .then(notes => {
        if (notes.length) {
          this.notespace.blur = notes.reverse()
          // console.log('Notes loaded')
        }
      })

    console.log('Minotá UI created')
  },

  beforeDestroy () {
    console.log('Minotá UI destroyed')
  },

  methods: {
    onCreate () {
      if (this.behaviorType.create === 'replace') {
        this.notespace.blurFocus()
        this.notespace.addToFocus(new Note())
      } else if (this.behaviorType.create === 'add') {
        this.notespace.addToFocus(new Note(), { extendFocusCapacity: true })
      }
    },

    onRemove () {
      this.notespace.blurFocus()
    },

    onGet () {
      this.notespace.focusBlur()
      // this.notespace.focus.sort((a, b) => {
      //   if (a.id === b.id) {
      //     throw new Error('Duplicate items in Notespace')
      //   } else {
      //     return a.id < b.id ? 1 : -1
      //   }
      // })
    },

    onUpdate (note) {
      backend
        .postNote(note)
        // .then(note => {
        //   console.log(`Note ${note.id} updated`)
        // })
    },

    onFocus (note) {
      if (this.notespace.focus.length > 1) {
        this.notespace.focus.slice().forEach(focused => {
          if (focused.id !== note.id) {
            this.notespace.blurFocus(focused)
          }
        })
      }
    },

    onDelete (note) {
      this.notespace.removeFromFocus(note)
      this.notespace.removeFromBlur(note)
      backend
        .deleteNote(note)
        // .then(success => {
        //   console.log(`Note ${note.id} deleted`)
        // })
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
