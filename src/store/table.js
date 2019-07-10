// import Backend from '@/backend'
import Workspace from '@/models/workspace'
import Note from '@/models/note'
import { lastPromise } from '@/utils/last-promise'
import { BackendReference } from './reference'

function Backend ({ getters }) {
  return BackendReference[getters.getCurrentStorageConfig.id]
}

const state = {
  workspace: new Workspace(),
  mode: 'view'
}

const getters = {
  isFocusEmpty: state => state.workspace.focus.length === 0,
  getFocus: state => state.workspace.focus,
  getBlur: state => state.workspace.blur
}

const mutations = {
  addToFocus (state, payload) {
    state.workspace.addToFocus(payload.note.config.id)
  },

  addToBlur (state, payload) {
    state.workspace.addToBlur(payload.note.config.id)
  },

  removeFromFocus (state, payload) {
    state.workspace.removeFromFocus(payload.note.config.id)
  },

  removeFromBlur (state, payload) {
    state.workspace.removeFromBlur(payload.note.config.id)
  },

  clearFocus () {
    state.workspace.clear('focus')
  },

  clearBlur () {
    state.workspace.clear('blur')
  },

  blurFocus (state, payload) {
    if (payload && payload.note) {
      state.workspace.blurFocus(payload.note.config.id)
    } else {
      state.workspace.blurFocus()
    }
  },

  focusBlur (state, payload) {
    if (payload && payload.note) {
      state.workspace.focusBlur(payload.note.config.id)
    } else {
      state.workspace.focusBlur()
    }
  }
}

const actions = {
  newNoteAction (context) {
    const note = new Note()
    context.commit('addToFocus', { note })
    context.commit('addToArchive', { notes: [ note ] })
    context.commit('setFocusEdit')
    return Promise.resolve(note)
  },

  getNoteAction (context, payload) {
    return lastPromise({
      type: `getNote${payload.id}`,
      promise: Backend(context).getNote(payload.id)
    }).then(note => {
      context.commit('addToArchive', { notes: [note] })
      return Promise.resolve(note)
    })
  },

  focusNoteAction (context, payload) {
    context.commit('addToFocus', payload)
  },

  blurNoteAction (context, payload) {
    context.commit('addToBlur', payload)
  },

  clearTableAction (context) {
    context.commit('clearFocus')
    context.commit('clearBlur')
  },

  saveNoteAction (context, payload) {
    return lastPromise({
      type: `saveNote${payload.note.config.id}`,
      promise: Backend(context).postNote(payload.note)
    }).then(note => {
      context.commit('addToArchive', { notes: [note] })
      return Promise.resolve(note)
    })
  },

  // updateNoteContentAction (context, payload) {
  //   return lastPromise({
  //     type: `updateContent${payload.note.config.id}`,
  //     promise: Backend.updateNote(payload.note)
  //   })
  // },

  deleteNoteAction (context, payload) {
    context.commit('removeFromFocus', payload)
    context.commit('removeFromBlur', payload)
    context.commit('removeFromArchive', payload)
    return Backend(context).deleteNote(payload.note)
  },

  closeNoteAction (context, payload) {
    context.commit('removeFromFocus', payload)
    context.commit('removeFromBlur', payload)
  },

  blurTableAction (context) {
    context.commit('blurFocus')
  },

  focusBlurAction (context) {
    context.commit('focusBlur')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
