<template lang="pug">
  .minota-modal(elevation="24" color="default")
    .minota-modal-header
      .text-h6 My header
    .minota-modal-body My body
    .minota-modal-footer
      .button(
        v-bind:class="cancelClass"
        v-on:click="rejectModalAction({ modal, reject })"
      ) {{ cancelLabel }}
      .button(
        v-bind:class="okClass"
        v-on:click="resolveModalAction({ modal, resolve })"
      ) {{ okLabel }}
</template>

<script>
import SimpleModal from '@/components/modals/Simple'

export default {
  name: 'CustomModal',

  mixins: [SimpleModal],

  data () {
    return {
      resolve: null,
      reject: null
    }
  }
}
</script>
