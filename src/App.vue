<template lang="pug">
  .minota-app
    .minota-actions
      .minota-actions__section-left(v-if="!editMode")
        a(
          v-show="!selected.focus.length"
          v-on:click.prevent="onCreate()"
          href) Создать

        a(
          v-show="!selected.focus.length"
          v-bind:disabled="!notespace.focus.length"
          v-on:click.prevent="onRemove()"
          href) Убрать<span v-if="notespace.focus.length > 0"> ({{ notespace.focus.length }})</span>

        a(
          v-show="!selected.focus.length"
          v-bind:disabled="!notespace.blur.length"
          v-on:click.prevent="onGet()"
          href) Достать<span v-if="notespace.blur.length"> ({{ notespace.blur.length }})</span>

      .minota-actions__section-left(v-if="editMode")
        a(
          v-bind:disabled="!selected.focus.length"
          v-on:click.prevent="onDeleteSelected()"
          href) Удалить<span v-if="selected.focus.length > 0"> ({{selected.focus.length}})</span>

        a(
          v-show="selected.focus.length"
          v-on:click.prevent="selected.clearFocus()"
          href) Сбросить выделение

      .minota-actions__section-right(v-if="notespace.focus.length")
        a(
          v-if="!editMode"
          v-bind:disabled="!notespace.focus.length"
          v-on:click.prevent="editMode = true"
          href) &#9998;
        a(
          v-if="editMode"
          v-on:click.prevent="editMode = false"
          href) Отмена

    note-component(
      v-if="notespace.focus.length"
      v-for="note in notespace.focus"
      v-bind:key="note.id"
      v-bind:note="note"
      v-bind:mode="editMode ? 'edit' : ''"
      v-bind:selected="selected.isInFocus(note)"
      v-on:focus="onFocus(note)"
      v-on:select="onSelect(note)"
      v-on:update="onUpdate(note)")

    .minota-status
      strong.minota-status__item(v-if="editMode") edit mode
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
      },
      editMode: false,
      selected: new Notespace()
    }
  },

  watch: {
    'editMode' (editMode) {
      // set mode to whole app
      this.$el.ownerDocument.body.classList[editMode ? 'add' : 'remove']('minota-mode__edit')
      // clear selected
      this.selected.clearFocus()
    }
  },

  created () {
    backend
      .getNotes()
      .then(notes => {
        if (notes.length) {
          this.notespace.blur = notes.reverse()
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
        this.editMode = false
      } else if (this.behaviorType.create === 'add') {
        this.notespace.addToFocus(new Note(), { extendFocusCapacity: true })
      }
    },

    onRemove (note) {
      this.notespace.blurFocus(note)
      this.editMode = false
    },

    onGet () {
      this.notespace.blurFocus()
      this.notespace.focusBlur()
    },

    onUpdate (note) {
      backend.postNote(note)
    },

    onFocus (note) {
      if (this.notespace.focus.length > 1) {
        this.notespace.focus.slice().forEach(focused => {
          if (focused.id !== note.id) {
            this.notespace.blurFocus(focused)
          }
        })
      }
      this.editMode = false
    },

    onDelete (note) {
      this.notespace.removeFromFocus(note)
      this.notespace.removeFromBlur(note)
      backend.deleteNote(note)
      this.editMode = false
    },

    onSelect (note) {
      if (this.selected.isInFocus(note)) {
        this.selected.removeFromFocus(note)
      } else {
        this.selected.addToFocus(note, { extendFocusCapacity: true })
      }
    },

    onFocusSelected () {
      this.notespace.blurFocus()
      this.selected.focus.forEach(item => this.notespace.addToFocus(item, { extendFocusCapacity: true }))
      this.editMode = false
    },

    onDeleteSelected () {
      this.selected.focus.forEach(item => {
        this.notespace.removeFromFocus(item)
        this.notespace.removeFromBlur(item)
      })
      backend.deleteNotes(this.selected.focus)
      this.editMode = false
    },

    capitalize (prop) {
      return prop[0].toUpperCase() + prop.slice(1)
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
input
button
  display block
  font-family mono-family
  font-size inherit
  line-height inherit
  outline none
  box-sizing border-box
  cursor pointer

.minota-actions
  margin 1rem 0
  display flex
  a
    margin 0 0.5rem
    &[disabled]
      pointer-events none
      opacity low-emphasis
  .minota-actions__section-right
    margin-left auto
    margin-right 0

.minota-status__item
  margin 0 0.5rem
  font-size smaller

</style>
