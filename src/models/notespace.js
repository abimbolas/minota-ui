import Workspace from '@/models/workspace'

export default class Notespace extends Workspace {
  getById (type, id) {
    return this[type].find(item => item.config.id === id)
  }

  _search (type, note) {
    let id = this[type].indexOf(note)
    if (id < 0) {
      id = this[type].findIndex(item => item.config.id === note.config.id)
    }
    return id
  }
}
