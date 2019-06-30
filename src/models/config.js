import uuid from 'uuid/v1'

export default class Config {
  constructor (config) {
    if (!config.id) {
      this.id = uuid()
    }
    Object.assign(this, config)
  }
}
