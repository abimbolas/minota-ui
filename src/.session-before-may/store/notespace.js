import merge from 'lodash/merge'
import Itemspace from '@/models/itemspace'

const state = {
  notespace: new Itemspace({ focusCapacity: 0 })
}

const getters = {
  getNoteById: state => id => state.notespace.getById('blur', id)
}

const mutations = {
  addToNotespace (state, payload) {
    (payload.notes || [payload.note]).forEach(note => {
      state.notespace.addToBlur(note)
    })
  },

  updateInNotespace (state, payload) {
    (payload.notes || [payload.note]).forEach(note => {
      merge(state.notespace.getById('blur', note.id), note)
    })
  },

  removeFromNotespace (state, payload) {
    (payload.notes || [payload.note]).forEach(note => {
      state.notespace.removeFromBlur(note)
    })
  }
}

export default {
  state,
  getters,
  mutations
}
