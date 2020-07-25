import uuid from 'uuid/v1'

export default class Note {
  constructor ({ content = '', config } = {}) {
    this.content = content
    this.config = Object.assign({
      id: uuid()
    }, config)
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
