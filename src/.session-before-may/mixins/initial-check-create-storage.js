import { mapGetters, mapActions } from 'vuex'
import { createBackend } from '@/backend'

export default {
  computed: {
    ...mapGetters({
      'storageList': 'getStorageConfigList'
    })
  },

  created () {
    // Create corresponding Backends for all storage configs
    this.storageList.forEach(config => {
      createBackend(config)
      // .then(() => {
      //   console.log(
      //     'Backend',
      //     config.id,
      //     config.topic,
      //     config.storage.url,
      //     'successfully created'
      //   )
      // })
    })
  },

  mounted () {
    // If we have not storage config at startup,
    // warn about it and send to create one to.
    if (!this.storageList.length) {
      this.pleaseCreateStorage()
    }
  },

  methods: {
    pleaseCreateStorage () {
      this.openModal({
        modal: {
          body: 'Please add storage to start working',
          ok: {
            label: 'Add storage'
          }
        }
      }).then(() => {
        this.$router.push({ name: 'config' })
      })
    },
    ...mapActions({
      'openModal': 'openModalAction'
    })
  }
}
