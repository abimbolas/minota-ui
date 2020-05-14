import { createBackend, destroyBackend } from '@/backend'

export default function (store) {
  const mutations = {
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
    mutations[mutation.type] && mutations[mutation.type](mutation.payload)
  })
}
