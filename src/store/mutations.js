import { NoteReference } from '@/reference'

const state = {}

const mutations = {
  addToReference (state, payload) {
    payload.notes.forEach(note => {
      NoteReference[note.config.id] = note
    })
  }
}

export default {
  state,
  mutations
}
