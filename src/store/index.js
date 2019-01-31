import Vue from 'vue'
import Vuex from 'vuex'
import archive from './archive'
import editor from './editor'
import table from './table'
import ui from './ui'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    archive,
    editor,
    table,
    ui
  }
})
