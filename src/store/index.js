import Vue from 'vue'
import Vuex from 'vuex'

import createPersistedState from 'vuex-persistedstate'
import storage from '@/store/storage'

import Note from '@/models/note'
import Workspace from '@/models/workspace'
import Notespace from '@/models/notespace'

Vue.use(Vuex)

const Table = new Workspace()

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    table: Table.focus
  },

  getters: {
    table: state => state.table
  },

  mutations: {
    rehydrateTable (state) {
      Table.focus = state.table.map(item => {
        if (item.notes) {
          return new Notespace(item)
        } else {
          return new Note(item)
        }
      })
      state.table = Table.focus
    },

    addToTable (state, payload) {
      let notes = payload.notes || [payload.note]
      notes.forEach(note => {
        Table.addToFocus(note, {
          focusCapacity: payload.focusCapacity || Number.POSITIVE_INFINITY,
          append: payload.append
        })
      })
    },

    replaceOnTable (state, payload) {
      let notes = payload.notes || [payload.note]
      notes.forEach(note => {
        Table.replaceInFocus(note)
      })
    },

    removeFromTable (state, payload) {
      let notes = payload.notes || [payload.note]
      notes.forEach(note => {
        Table.removeFromFocus(note)
      })
    },

    putOnTableBefore (state, payload) {
      if (!Table.isInFocus(payload.before)) {
        console.warn('putOnTableAfter: payload.before not found on table:', payload.before)
      } else {
        Table.removeFromFocus(payload.put)
        Table.focus.splice(
          Table.focus.findIndex(note => note.id === payload.before.id),
          0,
          payload.put
        )
      }
    },

    putOnTableAfter (state, payload) {
      if (!Table.isInFocus(payload.after)) {
        console.warn('putOnTableAfter: payload.after not found on table:', payload.after)
      } else {
        Table.removeFromFocus(payload.put)
        Table.focus.splice(
          Table.focus.findIndex(note => note.id === payload.after.id) + 1,
          0,
          payload.put
        )
      }
    },

    clearTable (state, payload) {
      Table.clearFocus()
    }
  },

  modules: {
    storage
  },

  plugins: [
    createPersistedState({
      key: 'minota-store',
      storage: localStorage,
      paths: ['table', 'storage.nodes'],
      rehydrated (store) {
        store.commit('rehydrateTable')
      }
    })
  ]
})
