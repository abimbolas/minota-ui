import axios from 'axios'
import BackendAPI from './api'
import Note from '@/models/note'

export default class ServerBackend extends BackendAPI {
  constructor ({ baseURL }) {
    super()
    this.resource = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
  }

  onReady (callback) {
    this._onReady.then(callback)
  }

  getNotes () {
    return this.resource.get('/notes/all')
      .then(this.parseNotes)
  }

  getNote (id) {
    return this.resource.get(`/notes/${id}`)
      .then(this.parseNote)
      .catch(this.parseError)
  }

  postNote (note) {
    return this.resource.post(`/notes/${note.config.id}`, note)
      .then(this.parseNote)
  }

  deleteNote (note) {
    return this.resource.delete(`/notes/${note.config.id}`)
      .then(this.parseSuccessResponse)
  }

  parseNotes (response) {
    return Promise.resolve(response.data.map(note => new Note(note)))
  }

  parseNote (response) {
    return Promise.resolve(new Note(response.data))
  }

  parseSuccessResponse (response) {
    return Promise.resolve(response.data)
  }

  parseError (error) {
    return Promise.reject(error.response)
  }

  init () {
    this._onReady = new Promise(resolve => {
      resolve()
    })
    return this._onReady
  }

  destroy () {
    return new Promise(resolve => {
      this.resource = null
      resolve()
    })
  }
}
