<template lang="pug">
  .minota-note-point
    div
      small {{ type }}
      br
      small {{ config.date }}
    .minota-note-point__content {{ content }}
</template>

<script>
import { NotePoint } from '@/models'
import mixin from '@/components/notespace/mixin'

export default {
  name: 'NotePoint',

  mixins: [mixin],

  props: {
    point: {
      type: Object,
      required: true,
      default () {
        return new NotePoint()
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-note-point
  background-color alpha(brown, 0.1)

.minota-note-point__content
  width 140px
  height 180px
  border solid alpha(black, 0.125) 2px
  border-radius 0.5rem
  background-color white
  margin 0.25rem
  // debug
  overflow hidden
</style>
