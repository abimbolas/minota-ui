import uuid from 'uuid/v1'

export default class Note {
  constructor ({ content = '', config = {} } = {}) {
    this.content = content
    this.config = {
      id: uuid(),
      date: new Date()
    }
    this.merge({ config })
  }

  get topic () {
    return this.config.topic || ''
  }

  clone () {
    const note = JSON.parse(JSON.stringify({
      content: this.content,
      config: this.config
    }))
    note.config.date = new Date(note.config.date)
    return note
  }

  merge (...notes) {
    notes.forEach(note => {
      if (typeof note.content === 'string') {
        this.content = note.content
      }
      if (typeof note.config === 'object') {
        this.config = this.config || {}
        Object.keys(note.config).forEach(key => {
          if (key === 'date') {
            this.config.date = new Date(note.config.date)
          } else {
            this.config[key] = note.config[key]
          }
        })
      }
    })
  }
}
