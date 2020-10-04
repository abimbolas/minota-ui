import StorageManager from './storage-manager'

export const storageManager = new StorageManager()

export default function (store) {
  const mutations = {
    rehydrateStorageNodes (state) {
      state.storage.nodes.forEach(node => {
        try {
          storageManager.addStorage(node.url)
        } catch (error) {
          console.warn(node)
        }
      })
    }
  }

  const actions = {
    addStorageAction (state, payload) {
      try {
        storageManager.addStorage(payload.url)
        store.commit('addStorage', payload)
      } catch (error) {
        console.warn(error)
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
