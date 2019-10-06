import { topicDelimiter } from '@/store/ui'
const state = {}

const mutations = {
  addToPool: () => {},
  clearPool: () => {}
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
  }
}

export default {
  state,
  mutations,
  actions
}
