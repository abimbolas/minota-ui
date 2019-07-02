<template lang="pug">
  .minota-modals(v-if="lastModal")
    .minota-modal-backdrop
    component(v-bind:is="lastModal.component || 'SimpleModal'" v-bind:modal="lastModal")
</template>

<script>
import { mapGetters } from 'vuex'
import SimpleModal from '@/components/modals/Simple'
import CustomModal from '@/components/modals/Custom'
import StorageModal from '@/components/modals/Storage'

export default {
  name: 'Modal',

  components: {
    SimpleModal,
    CustomModal,
    StorageModal
  },

  computed: {
    lastModal () {
      return this.getModalsList.slice(-1)[0]
    },
    ...mapGetters([
      'getModalsList'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'
@import '~@/assets/styles/typography'

.minota-modal-backdrop
  position fixed
  left 0px
  top 0px
  width 100%
  height 100%
  background-color alpha(gainsboro, high-emphasis)
  z-index 200

.minota-modal
  position fixed
  left 50%
  top 10vh
  transform translateX(-50%)
  min-width 300px
  max-width 420px
  box-sizing border-box
  width 100%
  border-radius 3px
  z-index 201
  background-color background-color

.minota-modal-header
  padding 0 24px 8px 24px
  border-bottom solid 1px transparent
  &.with-divider
    border-color gainsboro
  &:before
    content ""
    height 40px
    width 0px
    display inline-block
    vertical-align baseline
  & > :first-child
    display inline-block

.minota-modal-body
  @extend .text-body
  padding 20px 24px

  .form-field.tab-bar
    position relative
    margin-left -1.5rem
    margin-right -1.5rem
    &:first-child
      margin-top 0rem
    &:after
      content ''
      width 100%
      bottom 0
      left 0
      height 0
      border-top solid gainsboro 1px
      position absolute
      z-index -1

.minota-modal-footer
  text-align right
  padding 8px
  border-top solid 1px transparent
  display flex
  justify-content flex-end

  &.with-divider
    border-color gainsboro

  .icon-button
    margin-top -6px
    margin-bottom -6px

  .alternate-action
    margin-right auto
</style>
