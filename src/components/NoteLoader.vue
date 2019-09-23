<template lang="pug">
  .minota-note-loader
    note-component(v-bind:note="note" v-if="note")
</template>

<script>
import { mapActions } from 'vuex'
import NoteComponent from '@/components/Note'

export default {
  name: 'NoteLoader',

  components: {
    NoteComponent
  },

  props: {
    noteId: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      note: null
    }
  },

  watch: {
    noteId (id) {
      this.fetchNote(this.noteId)
    }
  },

  created () {
    this.fetchNote(this.noteId)
  },

  methods: {
    fetchNote (id) {
      // Id === 'new' is special case to create new note.
      // We create one with new noteId and then go it as
      // if it was usual note, except that it will not be saved
      // on server until first edit.
      if (id === 'new') {
        this.newNoteAction().then(note => {
          // Now we have regular note, redirect as if normally have this
          // note
          this.$router.replace(`/note/${note.config.id}`)
        })
      } else {
        // Get either from NoteReference (cache-like object) or from server
        this.getNoteAction({ id }).then(note => {
          this.note = note
        }).catch(error => {
          // Warn about not found note,
          // then redirect to note list
          if (error.status === 404) {
            this.openModalAction({
              modal: {
                header: 'Not found',
                body: `Note ${id} not found.`,
                cancel: false
              }
            }).then(() => {
              this.$router.push('/notes')
            })
          }
        })
      }
    },
    ...mapActions([
      'getNoteAction',
      'newNoteAction',
      'openModalAction'
    ])
  }
}
</script>

<style lang="stylus">
.minota-note-loader
  display flex
  justify-content center
  .minota-note
    flex-grow 1
</style>
