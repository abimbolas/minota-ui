import uuid from 'uuid/v1'
import Workspace from './workspace'

export default class Notespace extends Workspace {
  constructor ({ focus = [], blur = [], content = '', config } = {}) {
    super({ focus, blur })
    this.content = content
    this.config = Object.assign({
      id: uuid()
    }, config)
  }

  get id () {
    return this.config.id
  }

  set id (id) {
    this.config.id = id
  }

  update ({ content = null, config = null } = {}) {
    if (content !== null) {
      this.content = content
    }
    if (config !== null) {
      this.config = Object.assign(this.config, config)
    }
  }
}
