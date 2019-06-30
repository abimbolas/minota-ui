const state = {
  list: []
}

const getters = {
  getModalsList: state => state.list
}

const mutations = {
  addModal (state, payload) {
    state.list.push(payload.modal)
  },
  removeModal (state, payload) {
    state.list.splice(state.list.indexOf(payload.modal), 1)
  }
}

const actions = {
  openModalAction (context, payload) {
    const modal = payload.modal
    modal.promise = new Promise((resolve, reject) => {
      modal._resolve = resolve
      modal._reject = reject
    })
    context.commit('addModal', { modal })
    return modal.promise
  },

  resolveModalAction (context, payload) {
    payload.modal._resolve(payload.resolve)
    context.commit('removeModal', payload)
  },

  rejectModalAction (context, payload) {
    payload.modal._reject(payload.reject)
    context.commit('removeModal', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
