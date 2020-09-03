import NoteLine from './noteline'

export default class NotePlane extends NoteLine {
  constructor ({
    content = '',
    config,
    note,
    points = [],
    lines = []
  } = {}) {
    super({ content, config, note, points })
    this.lines = lines
  }
}
