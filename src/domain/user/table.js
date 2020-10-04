import Note from '@/domain/user/note'

export default {
  state: {
    table: {}
  },
  actions: {
    createNoteAction ({ commit }, payload) {
      let note = new Note()
      commit('addNote', { note })
      return Promise.resolve(note)
    },
    updateNoteAction ({ commit }, payload) {
      commit('updateNote', payload)
    }
  }
}
