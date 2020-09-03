<template lang="pug">
  .minota-table-grid(
    v-observe-zoom
    v-on:zoom-in="onZoomIn($event)"
    v-on:zoom-out="onZoomOut($event)"
    v-on:zoom-stop="onZoomStop($event)")
    .minota-table-grid__content(
      v-bind:style="style"
      v-bind:animating="zoom")

      //- Content is plane XY with yet undefined rows and columns.
      //- Though at the same time it primarily can be either one of them.

      //- Note line
      .minota-table-grid__content-item(
        v-for="note in table"
        v-bind:key="note.id"
        v-bind:content-item-id="note.id")
        //- Note
        note-component(
          v-bind:note="note"
          v-on:cursor-near-end="scrollContentItem(note.id, 'bottom')"
          v-on:cursor-near-start="scrollContentItem(note.id, 'top')"
          v-on:delete-note="onDelete(note)")

      //- Control panel
      .minota-table-grid__content-item(
        control
        content-item-id="control")
        //- Create note
        .minota-create-note(
          v-on:click="onCreate()"
          title="Кликните чтобы создать заметку")
          inspire-component
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import bus from '@/event-bus'
import Note from '@/models/note'
import { observeZoom } from '@/directives'
import InspireComponent from '@/components/Inspire'
import NoteComponent from '@/components/Note'

let zoomSpeed = 0.125
let zoomLimit = 0.375

export default {
  name: 'Table',

  directives: {
    observeZoom
  },

  components: {
    InspireComponent,
    NoteComponent
  },

  data () {
    return {
      style: {
        transform: 'scale(1)'
      },
      zoom: 0
    }
  },

  computed: {
    ...mapGetters(['table'])
  },

  methods: {

    // Note actions

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
    },

    onDelete (data) {
      this.openModalAction({
        modal: {
          component: 'PromptModal',
          header: 'Удалить эту заметку?',
          description: data.content ? `${data.content.slice(0, 200)}... и т. д.` : '',
          ok: 'Удалить и забыть',
          cancel: 'Отмена',
          danger: true
        }
      }).then(() => {
        let notes = Array.isArray(data) ? data : [data]
        this.deleteNotesAction({ notes })
        this.removeFromTable({ notes })
      }).catch(() => {})
    },

    // UI events

    onZoomIn (event) {
      // Zoom steps should be defined.
      // Visually how to switch steps.
      this.zoom = this.zoom || 1
      this.zoom += zoomSpeed
      let value = zoomLimit * 2 * (1 - 1 / this.zoom)
      console.log(1 + value)
      this.style.transform = `scale(${1 + value})`
      clearTimeout(this.zoomTimeout)
      this.zoomTimeout = setTimeout(() => {
        this.onZoomStop()
      }, 500)
    },

    onZoomOut (event) {
      this.zoom = this.zoom || 1
      this.zoom += zoomSpeed
      let value = zoomLimit * (1 - 1 / this.zoom)
      console.log(1 - value)
      this.style.transform = `scale(${1 - value})`
      clearTimeout(this.zoomTimeout)
      this.zoomTimeout = setTimeout(() => {
        this.onZoomStop()
      }, 500)
    },

    onZoomStop (event) {
      console.log('zoom stop')
      this.style.transform = `scale(1)`
      this.zoom = false
    },

    // UI helper

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

    ...mapMutations([
      'addToTable',
      'removeFromTable'
    ]),

    ...mapActions([
      'deleteNotesAction',
      'openModalAction'
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

.minota-table-grid__content:not([animating])
  transition transform 0.1s ease-out

.minota-table-grid__panel[position="top"]
  padding 0.5rem
  padding-bottom 0

.minota-table-grid__panel[position="bottom"]
  padding 0.5rem
  padding-top 0

.minota-table-grid__panel[position="left"]
  padding 0.5rem
  padding-right 0

.minota-table-grid__panel[position="right"]
  padding 0.5rem
  padding-left 0

//
// Control panel styles
//

.minota-table-grid__content-item[control]
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
</style>
