// import FileStorage from '@/domain/system/storage/file'
import BrowserStorage from '@/domain/system/storage/browser'
import { Note } from '@/domain/user/note'

export class Storage extends Map {
  add (note) {
    let duplicate = this.get(note.id)
    if (duplicate) {
      console.warn(`Storage: note ${duplicate.id} duplicate, ignoring`)
    } else {
      this.set(note.id, note)
    }
  }

  update (id, update) {
    let target = this.get(id)
    if (!target) {
      console.warn(`Storage: note ${id} not found, ignoring`)
    } else {
      if ('content' in update) {
        target.content = update.content
      }
      // if ('config' in update) {
      //   delete update.config.id // just in case
      //   Object.assign(target.config, update.config)
      // }
      // target.config.updated = new Date()
    }
  }
}

// const defaultStorage = new FileStorage('file://minota/antivitla')
const defaultStorage = new BrowserStorage('browser://minota/antivitla')

export default {
  state: {
    storage: new Storage()
  },
  getters: {
    getNote: state => id => state.storage.get(id)
  },
  mutations: {
    addNote ({ storage }, { id, content }) {
      storage.add(new Note({
        content,
        config: { id }
      }))
      // console.group('addNote')
      // console.log(storage.get(id))
      // console.groupEnd()
    },
    updateNote ({ storage }, { id, content }) {
      storage.update(id, { content })
      // console.group('updateNote')
      // console.log(storage.get(id))
      // console.groupEnd()
    }
  },
  actions: {
    getNoteAction ({ commit, getters }, { id }) {
      return defaultStorage
        .getNote(id)
        .then(note => {
          if (!getters.getNote(note.id)) {
            commit('addNote', note)
          }
          return Promise.resolve(note)
        })
        .catch(error => {
          // console.group('getNoteAction')
          // console.error(error)
          // console.groupEnd()
          return Promise.reject(error.response)
        })
    },
    getNotesAction ({ getters, commit }) {
      return defaultStorage
        .getNotes()
        .then(notes => {
          notes.forEach(note => {
            if (!getters.getNote(note.id)) {
              commit('addNote', note)
            }
          })
          return Promise.resolve(notes)
        })
        .catch(error => {
          return Promise.reject(error.response)
        })
    },
    updateNoteAction ({ getters, commit }, { id, content }) {
      if (getters.getNote(id)) {
        commit('updateNote', { id, content })
      } else {
        commit('addNote', { id, content })
      }
      return defaultStorage
        .postNote(getters.getNote(id))
        .catch(error => {
          // console.group('updateNoteAction')
          // console.error(error)
          // console.groupEnd()
          return Promise.reject(error.response)
        })
    },
    createNoteAction ({ getters, commit }) {
      let note = new Note()
      commit('addNote', note)
      return Promise.resolve(note)
    }
  }
}
