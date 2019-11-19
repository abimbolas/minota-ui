<template lang="pug">
  section.minota-screen.minota-table
    //- Header
    header.minota-screen-header
      bar-component
        template
          .button.icon-button(v-on:click="openTopicInDrawer('')")
            i.material-icons folder_open
          topic-breadcrumbs-component.title.text-overline(
            v-bind:topic="getContext"
            v-on:set-topic="openTopicInDrawer($event)")
          //- router-link(to="/new" title="New note").button.icon-button
            i.material-icons add
          router-link(to="/config" title="Setup storages").button.icon-button
            i.material-icons cloud_queue

    //-  Content
    main#minota-screen-table.minota-screen-main
      template(v-if="getTableFocus.length")
        note-component(
          v-for="note in getTableFocus"
          v-bind:key="note.config.id"
          v-bind:note="note")
      template(v-else)
        screen-quote-placeholder-component

    fab-component(v-bind:target="'window'" v-if="!drawerOpened")
      i.material-icons(v-on:click="createNewNote()") add

    //- Aside drawer
    drawer-pool-component(
      v-bind:topic="drawerTopic"
      v-bind:toggle="drawerOpened"
      v-on:toggle="drawerOpened = $event")
</template>

<script>
/* eslint-disable brace-style */
import { mapGetters, mapMutations, mapActions } from 'vuex'
import BarComponent from '@/components/Bar'
import FabComponent from '@/components/Fab'
import DrawerPoolComponent from '@/components/DrawerPool'
import NoteComponent from '@/components/Note'
import TopicBreadcrumbsComponent from '@/components/other/TopicBreadcrumbs'
import ScreenQuotePlaceholderComponent from '@/components/other/ScreenQuotePlaceholder'

export default {
  name: 'Table',

  components: {
    BarComponent,
    FabComponent,
    DrawerPoolComponent,
    NoteComponent,
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
      drawerTopic: '',
      drawerOpened: false
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
    },
    'getContext' (context) {
      // Compare context with topics of the focused notes and choose
      // the most common topic from them (or none at all)
      console.log('watch context:', context)
    }
  },

  created () {
    const actions = {
      // If note (in current focus) deleted somewhere (e.g in drawer), remove it from table
      // also (with modal window).
      deleteNotesAction: payload => {
        this.removeFromTableFocus({ notes: payload.notes })
        if (!this.getTableFocus.length) {
          this.$router.replace({ name: 'note' })
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

    openTopicInDrawer (topic) {
      this.drawerTopic = topic
      this.drawerOpened = true
    },

    createNewNote () {
      console.log('new note', this.getContext)
      this.newNoteAction().then(note => {
        this.openNoteAction({ note })
      })
    },

    ...mapMutations([
      'addToTableFocus',
      'removeFromTableFocus',
      'setTableFocusCapacity'
    ]),

    ...mapActions([
      'getNoteAction',
      'newNoteAction',
      'openNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

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
