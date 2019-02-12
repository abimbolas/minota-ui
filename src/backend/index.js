import axios from 'axios'
import Note from '@/models/note'

class Backend {
  constructor () {
    this.resource = axios.create({
      baseURL: 'http://192.168.1.101:7654',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
  }

  getAllNotes () {
    return this.resource.get('/notes/all')
      .then(this.parseNotes)
  }

  getNoteById (id) {
    return this.resource.get(`/notes/${id}`)
      .then(this.parseNote)
  }

  saveNote (note) {
    return this.resource.post(`/notes/${note.config.id}`, note)
      .then(this.parseNote)
  }

  saveNotes (notes) {
    return this.resource.post(`/notes`, notes)
      .then(this.parseNotes)
  }

  deleteNote (note) {
    return this.resource.delete(`/notes/${note.config.id}`)
      .then(this.parseSuccessResponse)
  }

  deleteNotes (notes) {
    return this.resource.delete(`/notes`, { data: notes })
      .then(this.parseSuccessResponse)
  }

  parseSuccessResponse (response) {
    return response.data
  }

  parseNotes (response) {
    return response.data.map(item => new Note(item))
  }

  parseNote (response) {
    return new Note(response.data[0])
  }
}

export default new Backend()
