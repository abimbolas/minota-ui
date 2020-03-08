<template lang="pug">
  .minota-modal.storage-modal(elevation="24" color="default")
    .minota-modal-header
      .text-h6 Setup storage
      .text-subtitle-smaller.medium-emphasis Choose from available types
    .minota-modal-body
      .form-field.tab-bar
        m-tab-bar(v-on:activated="chooseType")
          m-tab-scroller
            m-tab(
              v-bind:active="type.current === 0"
            ) {{ type.list[0].label }}
            m-tab(
              v-bind:active="type.current === 1"
            ) {{ type.list[1].label }}
            m-tab(
              v-bind:active="type.current === 2"
            ) {{ type.list[2].label }}

      p.medium-emphasis(v-html="type.list[type.current].labelDescription")

      .form-field
        m-text-field(
          v-model="path"
          id="storage-path"
          required
          v-on:keyup.enter="submit()"
        )
          m-floating-label(for="storage-path") {{ type.list[type.current].labelPath }}
          m-line-ripple(slot="bottomLine")
        m-text-field-helper-text(persistent) {{ type.list[type.current].labelHelp }}

      .form-field
        m-text-field(
          v-model="topic"
          id="storage-topic"
          v-on:keyup.enter="submit()"
        )
          m-floating-label(for="storage-topic") Topic (optional)
          m-line-ripple(slot="bottomLine")
        m-text-field-helper-text(persistent) For example 'My project / My subtopic'

      .form-field.text-right
        m-form-field
          m-checkbox(v-model="active" id="storage-active")
          label(for="storage-active") Current storage

    .minota-modal-footer
      .button.text-button.alternate-action(
        v-if="id"
        v-on:click="openRemoveStorageConfigModal()"
      ) Delete
      .button(
        v-bind:class="cancelClass"
        v-on:click="rejectModalAction({ modal, reject })"
      ) {{ cancelLabel }}
      .button(
        v-bind:class="okClass"
        v-bind:disabled="disabled"
        v-on:click="submit()"
      ) {{ okLabel }}
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import parseStorageUrl from '@/utils/parse-storage-url'
import SimpleModal from '@/components/modal/Simple'

export default {
  name: 'StorageModal',

  mixins: [SimpleModal],

  data () {
    return {
      id: null,
      active: false,
      topic: '',
      path: '',
      type: {
        current: 0,
        list: [
          {
            protocol: 'file',
            label: 'Local disk',
            labelPath: 'Path',
            labelDescription: 'Storage is on local disk',
            labelHelp: 'For example, "d:/Dropbox/Notes"'
          },
          {
            protocol: 'http',
            label: 'Web server',
            labelPath: 'URL',
            labelDescription: 'Storage is behind a web server',
            labelHelp: 'For example, "https://my-server.ru:8765/minota-api"'
          },
          {
            protocol: 'localStorage',
            label: 'Browser',
            labelPath: 'LocalStorage key',
            labelDescription: 'Storage is inside browser\'s localStorage',
            labelHelp: 'For example, "antivitla"'
          }
        ]
      }
    }
  },

  computed: {
    selectedProtocol () {
      return this.type.list[this.type.current].protocol
    },

    reject () {
      return 'Cancel'
    },

    resolvedConfig () {
      const config = {
        storage: {
          url: ''
        }
      }
      // Setup storage address
      if (this.selectedProtocol === 'http') {
        config.storage.url = (!this.path.match(/^https?:\/\//) ? 'http://' : '') + this.path
      } else if (this.selectedProtocol === 'file') {
        config.storage.url = 'file://' + (this.path.match(/^[a-zA-Z]:/) ? '/' : '') + this.path
      } else {
        config.storage.url = this.selectedProtocol + '://' + this.path
      }
      // Setup storage topic
      if (this.topic) {
        config.topic = this.topic
      }
      // Setup id
      if (this.modal.data && this.modal.data.id) {
        config.id = this.modal.data.id
      }
      return config
    },

    disabled () {
      return !(this.path && this.type.current >= 0)
    },

    ...mapGetters([
      'getCurrentStorageConfig'
    ])
  },

  watch: {
    path (value) {
      if (value.match(/^https?:/)) {
        this.chooseType({ index: 1 })
      } else if (value.match(/^\/[a-zA-Z]+/)) {
        this.chooseType({ index: 0 })
      } else if (value.match(/^[a-zA-Z]+:/)) {
        this.chooseType({ index: 0 })
      } else if (value.match(/^[a-zA-Z]{6,}/)) {
        this.chooseType({ index: 2 })
      }
    }
  },

  created () {
    if (this.modal.data) {
      // restore topic
      this.topic = this.modal.data.topic
      // restore path and type
      this.path = parseStorageUrl(this.modal.data.storage.url).path
      // restore id
      this.id = this.modal.data.id
      // restore activeness
      if (
        this.getCurrentStorageConfig &&
        this.getCurrentStorageConfig.id === this.modal.data.id
      ) {
        this.active = true
      }
    }
  },

  methods: {
    chooseType (event) {
      this.type.current = event.index
    },

    openRemoveStorageConfigModal () {
      this.openModalAction({
        modal: {
          ok: {
            label: 'Delete'
          },
          cancel: {
            label: 'Cancel'
          },
          body: 'Are you sure to delete this storage configuration?'
        }
      }).then(resolve => {
        this.removeStorageConfig({ config: this.modal.data })
        this.rejectModalAction({ modal: this.modal, reject: 'Deleted' })
      }).then(reject => {
        console.log('reject deletion')
      })
    },

    submit () {
      if (this.isValid()) {
        this.resolveModalAction({
          modal: this.modal,
          resolve: {
            config: this.resolvedConfig,
            activate: this.active
          }
        })
      }
    },

    isValid () {
      return Boolean(this.path)
    },

    ...mapMutations([
      'removeStorageConfig'
    ]),
    ...mapActions([
      'openModalAction'
    ])
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/everything"

.minota-modal.storage-modal
  max-width 420px

.form-field
  .mdc-text-field
    width 100%

</style>
