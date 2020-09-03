<template lang="pug">
  .minota-note-line
    note-point-component(
      v-for="point in line.points"
      v-bind:key="point.id"
      v-bind:point="point")
</template>

<script>
import { NoteLine } from '@/models'
import NotePointComponent from '@/components/NotePoint'

export default {
  name: 'NoteLine',

  components: {
    NotePointComponent
  },

  props: {
    line: {
      type: Object,
      required: true,
      default () {
        return new NoteLine()
      }
    }
  }
}
</script>

<style lang="stylus">
.minota-note-line
  background-color alpha(limegreen, 0.1)
  display flex
  overflow auto
</style>
