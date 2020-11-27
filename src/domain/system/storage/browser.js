import PersistentStorage from '@/domain/system/storage/persistent'
import { Note } from '@/domain/user/note'

export default class BrowserStorage extends PersistentStorage {
  //
  // Module: Note
  //
  getNote () {
    const note = this._model.note
    if (note) {
      return Promise.resolve(new Note(note))
    } else {
      return Promise.reject(this._errorNotFound('Note not found'))
    }
  }

  postNote (note) {
    this._model = Object.assign(this._model, { note })
  }

  //
  // Module: Iterable Notes
  //

  // getNotes () {
  //   try {
  //     return Promise.resolve(this._notesList.map(note => new Note(note)))
  //   } catch (error) {
  //     return Promise.reject(this._errorCommon(error))
  //   }
  // }

  // deleteNote (note) {
  //   try {
  //     const map = this._notesMap
  //     delete map[note.id]
  //     this._notesMap = map
  //     return Promise.resolve()
  //   } catch (error) {
  //     return Promise.reject(this._errorCommon(error))
  //   }
  // }

  // deleteNotes (notes) {
  //   try {
  //     const map = this._notesMap
  //     notes.forEach(note => {
  //       delete map[note.id]
  //     })
  //     this._notesMap = map
  //     return Promise.resolve()
  //   } catch (error) {
  //     return Promise.reject(this._errorCommon(error))
  //   }
  // }

  // get _note () {
  //   return JSON.parse(localStorage.getItem(this._noteKey))
  // }
  //
  // get _notesMap () {
  //   let map = JSON.parse(localStorage.getItem(this._notesMapKey)) || {}
  //   Object.keys(map).forEach(key => {
  //     map[key] = new Note(map[key])
  //   })
  //   return map
  // }
  //
  // set _notesMap (map) {
  //   localStorage.setItem(this._notesMapKey, JSON.stringify(map))
  // }
  //
  // get _notesList () {
  //   return Object.values(this._notesMap)
  // }
  //
  // get _noteKey () {
  //   return `${this._safePathname}/note`
  // }
  //
  // get _notesMapKey () {
  //   return `${this._safePathname}/notes`
  // }

  get _model () {
    return JSON.parse(localStorage.getItem(this._pathname)) || {}
  }

  set _model (model) {
    localStorage.setItem(this._pathname, JSON.stringify(model))
  }

  get _pathname () {
    return this.pathname.replace(/\/$/, '')
  }

  _errorNotFound (message) {
    return Object.assign(new Error(message), {
      data: message,
      status: 404,
      statusText: 'Not Found Error'
    })
  }

  _errorCommon (error) {
    return Object.assign(new Error(error.message), {
      data: error.message,
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
