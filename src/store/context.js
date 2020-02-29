import $router from '@/router'
// import { topicDelimiter } from '@/store/ui'
export const topicDelimiter = ' / '

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
    state.context = appendContextUtil(state.context, payload.context)
  },
  popContext () {
    state.context = popContextUtil(state.context)
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

export function cleanPathUtil (src) {
  return src.split(topicDelimiter).filter(i => i)
}

export function appendContextUtil (src, target) {
  return (cleanPathUtil(src || ''))
    .concat(cleanPathUtil(target || ''))
    .join(topicDelimiter)
}

export function popContextUtil (src) {
  return src.split(topicDelimiter).slice(0, -1).join(topicDelimiter)
}

export function contextLengthUtil (context) {
  return context.split(topicDelimiter).filter(item => item).length
}

export function topicInContextUtil (topic, context) {
  // If root (empty) context, any topic is in it. Otherwise compare.
  if (!context) {
    return true
  } else {
    const topicPath = topic.split(topicDelimiter)
    const contextPath = context.split(topicDelimiter)
    return contextPath.every((key, index) => key === topicPath[index])
  }
}
