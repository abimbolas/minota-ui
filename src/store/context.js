import $router from '@/router'
import { topicDelimiter } from '@/store/ui'

const state = {
  context: ''
}

const getters = {
  getContext: state => state.context,
  getContextArray: state => state.context
    .split(topicDelimiter)
    .filter(item => item)
}

const mutations = {
  setContext (state, payload) {
    state.context = payload.context
  },
  appendContext (state, payload) {
    state.context = (state.context ? state.context + topicDelimiter : '') + payload.context
  },
  clearContext (state) {
    state.context = ''
  }
}

const actions = {
  openContextAction (context, payload) {
    context.commit('appendContext', payload)
    $router.push(`/notes?topic=${context.getters.getContext}`)
  },
  syncContextAction (context, payload) {
    if (payload.context !== context.getters.getContext) {
      context.commit(payload.context ? 'setContext' : 'clearContext', payload)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
