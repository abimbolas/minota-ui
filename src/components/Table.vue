<template lang="pug">
  table-grid-component.minota-table
    //- Top
    template(v-slot:actions-top)
      .minota-section-right
        a.minota-action(
          v-bind:disabled="visible === 'createNote'"
          v-on:click.prevent="onRemove()" href)
          | Убрать всё со стола
        a.minota-action(
          v-if="visible === 'createNote' && drawer.length"
          v-on:click.prevent="onGet()" href)
          | Достать всё на стол ({{ drawer.length }})

    //- Bottom
    template(v-slot:actions-bottom)
      .minota-sections_note-width
        .minota-section-left
          a.minota-action.minota-action_danger(
            v-bind:disabled="!(visible && visible.id)"
            v-on:click.prevent="onDeleteVisible()" href)
            i.material-icons delete
            span Скомкать эту и выкинуть в корзину
        .minota-section-right
          a.minota-action(
            v-bind:disabled="!(visible && visible.id)"
            v-on:click.prevent="onRemoveVisible()" href)
            | Убрать эту чтоб не мешала, со стола
          a.minota-action(
            v-if="visible === 'createNote' && drawer.length"
            v-on:click.prevent="onGetRecent()" href)
            | Достать последнюю убранную заметку

    //- template(v-slot:actions-left)
      strong L
    //- template(v-slot:actions-right)
      strong R

    //- Content
    template(v-slot:content)
      table-grid-content-item-component(
        v-for="(note, index) in table"
        v-bind:key="note.id"
        v-bind:note-id="note.id"
        v-bind:class="visible && visible.id === note.id && contentItemClass"
        v-bind:update-scroll-data-on="'update-note-' + note.id + '-scroll-data'"
        v-on:enter-view="onEnterView(note)"
        v-on:exit-view="onExitView(note)")
        note-component(
          v-bind:note="note"
          v-on:update="onUpdate(note)")
        .minota-content-item-index {{ index + 1 }}

      table-grid-content-item-component(
        v-on:enter-view="onEnterView('createNote')")
        .minota-table__clean(v-on:click="onCreate()")
          .minota-table__clean-text (Кликните по столу чтобы создать новую заметку)
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import bus from '@/event-bus'
import Note from '@/models/note'
// import Workspace from '@/models/workspace'
// import Notespace from '@/models/notespace'

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
      visible: null,
      noteScrollDataTimestamp: new Date().getTime(),
      contentItemClass: {
        'minota-table-grid__content-item_stick-top': true,
        'minota-table-grid__content-item_stick-bottom': false
      }
      // mode: '',
      // selected: new Workspace(),
      // intent: 'clear'
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

    // Table-wide actions

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

    onRemove () {
      this.addToDrawer({ notes: this.table.slice(0) })
      this.clearTable()
    },

    // onCompose () {
    //   console.log('compose')
    // },

    onGet () {
      this.addToTable({
        notes: this.drawer.slice(0),
        focusCapacity: Number.POSITIVE_INFINITY,
        append: true
      })
      this.removeFromDrawer({ notes: this.drawer.slice(0) })
      setTimeout(() => {
        this.$el.querySelector('.minota-table-grid__content-item').scrollIntoView({
          behavior: 'smooth'
        })
      }, 500)
    },

    // Note-wide actions

    onRemoveVisible () {
      if (this.visible && this.visible.id) {
        let note = this.table.find(note => note.id === this.visible.id)
        if (note) {
          this.addToDrawer({ note })
          this.removeFromTable({ note })
        }
      }
    },

    onDeleteVisible () {
      if (this.visible && this.visible.id) {
        let note = this.table.find(note => note.id === this.visible.id)
        if (note) {
          this.backend.deleteNote(note).then(ok => {
            console.log('ok', ok)
          })
          this.removeFromDrawer({ note })
          this.removeFromTable({ note })
        }
      }
    },

    onGetRecent () {
      let note = this.drawer[0]
      this.addToTable({
        note,
        focusCapacity: Number.POSITIVE_INFINITY,
        append: true
      })
      this.removeFromDrawer({ note })
      setTimeout(() => {
        this.$el.querySelector(`.minota-table-grid__content-item[note-id="${note.id}"]`).scrollIntoView()
      }, 500)
    },

    onUpdate (note) {
      clearTimeout(this.noteContent)
      bus.$emit(`update-note-${note.id}-scroll-data`)
      this.noteContent = setTimeout(() => {
        this.updateOnTable({ note })
      }, 500)
    },

    // Current view

    onEnterView (item) {
      this.visible = item
    },

    onExitView (item) {
      if (this.visible === item) {
        this.visible = undefined
      }
    },

    onStickContentItem (event) {
      // if (event === 'top') {
      //   this.contentItemClass = {
      //     'minota-table-grid__content-item_stick-top': true,
      //     'minota-table-grid__content-item_stick-bottom': false
      //   }
      // } else if (event === 'bottom') {
      //   this.contentItemClass = {
      //     'minota-table-grid__content-item_stick-top': false,
      //     'minota-table-grid__content-item_stick-bottom': true
      //   }
      // } else {
      //   this.contentItemClass = {
      //     'minota-table-grid__content-item_stick-top': false,
      //     'minota-table-grid__content-item_stick-bottom': false
      //   }
      // }
    },

    // Select

    // isSelected (note) {
    //   this.selected.isInFocus(note)
    // },
    //
    // onSelect (note) {
    //   if (this.mode !== 'edit') {
    //     this.onEdit()
    //   }
    //   this.selected.addToFocus(note, {
    //     focusCapacity: Number.POSITIVE_INFINITY
    //   })
    // },
    //
    // onUnselect (note) {
    //   this.selected.removeFromFocus(note)
    // },
    //
    // clearSelection () {
    //   this.selected.clearFocus()
    // },

    // Selection actions

    // onDeleteSelected () {
    //   let notes = this.selected.focus.slice(0)
    //   this.backend.deleteNotes(notes)
    //   this.removeFromDrawer({ notes })
    //   this.removeFromTable({ notes })
    //   this.onDoneEdit()
    // },

    // onOpenSelected () {
    //   let notes = this.selected.focus.slice(0)
    //   this.replaceOnTable({ notes })
    //   this.onDoneEdit()
    // },
    //
    // onRemoveSelected () {
    //   let notes = this.selected.focus.slice(0)
    //   this.removeFromTable({ notes })
    //   this.onDoneEdit()
    // },

    ...mapMutations([
      'addToTable',
      'replaceOnTable',
      'removeFromTable',
      'clearTable',
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
  .minota-note
    margin 0 auto

  .minota-table-grid__content-item
    position relative
    padding 0.5rem
    .minota-actions
      max-width calc(47rem + 8vw)

    .minota-content-item-index
      position absolute
      top 1.25rem
      right 1.5rem
      opacity low-emphasis
      font-size smaller

    // &.minota-table-grid__content-item_stick-top
    //   scroll-snap-type block mandatory
    //   .minota-note
    //     scroll-snap-align start
    //     scroll-margin-top 1rem
    //     scroll-snap-stop always
    // &.minota-table-grid__content-item_stick-bottom
    //   scroll-snap-type block mandatory
    //   .minota-note
    //     scroll-snap-align end
    //     scroll-margin-bottom 1rem
    //     scroll-snap-stop always

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

.minota-action
  transition all 0.3s ease-out
  opacity 1
  text-decoration none
  .minota-table-grid__actions_bottom &
    padding-top 0.75rem
    padding-bottom 1.25rem

.minota-action[disabled]
  opacity 0
  pointer-events none
  user-select none
  line-height 1.5rem
.minota-action_danger
  color brown !important
</style>
