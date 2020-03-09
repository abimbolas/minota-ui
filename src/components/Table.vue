<template lang="pug">
  section.minota-screen.minota-table
    //- Header
    header.minota-screen-header
      bar-component(target="window"
        v-bind:extended-on-sticky="false")
        template
          //- .button.icon-button(v-on:click="openAppMenuDrawer()")
            i.material-icons menu

          //- .button.icon-button(v-on:click="openPoolDrawer()")
            i.material-icons folder_open

          .title &nbsp;
            //- topic-breadcrumbs-component.text-overline(
              v-if="getContext"
              v-bind:topic="getContext"
              v-on:set-topic="openPoolDrawer($event)")
            //- .topic.text-h6(v-if="focusedNoteTitle") {{ focusedNoteTitle }}

          router-link.button.icon-button(to="/new" title="New")
            i.material-icons add

          .button.icon-button(v-on:click="openPoolDrawer()")
            i.material-icons menu
          //- router-link.button.icon-button(to="/pool" title="Pool")

          //- .button.icon-button.table-note-menu(
            title="Unpin"
            v-if="getTableFocus[0] && getTableFocus[0].config.pinned"
            v-on:click="onNoteMenuTogglePin(getTableFocus[0])")
            i.material-icons star
          //- .button.icon-button.table-note-menu(
            v-if="getTableFocus[0]"
            v-on:click="openNoteMenuDrawer(getTableFocus[0])")
            i.material-icons more_vert

    //-  Content
    main.minota-screen-main
      template(v-if="getTableFocus.length")
        note-component(
          v-for="note in getTableFocus"
          v-bind:key="note.id"
          v-bind:note="note"
          v-on:open-menu="openNoteMenuDrawer(note)")
      template(v-else)
        screen-quote-placeholder-component

    //- FAB
    //- fab-component(v-bind:target="'window'" v-if="!drawer.opened")
      i.material-icons(v-on:click="createNewNote()") add

    //- Pool drawer
    drawer-component(
      position="right"
      v-bind:opened="drawerPoolOpened"
      v-on:opened="drawerPoolOpened = $event"
      id="pool-drawer")
      pool-component(
        position="right"
        v-bind:topic="poolTopic"
        v-on:opened="drawerPoolOpened = $event"
        v-on:topic="poolTopic = $event"
        scroll-target="pool-drawer")

    //- App menu drawer
    drawer-component(
      position="left"
      v-bind:opened="drawerAppMenuOpened"
      v-on:opened="drawerAppMenuOpened = $event"
      id="app-menu-drawer")
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

    //- Note menu drawer
    drawer-component(
      position="top"
      v-bind:opened="drawerNoteMenuOpened"
      v-on:opened="drawerNoteMenuOpened = $event"
      id="note-menu-drawer")
      menu-item-component(v-on:click="onNoteMenuTogglePin()" v-if="!getTableFocus[0] || !getTableFocus[0].config.pinned")
        template(v-slot:icon)
          i.material-icons star_border
        template(v-slot:title)
          span Pin
      menu-item-component(v-on:click="onNoteMenuTogglePin()" v-if="getTableFocus[0] && getTableFocus[0].config.pinned")
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
import cloneDeep from 'lodash.clonedeep'
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
    context: {
      type: String,
      requred: false,
      default: ''
    },
    focus: {
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    pool: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      poolTopic: '',
      noteForMenu: null,
      isBarSticky: false,
      drawer: {
        type: '',
        opened: false,
        position: 'left'
      },
      drawerNoteMenuOpened: false,
      drawerAppMenuOpened: false,
      drawerPoolOpened: false
    }
  },

  computed: {
    focusedNoteTitle () {
      return this.getTableFocus[0] &&
        this.getTableFocus[0].topic !== this.getContext &&
        this.getTableFocus[0].path.slice(-1)[0]
    },
    ...mapGetters([
      'getContext',
      'getTableFocus'
    ])
  },

  watch: {
    'pool' (pool) {
      this.syncFromPropPool(pool)
    },
    'focus' (focus) {
      this.syncFromPropFocus(focus)
    },
    'drawerPoolOpened' (pool) {
      this.syncToUrlPool(pool)
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

    // Sync focused notes
    this.syncFromPropFocus(this.focus || [])

    // Sync pool
    this.syncFromPropPool(this.pool)
  },

  beforeDestroy () {
    this.unsubscribeActions()
  },

  methods: {
    syncFromPropFocus (focus) {
      const srcFocus = JSON.stringify(this.getTableFocus.map(note => note.id))
      const targetFocus = JSON.stringify(focus)
      if (srcFocus !== targetFocus) {
        this.clearTableFocus()
        const notes = {}
        const promises = []
        focus.forEach(id => {
          let promise
          if (id === 'new') {
            promise = this.newNoteAction()
          } else {
            promise = this.getNoteAction({ id })
          }
          promises.push(promise)
          promise.then(note => {
            notes[note.id] = note
          }).catch(error => {
            console.error('Table.vue, syncFocusPropToStore:', error)
          })
        })
        Promise.all(promises).then(() => {
          this.addToTableFocus({
            notes: focus.map(noteId => notes[noteId])
          })
          console.log('all done', notes)
        })
      }
    },

    syncFromPropPool (pool) {
      if (this.drawerPoolOpened !== pool) {
        this.drawerPoolOpened = pool
      }
    },

    syncToUrlPool (targetPool) {
      const query = cloneDeep(this.$route.query)
      const srcPool = (this.$route.query.pool === true || this.$route.query.pool === 'true')
      if (srcPool !== targetPool) {
        if (targetPool) {
          query.pool = true
        } else {
          delete query.pool
        }
        this.$router.replace(Object.assign({}, this.$route, { query }))
      }
    },

    openNoteMenuDrawer (note) {
      this.noteForMenu = note
      this.drawerNoteMenuOpened = true
    },

    openPoolDrawer (topic = '') {
      this.poolTopic = topic
      this.drawerPoolOpened = true
    },

    openAppMenuDrawer () {
      this.drawerAppMenuOpened = true
    },

    createNewNote () {
      this.$router.push('/new')
    },

    onNoteMenuTogglePin (note) {
      const update = note ? note.clone() : this.noteForMenu.clone()
      update.config.pinned = !update.config.pinned
      this.updateNoteAction({ note: update })
      this.drawerNoteMenuOpened = false
    },

    onNoteMenuDelete () {
      this.drawerNoteMenuOpened = false
      console.log('delete note', this.noteForMenu)
    },

    ...mapMutations([
      'addToTableFocus',
      'removeFromTableFocus',
      'clearTableFocus',
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
  .minota-bar
    .topic
      display none
    &.extended
      .topic
        display block
        font-weight 500
      .minota-topic-breadcrumbs
        margin-bottom 0.5rem

    .table-note-menu
      display block
      @media (min-width screen-sm)
        display none

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
