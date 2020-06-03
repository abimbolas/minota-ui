import axios from 'axios'
import Note from '@/models/note'

export default class Backend {
  constructor ({ baseURL }) {
    this.resource = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
  }

  getNotes () {
    return this.resource
      .get('/notes')
      .then(this._parseNotes)
  }

  postNote (note) {
    return this.resource
      .post(`/notes/${note.id}`, note)
      .then(this._parseNote)
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
    return Promise.resolve(response.data.map(note => new Note(note)))
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
