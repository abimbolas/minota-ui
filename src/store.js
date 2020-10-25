import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Sytem
// import notesPlugin from '@/domain/system/notes-plugin'
// import storagePlugin from '@/domain/system/storage-plugin'
// UI
// import modal from '@/domain/ui/modal'
// User
import storage from '@/domain/user/storage'
// import table from '@/domain/user/table'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    storage
  }
  // plugins: [
  //   storagePlugin,
  //   createPersistedState({
  //     key: 'minota-store',
  //     storage: localStorage,
  //     paths: ['storage.storage'],
  //     rehydrated (store) {
  //       store.commit('loadStorage')
  //       // store.commit('rehydrateStorageNodes')
  //       // store.commit('rehydrateTable')
  //     }
  //   })
  // ]
})
