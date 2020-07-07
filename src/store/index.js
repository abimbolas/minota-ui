import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import Backend from '@/backend'
import LastPromise from '@/utils/last-promise'

import Note from '@/models/note'
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
          focusCapacity: payload.focusCapacity || 1,
          append: payload.append
        })
      })
    },

    replaceOnTable (state, payload) {
      let notes = payload.notes || [payload.note]
      notes.forEach(note => {
        table.replaceInFocus(note)
      })
    },

    removeFromTable (state, payload) {
      (payload.notes || [payload.note]).forEach(note => {
        table.removeFromFocus(note)
      })
    },

    updateOnTable (state, payload) {
      let note = state.table.find(note => note.id === payload.note.id)
      if (note) {
        note.update(payload.note)
      }
    },

    moveToDrawer (state, payload = {}) {
      let notes = payload.notes || (payload.note && [payload.note]) || state.table
      notes.forEach(note => {
        drawer.addToFocus(note, { focusCapacity: Number.POSITIVE_INFINITY })
      })
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
    },

    clearDrawer (state, payload) {
      drawer.clearFocus()
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
        type: 'sync-drawer',
        promise: backend.getNotes().then(notes => {
          context.commit('clearDrawer')
          context.commit('addToDrawer', { notes: notes.slice(0).reverse() })
          context.commit('replaceOnTable', {
            notes: notes.filter(note => {
              return context.getters.table.find(item => item.id === note.id)
            })
          })
        }),
        registry
      })
    }
  },

  plugins: [
    createPersistedState({
      key: 'minota-store',
      storage: localStorage,
      paths: ['table'],
      arrayMerger (store, saved) {
        // 'store' is actual table.focus and drawer.focus arrays, so
        // we need to keep them as store
        while (store.length) {
          store.pop()
        }
        saved.forEach(item => {
          store.push(new Note(item))
        })
        return store
      }
    })
  ]
})
