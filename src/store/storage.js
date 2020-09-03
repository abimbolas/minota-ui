import Vue from 'vue'
// import Note from '@/models/note'
import FileStorage from '@/backend/file'

const updateTimeout = {}

const Type = {
  'file:': FileStorage
}

const Storage = {}

function initStorage (node) {
  try {
    Storage[node.href] = new Type[new URL(node.href).protocol](node.href)
    node.isSupported = true
    return Storage[node.href]
  } catch {
    node.isSupported = false
    console.warn(`storage of type ${new URL(node.href).protocol} is not supported`)
  }
}

function getStorage (node) {
  return Storage[node.href] || initStorage(node)
}

export default {
  state: {
    notes: {},
    nodes: []
  },

  getters: {
    storageNodes: state => state.nodes,
    storageNotes: state => state.notes,
    storageNotesList: state => Object.keys(state.notes).map(key => state.notes[key])
  },

  mutations: {
    addStorage (state, payload) {
      let node = state.nodes.find(node => node.href === payload.href)
      if (!node) {
        node = Object.assign({
          isActive: true,
          isDefault: false
        }, payload)
        state.nodes.push(node)
      } else {
        Object.assign(node, payload)
      }
      if (state.nodes.length === 1) {
        node.isDefault = true
      }
      if (node.isDefault && state.nodes.length > 1) {
        state.nodes.filter(item => item.href !== node.href).forEach(item => {
          item.isDefault = false
        })
      }
      initStorage(node)
    },

    // toggleDefaultStorage (state, payload) {
    //   state.nodes.forEach(node => {
    //     if (node.href === payload.href && node.isSupported) {
    //       node.isDefault = payload.isDefault !== undefined
    //         ? payload.isDefault
    //         : !node.isDefault
    //       node.isActive = node.isDefault || node.isActive
    //     } else {
    //       node.isDefault = false
    //     }
    //   })
    // },

    // toggleActiveStorage (state, payload) {
    //   state.nodes.forEach(node => {
    //     if (node.href === payload.href && node.isSupported) {
    //       node.isActive = payload.isActive !== undefined
    //         ? payload.isActive
    //         : !node.isActive
    //     }
    //   })
    // },

    addNotes (state, payload) {
      let notes = payload.notes || [payload.note]
      notes.forEach(note => {
        Vue.set(
          state.notes,
          note.id,
          state.notes[note.id] ? state.notes[note.id].syncWith(note) : note
        )
      })
    },

    updateNote (state, payload) {
      let note = state.notes[payload.note.id]
      if (typeof payload.update.content === 'string') {
        Vue.set(note, 'content', payload.update.content)
      }
      if (payload.update.config) {
        Object.keys(payload.update.config).forEach(key => {
          Vue.set(note.config, key, payload.update.config[key])
        })
      }
    }
  },

  actions: {
    getNotesAction (context, payload) {
      return Promise.all(context.getters.storageNodes
        .filter(node => node.isSupported && (node.isActive || node.isDefault))
        .map(node => {
          return getStorage(node).getNotes().then(notes => {
            context.commit('addNotes', { notes })
          })
        })
      ).then(() => context.getters.storageNotes)
    },

    updateNoteAction (context, payload) {
      // Add default storage if not preset
      let storage
      try {
        storage = payload.note.config.storage || payload.update.config.storage
      } catch (error) {
        console.warn('No storage to update to', error, payload)
      }
      if (!storage || !storage.length) {
        payload.update.config = {
          ...payload.update.config,
          storage: [context.state.nodes.find(node => node.isDefault).href]
        }
      }
      // Update in storage in memory
      if (!context.state.notes[payload.note.id]) {
        context.commit('addNotes', payload)
      }
      context.commit('updateNote', payload)
      // Save to remove storage, with small debounce
      clearTimeout(updateTimeout[payload.note.id])
      updateTimeout[payload.note.id] = setTimeout(() => {
        const note = context.state.notes[payload.note.id]
        note.config.storage.forEach(href => {
          const node = context.state.nodes.find(node => node.href === href)
          if (node.isActive && node.isSupported) {
            getStorage(node).postNote(note)
          } else {
            console.warn('Storage Node is not supported or inactive', note, node)
          }
        })
      }, 500)
    },

    // deleteNoteAction (context, payload) {
    //   context.dispatch('updateNoteAction', {
    //     note: payload.note,
    //     update: {
    //       config: {
    //         deleted: true
    //       }
    //     }
    //   })
    //   let storage = (
    //     payload.note.config.storage ||
    //     (context.state.notes[payload.note.id] && context.state.notes[payload.note.id].config.storage)
    //   )
    //   if (!storage || !storage.length) {
    //     console.warn('No storage to delete from', payload)
    //   } else {
    //     storage.forEach(href => {
    //       const node = context.state.nodes.find(node => node.href === href)
    //       if (node.isActive && node.isSupported) {
    //         getStorage(node).deleteNote(payload.note)
    //       } else {
    //         console.warn('Storage Node is not supported or inactive', payload.note, node)
    //       }
    //     })
    //   }
    // },

    deleteNotesAction (context, payload) {
      let notes = payload.notes || [payload.note]
      return Promise.all(notes.map(note => {
        return context.dispatch('updateNoteAction', {
          note,
          update: {
            config: {
              deleted: true
            }
          }
        })
      }))
    }
  }
}
