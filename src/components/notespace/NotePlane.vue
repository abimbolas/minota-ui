<template lang="pug">
  .minota-note-plane
    div
      small {{ type }}
      br
      small {{ config.date }}
    note-line-component(
      v-for="line in plane.lines"
      v-bind:key="line.id"
      v-bind:line="line")
</template>

<script>
import { NotePlane } from '@/models'
import NoteLineComponent from '@/components/notespace/NoteLine'
import mixin from '@/components/notespace/mixin'

export default {
  name: 'NotePlane',

  components: {
    NoteLineComponent
  },

  mixins: [mixin],

  props: {
    plane: {
      type: Object,
      required: true,
      default () {
        return new NotePlane()
      }
    }
  }
}
</script>

<style lang="stylus">
.minota-note-plane
  background-color alpha(lightblue, 0.1)
</style>
