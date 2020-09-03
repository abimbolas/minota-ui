import NotePlane from './noteplane'

export default class NoteSpace extends NotePlane {
  constructor ({
    content = '',
    config,
    note,
    points = [],
    lines = [],
    planes = []
  } = {}) {
    super({ content, config, note, points, lines })
    this.planes = planes
  }
}
