<template lang="pug">
  .minota-modal.group-modal(elevation="24" color="default")
    .minota-modal-header
      .text-h6 Group notes
    .minota-modal-body
      p.medium-emphasis Specify topic, under which to group notes
      .form-field
        m-text-field(
          v-model="topic"
          id="topic-to-group-under"
          required
          v-bind:focused="true"
          v-on:keyup.enter="resolve()")
          m-floating-label(for="topic-to-group-under") Topic
          m-line-ripple(slot="bottomLine")
        //- m-text-field-helper-text(persistent) Specify topic, under which to group notes

    .minota-modal-footer
      .button(
        v-bind:class="cancelClass"
        v-on:click="rejectModalAction({ modal })"
      ) {{ cancelLabel }}
      .button(
        v-if="topic"
        v-bind:class="okClass"
        v-on:click="resolve()"
      ) {{ okLabel }}
      .button(
        v-else
        disabled="disabled"
        v-bind:class="okClass"
        v-on:click="resolve()"
      ) {{ okLabel }}
</template>

<script>
import SimpleModal from '@/components/modal/Simple'

export default {
  name: 'GroupModal',

  mixins: [SimpleModal],

  data () {
    return {
      topic: ''
    }
  },

  methods: {
    resolve () {
      if (this.topic) {
        this.resolveModalAction({
          modal: this.modal,
          resolve: this.topic
        })
      }
    }
  }
}
</script>

<!-- <style lang="stylus"></style> -->
