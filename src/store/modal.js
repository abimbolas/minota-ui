export default {
  state: {
    stack: []
  },

  getters: {
    modals: state => state.stack
  },

  mutations: {
    addModal (state, payload) {
      state.stack.push(payload.modal)
    },

    removeModal (state, payload) {
      state.stack.splice(state.stack.indexOf(payload.modal), 1)
    }
  },

  actions: {
    openModalAction (context, payload) {
      const modal = payload.modal
      modal.promise = new Promise((resolve, reject) => {
        modal.resolve = resolve
        modal.reject = reject
      })
      context.commit('addModal', { modal })
      return modal.promise
    },

    resolveModalAction (context, payload) {
      payload.modal.resolve(payload.resolve)
      context.commit('removeModal', payload)
    },

    rejectModalAction (context, payload) {
      payload.modal.reject(payload.reject)
      context.commit('removeModal', payload)
    }
  }
}
