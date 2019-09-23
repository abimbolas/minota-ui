import { parseStorageUrl } from '@/utils/url'
import { BackendReference } from '@/reference'
import ServerBackend from '@/backend/server'
import LocalStorageBackend from '@/backend/localstorage'

export const BackendFactory = {
  http: params => new ServerBackend(params),
  https: params => new ServerBackend(params),
  file: params => new ServerBackend({
    baseURL: 'http://localhost:8765'
  }),
  localStorage: params => new LocalStorageBackend(params)
}

export function createBackend (config) {
  const url = parseStorageUrl(config.storage.url)
  BackendReference[config.id] = BackendFactory[url.protocol]({
    baseURL: url.path
  })
  return BackendReference[config.id].init()
}

export function destroyBackend (config) {
  return BackendReference[config.id].destroy().then(() => {
    delete BackendReference[config.id]
  })
}

// import axios from 'axios'
// import Note from '@/models/note'

// class Backend {
//   constructor () {
//     this.resource = axios.create({
//       baseURL: 'http://localhost:7654',
//       headers: {
//         'Content-Type': 'application/json; charset=UTF-8'
//       }
//     })
//   }

//   getAllNotes () {
//     return this.resource.get('/notes/all')
//       .then(this.parseNotes)
//   }

//   getNoteById (id) {
//     return this.resource.get(`/notes/${id}`)
//       .then(this.parseNote)
//   }

//   saveNote (note) {
//     return this.resource.post(`/notes/${note.config.id}`, note)
//       .then(this.parseNotes)
//   }

//   // saveNotes (notes) {
//   //   return this.resource.post(`/notes`, notes)
//   //     .then(this.parseNotes)
//   // }

//   // updateNote (note) {
//   //   return this.resource.put(`/notes`, note)
//   //     .then(this.parseNotes)
//   // }

//   deleteNote (note) {
//     return this.resource.delete(`/notes/${note.config.id}`)
//       .then(this.parseSuccessResponse)
//   }

//   // deleteNotes (notes) {
//   //   return this.resource.delete(`/notes`, { data: notes })
//   //     .then(this.parseSuccessResponse)
//   // }

//   parseSuccessResponse (response) {
//     return response.data
//   }

//   parseNotes (response) {
//     return response.data.map(item => new Note(item))
//   }

//   parseNote (response) {
//     return Promise.resolve(new Note(response.data[0]))
//   }
// }

// export default new Backend()
