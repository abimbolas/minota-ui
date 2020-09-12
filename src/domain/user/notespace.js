import Noteplane from './noteplane'

export default class Notespace extends Noteplane {
  constructor ({
    content = '',
    config,
    note,
    points,
    lines,
    planes = [new Noteplane()],
    focusPoint,
    focusLine,
    focusPlane
  } = {}) {
    super({ content, config, note, points, lines, focusPoint, focusLine })
    this.planes = planes
    this.focusPlane = focusPlane || this.planes[0]
  }
}
