import uuid from 'uuid/v1'
import GroupItemInterface from '@/models/group-item'
import { topicDelimiter } from '@/store/ui'

export default class Note extends GroupItemInterface {
  constructor ({ content = '', config = {} } = {}) {
    super()
    this.config = {
      id: uuid(),
      date: new Date(),
      topic: '',
      pinned: false
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
    const lines = content.replace(/^\s+/, '').split('\n')
    const topic = lines[0].trim().split(/^#\s+/)[1]
    this.topic = topic || ''
    this.content = lines
      .slice(topic ? 1 : 0)
      .join('\n')
      .replace(/^\s+/, '')
  }

  clone () {
    const note = new Note(JSON.parse(JSON.stringify({
      content: this.content,
      config: this.config
    })))
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

  // Group Item Interface

  get id () {
    return this.config.id
  }

  get key () {
    return this.config.id
  }

  get leaf () {
    return this
  }

  get path () {
    return this.config.topic.split(topicDelimiter)
  }
}
