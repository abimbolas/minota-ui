import Note from './note'

export default class NotePoint extends Note {
  constructor () {
    super()
    this.note = new Note()
  }
}
