/* eslint-disable brace-style, padded-blocks */
import FileStorage from '@/domain/system/storage/file'
import { Note } from '@/domain/user/note'

const timeouts = {}
function debounce (type, callback, delay = 300) {
  clearTimeout(timeouts[type])
  timeouts[type] = setTimeout(callback, delay)
}

//
// Vuex Plugin
//

export default function (store) {
  const storage = new FileStorage(
    'file:///Users/antivitla/Projects/Personal/Minota/.minota'
  )

  Promise.all([
    // 1. Get Module:Note
    storage.getNote().then(note => {
      store.commit('note/sync', note)
    }).catch(error => {
      if (error.status === 404) {
        store.commit('note/sync', new Note())
      }
    }),

    // 2. Get Module:Notepad
    storage.getNotes().then(notes => {
      store.commit('notepad/sync', notes.sort((a, b) => a.date - b.date))
    })
  ]).then(() => {

    // Upgrade Module:Note to Module:Notepad
    const focusedNote = store.state['note'].note
    if (!store.getters['notepad/noteById'](focusedNote.id)) {
      store.commit('notepad/add', focusedNote)
      storage.postNotes([focusedNote])
    }
  })

  store.subscribe((mutation, state) => {

    //
    // Module:Note
    //

    if (mutation.type === 'note/update') {
      debounce(mutation.type, () => {
        const note = state['note'].note
        // Update single Module:Note
        storage.postNote(note)
        // Update relevant Modules:Notepad note
        storage.postNotes([note])
      })
    }

    else if (mutation.type === 'note/replace') {
      storage.postNote(store.state['note'].note)
    }

    //
    // Module:Notepad
    //

    else if (mutation.type === 'notepad/update') {
      const note = store.getters['notepad/noteById'](mutation.payload.id)
      const focusedNote = store.state['note'].note
      // If updating focused note, redirect to 'note/update'
      if (note.id === focusedNote.id) {
        // Update both Module:Note and Module:Notepad in redirect
        store.commit('note/update', note)
      } else {
        // Update Module:Notepad only
        debounce(`${mutation.type}${mutation.payload.id}`, () => {
          storage.postNotes([note])
        })
      }
    }

    else if (mutation.type === 'notepad/delete') {
      storage.deleteNotes(
        Array.isArray(mutation.payload)
          ? mutation.payload
          : [mutation.payload]
      )
    }
  })
}
