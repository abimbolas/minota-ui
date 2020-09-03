import NotePoint from './notepoint'

export default class NoteLine extends NotePoint {
  constructor ({
    content = '',
    config,
    note,
    points = []
  } = {}) {
    super({ content, config, note })
    this.points = points
  }
}
