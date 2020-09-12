import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import modal from '@/domain/ui/modal'
import storage from '@/domain/system/storage'
import storagePlugin from '@/domain/system/storage-plugin'
import table from '@/domain/user/table'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    ...table.state
  },

  getters: {
    ...table.getters
  },

  mutations: {
    ...table.mutations
  },

  modules: {
    modal,
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
