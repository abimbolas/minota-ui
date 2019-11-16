import Note from '@/models/note'
import Notespace from '@/models/notespace'

const state = {
  pool: new Notespace(),
  orderBy: 'date',
  orderAsc: false
}

const getters = {
  getPoolFocus: state => state.pool.focus,
  getPoolNoteById: state => id => state.pool.getById('focus', id),
  getOrderBy: state => state.orderBy,
  getOrderAsc: state => state.orderAsc
}

const mutations = {
  addToPoolFocus (state, payload) {
    (payload.notes || [payload.note]).forEach(note => {
      state.pool.addToFocus(note, {
        extendFocusCapacity: true
      })
    })
  },

  clearPoolFocus (state) {
    state.pool.clearFocus()
  },

  removeFromPoolFocus (state, payload) {
    (payload.notes || [payload.note]).forEach(note => {
      state.pool.removeFromFocus(note)
    })
  },

  setOrderBy (state, payload) {
    state.orderBy = payload.orderBy
  },

  setOrderAsc (state, payload) {
    state.orderAsc = payload.orderAsc
  },

  recreatePoolState (state, payload) {
    state.pool = new Notespace(payload.pool)
    state.pool.focus = state.pool.focus.map(note => new Note(note))
    state.pool.blur = state.pool.blur.map(note => new Note(note))
  }
}

export default {
  state,
  getters,
  mutations
}
