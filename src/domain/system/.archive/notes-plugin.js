import NotesManager from './notes-manager'
import { storageManager } from './storage-plugin'

export const notesManager = new NotesManager()

export default function (store) {
  const mutations = {
    rehydrateStorageNodes (state) {
      state.storage.nodes.forEach(node => {
        try {
          storageManager.getStorage(node.url).getNotes().then(notes => {
            notesManager.setNotes(notes)
          }).catch(error => {
            console.warn(`Get notes from ${node.url} failed`, error)
          })
        } catch (error) {
          console.warn(error)
        }
      })
    },

    addStorage (state, payload) {
      try {
        storageManager.getStorage(payload.url).getNotes().then(notes => {
          notesManager.setNotes(notes)
        }).catch(error => {
          console.warn(`Get notes from ${payload.url} failed`, error)
        })
      } catch (error) {
        console.warn(error)
      }
    }
  }

  store.subscribe((mutation, state) => {
    mutations[mutation.type] && mutations[mutation.type](state, mutation.payload)
  })
}
