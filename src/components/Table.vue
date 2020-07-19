<template lang="pug">
  .minota-table-grid
    //- Top
    //- .minota-table-grid__panel(position="top")
      .minota-section-right
        //- button.minota-action(v-on:click="onRemove()") Убрать всё
        button.minota-action(v-on:click="onGet()") Достать всё

    //- Bottom
    .minota-table-grid__panel(position="bottom")
      .minota-section-left
        button.minota-action(
          v-if="!taken"
          danger
          v-bind:disabled="!focused"
          v-on:click="onDelete(focused)")
          i.material-icons delete
          span Удалить
        button.minota-action(
          v-if="taken"
          v-bind:disabled="!focused"
          v-on:click="onPutBefore()")
          span Положить слева
      .minota-section-center
        button.minota-action(
          v-if="taken"
          v-on:click="onCancelPut()")
          span Отмена
      .minota-section-right
        button.minota-action(
          v-if="taken"
          v-bind:disabled="!focused"
          v-on:click="onPutAfter()")
          span Положить справа
        button.minota-action(
          v-if="!taken"
          v-bind:disabled="!focused"
          v-on:click="onTake()")
          span Переложить

    //- Left
    //- .minota-table-grid__panel(position="left") Left

    //- Right
    .minota-table-grid__panel(
      position="right"
      v-bind:class="{ 'minota-table-grid__panel_with-taken': taken }")
      table-grid-content-item-component(
        v-if="taken"
        v-bind:taken="taken && taken.id")
        note-component(v-bind:note="taken")

    //- Content
    .minota-table-grid__content
      //- Notes
      table-grid-content-item-component(
        v-for="note in table"
        v-bind:key="note.id"
        v-bind:note-id="note.id"
        v-on:enter-view="onEnterView(note)"
        v-on:exit-view="onExitView(note)"
        v-bind:taken-mirror="taken && taken.id === note.id && taken.id")
        note-component(
          v-bind:note="note"
          v-on:update="onUpdate(note)")
      //- Create
      table-grid-content-item-component(v-if="!taken")
        .minota-create-note(
          v-on:click="onCreate()"
          title="Кликните чтобы создать заметку")
          inspire-component
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import bus from '@/event-bus'
import Note from '@/models/note'
// import Workspace from '@/models/workspace'

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
      taken: null
    }
  },

  computed: {
    ...mapGetters([
      'table',
      // 'drawer',
      'backend'
    ])
  },

  // mounted () {
  //   this.syncDrawerAction()
  // },

  methods: {

    // Content item actions

    onDelete () {
      let note = this.table.find(item => item.id === this.focused.id)
      if (note) {
        this.backend.deleteNote(note)
        // this.removeFromDrawer({ note })
        this.removeFromTable({ note })
      } else {
        console.warn('Table.vue, onDelete(), focused note not found:', this.focused)
      }
    },

    onTake () {
      let note = this.table.find(item => item.id === this.focused.id)
      if (note) {
        this.taken = note
        let sibling
        let siblingAfter = this.table.indexOf(note) + 1
        let siblingBefore = this.table.indexOf(note) - 1
        if (siblingAfter < this.table.length) {
          sibling = siblingAfter
        } else if (siblingBefore > -1) {
          sibling = siblingBefore
        }
        if (sibling) {
          requestAnimationFrame(() => {
            this.$el.querySelector(`*[note-id="${this.table[sibling].id}"]`).scrollIntoView({
              behavior: 'smooth'
            })
          })
        }
      } else {
        console.warn('Table.vue, onTake(), focused note not found:', this.focused)
      }
    },

    onPutBefore () {
      this.putOnTableBefore({
        put: this.taken,
        before: this.focused
      })
      let id = this.taken.id
      this.taken = null
      requestAnimationFrame(() => {
        this.$el.querySelector(`*[note-id="${id}"]`).scrollIntoView({
          behavior: 'smooth'
        })
      })
    },

    onPutAfter () {
      this.putOnTableAfter({
        put: this.taken,
        after: this.focused
      })
      let id = this.taken.id
      this.taken = null
      requestAnimationFrame(() => {
        this.$el.querySelector(`*[note-id="${id}"]`).scrollIntoView({
          behavior: 'smooth'
        })
      })
    },

    onCancelPut () {
      let id = this.taken.id
      this.taken = null
      requestAnimationFrame(() => {
        this.$el.querySelector(`*[note-id="${id}"]`).scrollIntoView({
          behavior: 'smooth'
        })
      })
    },

    // Content item events

    onUpdate (note) {
      clearTimeout(this.updateOnTableTimeout)
      this.updateOnTableTimeout = setTimeout(() => {
        this.updateOnTable({ note })
      }, 500)
    },

    // Control panel

    onCreate () {
      let note = new Note()
      this.addToTable({
        note,
        focusCapacity: Number.POSITIVE_INFINITY,
        append: true
      })
      setTimeout(() => {
        bus.$emit(`focus-note-${note.id}`)
      }, 300)
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

    //
    // // Table-wide notes actions
    //
    // onRemove () {
    //   this.addToDrawer({ notes: this.table.slice(0) })
    //   this.clearTable()
    // },
    //
    // onGet () {
    //   this.addToTable({
    //     notes: this.drawer.slice(0),
    //     focusCapacity: Number.POSITIVE_INFINITY,
    //     append: true
    //   })
    //   this.removeFromDrawer({ notes: this.drawer.slice(0) })
    //   setTimeout(() => {
    //     this.$el.querySelector('.minota-table-grid__content-item').scrollIntoView({
    //       behavior: 'smooth'
    //     })
    //   }, 500)
    // },
    //
    // // Note-wide actions
    //
    // onRemoveVisible () {
    //   if (this.visible && this.visible.id) {
    //     let note = this.table.find(note => note.id === this.visible.id)
    //     if (note) {
    //       this.addToDrawer({ note })
    //       this.removeFromTable({ note })
    //     }
    //   }
    // },
    //
    // onKeepVisible () {
    //   if (this.visible && this.visible.id) {
    //     let notes = this.table.filter(note => note.id !== this.visible.id)
    //     if (notes.length) {
    //       this.addToDrawer({ notes })
    //       this.removeFromTable({ notes })
    //     }
    //   }
    // },

    ...mapMutations([
      'addToTable',
      'removeFromTable',
      'putOnTableBefore',
      'putOnTableAfter',
      'updateOnTable'
      // 'replaceOnTable',
      // 'clearTable',
      // 'moveToDrawer',
      // 'addToDrawer',
      // 'removeFromDrawer',
    ])

    // ...mapActions([
    //   'syncDrawerAction'
    // ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/table'

.minota-table-grid
  grid-template-rows auto 1fr auto
  grid-template-columns auto 1fr auto

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

.minota-table-grid__panel_with-taken
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
