import Workspace from '@/models/workspace'
import { NoteReference, BackendReference } from '@/store/reference'

function Backend ({ getters }) {
  return BackendReference[getters.getCurrentStorageConfig.id]
}

const state = {
  workspace: new Workspace()
}

const getters = {
  getArchive: state => state.workspace.blur
}

const mutations = {
  addToArchive (state, payload) {
    payload.notes.forEach(note => {
      state.workspace.addToBlur(note.config.id)
      NoteReference[note.config.id] = note
    })
  },

  removeFromArchive (state, payload) {
    state.workspace.removeFromBlur(payload.note.config.id)
  },

  clearArchive (state) {
    state.workspace.clear('blur')
  }
}

const actions = {
  loadArchiveAction (context, payload) {
    return Backend(context).getNotes().then(notes => {
      context.commit('clearArchive')
      context.commit('addToArchive', { notes })
      return notes
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
