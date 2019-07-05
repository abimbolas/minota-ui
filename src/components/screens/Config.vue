<template lang="pug">
  screen-component.minota-config
    bar-component
      router-link(to="/drawer").navigation.button.icon-button
        i.material-icons arrow_back

    fab-component
      .fab-action(v-on:click="addStorage()")
        i.material-icons add

    main
      template(v-if="storageList.length")
        list-item-component(
          v-for="config in storageList"
          v-bind:key="config.id"
          v-on:primary-action="tryToSetStorage(config)"
        )
          .button.icon-button(slot="primary-action")
            i.material-icons(v-if="isActive(config)") check
          div(slot="title") {{ config.topic }}
          div(slot="description") {{ config.storage.url }}
          .button.text-button(
            slot="secondary-action"
            v-on:click.stop.prevent="updateStorage({ config })"
          ) Edit

      template(v-else)
        screen-placeholder-component(v-bind:text="'Нет хранилищ'")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

import BarComponent from '@/components/layout/Bar'
import FabComponent from '@/components/layout/Fab'
import ListItemComponent from '@/components/layout/ListItem'
import ScreenComponent from '@/components/layout/Screen'
import ScreenPlaceholderComponent from '@/components/other/ScreenPlaceholder'

export default {
  name: 'Config',

  components: {
    BarComponent,
    FabComponent,
    ListItemComponent,
    ScreenComponent,
    ScreenPlaceholderComponent
  },

  computed: {
    ...mapGetters({
      'storageList': 'getStorageConfigList',
      'currentStorage': 'getCurrentStorageConfig'
    })
  },

  mounted () {
    // If we have no storage, go add one
    if (!this.storageList.length) {
      this.addStorage()
    }
  },

  methods: {
    isActive (config) {
      return this.currentStorage && this.currentStorage.id === config.id
    },

    tryToSetStorage (config) {
      if (!this.currentStorage || config.id !== this.currentStorage.id) {
        this.setStorage({ config })
      }
    },

    ...mapMutations({
      'setStorage': 'setCurrentStorageConfig'
    }),
    ...mapActions({
      'addStorage': 'addStorageConfigAction',
      'updateStorage': 'updateStorageConfigAction'
    })
  }
}
</script>
