import Vue from 'vue';
import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate'

import note from '@/domain/user/note';
import notepad from '@/domain/user/notepad';
import notebook from '@/domain/user/notebook';
import storage from '@/domain/system/storage';
import modal from '@/domain/ui/modal';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    note,
    notepad,
    notebook,
    modal
  },
  plugins: [storage]
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
});
