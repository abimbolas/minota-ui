<template lang="pug">
  .minota-table-grid(
    v-bind:taken="taken"
    v-bind:control="control"
    v-bind:selected="hasSelected")

    //- .minota-table-grid__panel(
      position="top"
      v-observe-view:threshold="0.75"
      v-on:enter-view="mode = !mode")
      .minota-section-center
        .minota-action(v-if="mode") Режим упорядочивания стола
        .minota-action(v-else) Режим редактирования заметок

    //- Bottom if something is taken
    //- .minota-table-grid__panel(position="bottom" v-if="taken")
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
          v-on:click="onPutAfter(focused)")
          span Положить

    //- Right if something is taken
    //- .minota-table-grid__panel(
      position="right"
      v-bind:class="{'minota-table-grid__panel_taken': taken && taken.id }")
      table-grid-content-item-component(
        v-if="taken && taken.id"
        v-bind:taken="taken && taken.id")
        note-component(
          v-if="isNote(taken)"
          v-bind:note="taken"
          v-bind:taken="taken && taken.id")
        notespace-component(
          v-if="isNotespace(taken)"
          v-bind:note="taken"
          v-bind:taken="taken && taken.id")

    //- Content
    .minota-table-grid__content
      //- Notes
      .minota-table-grid__content-item(
        v-for="note in table"
        v-bind:key="note.id"
        v-bind:content-item-id="note.id"
        v-bind:taken-mirror="taken && taken.id === note.id && taken.id")

        note-component(
          v-if="isNote(note)"
          v-bind:note="note"
          v-bind:mode="mode"
          v-on:cursor-near-end="scrollContentItem(note.id, 'bottom')"
          v-on:cursor-near-start="scrollContentItem(note.id, 'top')")
          //- template(slot="header-actions" v-if="mode")
            .minota-section-right
              .minota-action.minota-action_icon(v-on:click="onRemove(note)")
                i.material-icons close
          //- template(slot="footer-actions" v-if="mode")
            .minota-section-left
              .minota-action(danger v-on:click="onDelete(note)")
                | Удалить
        notespace-component(
          v-if="isNotespace(note)"
          v-bind:note="note"
          v-bind:selected="selected.isInFocus(note)")

      //- Control panel
      .minota-table-grid__content-item(
        v-if="!taken"
        control
        content-item-id="control"
        v-on:enter-view="control = true"
        v-on:exit-view="control = false")
        //- Create note
        .minota-create-note(
          v-on:click="onCreate()"
          title="Кликните чтобы создать заметку")
          inspire-component
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import bus from '@/event-bus'
import { getNoun } from '@/utils/i18n'
import Note from '@/models/note'
import Workspace from '@/models/workspace'
import Notespace from '@/models/notespace'

import InspireComponent from '@/components/Inspire'
import NoteComponent from '@/components/Note'
import NotespaceComponent from '@/components/Notespace'

import observeView from '@/directives/observe-view'

