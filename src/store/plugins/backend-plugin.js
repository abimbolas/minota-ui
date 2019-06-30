import { createBackend, destroyBackend } from '@/backend/utils'

export default function (store) {
  const actions = {
    addStorageConfig ({ config }) {
      createBackend(config).then(() => {
        console.log(`Backend ${config.id} successfully initialized`)
      })
    },

    removeStorageConfig ({ config }) {
      destroyBackend(config).then(() => {
        console.log(`Backend ${config.id} successfully destroyed`)
      })
    }
  }

  store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation.payload)
  })
}
