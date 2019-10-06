<template lang="pug">
  screen-component.minota-table
    //- Bar
    template(slot="bar")
      .title.text-overline {{ getContext }}
      router-link(to="/new" title="New note").button.icon-button
        i.material-icons add
      router-link(to="/notes" title="List notes").button.icon-button
        i.material-icons folder_open

    //-  Content
    template(slot="content" v-if="noteId")
      note-loader-component(v-bind:note-id="noteId")
    template(slot="content" v-else)
      screen-quote-placeholder-component
</template>

<script>
import { mapGetters } from 'vuex'
import NoteLoaderComponent from '@/components/NoteLoader'
import ScreenComponent from '@/components/Screen'
import ScreenQuotePlaceholderComponent from '@/components/ScreenQuotePlaceholder'

export default {
  name: 'Table',

  components: {
    NoteLoaderComponent,
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
  }
}
</script>

<style lang="stylus">
.minota-table
  .minota-note-loader
    flex-grow 1
    min-width 0
</style>
