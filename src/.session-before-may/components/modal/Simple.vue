<template lang="pug">
  .minota-modal(elevation="24" color="default")
    .minota-modal-header(v-if="modal.header")
      .text-h6 {{ modal.header }}
    .minota-modal-body(v-if="modal.body")
      span(v-html="modal.body")
    .minota-modal-footer
      .button(
        v-if="isCancelPresent"
        v-bind:class="cancelClass"
        v-on:click="rejectModalAction({ modal })"
      ) {{ cancelLabel }}
      .button(
        v-if="isOkPresent"
        v-bind:class="okClass"
        v-on:click="resolveModalAction({ modal })"
      ) {{ okLabel }}
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SimpleModal',

  props: {
    modal: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  computed: {
    isOkPresent () {
      return this.modal.ok !== false
    },
    isCancelPresent () {
      return this.modal.cancel !== false
    },
    okLabel () {
      return (
        this.modal.ok &&
        this.modal.ok.label
      ) || 'Ok'
    },
    okClass () {
      return (
        this.modal.ok &&
        this.modal.ok.class
      ) || 'text-button'
    },
    cancelLabel () {
      return (
        this.modal.cancel &&
        this.modal.cancel.label
      ) || 'Cancel'
    },
    cancelClass () {
      return (
        this.modal.cancel &&
        this.modal.cancel.class
      ) || 'text-button'
    }
  },

  methods: {
    ...mapActions([
      'resolveModalAction',
      'rejectModalAction'
    ])
  }
}
</script>
