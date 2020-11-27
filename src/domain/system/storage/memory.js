export default class MemoryStorage extends Map {

  // Module: Note

  getNote (id) {
    return this.get(id)
  }

  postNote (note) {
    this.set(note.id, note)
  }

  // Module: Iterable Notes

  getNotes () {
    return Array.from(this.values())
  }

  postNotes (notes) {
    notes.forEach(note => {
      this.set(note.id, note)
    })
  }

  updateNote (note, update) {
    throw new Error('Not Implemented')
  }

  updateNotes (noteUpdates) {
    throw new Error('Not Implemented')
  }

  deleteNote (note) {
    this.delete(note.id)
  }

  deleteNotes (notes) {
    notes.forEach(note => {
      this.delete(note.id)
    })
  }
}
