import uuid from 'uuid/v1'

export default class Note {
  constructor ({ content = '', config } = {}) {
    this.content = content
    this.config = Object.assign({
      id: uuid()
    }, config)

    // Setup date
    if (!this.config.date) {
      this.config.date = new Date()
    } else {
      this.config.date = new Date(this.config.date)
    }
    if (this.config.updated) {
      this.config.updated = new Date(this.config.updated)
    }
  }

  get id () {
    return this.config.id
  }

  set id (id) {
    this.config.id = id
  }

  syncWith (note) {
    return note.config.updated < this.config.updated ? this : note
  }
}
