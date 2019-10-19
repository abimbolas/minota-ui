<template lang="pug">
  section.minota-screen.minota-table
    //- Header
    header.minota-screen-header
      bar-component
        //- router-link(to="/notes" title="List notes").button.icon-button
        //-   i.material-icons folder_open
        .button.icon-button(v-on:click="openDrawer()")
          i.material-icons folder_open
        .title.text-overline
          topic-breadcrumbs-component(
            v-bind:topic="getContext"
            v-on:set-topic="onSetTopic($event)")
        router-link(to="/new" title="New note").button.icon-button
          i.material-icons add
        router-link(to="/config" title="Setup storages").button.icon-button
          i.material-icons cloud_queue

    //-  Content
    main.minota-screen-main
      template(v-if="noteId")
        note-loader-component(v-bind:note-id="noteId")
      template(v-else)
        screen-quote-placeholder-component

    //- Aside drawer
    drawer-pool-component(
      v-bind:topic="drawerTopic"
      v-bind:toggle="drawerOpened"
      v-on:toggle="drawerOpened = $event")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BarComponent from '@/components/Bar'
import DrawerPoolComponent from '@/components/DrawerPool'
import MenuComponent from '@/components/Menu'
import NoteLoaderComponent from '@/components/NoteLoader'
import TopicBreadcrumbsComponent from '@/components/other/TopicBreadcrumbs'
import ScreenQuotePlaceholderComponent from '@/components/other/ScreenQuotePlaceholder'

export default {
  name: 'Table',

  components: {
    BarComponent,
    DrawerPoolComponent,
    MenuComponent,
    NoteLoaderComponent,
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
      poolOpened: false,
      drawerTopic: '',
      drawerOpened: false
    }
  },

  computed: {
    ...mapGetters([
      'getContext'
    ])
  },

  created () {
    this.syncContextAction({ context: this.topic })
  },

  methods: {
    deleteNote () {
      this.openModalAction({
        modal: {
          header: 'Delete note',
          body: `Are you sure to delete this note?`,
          ok: {
            label: 'Delete'
          }
        }
      }).then(() => {
        console.log('delete', this.noteId)
      })
    },
    onSetTopic (topic) {
      this.drawerTopic = topic
      this.drawerOpened = true
    },
    openDrawer () {
      this.drawerOpened = true
      this.drawerTopic = ''
    },
    ...mapActions([
      'openModalAction',
      'syncContextAction'
    ])
  }
}
</script>

<style lang="stylus">
.minota-table
  .minota-note-loader
    flex-grow 1
    min-width 0
</style>
