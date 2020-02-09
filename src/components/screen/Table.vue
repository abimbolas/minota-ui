<template lang="pug">
  section.minota-screen.minota-table
    //- Header
    header.minota-screen-header
      bar-component(target="window")
        template
          .button.icon-button(v-on:click="openAppMenuDrawer()")
            i.material-icons menu
          topic-breadcrumbs-component.title.text-overline(
            v-bind:topic="getContext"
            v-on:set-topic="openPoolDrawer($event)")
          //- router-link(to="/new" title="New note").button.icon-button
            i.material-icons add
          .button.icon-button(v-on:click="openPoolDrawer()")
            i.material-icons folder_open
          .button.icon-button.media-max-sm(
            title="Unpin"
            v-if="getTableFocus[0] && getTableFocus[0].config.pinned"
            v-on:click="onNoteMenuTogglePin(getTableFocus[0])")
            i.material-icons star
          .button.icon-button.media-max-sm(
            v-if="getTableFocus[0]"
            v-on:click="openNoteMenuDrawer(getTableFocus[0])")
            i.material-icons more_vert

    //-  Content
    main.minota-screen-main
      template(v-if="getTableFocus.length")
        note-component(
          v-for="note in getTableFocus"
          v-bind:key="note.config.id"
          v-bind:note="note"
          v-on:open-menu="openNoteMenuDrawer(note)")
      template(v-else)
        screen-quote-placeholder-component

    fab-component(v-bind:target="'window'" v-if="!drawer.opened")
      i.material-icons(v-on:click="createNewNote()") add

    drawer-component(
      v-bind:position="drawer.position"
      v-bind:opened="drawer.opened"
      v-on:opened="drawer.opened = $event"
      id="table-drawer")
      template(v-if="drawer.type === 'pool'")
        pool-component(
          v-bind:topic="poolTopic"
          v-on:opened="drawer.opened = $event"
          v-on:topic="poolTopic = $event"
          scroll-target="table-drawer"
          position="right")

      template(v-if="drawer.type === 'app'")
        router-link.no-style(to="/table" title="Setup storages")
          menu-item-component
            template(v-slot:icon)
              i.material-icons edit
            template(v-slot:title)
              span Table
        router-link.no-style(to="/config" title="Setup storages")
          menu-item-component
            template(v-slot:icon)
              i.material-icons cloud_queue
            template(v-slot:title)
              span Config
        menu-item-component
          template(v-slot:icon)
            i.material-icons folder_open
          template(v-slot:title)
            span Notes

      template(v-if="drawer.type === 'menu'")
        menu-item-component(v-on:click="onNoteMenuTogglePin()" v-if="!getTableFocus[0].config.pinned")
          template(v-slot:icon)
            i.material-icons star_border
          template(v-slot:title)
            span Pin
        menu-item-component(v-on:click="onNoteMenuTogglePin()" v-if="getTableFocus[0].config.pinned")
          template(v-slot:icon)
            i.material-icons star
          template(v-slot:title)
            span Unpin
        menu-item-component(v-on:click="onNoteMenuDelete()")
          template(v-slot:icon)
            i.material-icons delete_outline
          template(v-slot:title)
            span Delete
</template>

<script>
/* eslint-disable brace-style */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import BarComponent from '@/components/Bar'
import DrawerComponent from '@/components/Drawer'
import FabComponent from '@/components/Fab'
import MenuComponent from '@/components/Menu'
import MenuItemComponent from '@/components/MenuItem'
import NoteComponent from '@/components/Note'
import PoolComponent from '@/components/Pool'
import TopicBreadcrumbsComponent from '@/components/other/TopicBreadcrumbs'
import ScreenQuotePlaceholderComponent from '@/components/other/ScreenQuotePlaceholder'

export default {
  name: 'Table',

  components: {
    BarComponent,
    DrawerComponent,
    FabComponent,
    MenuItemComponent,
    MenuComponent,
    NoteComponent,
    PoolComponent,
    TopicBreadcrumbsComponent,
    ScreenQuotePlaceholderComponent
  },

  props: {
    noteId: {
      type: String,
      required: false,
      default: ''
    },
    topic: {
      type: String,
      requred: false,
      default: ''
    }
  },

  data () {
    return {
      poolTopic: '',
      noteForMenu: null,
      drawer: {
        type: '',
        opened: false,
        position: 'left'
      }
    }
  },

  computed: {
    ...mapGetters([
      'getContext',
      'getTableFocus'
    ])
  },

  watch: {
    'noteId' (noteId) {
      this.fetchNoteById(noteId)
    }
  },

  created () {
    const actions = {
      deleteNotesAction: payload => {
        // If note (in current focus) deleted somewhere (e.g in drawer),
        // remove it from table also.
        this.removeFromTableFocus({ notes: payload.notes })
        if (!this.getTableFocus.length) {
          const route = {
            name: 'note'
          }
          if (this.getContext) {
            route.query = {
              topic: this.getContext
            }
          }
          this.$router.push(route)
        }
      }
    }
    this.unsubscribeActions = this.$store.subscribeAction(action => {
      if (actions[action.type]) {
        actions[action.type](action.payload)
      }
    })
    // Set capacity
    this.setTableFocusCapacity({ capacity: 1 })
  },

  mounted () {
    this.fetchNoteById(this.noteId)
  },

  beforeDestroy () {
    this.unsubscribeActions()
  },

  methods: {
    fetchNoteById (id) {
      let promise
      if (id === 'new') {
        promise = this.newNoteAction()
      } else if (id) {
        promise = this.getNoteAction({ id })
      } else {
        promise = Promise.reject(new Error('No id'))
      }
      promise.then(note => {
        this.addToTableFocus({ note })
      }).catch(error => {
        console.warn('fetchNoteById error:', error)
        if (error.status === 404) {
          this.$router.push({ name: 'note' })
        }
      })
    },

    openNoteMenuDrawer (note) {
      this.noteForMenu = note
      this.drawer = {
        type: 'menu',
        opened: true,
        position: 'top'
      }
    },

    openPoolDrawer (topic = '') {
      this.poolTopic = topic
      this.drawer = {
        type: 'pool',
        opened: true,
        position: 'right'
      }
    },

    openAppMenuDrawer () {
      this.drawer = {
        type: 'app',
        opened: true,
        position: 'left'
      }
    },

    closeDrawer () {
      this.noteForMenu = null
      // this.poolTopic = ''
      this.drawer.opened = false
    },

    createNewNote () {
      this.$router.push('/new')
    },

    onNoteMenuTogglePin (note) {
      const update = note ? note.clone() : this.noteForMenu.clone()
      update.config.pinned = !update.config.pinned
      this.updateNoteAction({ note: update })
      this.closeDrawer()
    },

    onNoteMenuDelete () {
      this.closeDrawer()
      console.log('delete note', this.noteForMenu)
    },

    ...mapMutations([
      'addToTableFocus',
      'removeFromTableFocus',
      'setTableFocusCapacity'
    ]),

    ...mapActions([
      'getNoteAction',
      'newNoteAction',
      'updateNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/everything'

.minota-table
  .minota-screen-main
    justify-content center
    flex-wrap wrap

  .minota-note
    flex-grow 1
    min-width 0

    & + .minota-note
      margin-top 1rem
      position relative
      &:before
        content ''
        display block
        height 1px
        position absolute
        top -0.5rem
        left 0
        right 0
        background-color border-color
      @media (min-width screen-sm)
        margin-top 0.5rem
        &:before
          content none
      @media (min-width screen-md)
        margin-top 1rem
</style>
