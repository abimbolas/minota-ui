<template lang="pug">
  .minota-table-grid(
    v-bind:taken="taken"
    v-bind:control="control"
    v-bind:focused="focused")
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
          v-on:click="onTake()")
          span Переложить
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onRemove()")
          span Убрать

    //- Bottom if something is taken
    .minota-table-grid__panel(position="bottom" v-if="taken")
      .minota-section-left
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onPutBefore()")
          span Положить слева
      .minota-section-center
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onCancelPut()")
          span Отмена
      .minota-section-right
        button.minota-action(
          v-bind:disabled="!focused"
          v-on:click="onPutAfter()")
          span Положить

    //- Bottom for control
    .minota-table-grid__panel(position="bottom" v-if="control")
      .minota-section-right
        button.minota-action(
          v-bind:disabled="!notesNotOnTable.length"
          v-on:click="onGet()")
          span Достать&nbsp;
          span(v-if="notesNotOnTable.length") ({{ notesNotOnTableCount }})

    //- Left
    //- .minota-table-grid__panel(position="left") Left

    //- Right if something is taken
    .minota-table-grid__panel(position="right" v-if="taken")
      table-grid-content-item-component(v-bind:taken="taken && taken.id")
        note-component(v-bind:note="taken")

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
        note-component(v-bind:note="note")

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
      //- Storages
      table-grid-content-item-component(v-if="!taken")
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
import Note from '@/models/note'

import InspireComponent from '@/components/Inspire'
import NoteComponent from '@/components/Note'
import TableGridContentItemComponent from '@/components/TableGridContentItem'

export default {
  name: 'Table',

  components: {
    InspireComponent,
    NoteComponent,
    TableGridContentItemComponent
  },

  data () {
    return {
      focused: null,
      taken: null,
      control: false,
      tableCapacity: 5
    }
  },

  computed: {
    usual () {
      return !this.taken && !this.control
    },

    notesNotOnTable () {
      return Object.keys(this.storageNotes)
        .map(key => this.storageNotes[key])
        .filter(note => !this.table.find(item => item.id === note.id))
    },

    notesNotOnTableCount () {
      return this.notesNotOnTable.length >= this.tableCapacity
        ? `${this.tableCapacity} из ${this.notesNotOnTable.length}`
        : this.notesNotOnTable.length
    },

    ...mapGetters([
      'table',
      'storageNodes',
      'storageNotes'
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

    onDelete () {
      this.deleteNoteAction({ note: this.focused })
      this.removeFromTable({ note: this.focused })
    },

    onRemove () {
      this.removeFromTable({ note: this.focused })
    },

    onTake () {
      this.taken = this.focused
      let index = this.table.findIndex(note => note.id === this.focused.id)
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

    onPutBefore () {
      this.putOnTableBefore({
        put: this.taken,
        before: this.focused
      })
      this.scrollContentItemIntoView(this.taken.id)
      this.taken = null
    },

    onPutAfter () {
      this.putOnTableAfter({
        put: this.taken,
        after: this.focused
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

    onGet () {
      if (this.notesNotOnTable.length) {
        let notes = this.notesNotOnTable.slice(0, this.tableCapacity)
        this.addToTable({
          notes,
          append: true
        })
        this.scrollContentItemIntoView(notes[0].id)
      }
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
        this.$el.querySelector(`*[content-item-id="${id}"]`).scrollIntoView({
          behavior: 'smooth'
        })
      })
    },

    ...mapMutations([
      'addToTable',
      'replaceOnTable',
      'removeFromTable',
      'putOnTableBefore',
      'putOnTableAfter'
    ]),

    ...mapActions([
      'getNotesAction',
      'deleteNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
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
    height 100%
    border-radius 0.25rem
    display flex
    flex-direction column
    justify-content center
    align-items center
    cursor pointer

.minota-table-grid__panel[position="right"]
  width 25vw
  overflow hidden

.minota-table-grid__content-item[taken]
  position absolute
  top 0rem
  left 0.5rem
  height calc(100% - 3.5rem)
  width calc(42rem + 16% + 1rem)
  transform-origin 0 50%
  transform perspective(90rem) rotateY(-30deg)
  .minota-note
    padding-left 2rem
    padding-right 2rem
    border dashed 5px alpha(black, 0.25)
    box-shadow none
    color alpha(black, medium-emphasis)

.minota-table-grid__content-item[taken-mirror]
  display none

</style>
