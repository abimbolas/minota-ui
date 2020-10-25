<template lang="pug">
  .minota-table-grid(
    v-observe-zoom
    v-on:zoom-in="onZoomIn($event)"
    v-on:zoom-out="onZoomOut($event)"
    v-on:zoom-stop="onZoomStop($event)"
    v-bind:lod="lod")

    //- .minota-table-grid__panel(position="bottom")
      note-line-component(v-bind:item="tableLine")

    .minota-table-grid__content(
      v-bind:style="zoomStyle"
      v-bind:animating="zoomStep")
      //- .minota-zoom(
      //-   v-bind:style="zoomStyle"
      //-   v-bind:animating="zoomStep")

      .minota-table-grid__content-item(
        v-for="note in table"
        v-bind:key="note.id"
        v-bind:content-item-id="note.id"
        v-observe-view:threshold="0.875"
        v-on:enter-view="onEnterView(note)"
        v-on:exit-view="onExitView(note)")
        //- Note
        note-component(
          v-bind:note="note"
          v-on:cursor-near-end="scrollContentItem(note.id, 'bottom')"
          v-on:cursor-near-start="scrollContentItem(note.id, 'top')"
          v-on:delete-note="onDelete(note)"
          v-bind:lod="lod")
          //- template(slot="header-actions" v-if="lod > 0")
            .minota-section-right
              //- .minota-action.minota-action_icon(
                v-if="lod > 1"
                v-on:click="onLod(0, note)")
                i.material-icons open_in_full
              .minota-action.minota-action_icon
                i.material-icons close
          template(slot="footer-actions" v-if="lod > 0")
            .minota-section-right
              .minota-action(danger v-on:click="onDelete(note)") Удалить

      //- Control panel
      .minota-table-grid__content-item(
        control
        content-item-id="control"
        v-on:enter-view="onEnterView('control')"
        v-on:exit-view="onExitView('control')")
        //- Create note
        .minota-create-note(
          v-on:click="onCreate()"
          title="Кликните чтобы создать заметку")
          inspire-component
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import bus from '@/event-bus'
import { observeZoom, observeView } from '@/directives'
import InspireComponent from '@/components/Inspire'
import NoteComponent from '@/components/Note'
import { Note } from '@/domain/user/note'

let zoomSpeed = 0.125
let zoomLimit = 0.25

export default {
  name: 'Table',

  directives: {
    observeView,
    observeZoom
  },

  components: {
    InspireComponent,
    NoteComponent
  },

  data () {
    return {
      zoomStyle: {
        transform: 'scale(1)'
      },
      zoomStep: false,
      zoom: 1,
      lod: 0
    }
  },

  computed: {
    ...mapGetters(['table'])
  },

  watch: {
    'lod' (lod) {
      if (lod < 0) {
        this.lod = 0
      } else if (lod > 2) {
        this.lod = 2
      }
    },

    'zoom' (zoom) {
      if (zoom > 0.25) {
        if (!this.lodDirty) {
          this.lod -= 1
        }
        this.lodDirty = true
      } else if (zoom < -0.25) {
        if (!this.lodDirty) {
          this.lod += 1
        }
        this.lodDirty = true
      } else {
        this.lodDirty = false
      }
      clearTimeout(this.lodDirtyTimeout)
      this.lodDirtyTimeout = setTimeout(() => {
        this.lodDirty = false
      }, 500)
    }
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
      this.zoomStep = this.zoomStep || 1
      this.zoomStep += zoomSpeed * 2 * Math.abs(event.detail)
      let value = zoomLimit * (1 - 1 / this.zoomStep)
      this.zoom = (1 - 1 / this.zoomStep) // watch
      this.zoomStyle.transform = `scale(${1 + value})`

      clearTimeout(this.zoomTimeout)
      this.zoomTimeout = setTimeout(() => {
        this.onZoomStop()
      }, 500)
    },

    onZoomOut (event) {
      this.zoomStep = this.zoomStep || 1
      this.zoomStep += zoomSpeed * Math.abs(event.detail)
      let value = zoomLimit * (1 - 1 / this.zoomStep)
      this.zoom = (-1 + 1 / this.zoomStep) // watch
      this.zoomStyle.transform = `scale(${1 - value})`

      clearTimeout(this.zoomTimeout)
      this.zoomTimeout = setTimeout(() => {
        this.onZoomStop()
      }, 500)
    },

    onZoomStop (event) {
      this.zoomStyle.transform = `scale(1)`
      this.zoomStep = false
    },

    onLod (lod, note) {
      this.lod = lod
      this.scrollContentItem(note.id, 'view')
    },

    onEnterView (note) {
      // console.log('enter', note)
    },

    onExitView (note) {
      // console.log('exit', note)
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
// LOD
//

.minota-table-grid[lod="1"]
  .minota-table-grid__content
    grid-auto-columns 100%
    @media (min-width 49rem)
      grid-auto-columns 48rem

.minota-table-grid[lod="2"]
  .minota-table-grid__content
    grid-auto-columns 100%
    height 75vh
    margin-top 10vh
    @media (min-width 38rem)
      grid-auto-columns 37rem

//
// Control
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
