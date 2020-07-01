<template lang="pug">
  .minota-view.minota-view__table.minota-view_only-bottom-actions(v-bind:intent="intent")
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

    .minota-view__content(
      v-bind:disable-item-scroll="disableItemScroll")
      .minota-view__content-item(v-for="note in table.slice(0).reverse()")
        note-component(
          v-bind:key="note.id"
          v-bind:note="note"
          v-bind:note-id="note.id"
          v-on:update="onUpdate(note)")

      .minota-view__content-item
        .minota-table__clean(
          v-on:click.prevent="onCreate()")
          span (Кликните по столу, чтобы создать новую заметку)
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
      selected: new Notespace(),
      emptyPlaceholder: 0,
      intent: 'clear',
      created: false,
      disableItemScroll: false
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
    this.emptyPlaceholder = Math.floor((Math.random() * 2))

    this.$el.querySelector('.minota-view__content').scrollIntoView({
      block: 'center',
      inline: 'center',
      behavior: 'smooth'
    })

    let bottomActionsEl = this.$el.querySelector('.minota-actions_bottom')

    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.target.classList.contains('minota-table__clean')) {
          if (entry.isIntersecting) {
            requestIdleCallback(() => {
              // topActionsEl.setAttribute('disabled', true)
              bottomActionsEl.setAttribute('disabled', true)
            })
          } else {
            requestIdleCallback(() => {
              // topActionsEl.removeAttribute('disabled')
              bottomActionsEl.removeAttribute('disabled')
            })
          }
        }
      })
    }, {
      threshold: 0.5
    })
    observer.observe(this.$el.querySelector('.minota-table__clean'))

    // Ctrl
    document.addEventListener('keydown', event => {
      if (event.key === 'Control') {
        this.disableItemScroll = true
      }
    })
    document.addEventListener('keyup', event => {
      if (event.key === 'Control') {
        this.disableItemScroll = false
      }
    })
  },

  methods: {

    //  Create / Delete

    onCreate () {
      let note = new Note()
      this.addToTable({
        note,
        focusCapacity: Number.POSITIVE_INFINITY
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

    // Focus & open

    // onFocus (note) {
    //   let rect = this.$el.querySelector('.minota-view__content').getBoundingClientRect()
    //   console.log(rect)
    // },

    // onBlur (note) {
    //   if (this.focused && this.focused.id === note.id) {
    //     this.focused = null
    //   }
    // },

    onOpen (note) {
      this.replaceOnTable({ note })
      this.intent = 'open'
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
      let visibleNote = Array.from(this.$el.querySelectorAll('.minota-note')).find(element => {
        return Math.abs(element.getBoundingClientRect().left) < 10
      })
      if (visibleNote) {
        let id = visibleNote.getAttribute('note-id')
        let table = this.table.slice(0).reverse()
        let previousNote = this.$el.querySelector(
          '[note-id="' + table[table.findIndex(note => note.id === id) - 1].id + '"]'
        )
        this.removeFromTable({
          notes: this.table.filter(note => note.id === id)
        })
        if (previousNote) {
          previousNote.scrollIntoView({
            behavior: 'smooth'
          })
        }
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

.minota-view
  height 100vh
  overflow-y auto
  scroll-snap-type both proximity

.minota-actions
  scroll-snap-align center start
  scroll-snap-stop always

.minota-view__table
  display grid
  grid-template-rows 3rem auto 3rem
  grid-template-columns 3rem auto 3rem
  grid-template-areas 'top-right top top-left' 'left main right' 'bottom-right bottom bottom-left'
  &.minota-view_no-vert-actions
    grid-template-rows 0rem auto 0rem
    grid-template-columns 3rem auto 3rem
  &.minota-view_no-horz-actions
    grid-template-rows 3rem auto 3rem
    grid-template-columns 0rem auto 0rem
  &.minota-view_no-actions
    grid-template-rows 0rem auto 0rem
    grid-template-columns 0rem auto 0rem
  &.minota-view_only-bottom-actions
    grid-template-rows 0rem auto 3rem
    grid-template-columns 0rem auto 0rem

  .minota-note
    min-height fullscreen-content-height
    width fullscreen-content-width

.minota-actions_top
  grid-area top
.minota-actions_bottom
  grid-area bottom
.minota-actions_left
  justify-content center
  grid-area left
.minota-actions_right
  justify-content center
  grid-area right
.minota-view__content
  grid-area main
  display flex
  flex-direction row
  align-items flex-start
  width 100vw
  height 100vh
  overflow scroll
  scroll-snap-align center start
  scroll-snap-stop always
  scroll-snap-type both proximity

.minota-table__clean
  height content-height
  width content-width
  flex-basis content-width
  flex-shrink 0
  margin 3rem
  display flex
  flex-direction column
  justify-content center
  align-items center
  text-align center
  color rgba(black, low-emphasis)
  cursor pointer
  border-radius 0.25rem
  box-shadow 0px 0px 0px 1px alpha(black, 0.125)
  scroll-snap-align center
  scroll-snap-stop always

.minota-view__content-item
  height 100vh
  width 100vw
  flex-basis 100vw
  flex-shrink 0
  // display table-cell
  // vertical-align top
  box-sizing border-box
  padding 0.5rem
  overflow scroll
  scroll-snap-align start
  // scroll-margin 0.5rem
  scroll-snap-stop always
  .minota-view__content[disable-item-scroll] &
    pointer-events none
</style>
