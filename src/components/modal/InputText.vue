<template lang="pug">
  .minota-modal(elevation="24")
    .minota-modal-header
      .text-h6 {{ modal.header }}
    .minota-modal-body
      .form-field
        m-text-field(
          v-model="inputText"
          required
          full-width
          v-set-placeholder="placeholder"
          v-bind:focused="true"
          v-on:keyup.enter="resolve()")
          m-line-ripple(slot="bottomLine")
    .minota-modal-footer
      .button(
        v-if="isCancelPresent"
        v-bind:class="cancelClass"
        v-on:click="rejectModalAction({ modal })"
      ) {{ cancelLabel }}
      .button(
        v-if="isOkPresent"
        v-bind:class="okClass"
        v-on:click="resolve()"
      ) {{ okLabel }}
</template>

<script>
import { mapActions } from 'vuex'
import SimpleModal from '@/components/modal/Simple'
import setPlaceholder from '@/directives/set-placeholder'

export default {
  name: 'InputText',

  directives: {
    setPlaceholder
  },

  mixins: [SimpleModal],

  data () {
    return {
      inputText: ''
    }
  },

  computed: {
    placeholder () {
      return this.modal.placeholder
    },

    header () {
      return this.modal.header
    }
  },

  created () {
    this.inputText = this.modal.inputText || this.inputText || ''
  },

  methods: {
    resolve () {
      if (this.inputText) {
        this.resolveModalAction({
          modal: this.modal,
          resolve: this.inputText
        })
      }
    },

    ...mapActions([
      'resolveModalAction'
    ])
  }
}
</script>

<style lang="stylus">
</style>
