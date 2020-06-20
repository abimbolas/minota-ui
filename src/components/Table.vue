<template lang="pug">
  .minota-view
    .minota-actions.minota-actions_sticky

      //- LEFT: Regular mode
      .minota-section-left(v-if="mode !== 'edit'")
        a.minota-actions__action(
          v-on:click.prevent="onCreate()" href)
          strong Создать

        a.minota-actions__action(
          v-if="table.length === 1"
          v-on:click.prevent="onDelete()" href)
          strong Удалить

        a.minota-actions__action(
          v-if="table.length > 1"
          v-on:click.prevent="onEdit()" href)
          strong Редактировать

      //- LEFT: Edit mode
      .minota-section-left(v-if="mode === 'edit'")
        a.minota-actions__action(
          v-if="table.length"
          v-on:click.prevent="onDoneEdit()" href)
          small Отменить редактирование

      //- RIGHT: Regular mode
      .minota-section-right(v-if="mode !== 'edit'")
        a.minota-actions__action(
          v-if="table.length"
          v-on:click.prevent="onDone()" href)
          small Убрать ({{ table.length }})

        a.minota-actions__action(
          v-if="otherLength()"
          v-on:click.prevent="onGet()" href)
          small Достать ({{ otherLength() }})

      //- RIGHT: Edit mode
      .minota-section-right(v-if="mode === 'edit' && selected.focus.length")
        a.minota-actions__action(
          v-on:click.prevent="onOpenSelected()" href)
          strong Открыть <span v-show="selected.focus.length">({{ selected.focus.length }})</span>

        a.minota-actions__action(
          v-on:click.prevent="onDeleteSelected()" href)
          strong Удалить <span v-show="selected.focus.length">({{ selected.focus.length }})</span>

    div(v-if="mode !== 'edit'")
      note-component(
        v-for="note in table"
        v-bind:key="note.id"
        v-bind:note="note")

    div(v-if="mode === 'edit'")
      note-list-item-component(
        v-for="note in table"
        v-bind:key="note.id"
        v-bind:note="note"
        v-bind:mode="mode"
        v-bind:selected="isSelected(note)"
        v-on:select="onSelect(note)"
        v-on:unselect="onUnselect(note)")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import bus from '@/event-bus'
import Note from '@/models/note'
import NoteComponent from '@/components/Note'
import NoteListItemComponent from '@/components/NoteListItem'
import Notespace from '@/models/notespace'

export default {
  name: 'Table',

  components: {
    NoteComponent,
    NoteListItemComponent
  },

  data () {
    return {
      mode: '',
      selected: new Notespace()
    }
  },

  computed: {
    other () {
      return this.drawer.filter(note => {
        console.log('is on table', note.id, this.isOnTable(note))
        return !this.isOnTable(note)
      })
    },

    ...mapGetters([
      'table',
      'drawer',
      'isOnTable',
      'backend'
    ])
  },

  mounted () {
    this.syncDrawerAction()
  },

  methods: {

    //  Create / Delete

    onCreate () {
      this.addToTable({
        note: new Note(),
        focusCapacity: Number.POSITIVE_INFINITY
      })
    },

    onDelete () {
      let notes = this.table.slice(0)
      this.backend.deleteNotes(notes)
      this.removeFromDrawer({ notes })
      this.removeFromTable({ notes })
    },

    // Get / Done

    onGet () {
      this.replaceOnTable({ notes: this.drawer })
    },

    onDone () {
      this.clearTable()
      this.syncDrawerAction()
    },

    // Mode

    onEdit () {
      this.mode = 'edit'
    },
    onDoneEdit () {
      this.mode = ''
      this.clearSelection()
    },

    // Select

    isSelected (note) {
      this.selected.isInFocus(note)
    },

    onSelect (note) {
      this.selected.addToFocus(note, {
        focusCapacity: Number.POSITIVE_INFINITY
      })
    },

    onUnselect (note) {
      this.selected.removeFromFocus(note)
    },

    clearSelection () {
      this.selected.clearFocus()
    },

    // Selection actions

    onDeleteSelected () {
      let notes = this.selected.focus.slice(0)
      this.backend.deleteNotes(notes)
      this.removeFromDrawer({ notes })
      this.removeFromTable({ notes })
      this.onDoneEdit()
    },

    onOpenSelected () {
      let notes = this.selected.focus.slice(0)
      this.replaceOnTable({ notes })
      this.onDoneEdit()
    },

    otherLength () {
      return this.drawer.filter(note => !this.isOnTable(note)).length
    },

    ...mapMutations([
      'addToTable',
      'replaceOnTable',
      'removeFromTable',
      'clearTable',
      'addToDrawer',
      'removeFromDrawer'
    ]),

    ...mapActions([
      'syncDrawerAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/common'
</style>
