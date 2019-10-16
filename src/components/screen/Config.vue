<template lang="pug">
  screen-component.minota-config
    template(slot="bar")
      router-link.button.icon-button(to="/note" title="Table")
        i.material-icons home
      router-link(to="/notes" title="List notes").button.icon-button
        i.material-icons folder_open
      .title
      .button.icon-button(v-on:click="addStorage()" title="Add storage")
        i.material-icons add

    template(slot="content" v-if="storageList.length")
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
    template(slot="content" v-else)
      screen-placeholder-component(v-bind:text="'Нет хранилищ'")
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

// import BarComponent from '@/components/Bar'
// import FabComponent from '@/components/Fab'
import ListItemComponent from '@/components/ListItem'
import ScreenComponent from '@/components/Screen'
import ScreenPlaceholderComponent from '@/components/ScreenPlaceholder'

export default {
  name: 'Config',

  components: {
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

<style lang="stylus">
.minota-config
  .minota-screen-main
    flex-direction column
    justify-content flex-start
</style>
