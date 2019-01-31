const state = {
  view: 'table'
}

const getters = {
  getView: state => state.view
}

const mutations = {
  setView (state, payload) {
    state.view = payload.view
  }
}

export default {
  state,
  getters,
  mutations
}
