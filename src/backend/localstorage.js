import BackendAPI from './api'

export default class LocalStorageBackend extends BackendAPI {
  constructor ({ baseURL }) {
    super()
    this.key = baseURL
    // console.log('Local Storage Backend created', this.key)
  }
}
