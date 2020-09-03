<template lang="pug">
  .minota-playground
    note-point-component(v-bind:point="notePoint")
    note-line-component(v-bind:line="noteLine")
    note-plane-component(v-bind:plane="notePlane")
</template>

<script>
import { mapGetters } from 'vuex'
import { Note, NoteLine, NotePlane, NotePoint } from '@/models'
import NoteLineComponent from '@/components/NoteLine'
import NotePlaneComponent from '@/components/NotePlane'
import NotePointComponent from '@/components/NotePoint'

export default {
  name: 'Playground',

  components: {
    NoteLineComponent,
    NotePlaneComponent,
    NotePointComponent
  },

  computed: {
    notePoint () {
      return new NotePoint({
        note: new Note({ content: 'NotePoint\'s note content' })
      })
    },

    noteLine () {
      return new NoteLine({
        points: this.table.slice(0, 4).map(note => new NotePoint({ note }))
      })
    },

    notePlane () {
      return new NotePlane({
        lines: [
          new NoteLine({ points: this.table.slice(0, 4).map(note => new NotePoint({ note })) }),
          new NoteLine({ points: this.table.slice(2, 4).map(note => new NotePoint({ note })) }),
          new NoteLine({ points: this.table.slice(3, 9).map(note => new NotePoint({ note })) })
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
