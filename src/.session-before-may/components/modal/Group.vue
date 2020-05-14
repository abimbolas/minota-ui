<template lang="pug">
  .minota-modal.group-modal(elevation="24" color="default")
    .minota-modal-header
      .text-h6 Topic
    .minota-modal-body
      .form-field
        m-text-field(
          v-model="topic"
          id="topic-to-group-under"
          required
          full-width
          v-set-placeholder="'Set topic for new group'"
          aria-label="Group under topic"
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
import setPlaceholder from '@/directives/set-placeholder'
import { topicDelimiter } from '@/store/ui'

export default {
  name: 'GroupModal',

  directives: {
    setPlaceholder
  },

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
          resolve: this.topic.split(topicDelimiter)
            .filter(i => i)
            .join(topicDelimiter)
        })
      }
    }
  }
}
</script>

<!-- <style lang="stylus"></style> -->
