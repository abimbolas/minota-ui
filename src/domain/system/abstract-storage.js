import Note from '@/domain/user/note'

export default class AbstractStorage extends URL {
  getNotes () { return Promise.reject(new Error('Abstract getNotes')) }
  postNote () { return Promise.reject(new Error('Abstract postNote')) }
  deleteNote () { return Promise.reject(new Error('Abstract deleteNote')) }
  deleteNotes () { return Promise.reject(new Error('Abstract deleteNotes')) }

  rememberStorage (note) {
    let newNote = new Note(note)
    newNote.config.storage = [this.href]
    return newNote
  }

  forgetStorage (note) {
    let newNote = new Note(note)
    delete newNote.config.storage
    return newNote
  }
}
