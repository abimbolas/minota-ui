import uuid from 'uuid/v1'

export default class Note {
  constructor ({ id = uuid(), content = '' } = {}) {
    this.id = id
    this.content = content
  }
}
