import Vue from 'vue'
import Vuex from 'vuex'
import isElectron from '@/utils/is-electron'
import createPersistedState from 'vuex-persistedstate'
// Store modules
import actions from './actions'
import context from './context'
import editor from './editor'
import i18n from './i18n'
import modal from './modal'
import notespace from './notespace'
import placeholder from './placeholder'
import pool from './pool'
import storageConfig from './storage-config'
import table from './table'
import ui from './ui'
// Plugins
import backendPlugin from './plugins/backend-plugin'
import tablePlugin from './plugins/table-plugin'
import poolPlugin from './plugins/pool-plugin'

Vue.use(Vuex)

// Persist to localStorage or .json file on disk,
// depending on whether we are in browser or Electron environment
let appStorage
if (isElectron()) {
  const ElectronStore = require('electron-store')
  appStorage = new ElectronStore()
} else {
  appStorage = localStorage
}

// List of modules to persist. Module's state may have custom classes with
// behavior, and since we persist only as JSON objects, class info is lost.
// We provide special mutations (as string values), in which we can instantiate all required
// classes and do other init stuff. We will call all these mutations during
// app's init phase (check App.vue's 'created' hook)
export const persistedModules = {
  'table': 'recreateTableState',
  'pool': 'recreatePoolState',
  'storageConfig': 'recreateStorageConfigState'
}

export default new Vuex.Store({
  strict: true,
  modules: {
    actions,
    context,
    editor,
    i18n,
    modal,
    notespace,
    placeholder,
    pool,
    storageConfig,
    table,
    ui
  },
  plugins: [
    backendPlugin,
    tablePlugin,
    poolPlugin,
    createPersistedState({
      key: 'minota-store',
      storage: appStorage,
      paths: Object.keys(persistedModules)
    })
  ]
})
