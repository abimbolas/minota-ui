export default {
  namespaced: true,
  state: {
    notes: [],
    table: []
  },
  getters: {
    table: state => state.table
  },
  mutations: {
    addToTable (state, note) {
      const i = state.table.findIndex(id => id === note.id);
      if (i < 0) state.table.push(note.id);
    },
    removeFromTable (state, note) {
      const i = state.table.findIndex(id => id === note.id);
      if (i >= 0) state.table.splice(i, 1);
    },
    sync (state, notes) {
      state.notes = notes;
      // DEV
      state.table = notes.map(n => n.id);
    }
  }
};
