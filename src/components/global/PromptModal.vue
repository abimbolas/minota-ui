<template lang="pug">
  .minota-modal
    .minota-modal__header {{ modal.header }}
    .minota-modal__main(v-html="modal.description")
    .minota-modal__footer
      .minota-actions
        .minota-action.minota-action_cancel(
          v-on:click="rejectModalAction({ modal })")
          | {{ modal.cancel || cancel }}
        .minota-action.minota-action_ok(
          v-bind:danger="modal.danger"
          v-bind:primary="modal.primary"
          v-on:click="resolveModalAction({ modal })")
          | {{ modal.ok || ok }}
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'PromptModal',
  props: {
    modal: {
      type: Object,
      required: true,
      default () {
        return {
          header: '',
          description: '?',
          ok: 'Ok',
          cancel: 'Отмена',
          danger: false,
          primary: true
        };
      }
    }
  },
  data () {
    return {
      cancel: 'Cancel',
      ok: 'Ok'
    };
  },
  methods: {
    ...mapActions([
      'resolveModalAction',
      'rejectModalAction'
    ])
  }
};
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/actions'

.minota-modal
  width 100%
  max-width 30rem
  background-color white
  border-radius 0.25rem
  box-shadow 0px 5px 10px 0px rgba(0, 0, 0, 0.125)

.minota-modal__header
  padding 1.5rem
  font-size 1.5rem
  &:empty
    display none

.minota-modal__footer
  border-top solid 1px alpha(black, 0.125)
  padding 0.5rem

  .minota-actions
    justify-content flex-end

  .minota-action_cancel
    margin-right auto
    margin-left 0

.minota-modal__main
  padding 0 1.5rem 1.5rem 1.5rem
  &:empty
    display none
  p:first-child
    margin-top 0
</style>
