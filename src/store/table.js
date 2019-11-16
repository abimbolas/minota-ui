/* eslint-disable brace-style */
import merge from 'lodash/merge'
import Note from '@/models/note'
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
    state.table = new Notespace(payload.table)
    state.table.focus = state.table.focus.map(note => new Note(note))
    state.table.blur = state.table.blur.map(note => new Note(note))
  }
}

export default {
  state,
  getters,
  mutations
}

export function tableRestoreState (state) {
  return {
    table: state.table
      ? new Notespace(state.table)
      : new Notespace()
  }
}

export function tableNavigationGuard (store, to, from, next) {
  // If we load app first time with this url
  // e.g. /note/909-dfdf-89890/?topic=MyTopic, take it's topic as
  // initial context
  if (!from.name) {
    store.commit('setContext', { context: to.query.topic || '' })
    // next()
  }

  // If this is 'new' note, create one and redirect to it as usual
  // + add context if any
  if (to.params.noteId === 'new') {
    store.dispatch('newNoteAction').then(note => {
      store.commit('addToTableFocus', { note })
      const context = store.getters.getContext
      const route = merge({}, to)
      route.params.noteId = note.id
      if (route.query.topic === undefined && context) {
        route.query.topic = context
      }
      delete route.path
      next(route)
    }).catch(error => {
      console.warn('tableNavigationGuard error:', error)
      next()
    })
  }

  // If no noteId or topic specified, but we have one or both of them,
  // add it to url
  else if (to.params.noteId === undefined || to.query.topic === undefined) {
    const note = store.getters.getTableFocus.slice(-1)[0]
    const context = store.getters.getContext
    const route = merge({}, to)
    Object.keys(route)
      .filter(key => ['name', 'params', 'query'].indexOf(key) < 0)
      .forEach(key => {
        delete route[key]
      })
    if (route.params.noteId === undefined && note) {
      route.params.noteId = note.id
    }
    if (route.query.topic === undefined && context) {
      route.query.topic = context
    }
    // If newly created route is the same as previous, just pass through,
    // otherwise redirect to updated router
    if (
      route.params.noteId !== to.params.noteId ||
      route.query.topic !== to.query.topic
    ) {
      next(route)
    } else {
      next()
    }
  }

  // or just pass through
  else {
    next()
  }
}
