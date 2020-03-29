import $router from '@/router'
import Note from '@/models/note'
import Backend from '@/backend'
import lastPromise from '@/utils/last-promise'

const state = {}

const actions = {

  //
  // Core
  //

  newNoteAction (context, payload) {
    const note = new Note(payload ? payload.note : undefined)
    context.commit('addToNotespace', { note })
    return Promise.resolve(note)
  },

  getNoteAction (context, payload) {
    const found = context.getters.getNoteById(payload.id)
    if (found) {
      return Promise.resolve(found)
    } else {
      return context
        .dispatch('backendAction', {
          action: 'getNote',
          payload: payload.id
        })
        .then(note => {
          context.commit('addToNotespace', { note })
          return note
        })
        .catch(error => {
          if (error.status === 404) {
            return context.dispatch('openModalAction', {
              modal: {
                header: 'Not found',
                body: `Note ${payload.id} not found.`,
                cancel: false
              }
            }).then(() => {
              return Promise.reject(error)
            })
          } else {
            console.warn('getNoteAction catch:', error)
            return Promise.reject(error)
          }
        })
    }
  },

  getNotesAction (context, payload) {
    return context
      .dispatch('backendAction', {
        action: 'getNotes'
      })
      .then(notes => {
        notes.forEach(note => {
          context.commit('addToNotespace', { note })
        })
        return notes
      })
      .then(notes => notes.filter(note => {
        // filter by topic:
        // - no context topic
        // - either equal
        // - in context + ' /'
        const noContext = !payload.topic
        const isEqual = payload.topic === note.topic
        const isInContext = note.topic.indexOf(`${payload.topic} /`) === 0
        return noContext || isEqual || isInContext
      }))
      .catch(error => {
        console.warn('getNotesAction error', error)
      })
  },

  updateNotesAction (context, payload) {
    context.commit('updateInNotespace', { notes: payload.notes })
    return Promise.all(payload.notes.map(note => {
      return context.dispatch('backendAction', {
        action: 'postNote',
        payload: note
      })
    }))
  },

  updateNoteAction (context, payload) {
    context.commit('updateInNotespace', { note: payload.note })
    return lastPromise({
      type: `updateNoteAction_${payload.note.id}`,
      promise: context.dispatch('backendAction', {
        action: 'postNote',
        payload: payload.note
      })
    })
  },

  openNoteAction (context, payload) {
    if (context.getters.isInTableFocus(payload.note)) {
      context.commit('removeFromTableFocus', { note: payload.note })
    }
    context.commit('addToTableFocus', { note: payload.note })
    const query = Object.assign({}, $router.currentRoute.query, {
      focus: context.getters['getTableFocus'].map(note => note.id)
    })
    $router.push({ name: 'table', query })
  },

  closeNoteAction (context, payload) {
    if (context.getters.isInTableFocus(payload.note)) {
      context.commit('removeFromTableFocus', { note: payload.note })
    }
    const query = Object.assign({}, $router.currentRoute.query, {
      focus: context.getters['getTableFocus'].map(note => note.id)
    })
    $router.push({ name: 'table', query })
  },

  deleteNotesAction (context, payload) {
    return Promise.all((payload.notes || [payload.note]).map(note => {
      return context.dispatch('backendAction', {
        action: 'deleteNote',
        payload: note
      })
    }))
  },

  backendAction (context, payload) {
    return context.dispatch('getBackendAction')
      .then(backend => backend[payload.action](payload.payload))
  },

  getBackendAction ({ getters }) {
    if (!getters.getCurrentStorageConfig) {
      return Promise.reject(new Error('No storage config'))
    } else {
      return Promise.resolve(Backend[getters.getCurrentStorageConfig.id])
    }
  }
}

export default {
  state,
  actions
}
