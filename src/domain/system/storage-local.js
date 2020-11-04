import StorageInterface from '@/domain/system/storage-interface'

export default class LocalStorage extends StorageInterface {
  constructor(url) {
    super(url)
  }
}
