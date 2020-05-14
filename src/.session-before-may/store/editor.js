/* eslint-disable no-shadow */

const state = {
  editorFullscreen: false
}

const getters = {
  editorFullscreen: state => state.editorFullscreen
}

const mutations = {
  toggleEditorFullscreen (state, payload) {
    if (payload === undefined) {
      state.editorFullscreen = !state.editorFullscreen
    } else {
      state.editorFullscreen = Boolean(payload)
    }
  }
}

export default {
  state,
  getters,
  mutations
}
