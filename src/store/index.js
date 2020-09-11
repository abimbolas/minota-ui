import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import modal from '@/store/modal'
import notespace from '@/store/notespace'
import storage from '@/store/storage'
import storagePlugin from '@/store/plugins/storage-plugin'
import table from '@/store/table'

Vue.use(Vuex)

// const Table = new Workspace()
console.log(notespace)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    // ...notespace.state,
    ...table.state
  },

  getters: {
    ...table.getters
  },

  mutations: {
    // ...notespace.mutations,
    ...table.mutations
  },

  modules: {
    modal,
    notespace,
    storage
  },

  plugins: [
    storagePlugin,
    createPersistedState({
      key: 'minota-store',
      storage: localStorage,
      paths: ['table', 'storage.nodes'],
      rehydrated (store) {
        store.commit('rehydrateTable')
        store.commit('rehydrateStorageNodes')
      }
    })
  ]
})
