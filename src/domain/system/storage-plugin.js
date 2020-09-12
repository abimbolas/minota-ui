import { storageManager } from './storage'

function initStorageNode (store, node) {
  storageManager.addStorage(node.url).getNotes().then(notes => {
    console.log('setNotes', notes.length)
  }).catch(error => {
    console.warn('BE', error)
  })
}

export default function (store) {
  const mutations = {
    rehydrateStorageNodes (state) {
      state.storage.nodes.forEach(node => {
        try {
          initStorageNode(store, node)
        } catch (error) {
          console.warn('rehydrate storage failed:', node)
        }
      })
    }
  }

  const actions = {
    addStorageAction (state, payload) {
      try {
        initStorageNode(store, payload)
        store.commit('addStorage', payload)
      } catch (error) {
        console.warn('add storage failed:', error)
      }
    },
    removeStorageAction (state, payload) {
      storageManager.removeStorage(payload.url)
      store.commit('removeStorage', payload)
    }
  }

  store.subscribe((mutation, state) => {
    mutations[mutation.type] && mutations[mutation.type](state, mutation.payload)
  })

  store.subscribeAction((action, state) => {
    actions[action.type] && actions[action.type](state, action.payload)
  })
}
