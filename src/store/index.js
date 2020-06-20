import Vue from 'vue'
import Vuex from 'vuex'

import Backend from '@/backend'
import LastPromise from '@/utils/last-promise'

import Notespace from '@/models/notespace'

Vue.use(Vuex)

const backend = new Backend({
  baseURL: 'http://localhost:1234'
})

const registry = {}
const table = new Notespace()
const drawer = new Notespace()

export default new Vuex.Store({
  state: {
    table: table.focus,
    drawer: drawer.focus,
    backend: backend
  },

  getters: {
    table: state => state.table,
    drawer: state => state.drawer,
    isOnTable: state => note => table.isInFocus(note),
    backend: state => backend
  },

  mutations: {
    addToTable (state, payload) {
      (payload.notes || [payload.note]).forEach(note => {
        table.addToFocus(note, {
          focusCapacity: payload.focusCapacity || 1
        })
      })
    },

    replaceOnTable (state, payload) {
      let notes = payload.notes || [payload.note]
      let focusCapacity = notes.length
      notes.forEach(note => {
        table.addToFocus(note, { focusCapacity })
      })
    },

    removeFromTable (state, payload) {
      (payload.notes || [payload.note]).forEach(note => {
        table.removeFromFocus(note)
      })
    },

    clearTable (state) {
      table.clearFocus()
    },

    addToDrawer (state, payload) {
      (payload.notes || [payload.note]).forEach(note => {
        drawer.addToFocus(note, { focusCapacity: Number.POSITIVE_INFINITY })
      })
    },

    removeFromDrawer (state, payload) {
      (payload.notes || [payload.note]).forEach(note => {
        drawer.removeFromFocus(note)
      })
    }
  },

  actions: {
    updateNoteAction (context, payload) {
      return new LastPromise({
        type: `update-note-${payload.note.id}`,
        promise: backend.postNote(payload.note),
        registry
      })
    },

    syncDrawerAction (context, payload) {
      return new LastPromise({
        type: `sync-drawer`,
        promise: backend.getNotes().then(notes => {
          context.commit('addToDrawer', { notes })
        }),
        registry
      })
    }
  }
})
