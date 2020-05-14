import parseStorageUrl from '@/utils/parse-storage-url'
import ServerBackend from '@/backend/server'
import LocalStorageBackend from '@/backend/localstorage'

const BackendReference = {}

export const BackendFactory = {
  http: params => new ServerBackend(params),
  https: params => new ServerBackend(params),
  file: params => new ServerBackend({
    baseURL: 'http://localhost:8765'
  }),
  localStorage: params => new LocalStorageBackend(params)
}

export function createBackend (config) {
  const url = parseStorageUrl(config.storage.url)
  BackendReference[config.id] = BackendFactory[url.protocol]({
    baseURL: url.path
  })
  return BackendReference[config.id].init()
}

export function destroyBackend (config) {
  return BackendReference[config.id].destroy().then(() => {
    delete BackendReference[config.id]
  })
}

export default BackendReference
