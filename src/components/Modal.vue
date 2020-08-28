<template lang="pug">
  .minota-modal__backdrop(v-if="modal")
    component(v-bind:is="modal.component" v-bind:modal="modal")
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Modal',

  computed: {
    modal () {
      return Boolean(this.modals.length) && this.modals.slice(-1)[0]
    },

    ...mapGetters(['modals'])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-modal__backdrop
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  overflow auto
  background-color alpha(black, 0.5)
  display flex
  justify-content center
  align-items center
  padding 0.5rem
  box-sizing border-box
</style>
