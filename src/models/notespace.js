import uuid from 'uuid/v1'
// import Workspace from './workspace'
import Note from './note'

export default class Notespace {
  constructor ({ notes = [], config = {} } = {}) {
    // Restore notes
    this.notes = notes.map(note => {
      if (!note) {
        return new Note()
      }
      if (note.notes) {
        return new Notespace(note)
      }
      return new Note(note)
    })
    // Config
    this.config = Object.assign({
      date: new Date(),
      id: uuid()
    }, config)
  }

  get id () {
    return this.config.id
  }

  set id (id) {
    this.config.id = id
  }

  get content () {
    return this.notes.map(note => `[${note.config.storage[0]}/${note.id}]`).join('\n')
  }

  get topic () {
    return 'Notespace Topic'
  }

  set topic (topic) {
    this.config.topic = topic
  }
}

// export class Notespace extends Workspace {
//   constructor ({ focus = [], blur = [], content = '', config } = {}) {
//     super({ focus, blur })
//     this.content = content
//     this.config = Object.assign({
//       id: uuid()
//     }, config)
//   }
//
//   get id () {
//     return this.config.id
//   }
//
//   set id (id) {
//     this.config.id = id
//   }
//
//   update ({ content = null, config = null } = {}) {
//     if (content !== null) {
//       this.content = content
//     }
//     if (config !== null) {
//       this.config = Object.assign(this.config, config)
//     }
//   }
// }
