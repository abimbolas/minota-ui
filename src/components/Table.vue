<template lang="pug">
  .minota-table-grid(
    v-bind:taken="taken"
    v-bind:control="control"
    v-bind:focused="Boolean(focused)"
    v-bind:selected="selected.focus.length")
    //- Top
    //- .minota-table-grid__panel(position="top")
      .minota-section-right
        //- button.minota-action(v-on:click="onRemove()") Убрать всё
        button.minota-action(v-on:click="onGet()") Достать всё

    //- Bottom if everything is usual
    .minota-table-grid__panel(position="bottom" v-if="usual")
      .minota-section-left
        button.minota-action(
          danger
          v-bind:disabled="!focused"
          v-on:click="onDelete(focused)")
          i.material-icons delete
          span Удалить
      .minota-section-right
        button.minota-action(
          v-bind:disabled="!focused || table.length === 1"
          v-on:click="onSelect(focused)")
          span Выделить
        button.minota-action(
          v-bind:disabled="!focused || table.length === 1"
          v-on:click="onTake(focused)")
          span Переложить
        button.minota-action(
          v-bind:disabled="!focused || table.length === 1"
          v-on:click="onKeep(focused)")
          span Оставить
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onRemove(focused)")
          span Убрать

    //- Bottom is something is selected
    .minota-table-grid__panel(position="bottom" v-if="selected.focus.length && !control")
      .minota-section-left
        .minota-action.minota-action_text
          span {{ getNoun(selected.focus.length, 'Выбрана', 'Выбраны', 'Выбраны')}}&nbsp;
          span {{ selected.focus.length }}&nbsp;
          span {{ getNoun(selected.focus.length, 'заметка', 'заметки', 'заметок')}}
      .minota-section-right
        button.minota-action(
          v-on:click="onCancelSelect()")
          i.material-icons block
          span Отмена
        button.minota-action(
          v-if="selected.isInFocus(focused)"
          v-bind:disabled="!focused || table.length === 1"
          v-on:click="onUnselect(focused)")
          span Снять выделение
        button.minota-action(
          v-if="!selected.isInFocus(focused)"
          v-bind:disabled="!focused || table.length === 1"
          v-on:click="onSelect(focused)")
          span Выделить
        button.minota-action(
          danger
          v-on:click="onDelete(selected.focus)")
          span Удалить
        button.minota-action(
          v-on:click="onKeep(selected.focus)")
          span Оставить
        button.minota-action(
          v-on:click="onRemove(selected.focus)")
          span Убрать

    //- Bottom if something is taken
    .minota-table-grid__panel(position="bottom" v-if="taken")
      .minota-section-left
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onPutBefore(focused)")
          span Положить слева
      .minota-section-center
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onCancelPut()")
          span Отмена
      .minota-section-right
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onPutAfter(focused)")
          span Положить

    //- Bottom for control
    .minota-table-grid__panel(position="bottom" v-if="control")
      .minota-section-left
        .minota-action.minota-action_text(v-if="notesDeleted.length")
          span Корзина ({{ notesDeleted.length }})
      .minota-section-right
        button.minota-action(
          v-bind:disabled="!notesNotOnTable.length"
          v-on:click="onGet(5)")
          span Разложить&nbsp;
          span(v-if="notesNotOnTable.length") 5 из {{ notesNotOnTable.length }}

    //- Left
    //- .minota-table-grid__panel(position="left") Left

    //- Right if something is taken
    .minota-table-grid__panel(
      position="right"
      v-bind:class="{'minota-table-grid__panel_taken': taken && taken.id }")
      table-grid-content-item-component(
        v-if="taken && taken.id"
        v-bind:taken="taken && taken.id")
        note-component(
          v-bind:note="taken"
          v-bind:taken="taken && taken.id")

    //- Content
    .minota-table-grid__content
      //- Notes
      table-grid-content-item-component(
        v-for="note in table"
        v-bind:key="note.id"
        v-bind:content-item-id="note.id"
        v-on:enter-view="onEnterView(note)"
        v-on:exit-view="onExitView(note)"
        v-bind:taken-mirror="taken && taken.id === note.id && taken.id")
        note-component(
          v-bind:note="note"
          v-bind:selected="selected.isInFocus(note)"
          v-on:cursor-near-end="scrollContentItemBottom(note.id)"
          v-on:cursor-near-start="scrollContentItemTop(note.id)")
      //- Bundle debug
      //- table-grid-content-item-component
        notes-bundle-component(v-bind:notes="storageNotesList")
      //- Create
      table-grid-content-item-component(
        v-if="!taken"
        content-item-id="control"
        v-on:enter-view="control = true"
        v-on:exit-view="control = false")
        .minota-create-note(
          v-on:click="onCreate()"
          title="Кликните чтобы создать заметку")
          inspire-component
        //- notes-bundle-component(v-bind:notes="notesNotOnTable")
      //- Storages
      //- table-grid-content-item-component(v-if="!taken")
        h3 Storages
        p(v-for="storage in storageNodes")
          em(v-if="storage.isSupported && !storage.isActive" style="color: grey;") (inactive)&nbsp;
          em(v-if="!storage.isSupported" style="color: brown;") (unsupported)&nbsp;
          strong(v-if="storage.isSupported && storage.isDefault") (default)&nbsp;
          span {{ storage.href }}&nbsp;
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import bus from '@/event-bus'
import { getNoun } from '@/utils/i18n'
import Note from '@/models/note'
import Notespace from '@/models/notespace'

