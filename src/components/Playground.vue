<template lang="pug">
  .minota-playground
    notepoint-component(v-bind:item="notePoint")
    br
    noteline-component(v-bind:item="noteLine")
    br
    noteplane-component(v-bind:item="notePlane")
</template>

<script>
/* eslint-disable no-unused-vars */
import { mapGetters } from 'vuex'
import Note from '@/domain/user/note'
import Notepoint from '@/domain/user/notepoint'
import Noteline from '@/domain/user/noteline'
import Noteplane from '@/domain/user/noteplane'
import NotepointComponent from '@/components/Notepoint'
import NotelineComponent from '@/components/Noteline'
import NoteplaneComponent from '@/components/Noteplane'

export default {
  name: 'Playground',

  components: {
    NotepointComponent,
    NotelineComponent,
    NoteplaneComponent
  },

  computed: {
    note () {
      return this.table[0]
    },

    notePoint () {
      return new Notepoint({ note: this.table[1] })
    },

    noteLine () {
      return new Noteline({
        points: this.table.slice(0, 14)
      })
    },

    notePlane () {
      return new Noteplane({
        lines: [
          new Noteline({ points: this.table.slice(0, 4) }),
          new Noteline({ points: this.table.slice(2, 4) }),
          new Noteline({ points: this.table.slice(3, 20) })
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
