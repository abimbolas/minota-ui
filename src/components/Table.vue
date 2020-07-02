<template lang="pug">
  table-grid-component
    template(v-slot:actions-top) Top actions
    template(v-slot:actions-bottom)
      .minota-section-left
        .minota-status Create
      .minota-section-right
        a.minota-action(v-on:click.prevent="onRemoveVisible()" href) Убрать
    template(v-slot:actions-left) Left actions
    template(v-slot:actions-right) Right actions
    template(v-slot:content)
      table-grid-content-item-component(
        v-for="note in table.slice(0).reverse()"
        v-bind:key="note.id"
        v-on:enter-view="onEnterView(note)"
        v-on:exit-view="onExitView(note)")
        note-component(v-bind:note="note")
      table-grid-content-item-component
        .minota-table__clean(v-on:click="onCreate()")
          span (Кликните по столу чтобы создать новую заметку)
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
// import fastdom from 'fastdom'

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

  // mounted () {
  //   this.syncDrawerAction()
  //   this.emptyPlaceholder = Math.floor((Math.random() * 2))
  //
  //   this.$el.querySelector('.minota-view__content').scrollIntoView({
  //     block: 'center',
  //     inline: 'center',
  //     behavior: 'smooth'
  //   })
  //
  //   let currentVisibleItem = null
  //   let isBottomVisible = false
  //   let bottomActionsEl = this.$el.querySelector('.minota-actions_bottom')
  //
  //   let itemObserver = new IntersectionObserver((entries, observer) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         currentVisibleItem = entry.target
  //         if (isBottomVisible && currentVisibleItem.scrollTop > 0) {
  //           bottomActionsEl.classList.add('minota-actions_solid')
  //         } else {
  //           bottomActionsEl.classList.remove('minota-actions_solid')
  //         }
  //       }
  //     })
  //   }, {
  //     threshold: 0.875
  //   })
  //
  //   Array.from(this.$el.querySelectorAll('.minota-view__content-item')).forEach(item => {
  //     itemObserver.observe(item)
  //   })
  //
  //   // let bottomActionsEl = this.$el.querySelector('.minota-actions_bottom')
  //
  //   let bottomObserver = new IntersectionObserver((entries, observer) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         isBottomVisible = true
  //         if (currentVisibleItem.scrollTop > 0) {
  //           bottomActionsEl.classList.add('minota-actions_solid')
  //         } else {
  //           bottomActionsEl.classList.remove('minota-actions_solid')
  //         }
  //       } else {
  //         isBottomVisible = false
  //         bottomActionsEl.classList.remove('minota-actions_solid')
  //       }
  //     })
  //   }, {
  //     threshold: 0.75
  //   })
  //
  //   bottomObserver.observe(bottomActionsEl)
  //
  //   let observer = new IntersectionObserver((entries, observer) => {
  //     entries.forEach(entry => {
  //       if (entry.target.classList.contains('minota-table__clean')) {
  //         if (entry.isIntersecting) {
  //           requestIdleCallback(() => {
  //             // topActionsEl.setAttribute('disabled', true)
  //             bottomActionsEl.setAttribute('disabled', true)
  //           })
  //         } else {
  //           requestIdleCallback(() => {
  //             // topActionsEl.removeAttribute('disabled')
  //             bottomActionsEl.removeAttribute('disabled')
  //           })
  //         }
  //       }
  //     })
  //   }, {
  //     threshold: 0.5
  //   })
  //   observer.observe(this.$el.querySelector('.minota-table__clean'))
  //
  //   // Ctrl
  //   document.addEventListener('keydown', event => {
  //     if (event.key === 'Control') {
  //       this.disableItemScroll = true
  //     }
  //   })
  //   document.addEventListener('keyup', event => {
  //     if (event.key === 'Control') {
  //       this.disableItemScroll = false
  //     }
  //   })
  //
  //   let threshold = 5
  //
  //   let viewScrollData = {
  //     scrollHeight: this.$el.scrollHeight,
  //     height: this.$el.offsetHeight,
  //     current: this.$el.scrollTop,
  //     isAtTop: false,
  //     isAtBottom: false
  //   }
  //
  //   this.$el.addEventListener('scroll', event => {
  //     let data = viewScrollData
  //     let t = threshold || 0
  //     fastdom.measure(() => {
  //       data.scrollHeight = this.$el.scrollHeight
  //       data.current = this.$el.scrollTop
  //       data.isAtTop = data.current <= t
  //       data.topHidden = data.current - 48 <= t
  //       data.bottomHidden = Math.abs(data.scrollHeight - data.height - data.current - 48) <= t
  //       data.isAtBottom = Math.abs(data.scrollHeight - data.height - data.current) <= t
  //       if (data.bottomHidden) {
  //         this.disableItemScroll = false
  //       }
  //     })
  //   })
  //
  //   // Scroll content item
  //
  //   Array.from(this.$el.querySelectorAll('.minota-view__content-item')).forEach(item => {
  //     let data = {
  //       current: item.scrollTop,
  //       scrollHeight: item.scrollHeight,
  //       height: item.offsetHeight,
  //       prev: item.scrollTop,
  //       velocity: 0,
  //       isAtTop: undefined,
  //       isAtBottom: undefined
  //     }
  //
  //     item.addEventListener('scroll', event => {
  //       fastdom.measure(() => {
  //         data.current = item.scrollTop
  //         data.scrollHeight = item.scrollHeight
  //         // fer
  //         data.velocity = data.current - data.prev
  //         data.prev = data.current
  //         data.isAtTop = data.current <= (threshold || 0)
  //         data.isAtBottom = data.scrollHeight - data.height - data.current <= (threshold || 0)
  //         if (data.isAtBottom && data.velocity < 0 && viewScrollData.isAtBottom) {
  //           this.disableItemScroll = true
  //         }
  //       })
  //     })
  //   })
  // },

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

    onEnterView (note) {
      console.log('on enter view', note.id)
    },

    onExitView (note) {
      console.log('on exit view', note.id)
    },

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

.minota-note
  min-height fullscreen-content-height
  width fullscreen-content-width
  margin 0.5rem

.minota-table__clean
  height content-height
  width content-width
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
</style>
