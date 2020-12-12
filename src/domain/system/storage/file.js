import axios from 'axios'
import PersistentStorage from '@/domain/system/storage/persistent'
import { Note } from '@/domain/user/note'

export default class FileStorage extends PersistentStorage {
  constructor (url) {
    super(url)
    this.resource = axios.create({
      baseURL: 'http://localhost:54321',
      headers: {
        'Content-Type': 'application/json',
        'Storage-Config': JSON.stringify({ url })
      }
    })
  }

  // Module: Note

  getNote () {
    return this.resource
      .get('/note')
      .then(this._parseNote)
      .catch(this._parseError)
  }

  postNote (note) {
    return this.resource
      .post('/note', note)
      .then(this._parseNote)
      .catch(this._parseError)
  }

  // Module: Notes

  getNotes () {
    return this.resource
      .get('/notes')
      .then(this._parseNotes)
      .catch(this._parseError)
  }

  postNotes (notes) {
    return this.resource
      .post('/notes', notes)
      .then(this._parseNotes)
      .catch(this._parseError)
  }

  // getNoteById (id) {
  //   return this.resource
  //     .get(`/notes/${id}`)
  //     .then(this._parseNote.bind(this))
  // }

  // postNotes (note) {
  //   return this.resource
  //     .post(`/notes/${note.id}`, note)
  //     .then(this._parseNote.bind(this))
  // }

  deleteNote (note) {
    return this.resource
      .delete(`/notes/${note.id}`)
      .then(this._parseSuccess)
      .catch(this._parseError)
  }

  deleteNotes (notes) {
    return this.resource
      .delete('/notes', {
        params: {
          notes: notes.map(note => note.id)
        }
      })
      .then(this._parseSuccess)
  }

  _parseNotes (response) {
    return Promise.resolve(
      response.data.map(note => new Note(note))
    )
  }

  _parseNote (response) {
    return Promise.resolve(
      new Note(Array.isArray(response.data) ? response.data[0] : response.data)
    )
  }

  _parseSuccess (response) {
    return Promise.resolve(response.data)
  }

  _parseError (error) {
    return Promise.reject(error.response)
  }
}
