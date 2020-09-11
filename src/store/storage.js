import StorageManager from '@/logic/storage-manager'

export const storageManager = new StorageManager()

export default {
  state: {
    nodes: []
  },

  getters: {
    storageNodes: state => state.nodes
  },

  mutations: {
    rehydrateStorageNodes (state) {
      state.nodes = state.nodes.filter(node => node).map(data => {
        try {
          storageManager.addStorage(data.url)
          return {
            url: data.url,
            enabled: data.enabled
          }
        } catch (error) {
          console.warn(`Invalid Storage Node ${data}`)
          return {
            url: '(Invalid Storage Node)' + data.url,
            enabled: false
          }
        }
      })
    },

    addStorage (state, payload) {
      state.nodes.push(Object.assign({}, {
        enabled: true
      }, payload))
    },

    removeStorage (state, payload) {
      let index = state.nodes.findIndex(node => node.url === payload.url)
      state.nodes.splice(index, 1)
    }
  },

  actions: {
    async addStorageAction ({ commit }, payload) {
      storageManager.addStorage(payload.url)
      commit('addStorage', payload)
      storageManager.getStorage(payload.url).getNotes().then(notes => {
        console.log('get notes from freshly added storage', notes)
      })
    },

    async removeStorageAction ({ commit }, payload) {
      storageManager.removeStorage(payload.url)
      commit('removeStorage', payload)
    }
  }
}
