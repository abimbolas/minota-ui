<template lang="pug">
  screen-component.minota-drawer
    bar-component
      router-link(v-bind:to="backToFocusedNote").navigation.button.icon-button
        i.material-icons developer_board
      h6.title
        span {{ currentStorage && currentStorage.topic }}
      router-link(to="/config").button.icon-button
        i.material-icons cloud_queue

    fab-component
      .fab-action(v-on:click="newNote()")
        i.material-icons add

    main
      template(v-if="orderedByDate.length")
        archive-note-component(
          v-for="noteId in orderedByDate"
          v-bind:key="noteId"
          v-bind:note="noteId"
          v-on:primary-action="openNote(noteId)")

      template(v-else)
        screen-placeholder-component(v-bind:text="'Пустой ящик'")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BackendReference, NoteReference } from '@/store/reference'

import BarComponent from '@/components/layout/Bar'
import FabComponent from '@/components/layout/Fab'
import ScreenComponent from '@/components/layout/Screen'
import ArchiveNoteComponent from '@/components/notes/ArchiveNote'
import ScreenPlaceholderComponent from '@/components/other/ScreenPlaceholder'

export default {
  name: 'Drawer',

  components: {
    BarComponent,
    FabComponent,
    ScreenComponent,
    ArchiveNoteComponent,
    ScreenPlaceholderComponent
  },

  computed: {
    backToFocusedNote () {
      return `/table/${NoteReference[this.focus[0]].config.id}`
    },
    backend () {
      return BackendReference[this.currentStorage.id]
    },
    orderedByDate () {
      return this.archive.slice(0).sort((a, b) => {
        return NoteReference[b].config.date - NoteReference[a].config.date
      })
    },
    ...mapGetters({
      'currentStorage': 'getCurrentStorageConfig',
      'archive': 'getArchive',
      'focus': 'getFocus'
    })
  },

  mounted () {
    this.backend.onReady(() => {
      console.log('Backend for Drawer ready')
      this.loadArchiveAction()
    })
  },

  methods: {
    newNote () {
      this.$router.push('/table')
      this.newNoteAction()
    },
    openNote (id) {
      // this.focusNoteAction({ note: NoteReference[id] })
      this.$router.push(`/table/${id}`)
    },
    ...mapActions([
      'loadArchiveAction',
      'focusNoteAction',
      'newNoteAction'
    ])
  }
}
</script>

<style lang="stylus"></style>
