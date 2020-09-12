<template lang="pug">
  .minota-note-plane
    div
      small plane
      br
      small {{ item.config.date }}
    note-line-component(
      v-for="line in item.lines"
      v-bind:key="line.id"
      v-bind:item="line")
</template>

<script>
import Noteplane from '@/domain/user/noteplane'
import NotelineComponent from '@/components/Noteline'

export default {
  name: 'Noteplane',

  components: {
    NotelineComponent
  },

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
