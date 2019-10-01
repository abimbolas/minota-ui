const state = {
  context: ''
}

const getters = {
  context: state => state.context
}

const mutations = {
  setContext (state, payload) {
    state.context = payload.context
  }
}

export default {
  state,
  getters,
  mutations
}
