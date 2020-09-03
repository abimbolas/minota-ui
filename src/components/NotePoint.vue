<template lang="pug">
  .minota-note-point
    .minota-note-point__note
      small {{ noteContent }}
</template>

<script>
import { NotePoint } from '@/models'

export default {
  name: 'NotePoint',

  props: {
    point: {
      type: Object,
      required: true,
      default () {
        return new NotePoint()
      }
    }
  },

  computed: {
    noteContent () {
      return this.point.note.content.slice(0, 70)
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-note-point
  background-color alpha(brown, 0.1)

.minota-note-point__note
  width 140px
  height 180px
  border solid alpha(black, 0.125) 2px
  border-radius 0.5rem
  background-color white
  margin 0.25rem
  // debug
  overflow hidden
</style>
