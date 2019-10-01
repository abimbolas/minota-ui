import uuid from 'uuid/v1'

export default class Note {
  constructor ({ content = '', config = {} } = {}) {
    this.config = {
      id: uuid(),
      date: new Date()
    }
    this.editableContent = content // initially parses content with topic
    this.merge({ config }) // overwrites topic, if present
  }

  set topic (topic) {
    this.config.topic = topic
  }

  get topic () {
    return this.config.topic
  }

  get editableContent () {
    if (this.topic) {
      return [
        `# ${this.topic}`,
        '',
        this.content
      ].join('\n')
    } else {
      return this.content
    }
  }

  set editableContent (content) {
    const lines = content.split('\n')
    // Extract topic from first line
    const topic = lines[0].trim().split(/^#\s*/)[1]
    if (topic) {
      this.topic = topic
      this.content = lines.slice(1).join('\n').trim()
    } else {
      this.content = content
    }
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
