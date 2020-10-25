import uuid from 'uuid/v4'

export class Note {
  constructor ({ content = '', config } = {}) {
    this.content = content
    this.config = Object.assign({
      id: uuid(),
      date: new Date()
    }, config)

    // Setup date
    this.config.date = new Date(this.config.date)
  }

  get id () {
    return this.config.id
  }

  set id (id) {
    this.config.id = id
  }
}
