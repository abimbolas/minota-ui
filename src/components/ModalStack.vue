<template lang="pug">
  .minota-modal-stack(v-if="lastModal")
    .minota-modal-backdrop
      component(
        v-bind:is="lastModal.component || 'SimpleModal'"
        v-bind:modal="lastModal"
      )
</template>

<script>
import { mapGetters } from 'vuex'
import SimpleModal from '@/components/modal/Simple'
import CustomModal from '@/components/modal/Custom'
import StorageModal from '@/components/modal/Storage'

export default {
  name: 'ModalStack',

  components: {
    SimpleModal,
    CustomModal,
    StorageModal
  },

  computed: {
    lastModal () {
      return this.getModalStack.slice(-1)[0]
    },
    ...mapGetters([
      'getModalStack'
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
  height 100vh
  overflow auto
  -webkit-overflow-scroll touch
  background-color alpha(gainsboro, high-emphasis)
  z-index modal-index-backdrop

.minota-modal
  position absolute
  left 50%
  transform translateX(-50%)
  width calc(100% - 8px)
  margin-top 4px
  margin-bottom 4px
  box-sizing border-box
  border-radius 3px
  z-index modal-index
  background-color background-color
  @media (min-width 480px)
    max-width 480px

.minota-modal-header
  padding 0 16px 15px 16px
  border-bottom solid 1px transparent
  @media (min-width 768px)
    padding 0 24px 15px 24px

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

  &:not(:empty) ~ .minota-modal-body:not(:empty)
    padding-top 0px
    margin-top -8px

.minota-modal-body
  @extend .text-body
  padding 20px 16px
  @media (min-width 768px)
    padding 20px 24px

  .form-field.tab-bar
    position relative
    margin-left -1rem
    margin-right -1rem
    @media (min-width 768px)
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
