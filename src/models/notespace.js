import Workspace from '@/models/workspace'

export default class Notespace extends Workspace {
  _search (type, note) {
    // search by reference
    let id = this[type].indexOf(note)
    // search by id
    if (id < 0) {
      id = this[type].findIndex(item => item.id === note.id)
    }
    return id
  }
}