import InspireComponent from '@/components/Inspire'
import NoteComponent from '@/components/Note'
import NotesBundleComponent from '@/components/NotesBundle'
import TableGridContentItemComponent from '@/components/TableGridContentItem'

export default {
  name: 'Table',

  components: {
    InspireComponent,
    NoteComponent,
    NotesBundleComponent,
    TableGridContentItemComponent
  },

  data () {
    return {
      focused: null,
      taken: null,
      control: false,
      selected: new Notespace()
    }
  },

  computed: {
    usual () {
      return !this.taken && !this.control && !this.selected.focus.length
    },

    notesNotOnTable () {
      return this.storageNotesList.filter(note => {
        return !note.config.deleted && !this.table.find(item => item.id === note.id)
      })
    },

    notesDeleted () {
      return this.storageNotesList.filter(item => item.config.deleted)
    },

    ...mapGetters([
      'table',
      'storageNodes',
      'storageNotesList'
    ])
  },

  created () {
    const mutations = {
      addNotes: payload => {
        this.replaceOnTable(payload)
      }
    }
    this.$store.subscribe(mutation => {
      mutations[mutation.type] && mutations[mutation.type](mutation.payload)
    })
  },

  mounted () {
    this.getNotesAction()
  },

  methods: {

    // Content item actions

    onDelete (data) {
      let notes = Array.isArray(data) ? data : [data]
      this.deleteNotesAction({ notes })
      this.removeFromTable({ notes })
      this.selected.clearFocus()
    },

    onRemove (data) {
      let notes = Array.isArray(data) ? data : [data]
      this.removeFromTable({ notes })
      this.selected.clearFocus()
    },

    onKeep (data) {
      let notes = Array.isArray(data) ? data : [data]
      this.clearTable()
      this.addToTable({ notes })
      this.selected.clearFocus()
    },

    onTake (note) {
      this.taken = note
      let index = this.table.findIndex(item => item.id === this.taken.id)
      let siblingId
      if (index + 1 < this.table.length) {
        siblingId = this.table[index + 1].id
      } else if (index - 1 > -1) {
        siblingId = this.table[index - 1].id
      }
      if (siblingId) {
        this.scrollContentItemIntoView(siblingId)
      }
    },

    onSelect (note) {
      this.selected.addToFocus(note, {
        focusCapacity: Number.POSITIVE_INFINITY,
        append: true
      })
    },

    onUnselect (note) {
      this.selected.removeFromFocus(note)
    },

    onCancelSelect () {
      this.selected.clearFocus()
    },

    onPutBefore (before) {
      this.putOnTableBefore({
        put: this.taken,
        before
      })
      this.scrollContentItemIntoView(this.taken.id)
      this.taken = null
    },

    onPutAfter (after) {
      this.putOnTableAfter({
        put: this.taken,
        after
      })
      this.scrollContentItemIntoView(this.taken.id)
      this.taken = null
    },

    onCancelPut () {
      this.scrollContentItemIntoView(this.taken.id)
      this.taken = null
    },

    // Content item events

    // Control panel

    onCreate () {
      let note = new Note()
      this.addToTable({
        note,
        focusCapacity: Number.POSITIVE_INFINITY,
        append: true
      })
      this.scrollContentItemIntoView(note.id)
      setTimeout(() => {
        bus.$emit(`focus-note-${note.id}`)
      }, 2000)
    },

    onGet (quantity) {
      if (this.notesNotOnTable.length) {
        let notes = this.notesNotOnTable.slice(0, quantity)
        this.addToTable({
          notes,
          append: true
        })
        this.scrollContentItemIntoView(notes[0].id)
      }
    },

    onGetPile () {
      console.log('get pile of', this.notesNotOnTable.length, 'notes')
    },

    // UI helper events

    onEnterView (note, index) {
      this.focused = note
      this.focusedIndex = index
    },

    onExitView (note) {
      if (this.focused && note && this.focused.id === note.id) {
        this.focused = null
      }
    },

    // UI helper actions

    scrollContentItemIntoView (id) {
      requestAnimationFrame(() => {
        let element = this.$el.querySelector(`*[content-item-id="${id}"]`)
        element.scrollIntoView({
          behavior: 'smooth'
        })
      })
    },

    scrollContentItemTop (id) {
      requestAnimationFrame(() => {
        let element = this.$el.querySelector(`*[content-item-id="${id}"]`)
        let top = 0
        let behavior = 'smooth'
        element.scroll({ top, behavior })
      })
    },

    scrollContentItemBottom (id) {
      requestAnimationFrame(() => {
        let element = this.$el.querySelector(`*[content-item-id="${id}"]`)
        let top = element.scrollHeight
        let behavior = 'smooth'
        element.scroll({ top, behavior })
      })
    },

    getNoun,

    ...mapMutations([
      'addToTable',
      'replaceOnTable',
      'removeFromTable',
      'putOnTableBefore',
      'putOnTableAfter',
      'clearTable'
    ]),

    ...mapActions([
      'getNotesAction',
      'deleteNotesAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/table'

.minota-table-grid
  grid-template-rows auto 100vh auto
  grid-template-columns auto 1fr auto
  &[taken]
    grid-template-rows auto 1fr auto

.minota-table-grid__content-item
  .minota-note
    margin 0 auto
  .minota-create-note
    width 100%
    height 87.5%
    border-radius 0.25rem
    display flex
    flex-direction column
    justify-content center
    align-items center
    cursor pointer

  .minota-note[selected]
    border dashed 5px alpha(black, medium-emphasis)
    box-shadow none

  .minota-note[taken]
    border dashed 4px alpha(black, medium-emphasis)
    box-shadow none
    padding-left 2rem
    padding-right 2rem

.minota-table-grid__panel[position="right"]
  width 0
  overflow hidden
  display block
  transition all 0.2s ease-out
  &.minota-table-grid__panel_taken
    width 25vw

.minota-table-grid__content-item[taken]
  position absolute
  top 0rem
  left 0.5rem
  height calc(100% - 3.5rem)
  width calc(42rem + 16% + 1rem)

.minota-table-grid__content-item[taken-mirror]
  display none
</style>
