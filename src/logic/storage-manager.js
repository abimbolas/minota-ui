import FileStorage from '@/backend/file'

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

  nodes = {}

  addStorage (url) {
    const validUrl = this.validate(url)
    // Throw error if duplicate
    if (this.nodes[validUrl.href]) {
      throw new StorageDuplicateError(validUrl.href)
    }
    // Add storage if all good
    this.nodes[validUrl.href] = new this.types[validUrl.protocol](validUrl.href)
    // Freshly added storage start
    // emitting notes. How to pass them to vue?
  }

  removeStorage (url) {
    delete this.nodes[this.validate(url).href]
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
