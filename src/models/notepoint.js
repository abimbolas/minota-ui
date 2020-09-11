import Note from './note'

export default class Notepoint extends Note {
  constructor ({
    content = 'Notepoint\'s content',
    config,
    note = new Note()
  } = {}) {
    super({ content, config })
    this.note = note

    if (!(this.note instanceof Note)) {
      console.warn('Notepoint: note is not an instance of Note:', note)
    }
  }
}
