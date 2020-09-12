import StorageManager from './storage-manager'
import storageActions from '@/domain/user/storage-actions'

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
      let nodes = {}
      state.nodes = state.nodes
        .filter(node => node)
        .map(data => ({
          url: data.url,
          enabled: Boolean(data.enabled)
        }))
        // Remove duplicates
        .filter(node => {
          if (!nodes[node.url]) {
            nodes[node.url] = true
            return true
          }
        })
    },

    addStorage (state, payload) {
      // Do not add duplicates
      if (!state.nodes.find(node => node.url === payload.url)) {
        state.nodes.push(Object.assign({}, {
          enabled: true
        }, payload))
      } else {
        console.warn('addStorage attempted to add duplicate')
      }
    },

    removeStorage (state, payload) {
      state.nodes = state.nodes.filter(node => node.url === payload.url)
    }
  },

  actions: {
    ...storageActions
  }
}
