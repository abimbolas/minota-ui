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
          router-link(to="/new" title="New note").button.icon-button
            i.material-icons add
          router-link(to="/config" title="Setup storages").button.icon-button
            i.material-icons cloud_queue

    //-  Content
    main.minota-screen-main
      template(v-if="getTableFocus.length")
        note-component(
          v-for="note in getTableFocus"
          v-bind:key="note.config.id"
          v-bind:note="note")
      template(v-else)
        screen-quote-placeholder-component

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
import DrawerPoolComponent from '@/components/DrawerPool'
import NoteComponent from '@/components/Note'
import TopicBreadcrumbsComponent from '@/components/other/TopicBreadcrumbs'
import ScreenQuotePlaceholderComponent from '@/components/other/ScreenQuotePlaceholder'

export default {
  name: 'Table',

  components: {
    BarComponent,
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

    ...mapMutations([
      'addToTableFocus',
      'removeFromTableFocus'
    ]),

    ...mapActions([
      'getNoteAction',
      'newNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-table
  .minota-screen-main
    justify-content center
  .minota-note
    flex-grow 1
    min-width 0
  .minota-note-loader
    flex-grow 1
    min-width 0
  .minota-bar
    background-color white
  @media (min-width screen-sm)
    .minota-bar
      background-color transparent
      &.sticky
        background-color white
</style>
