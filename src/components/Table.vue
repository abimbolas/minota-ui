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
          danger
          v-bind:disabled="!focused"
          v-on:click="onDelete(focused)")
          i.material-icons delete
          span Удалить

    //- Content
    .minota-table-grid__content
      //- Notes
      table-grid-content-item-component(
        v-for="note in table"
        v-bind:key="note.id"
        v-on:enter-view="onEnterView(note)"
        v-on:exit-view="onExitView(note)")
        note-component(
          v-bind:note="note"
          v-on:update="onUpdate(note)")
      //- Create
      table-grid-content-item-component
        .minota-create-note(v-on:click="onCreate()")
          inspire-component
  //- table-grid-component.minota-table(
    v-bind:table-zoom="tableZoom"
    )
    //- Top
    template(v-slot:actions-top)
      .minota-section-right
        a.minota-action(
          v-if="tableZoom >= -1"
          v-on:click.prevent="onZoomOut()" href)
          span Отдалить
        a.minota-action(
          v-if="tableZoom < 0"
          v-on:click.prevent="onZoomIn()" href)
          span Приблизить
        a.minota-action(
          v-bind:disabled="visible === 'createNote'"
          v-on:click.prevent="onRemove()" href)
          | Убрать всё
        a.minota-action(
          v-if="visible === 'createNote' && drawer.length"
          v-on:click.prevent="onGet()" href)
          | Достать всё ({{ drawer.length }})

    //- Bottom
    template(v-slot:actions-bottom v-if="tableZoom === 0")
      .minota-section-left
        a.minota-action.minota-action_danger(
          v-bind:disabled="!(visible && visible.id)"
          v-on:click.prevent="onDeleteVisible()" href)
          i.material-icons delete
          span Удалить
      .minota-section-right
        a.minota-action(
          v-bind:disabled="!(visible && visible.id)"
          v-on:click.prevent="onSelectVisible()" href)
          | Выбрать
        a.minota-action(
          v-bind:disabled="!(visible && visible.id)"
          v-on:click.prevent="onKeepVisible()" href)
          | Оставить
        a.minota-action(
          v-bind:disabled="!(visible && visible.id)"
          v-on:click.prevent="onRemoveVisible()" href)
          | Убрать
        a.minota-action(
          v-if="visible === 'createNote' && drawer.length"
          v-on:click.prevent="onGetRecent()" href)
          | Достать последнее убранное

    //- template(v-slot:actions-left)
      strong L
    //- template(v-slot:actions-right)
      strong R

    //- Content
    template(v-slot:content)
      draggable-component(
        v-bind:list="table"
        class="minota-table-grid__content"
        ghost-class="ghost"
        handle=".minota-content-item__action_drag"
        v-bind:move="onMove"
        v-on:start="dragging = true"
        v-on:end="dragging = false")
        table-grid-content-item-component(
          v-for="(note, index) in table"
          v-bind:key="note.id"
          v-bind:note-id="note.id"
          v-bind:update-scroll-data-on="'update-note-' + note.id + '-scroll-data'"
          v-on:enter-view="onEnterView(note)"
          v-on:exit-view="onExitView(note)")
          note-component(
            v-bind:note="note"
            v-on:update="onUpdate(note)"
            v-on:click="onClick(note)")
          .minota-content-item__actions(v-if="tableZoom < 0")
            .minota-content-item__action
              i.material-icons check_box_outline_blank
            .minota-content-item__action.minota-content-item__action_drag
              i.material-icons drag_handle

        table-grid-content-item-component(
          v-on:enter-view="onEnterView('createNote')")
          .minota-table__clean(v-on:click="onCreate()")
            .minota-table__clean-text (Кликните по столу чтобы создать новую заметку)
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
// import DraggableComponent from 'vuedraggable'

import bus from '@/event-bus'
import Note from '@/models/note'
// import Workspace from '@/models/workspace'
// import Notespace from '@/models/notespace'

import InspireComponent from '@/components/Inspire'
import NoteComponent from '@/components/Note'
// import TableGridComponent from '@/components/TableGrid'
import TableGridContentItemComponent from '@/components/TableGridContentItem'

