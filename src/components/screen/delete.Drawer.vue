<template lang="pug">
  screen-component.minota-drawer
    bar-component
      //- router-link(v-bind:to="backToFocusedNote").button.icon-button
        i.material-icons close
      .button.icon-button
        i.material-icons menu
      .title.text-overline
      .button.icon-button(v-on:click="newNote()")
        i.material-icons add
      router-link(to="/config").button.icon-button
        i.material-icons cloud_queue

    //- fab-component
      .fab-action(v-on:click="newNote()")
        i.material-icons add

    main
      template(v-if="orderedByDate.length")
        archive-note-component(
          v-for="note in orderedByDate"
          v-bind:key="note.config.id"
          v-bind:note="note"
          v-on:primary-action="openNote(note.config.id)")

      template(v-else)
        screen-placeholder-component(v-bind:text="'Пустой ящик'")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { BackendReference, NoteReference } from '@/reference'

import BarComponent from '@/components/Bar'
import FabComponent from '@/components/Fab'
import ScreenComponent from '@/components/Screen'
import ArchiveNoteComponent from '@/components/NoteListItem'
import ScreenPlaceholderComponent from '@/components/ScreenPlaceholder'

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
      if (this.focus[0]) {
        return `/table/${NoteReference[this.focus[0]].config.id}`
      } else {
        return '/table'
      }
    },
    backend () {
      return BackendReference[this.currentStorage.id]
    },
    orderedByDate () {
      return this.archive.slice(0).sort((a, b) => {
        return NoteReference[b].config.date - NoteReference[a].config.date
      }).map(id => NoteReference[id])
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
