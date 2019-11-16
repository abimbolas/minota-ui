import Workspace from '@/models/workspace'

export default class Itemspace extends Workspace {
  getById (type, id) {
    return this[type][id]
  }

  //
  // Implementation
  //

  _addTo (type, obj) {
    this[type][obj.id] = obj
  }

  _removeFrom (type, obj) {
    delete this[type][obj.id]
  }

  _replaceIn (type, obj) {
    this[type][obj.id] = obj
  }

  _clear (type) {
    for (let key in this[type]) {
      delete this[type][key]
    }
  }

  _isIn (type, obj) {
    return this[type][obj.id]
  }

  _search (type, obj) {
    return this[type][obj.id]
  }

  _move (from, to, obj) {
    if (obj) {
      this._removeFrom(from, obj)
      this._addTo(to, obj)
    } else {
      for (let key in this[from]) {
        this[to][key] = this[from][key]
        delete this[from][key]
      }
    }
  }
}
