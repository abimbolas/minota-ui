import Vue from 'vue'
import Vuex from 'vuex'
import { isElectron } from '@/utils/is-electron'
import createPersistedState from 'vuex-persistedstate'
// Store modules
import archive from './archive'
import editor from './editor'
import modal from './modal'
import placeholder from './placeholder'
import storageConfig from './storage-config'
import table from './table'
import ui from './ui'
// Plugins
import backendPlugin from './plugins/backend-plugin'

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

export default new Vuex.Store({
  strict: true,
  modules: {
    archive,
    editor,
    modal,
    placeholder,
    storageConfig,
    table,
    ui
  },
  plugins: [
    backendPlugin,
    createPersistedState({
      key: 'minota-store',
      paths: [
        'storageConfig'
      ],
      storage: appStorage
    })
  ]
})
