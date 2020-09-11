import Notepoint from './notepoint'

export default class Noteline extends Notepoint {
  constructor ({
    content = 'Noteline\'s content',
    config,
    note,
    points = [],
    focusPoint
  } = {}) {
    super({ content, config, note })
    this.points = points
    this.focusPoint = focusPoint || points[0]
  }

  setPoints (points) {
    // Replace if found, insert if not. Our points array
    // is sorted by date
  }
}
