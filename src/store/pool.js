import { topicDelimiter } from '@/store/ui'
import { extractItems } from '@/models/group'
const state = {
  orderBy: 'date',
  orderAsc: false
}

const getters = {
  getOrderBy: state => state.orderBy,
  getOrderAsc: state => state.orderAsc
}

const mutations = {
  addToPool: () => {},
  clearPool: () => {},
  removeFromPool: () => {},
  setOrderBy (state, payload) {
    state.orderBy = payload.orderBy
  },
  setOrderAsc (state, payload) {
    state.orderAsc = payload.orderAsc
  }
}

const actions = {
  loadPoolAction (context, payload = {}) {
    context.dispatch('getNotesAction').then(notes => {
      context.commit('clearPool')
      context.commit('addToPool', {
        notes: (payload.topic ? notes.filter(note => {
          return note.topic.match(new RegExp(`^${payload.topic}`))
        }) : notes),
        depth: payload.topic.split(topicDelimiter).filter(item => item).length
      })
    })
  },
  removeFromPoolAction (context, payload = {}) {
    context.commit('removeFromPool', payload)
    const notes = extractItems(payload.items)
    return context.dispatch('deleteNotesAction', { notes })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
