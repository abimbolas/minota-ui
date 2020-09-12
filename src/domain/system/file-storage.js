import axios from 'axios'
import Note from '@/domain/user/note'
import AbstractStorage from './abstract-storage'

export default class FileStorage extends AbstractStorage {
  constructor (url) {
    super(url)
    this.resource = axios.create({
      baseURL: 'http://localhost:1234',
      headers: {
        'Content-Type': 'application/json',
        'Storage-Config': JSON.stringify({ url })
      }
    })
  }

  getNotes () {
    return this.resource
      .get('/notes')
      .then(this._parseNotes.bind(this))
  }

  postNote (note) {
    if (note.config.storage.indexOf(this.url) > -1) {
      return this.resource
        .post(`/notes/${note.id}`, this.forgetStorage(note))
        .then(this._parseNote.bind(this))
    } else {
      return Promise.reject(new Error(
        'postNote can\'t store not related note ' +
        note.config.storage +
        ' to our storage ' + this.url
      ))
    }
  }

  deleteNote (note) {
    return this.resource
      .delete(`/notes/${note.id}`)
      .then(this._parseSuccess)
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
      response.data.map(note => new Note(this.rememberStorage(note)))
    )
  }

  _parseNote (response) {
    return Promise.resolve(
      new Note(this.rememberStorage(Array.isArray(response.data) ? response.data[0] : response.data))
    )
  }

  _parseSuccess (response) {
    return Promise.resolve(response.data)
  }
}
