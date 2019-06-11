<template lang="pug">
  .minota-drawer.minota-screen
    bar-component
      router-link(to="/table").navigation.action
        i.material-icons(v-on:click) arrow_back
      h6.title

    fab-component
      .fab-action(v-on:click="newNote()")
        i.material-icons add

    main
      archive-note-component(
        v-for="noteId in orderedByDate"
        v-bind:key="noteId"
        v-bind:note="noteId"
        v-on:open="openNote(noteId)")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArchiveNoteComponent from '@/components/notes/ArchiveNote'
// import ScreenComponent from '@/components/layout/Screen'
import FabComponent from '@/components/layout/Fab'
import BarComponent from '@/components/layout/Bar'
import { Reference } from '@/store/reference'

export default {
  name: 'Drawer',

  components: {
    ArchiveNoteComponent,
    // ScreenComponent,
    FabComponent,
    BarComponent
  },

  computed: {
    orderedByDate () {
      return this.getArchive.slice(0).sort((a, b) => {
        return Reference[b].config.date - Reference[a].config.date
      })
    },
    ...mapGetters([
      'getArchive'
    ])
  },

  created () {
    this.loadArchiveAction()
  },

  methods: {
    getId (note) {
      return Reference[note].config.id
    },
    newNote () {
      this.$router.push('/table')
      this.newNoteAction()
    },
    openNote (id) {
      this.focusNoteAction({ note: Reference[id] })
      this.$router.push('/table')
    },
    ...mapActions([
      'loadArchiveAction',
      'focusNoteAction',
      'newNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/screen'

.minota-drawer
  .minota-archive-note
    cursor pointer
</style>