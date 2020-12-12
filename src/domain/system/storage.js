import FileStorage from '@/domain/system/storage/file'

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
    'file:///Users/antivitla/Projects/Personal/Minota/.minota-003'
  )

  storage.getNote().then(note => {
    store.commit('note/sync', note)
  })

  // storage.getNotes().then(notes => {
  //   console.log('getNotes', notes)
  // }).catch(error => {
  //   console.warn('getNotes error', error)
  // })

  store.subscribe((mutation, state) => {
    if (mutation.type === 'note/update') {
      debounce(mutation.type, () => {
        storage.postNote(
          Object.assign(state['note'].note, mutation.payload)
        )
      })
    }
  })
}
