<template lang="pug">
  table-grid-component.minota-table
    //- template(v-slot:actions-top) Top
    template(v-slot:actions-bottom)
      //- .minota-section-left
        .minota-status {{ intent }}
      //- .minota-section-center
        .minota-dots
          .minota-dots__dot(
            v-for="note in table.slice(0).reverse()"
            v-bind:active="note.id === visible")
      .minota-section-right
        a.minota-action(
          v-bind:disabled="!visible"
          v-on:click.prevent="onRemoveVisible()" href) Убрать
    //- template(v-slot:actions-left)
      strong L
    //- template(v-slot:actions-right)
      strong R
    template(v-slot:content)
      table-grid-content-item-component(
        v-for="note in table"
        v-bind:key="note.id"
        v-on:enter-view="onEnterView(note)"
        v-on:exit-view="onExitView(note)")
        note-component(
          v-bind:note="note"
          v-on:update="onUpdate(note)")
      table-grid-content-item-component(
        v-on:enter-view="onEnterView(null)")
        .minota-table__clean(v-on:click="onCreate()")
          .minota-table__clean-text (Кликните по столу чтобы создать новую заметку)
  //- .minota-table-grid(v-bind:intent="intent")
    .minota-actions.minota-actions_bottom
      .minota-section-left
        //- .minota-status {{ intent | capitalize }}
      .minota-section-right
        a.minota-actions__action(
          v-on:click.prevent="onRemoveVisible()" href)
          span Убрать

    //- .minota-actions.minota-actions_top.minota-actions_sticky
      //- LEFT: Regular mode
      .minota-section-left(v-if="mode !== 'edit'")
        //- a.minota-actions__action(
          v-if="!table.length || true"
          v-on:click.prevent="onCreate()" href)
          small Создать

        //- a.minota-actions__action(
          v-if="table.length === 1"
          v-on:click.prevent="onDelete()" href)
          strong Удалить

        //- a.minota-actions__action(
          v-if="table.length > 2 && intent === 'get'"
          v-on:click.prevent="onEdit()" href)
          small Изменить

        //- a.minota-actions__action(
          v-if="intent === 'get' && focused"
          v-on:click.prevent="onOpen(focused)" href)
          strong Открыть (1)</small>

      //- LEFT: Edit mode
      .minota-section-left(v-if="mode === 'edit'")
        a.minota-actions__action(
          v-if="table.length"
          v-on:click.prevent="onDoneEdit()" href)
          small Отменить редактирование

      //- RIGHT: Regular mode
      .minota-section-right(v-if="mode !== 'edit'")
        //- a.minota-actions__action(
          v-if="table.length"
          v-on:click.prevent="onDone()" href)
          small Убрать ({{ table.length }})

        //- a.minota-actions__action(
          v-if="!table.length && otherLength() || true"
          v-on:click.prevent="onGet()" href)
          small Достать ({{ otherLength() }})

      //- RIGHT: Edit mode
      .minota-section-right(v-if="mode === 'edit' && selected.focus.length")
        a.minota-actions__action(
          v-on:click.prevent="onDeleteSelected()" href)
          span Удалить <span v-show="selected.focus.length">({{ selected.focus.length }})</span>

        a.minota-actions__action(
          v-on:click.prevent="onRemoveSelected()" href)
          strong Убрать <span v-show="selected.focus.length">({{ selected.focus.length }})</span>

        a.minota-actions__action(
          v-on:click.prevent="onOpenSelected()" href)
          strong Открыть <span v-show="selected.focus.length">({{ selected.focus.length }})</span>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import bus from '@/event-bus'
import Note from '@/models/note'
import Notespace from '@/models/notespace'

import NoteComponent from '@/components/Note'
import TableGridComponent from '@/components/TableGrid'
import TableGridContentItemComponent from '@/components/TableGridContentItem'

export default {
  name: 'Table',

  components: {
    NoteComponent,
    TableGridComponent,
    TableGridContentItemComponent
  },

  data () {
    return {
      mode: '',
      selected: new Notespace(),
      visible: null,
      intent: 'clear'
    }
  },

  computed: {
    other () {
      return this.drawer.filter(note => {
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
      let note = new Note()
      this.addToTable({
        note,
        focusCapacity: Number.POSITIVE_INFINITY,
        append: true
      })
      this.intent = 'create'
      setTimeout(() => {
        bus.$emit(`focus-start-${note.id}`)
      }, 200)
    },

    onDelete () {
      let notes = this.table.slice(0)
      this.backend.deleteNotes(notes)
      this.removeFromDrawer({ notes })
      this.removeFromTable({ notes })
    },

    onUpdate (note) {
      clearTimeout(this.noteContent)
      this.noteContent = setTimeout(() => {
        this.updateOnTable({ note })
      }, 500)
    },

    // Get / Done

    onGet () {
      this.replaceOnTable({ notes: this.drawer })
      this.intent = 'get'
      setTimeout(() => {
        this.$el.querySelector('.minota-view__content').scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        })
      })
    },

    onDone () {
      this.moveToDrawer({ notes: this.table.filter(note => note.content) })
      // this.syncDrawerAction()
      this.intent = 'clear'
    },

    // Mode

    onEdit () {
      this.mode = 'edit'
    },

    onDoneEdit () {
      this.mode = ''
      this.clearSelection()
    },

    // Current view

    onEnterView (note) {
      this.visible = note ? note.id : null
    },

    onExitView (note) {
      if (this.visible === note.id) {
        this.visible = null
      }
    },

    // Select

    isSelected (note) {
      this.selected.isInFocus(note)
    },

    onSelect (note) {
      if (this.mode !== 'edit') {
        this.onEdit()
      }
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

    // Visible actions

    onRemoveVisible () {
      let note = this.table.find(note => note.id === this.visible)
      if (note) {
        this.removeFromTable({ note })
      }
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

    onRemoveSelected () {
      let notes = this.selected.focus.slice(0)
      this.removeFromTable({ notes })
      this.onDoneEdit()
    },

    otherLength () {
      return this.drawer.filter(note => !this.isOnTable(note)).length
    },

    ...mapMutations([
      'addToTable',
      'replaceOnTable',
      'removeFromTable',
      'moveToDrawer',
      'addToDrawer',
      'removeFromDrawer',
      'updateOnTable'
    ]),

    ...mapActions([
      'syncDrawerAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/common'

.minota-table
  .minota-table-grid
    // grid-template-rows auto 1fr auto
    // grid-template-columns auto 1fr auto
  .minota-table-grid__content-item
    padding 0.5rem
  .minota-table-grid__actions
    padding 1rem
    box-sizing border-box
  .minota-note
    margin 0 auto

.minota-table__clean
  width 100%
  margin 0 auto
  max-width 50rem
  min-height 100%
  display flex
  flex-direction column
  justify-content center
  align-items center
  cursor pointer
  border-radius 0.25rem
  box-shadow 0px 0px 0px 1px alpha(black, 0.125)

.minota-table__clean-text
  width 80%
  max-width 30rem
  color rgba(black, low-emphasis)
  text-align center

.minota-section-center
  text-align center
  align-self center

.minota-action[disabled]
  opacity low-emphasis
  pointer-events none
  user-select none
</style>
