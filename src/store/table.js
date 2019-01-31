import Backend from '@/backend'
import { lastPromise } from '@/utils/last-promise'
import Workspace from '@/models/workspace'
import Note from '@/models/note'
// import { Reference } from './reference'

const state = {
  workspace: new Workspace()
}

const getters = {
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
    return Promise.resolve(note)
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
      promise: Backend.saveNote(payload.note)
    })
  },

  deleteNoteAction (context, payload) {
    context.commit('removeFromFocus', payload)
    context.commit('removeFromBlur', payload)
    context.commit('removeFromArchive', payload)
    return Backend.deleteNote(payload.note)
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
