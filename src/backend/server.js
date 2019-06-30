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
    console.log(baseURL)
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
  }

  parseNotes (response) {
    return response.data.map(note => new Note(note))
  }

  parseNote (response) {
    return Promise.resolve(new Note(response.data[0]))
  }

  init () {
    this._onReady = new Promise(resolve => {
      console.log('Server Backend resolved init')
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
