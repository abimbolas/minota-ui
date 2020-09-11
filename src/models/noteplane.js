import Noteline from './noteline'

export default class Noteplane extends Noteline {
  constructor ({
    content = 'Noteplane\'s content',
    config,
    note,
    points,
    lines = [new Noteline()],
    focusPoint,
    focusLine
  } = {}) {
    super({ content, config, note, points, focusPoint })
    this.lines = lines
    this.focusLine = focusLine || this.lines[0]
  }
}
