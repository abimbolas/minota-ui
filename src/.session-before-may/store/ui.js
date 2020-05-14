export const topicDelimiter = ' / '

const state = {
  focusMode: 'edit'
}

const getters = {
  getFocusMode: state => state.focusMode,
  isFocusEdit: state => state.focusMode === 'edit',
  isFocusView: state => state.focusMode === 'view'
}

const mutations = {
  setFocusView (state) {
    state.focusMode = 'view'
  },
  setFocusEdit (state) {
    state.focusMode = 'edit'
  }
}

export default {
  state,
  getters,
  mutations
}
