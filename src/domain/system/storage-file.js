import axios from 'axios'
import StorageInterface from '@/domain/system/storage-interface'
import { Note } from '@/domain/user/note'

export default class FileStorage extends StorageInterface {
  constructor(url) {
    super(url)
    this.resource = axios.create({
      baseURL: 'http://localhost:54321',
      headers: {
        'Content-Type': 'application/json',
        'Storage-Config': JSON.stringify({ url })
      }
    })
  }

  getNote (id) {
    return this.resource
      .get(`/notes/${id}`)
      .then(this._parseNote.bind(this))
  }

  getNotes () {
    return this.resource
      .get('/notes')
      .then(this._parseNotes.bind(this))
  }

  postNote (note) {
    return this.resource
      .post(`/notes/${note.id}`, note)
      .then(this._parseNote.bind(this))
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
}
