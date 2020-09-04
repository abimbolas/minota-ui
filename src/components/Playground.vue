<template lang="pug">
  .minota-playground
    note-point-component(v-bind:point="notePoint")
    br
    note-line-component(v-bind:line="noteLine")
    br
    note-plane-component(v-bind:plane="notePlane")
</template>

<script>
import { mapGetters } from 'vuex'
import { Note, NoteLine, NotePlane } from '@/models'
import {
  NotePointComponent,
  NoteLineComponent,
  NotePlaneComponent
} from '@/components/notespace'

export default {
  name: 'Playground',

  components: {
    NotePointComponent,
    NoteLineComponent,
    NotePlaneComponent
  },

  computed: {
    notePoint () {
      return new Note({ content: 'NotePoint\'s note content' })
    },

    noteLine () {
      return new NoteLine({
        points: this.table.slice(0, 4)
      })
    },

    notePlane () {
      return new NotePlane({
        lines: [
          new NoteLine({ points: this.table.slice(0, 4) }),
          new NoteLine({ points: this.table.slice(2, 4) }),
          new NoteLine({ points: this.table.slice(3, 20) })
        ]
      })
    },

    ...mapGetters(['table'])
  }
}
</script>

<style lang="stylus">
.minota-playground
  padding 1rem
</style>
