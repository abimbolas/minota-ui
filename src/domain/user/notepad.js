export default {
  namespaced: true,
  state: {
    notes: []
  },
  getters: {
    noteById: state => id => state.notes.find(note => note.id === id)
  },
  mutations: {
    add (state, note) {
      // Overwrite existing duplicate
      const duplicateIndex = state.notes.findIndex(item => item.id === note.id)
      if (duplicateIndex > -1) {
        state.notes.splice(duplicateIndex, 1, note)
      } else {
        state.notes.push(note)
      }
    },
    update (state, payload) {
      const note = state.notes.find(note => note.id === payload.id)
      if (!note) {
        console.warn('notepad/update not found', payload)
      } else {
        if (payload.content !== undefined) {
          note.content = payload.content
        }
        if (payload.config !== undefined) {
          Object.assign(note.config, payload.config)
        }
      }
    },
    delete (state, note) {
      const notes = Array.isArray(note) ? note : [note]
      notes.forEach(note => {
        const deleteIndex = state.notes.findIndex(item => item.id === note.id)
        if (deleteIndex > -1) {
          state.notes.splice(deleteIndex, 1)
        }
      })
    },
    sync (state, notes) {
      state.notes = notes
    }
  }
}
