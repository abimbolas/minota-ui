<template lang="pug">
  screen-component.minota-pool
    //- Bar
    template(slot="bar")
      .title.text-overline {{ topic }}
      router-link(to="/new" title="Add note").button.icon-button
        i.material-icons add
      router-link(to="/config" title="Setup storages").button.icon-button
        i.material-icons cloud_queue

    //- Content
    template(slot="content")
      note-list-loader-component(v-bind:topic="topic")
</template>

<script>
import ScreenComponent from '@/components/Screen'
import NoteListLoaderComponent from '@/components/NoteListLoader'

export default {
  name: 'Pool',

  components: {
    NoteListLoaderComponent,
    ScreenComponent
  },

  props: {
    topic: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style lang="stylus">
.minota-pool
  .minota-screen-main
    flex-direction column
    .minota-note-tree-loader
      flex-grow 1
      min-width 0
</style>
