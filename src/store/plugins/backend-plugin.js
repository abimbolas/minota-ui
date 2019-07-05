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
    },

    updateStorageConfig ({ config }) {
      destroyBackend(config)
        .then(() => createBackend(config))
        .then(() => {
          console.log(`Backend ${config.id} successfully updated`)
        })
    }
  }

  store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation.payload)
  })
}
