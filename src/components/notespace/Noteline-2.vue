<template lang="pug">
  .minota-note-line
    note-point-component(
      v-for="point in item.points"
      v-bind:key="point.id"
      v-bind:item="point")
</template>

<script>
import { Noteline } from '@/models'
import NotepointComponent from '@/components/notespace/Notepoint'
import mixin from '@/components/notespace/mixin'

export default {
  name: 'Noteline',

  components: {
    NotepointComponent
  },

  mixins: [mixin],

  props: {
    item: {
      type: Object,
      required: true,
      default () {
        return new Noteline()
      }
    }
  }
}
</script>

<style lang="stylus">
.minota-note-line
  // background-color alpha(limegreen, 0.1)
  display flex
  overflow auto
  height 20vh
  .minota-note-point
    height 100%
    width calc(0.7 * 20vh)
    flex-basis calc(0.7 * 20vh)
    flex-shrink 0
    & + .minota-note-point
      margin-left 0.5rem
</style>
