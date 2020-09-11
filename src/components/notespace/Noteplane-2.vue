<template lang="pug">
  .minota-note-plane
    div
      small plane/{{ itemType }}
      br
      small {{ item.config.date }}
    note-line-component(
      v-for="line in item.lines"
      v-bind:key="line.id"
      v-bind:item="line")
</template>

<script>
import { Noteplane } from '@/models'
import NotelineComponent from '@/components/notespace/Noteline'
import mixin from '@/components/notespace/mixin'

export default {
  name: 'Noteplane',

  components: {
    NotelineComponent
  },

  mixins: [mixin],

  props: {
    item: {
      type: Object,
      required: true,
      default () {
        return new Noteplane()
      }
    }
  }
}
</script>

<style lang="stylus">
.minota-note-plane
  background-color alpha(lightblue, 0.1)
</style>
