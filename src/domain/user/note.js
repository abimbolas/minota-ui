import uuid from 'uuid/v1' // time-based

export class Note {
  constructor ({ content = '', config = {} } = {}) {
    this.content = content

    this.config = {
      id: uuid(),
      date: new Date(),
      ...config
    }

    console.log('note', this.config, config)

    this.config.date = new Date(this.config.date)
  }

  get id () {
    return this.config.id
  }

  set id (id) {
    this.config.id = id
  }

  get date () {
    return this.config.date
  }

  set date (date) {
    this.config.date = new Date(date)
  }
}

//
// Store
//

export default {
  namespaced: true,
  state: {
    note: new Note()
  },
  mutations: {
    update (state, { content }) {
      state.note.content = content
    },
    sync (state, note) {
      state.note = note
    }
  }
}
