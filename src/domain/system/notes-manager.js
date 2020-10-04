export default class NotesManager {
  notes = {}

  setNotes (notes = []) {
    notes.forEach(note => {
      this.notes[note.id] = note
    })
  }
}