export default {
  name: 'Table',

  components: {
    InspireComponent,
    NoteComponent,
    NotespaceComponent
  },

  directives: {
    observeView
  },

  data () {
    return {
      focused: null,
      taken: null,
      control: false,
      selected: new Workspace(),
      mode: false
    }
  },

  computed: {
    usual () {
      return !this.taken && !this.control && !this.selected.focus.length
    },

    hasFocused () {
      return Boolean(this.focused)
    },

    hasSelected () {
      return Boolean(this.selected.focus.length)
    },

    notesNotOnTable () {
      return this.storageNotesList.filter(note => {
        return !note.config.deleted && !this.table.find(item => item.id === note.id)
      })
    },

    notesNotOnTableRecentFirst () {
      return this.notesNotOnTable.slice(0).sort((a, b) => {
        return b.config.date - a.config.date
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
        this.scrollContentItem(siblingId, 'view')
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
      this.scrollContentItem(this.taken.id, 'view')
      this.taken = null
    },

    onPutAfter (after) {
      this.putOnTableAfter({
        put: this.taken,
        after
      })
      this.scrollContentItem(this.taken.id, 'view')
      this.taken = null
    },

    onCancelPut () {
      this.scrollContentItem(this.taken.id, 'view')
      this.taken = null
    },

    // Table actions

    resetMode () {
      this.mode = false
    },

    // Control panel

    onCreate () {
      let note = new Note()
      this.addToTable({
        note,
        focusCapacity: Number.POSITIVE_INFINITY,
        append: true
      })
      this.scrollContentItem(note.id, 'view')
      setTimeout(() => {
        bus.$emit(`focus-note-${note.id}`)
      }, 2000)
      this.resetMode()
    },

    onGet (quantity) {
      if (this.notesNotOnTable.length) {
        let notes = this.notesNotOnTableRecentFirst.slice(0, quantity)
        this.addToTable({
          notes,
          append: true
        })
        this.scrollContentItem(notes[0].id, 'view')
      }
    },

    onGetPile () {
      let notes = this.notesNotOnTableRecentFirst.slice(0)
      if (notes.length) {
        this.addToTable({
          notes,
          append: true
        })
        this.scrollContentItem(notes[0].id, 'view')
      }
    },

    // UI helper actions

    scrollContentItem (id, type) {
      let options = { behavior: 'smooth' }
      requestAnimationFrame(() => {
        let element = this.$el.querySelector(`*[content-item-id="${id}"]`)
        if (type === 'view') {
          element.scrollIntoView(options)
        } else if (type === 'top') {
          element.scroll({ top: 0, ...options })
        } else if (type === 'bottom') {
          element.scroll({ top: element.scrollHeight, ...options })
        }
      })
    },

    isNote (note) {
      return note instanceof Note
    },

    isNotespace (notespace) {
      return notespace instanceof Notespace
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
  &[selected]
    grid-template-rows 3.5rem 1fr 3.5rem
  &[mode]
    .minota-note
      height 100%

.minota-table-grid__content-item
  .minota-note
    margin 0 auto

  .minota-note[selected]
  .minota-notespace[selected]
    border dashed 5px alpha(black, medium-emphasis)
    box-shadow none

  .minota-note[taken]
    border dashed 4px alpha(black, medium-emphasis)
    box-shadow none
    padding-left 2rem
    padding-right 2rem
  .minota-notespace[taken]
    border dashed 4px alpha(black, medium-emphasis)

.minota-table-grid__panel[position="top"]
  padding 0.5rem
  padding-bottom 0

.minota-table-grid__panel[position="bottom"]
  padding 0.5rem
  padding-top 0
  .minota-action
    padding 0.5rem 0.5rem

// .minota-table-grid__panel[position="right"]
//   // width 0
//   overflow hidden
//   display block
//   transition all 0.2s ease-out
//   &.minota-table-grid__panel_taken
//     width 25vw
//     perspective 90rem

.minota-table-grid__panel[position="left"]
  padding 0.5rem
  padding-right 0
  display block

.minota-table-grid__content-item[taken]
  position absolute
  top 0rem
  left 0.5rem
  height calc(100% - 3.5rem)
  width calc(42rem + 16% + 1rem)
  transform-origin 0% 50%
  transform rotateY(-30deg)

.minota-table-grid__content-item[taken-mirror]
  display none

.minota-table-grid__content-item[control]
  // display flex
  // flex-direction column
  display block
  scroll-snap-type block mandatory

.minota-create-note
  width 100%
  height 100%
  border-radius 0.25rem
  display flex
  flex-direction column
  justify-content center
  align-items center
  cursor pointer
  flex-grow 1
  scroll-snap-stop always
  scroll-snap-align center

.minota-table-control
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center

.minota-control-panel
  height 100%
  display flex
  justify-content center
  align-items center
  box-shadow 0px 0px 0px 2px alpha(black, 0.125)
  border-radius 0.25rem
  scroll-snap-stop always
  scroll-snap-align center
  & + *
  * + &
    margin-top 1rem
</style>
