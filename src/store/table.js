/* eslint-disable brace-style */
import merge from 'lodash/merge'
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
    (payload.notes || [payload.note]).forEach(note => {
      state.table.addToFocus(note, {
        extendFocusCapacity: payload.extendFocusCapacity
      })
    })
  },

  removeFromTableFocus (state, payload) {
    (payload.notes || [payload.note]).forEach(note => {
      state.table.removeFromFocus(note)
    })
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

export function tableNavigationGuard (store, to, from, next) {
  // If we load app first time with this url
  // e.g. /note/909-dfdf-89890/?topic=MyTopic, take it's topic as
  // initial context
  if (!from.name && to.query.topic) {
    store.commit('setContext', { context: to.query.topic })
    // next()
  }

  // If this is 'new' note, create one and redirect to it as usual
  // + add context if any
  if (to.name === 'new') {
    const context = store.getters.getContext || ''
    store.dispatch('newNoteAction', {
      note: {
        config: {
          topic: context
        }
      }
    }).then(note => {
      store.commit('addToTableFocus', { note })
      const route = {
        name: 'note',
        params: {
          noteId: note.id
        }
      }
      if (context) {
        route.query = {
          topic: context
        }
      }
      next(route)
    }).catch(error => {
      console.warn('tableNavigationGuard error:', error)
      next()
    })
  }

  // If redirected to 'table', that means we want to restore
  // existing focus and context
  else if (to.name === 'table') { // to.params.noteId === undefined || to.query.topic === undefined) {
    const context = store.getters.getContext
    const note = store.getters.getTableFocus.slice(-1)[0]
    const route = {
      name: 'note',
      params: {
        noteId: note.id
      }
    }
    if (context) {
      route.query = {
        topic: context
      }
    }
    next(route)
  }

  // or just pass through
  else {
    next()
  }
}
