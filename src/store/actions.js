import $router from '@/router'
import Note from '@/models/note'
import { BackendReference, NoteReference } from '@/reference'
import { lastPromise } from '@/utils/last-promise'
// import router from '@/router'

function Backend ({ getters }) {
  return BackendReference[getters.getCurrentStorageConfig.id]
}

const state = {}

const actions = {

  //
  // Core
  //

  newNoteAction (context) {
    const note = new Note()
    context.commit('addToReference', { notes: [note] })
    // context.commit('addToFocus', { note })
    // router.push(`/table/${note.config.id}`)
    return Promise.resolve(note)
  },

  getNotesAction (context, payload) {
    return Backend(context).getNotes().then(notes => {
      context.commit('addToReference', { notes })
      return notes
    })
  },

  getNoteAction (context, payload) {
    const existingNote = NoteReference[payload.id]
    if (existingNote) {
      return Promise.resolve(existingNote)
    } else {
      return Backend(context).getNote(payload.id)
        .then(note => {
          context.commit('addToReference', { notes: [note] })
          return note
        })
    }
  },

  saveNoteAction (context, payload) {
    return lastPromise({
      type: `saveNoteAction_${payload.note.config.id}`,
      promise: Backend(context).postNote(payload.note)
    }).then(note => {
      context.commit('addToReference', { notes: [note] })
      return Promise.resolve(note)
    })
  },

  openNoteAction (context, payload) {
    $router.push(`/note/${payload.note.config.id}`)
  },

  deleteNotesAction (context, payload) {
    return Promise.all(payload.notes.map(note => {
      return Backend(context).deleteNote(note)
    }))
  }
}

export default {
  state,
  actions
}
