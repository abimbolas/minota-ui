<template lang="pug">
  screen-component.minota-table
    //- Bar
    template(slot="bar")
      router-link(to="/notes" title="List notes").button.icon-button
        i.material-icons folder_open
      router-link(to="/config" title="Setup storages").button.icon-button
        i.material-icons cloud_queue
      .title.text-overline
        topic-breadcrumbs-component(v-bind:topic="getContext")
      router-link(to="/new" title="New note").button.icon-button
        i.material-icons add
      //- .button.icon-button(v-on:click="deleteNote()")
        i.material-icons delete

    //-  Content
    template(slot="content" v-if="noteId")
      note-loader-component(v-bind:note-id="noteId")
    template(slot="content" v-else)
      screen-quote-placeholder-component
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import NoteLoaderComponent from '@/components/NoteLoader'
import TopicBreadcrumbsComponent from '@/components/TopicBreadcrumbs'
import ScreenComponent from '@/components/Screen'
import ScreenQuotePlaceholderComponent from '@/components/ScreenQuotePlaceholder'

export default {
  name: 'Table',

  components: {
    NoteLoaderComponent,
    TopicBreadcrumbsComponent,
    ScreenComponent,
    ScreenQuotePlaceholderComponent
  },

  props: {
    noteId: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    ...mapGetters([
      'getContext'
    ])
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
        console.log('delette', this.noteId)
      })
    },
    ...mapActions([
      'openModalAction'
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
