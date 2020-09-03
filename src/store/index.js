import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import modal from '@/store/modal'
import storage from '@/store/storage'
import table from '@/store/table'
import zoom from '@/store/zoom'

Vue.use(Vuex)

// const Table = new Workspace()

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    ...table.state,
    ...zoom.state
  },

  getters: {
    ...table.getters,
    ...zoom.getters
  },

  mutations: {
    ...table.mutations,
    ...zoom.mutations
  },

  modules: {
    modal,
    storage
  },

  plugins: [
    createPersistedState({
      key: 'minota-store',
      storage: localStorage,
      paths: ['table', 'storage.nodes'],
      rehydrated (store) {
        store.commit('rehydrateTable')
      }
    })
  ]
})
