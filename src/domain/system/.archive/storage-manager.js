import FileStorage from './file-storage'

export class StorageInvalidURLError extends Error {
  constructor (message = 'Storage Invalid URL') {
    super(message)
    this.name = 'StorageInvalidURLError'
  }
}

export class StorageNotSupportedError extends Error {
  constructor (message = 'Storage Not Supported') {
    super(message)
    this.name = 'StorageNotSupportedError'
  }
}

export class StorageDuplicateError extends Error {
  constructor (message = 'Storage Duplicate') {
    super(message)
    this.name = 'StorageDuplicateError'
  }
}

export default class StorageManager {
  types = {
    'file:': FileStorage
  }

  nodes = {} // storage nodes

  addStorage (url) {
    const validUrl = this.validate(url)
    // Throw error if duplicate
    if (this.nodes[validUrl.href]) {
      throw new StorageDuplicateError(validUrl.href)
    }
    // If all good, create, keep and return new storage instance
    const storageInstance = new this.types[validUrl.protocol](validUrl.href)
    this.nodes[validUrl.href] = storageInstance
    return storageInstance
  }

  removeStorage (url) {
    try {
      delete this.nodes[this.validate(url).href]
    } catch {
      delete this.nodes[url]
    }
  }

  getStorage (url) {
    return this.nodes[this.validate(url).href]
  }

  validate (url) {
    let validUrl
    // Check URL itself
    try {
      validUrl = new URL(url)
    } catch {
      throw new StorageInvalidURLError(url)
    }
    // Check storage type
    if (!this.types[validUrl.protocol]) {
      throw new StorageNotSupportedError(validUrl.protocol)
    }
    return validUrl
  }
}
