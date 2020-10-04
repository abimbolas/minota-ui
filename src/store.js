import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

// Sytem
// import notesPlugin from '@/domain/system/notes-plugin'
// import storagePlugin from '@/domain/system/storage-plugin'
// UI
// import modal from '@/domain/ui/modal'
// User
import storage from '@/domain/user/storage'
import table from '@/domain/user/table'
// import mind from '@/domain/user/mind'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  state: {
    ...storage.state,
    ...table.state
  },

  // getters: {
  //   // ...table.getters
  // },

  mutations: {
    ...storage.mutations
  },

  actions: {
    ...table.actions
  }

  // modules: {
  //   mind,
  //   modal,
  //   storage
  // }

  // plugins: [
  //   storagePlugin,
  //   notesPlugin,
  //   createPersistedState({
  //     key: 'minota-store',
  //     storage: localStorage,
  //     // paths: ['table', 'storage.nodes'],
  //     rehydrated (store) {
  //       // store.commit('rehydrateStorageNodes')
  //       // store.commit('rehydrateTable')
  //     }
  //   })
  // ]
})