export default {
  name: 'Table',

  components: {
    // DraggableComponent,
    InspireComponent,
    NoteComponent,
    // TableGridComponent,
    TableGridContentItemComponent
  },

  data () {
    return {
      focused: null
      // visible: null,
      // tableZoom: 0,
      // dragging: false,
    }
  },

  computed: {
    ...mapGetters([
      'table',
      // 'drawer',
      // 'isOnTable',
      'backend'
    ])
  },

  // watch: {
  //   'dragging' (dragging) {
  //     if (dragging) {
  //       this.tableZoom = -1
  //     }
  //   }
  // },

  // mounted () {
  //   this.syncDrawerAction()
  // },

  methods: {

    // Content item actions

    onDelete (focused) {
      let note = this.table.find(item => item.id === focused.id)
      if (note) {
        this.backend.deleteNote(note)
        // this.removeFromDrawer({ note })
        this.removeFromTable({ note })
      } else {
        console.warn('Table.vue, onDelete(focused), focused note not found:', focused)
      }
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

    // UI helpers

    onEnterView (note) {
      this.focused = note
    },

    onExitView (note) {
      if (this.focused && note && this.focused.id === note.id) {
        this.focused = null
      }
    },

    //
    //
    //
    //

    // // Table view actions
    //
    // onDragMouseDown () {
    //   this.tableZoom = -1
    // },
    //
    // onZoomIn () {
    //   this.tableZoom = Math.min(this.tableZoom + 1, 0)
    // },
    //
    // onZoomOut () {
    //   this.tableZoom = Math.max(this.tableZoom - 1, -2)
    // },
    //
    // onMove (event) {
    //   console.log(event)
    // },
    //
    // onClick (note) {
    //   this.tableZoom = 0
    //   setTimeout(() => {
    //     this.$el
    //       .querySelector(`.minota-table-grid__content-item[note-id="${note.id}"]`)
    //       .scrollIntoView({
    //         behavior: 'smooth'
    //       })
    //   }, 200)
    // },
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
    //
    // onSelectVisible () {
    //   //
    // },
    //
    // onGetRecent () {
    //   let note = this.drawer[0]
    //   this.addToTable({
    //     note,
    //     focusCapacity: Number.POSITIVE_INFINITY,
    //     append: true
    //   })
    //   this.removeFromDrawer({ note })
    //   setTimeout(() => {
    //     this.$el.querySelector(`.minota-table-grid__content-item[note-id="${note.id}"]`).scrollIntoView()
    //   }, 500)
    // },
    //
    // onUpdate (note) {
    //   clearTimeout(this.noteContent)
    //   bus.$emit(`update-note-${note.id}-scroll-data`)
    //   this.noteContent = setTimeout(() => {
    //     this.updateOnTable({ note })
    //   }, 500)
    // },

    ...mapMutations([
      'addToTable',
      'removeFromTable'
      // 'replaceOnTable',
      // 'clearTable',
      // 'moveToDrawer',
      // 'addToDrawer',
      // 'removeFromDrawer',
      // 'updateOnTable'
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

.minota-table-grid__content-item
  padding 0.5rem
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

//
// .minota-table-grid__content-item
//   position relative
//   padding 0.5rem
//
//   .minota-content-item__actions
//     position absolute
//     top 0.25rem
//     right 0.75rem
//     display flex
//
//     .material-icons
//       line-height 48px
//
//   .minota-content-item__action
//     line-height 48px
//     width 40px
//     height 48px
//     text-align center
//     color alpha(black, low-emphasis)
//     // font-size smaller
//     user-select none
//     cursor grab
//
// &[table-zoom="0"]
//   .minota-table-grid__content
//     grid-auto-columns 100%
//     grid-auto-flow column
//   .minota-table-grid__content-item
//     scroll-snap-align center
// // &[table-zoom="-1"]
// //   .minota-table-grid__content
// //     grid-auto-columns 50%
// //     grid-auto-flow column
// //   .minota-table-grid__content-item
// //     scroll-snap-align start
// &[table-zoom="-1"]
//   .minota-table-grid__content
//     width 100%
//     box-sizing border-box
//     padding 0.25rem
//     display grid
//     grid-gap 0.25rem
//     grid-template-columns repeat(auto-fill, minmax(320px, 1fr))
//     grid-auto-rows minmax(50%, 1fr)
//   .minota-table-grid__content-item
//     padding 0.25rem
//   .minota-note
//     cursor pointer
//     padding 2rem
//     font-size smaller
//     box-shadow 0px 1px 2px 0px alpha(black, 0.125), 0px 0px 5px 0px alpha(black, 0.1)
//
// &[table-zoom="-2"]
//   .minota-table-grid__content
//     width 100%
//     box-sizing border-box
//     padding 0.25rem
//     display grid
//     grid-gap 0.25rem
//     grid-template-columns repeat(auto-fill, minmax(240px, 1fr))
//     grid-template-rows minmax(25%, 1fr)
//     grid-auto-rows minmax(25%, 1fr)
//   .minota-table-grid__content-item
//     padding 0.25rem
//   .minota-note
//     cursor pointer
//     padding 1rem
//     font-size 75%
//     box-shadow 0px 1px 2px 0px alpha(black, 0.125), 0px 0px 5px 0px alpha(black, 0.1)
//
// .minota-table-grid__content-item.ghost
//   opacity 0.25
// .minota-table-grid__content-item.sortable-chosen
//   transform scale(0.95, 0.95) !important
//   transform-origin 100% 0%
//
// .sortable-fallback
//   visibility hidden !important
//
</style>
