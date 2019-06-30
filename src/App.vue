<template lang="pug">
  .minota-app
    router-view
    modals-component
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { createBackend } from '@/backend/utils'
import ModalsComponent from '@/components/modals/Modals'
import TableComponent from '@/components/screens/Table'

export default {
  name: 'App',

  components: {
    ModalsComponent,
    TableComponent
  },

  computed: {
    ...mapGetters({
      'currentStorage': 'getCurrentStorageConfig',
      'storageList': 'getStorageConfigList'
    })
  },

  created () {
    console.log('Minota App created!')
    // Create corresponding Backends for all storage configs
    this.storageList.forEach(config => {
      createBackend(config).then(() => {
        console.log(`Backend ${config.id} for ${config.storage.url} successfully created`)
      })
    })
  },

  mounted () {
    // If we have not storage config at startup,
    // warn about it and send to create one to.
    if (!this.storageList.length) {
      this.pleaseCreateStorage()
    }
  },

  beforeDestroy () {
    console.log('Minota App destroyed...')
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
        this.$router.push('config')
      })
    },
    ...mapMutations({
      'setStorage': 'setCurrentStorageConfig'
    }),
    ...mapActions({
      'openModal': 'openModalAction'
    })
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/index"
@import "~@/assets/styles/variables"

html
body
  margin 0
  padding 0
  height 100% // Hack parent container

.minota-app
  position relative
  min-height 100%
  overflow hidden
  display flex
  flex-direction column
  background-color ghostwhite
  color alpha(black, high-emphasis)
</style>
