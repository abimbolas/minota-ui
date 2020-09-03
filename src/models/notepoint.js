import Note from './note'

export default class NotePoint extends Note {
  constructor ({
    content = '',
    config,
    note
  } = {}) {
    super({ content, config })
    this.note = new Note(note)
  }
}
