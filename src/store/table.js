/* eslint-disable brace-style */
import Notespace from '@/models/notespace'

const state = {
  table: new Notespace()
}

const getters = {
  getTableFocus: state => state.table.focus,
  isInTableFocus: state => note => state.table.isInFocus(note)
}

const mutations = {
  addToTableFocus (state, payload) {
    const notes = payload.notes || [payload.note]
    notes.slice().reverse().forEach(note => {
      state.table.addToFocus(note, {
        extendFocusCapacity: payload.extendFocusCapacity
      })
    })
  },

  removeFromTableFocus (state, payload) {
    const notes = payload.notes || [payload.note]
    notes.forEach(note => {
      state.table.removeFromFocus(note)
    })
  },

  clearTableFocus (state) {
    state.table.clearFocus()
  },

  recreateTableState (state, payload) {
    state.table = new Notespace()
  },

  setTableFocusCapacity (state, payload) {
    state.table.focusCapacity = payload.capacity
  }
}

export default {
  state,
  getters,
  mutations
}
