<template lang="pug">
  .minota-drawer(style-elevation="0")
    archive-note(
      v-for="note in orderedByDate"
      v-bind:key="note"
      v-bind:note="note")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArchiveNote from '@/components/notes/ArchiveNote'
import { Reference } from '@/store/reference'

export default {
  name: 'Drawer',

  components: {
    ArchiveNote
  },

  computed: {
    orderedByDate () {
      return this.getArchive.slice(0).sort((a, b) => {
        return Reference[b].config.date - Reference[a].config.date
      })
    },
    ...mapGetters([
      'getArchive'
    ])
  },

  created () {
    this.loadArchiveAction()
  },

  methods: {
    ...mapActions([
      'loadArchiveAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-drawer
  // background-color primary-dark-color
  color alpha(white, high-emphasis)
  // box-shadow inset 0px 0px 10px rgba(0, 0, 0, 0.5)
  // padding 0.8rem 0.25rem
  // padding-top 48px
  width 100%
  // box-sizing border-box
  // position relative
  // min-height 100vh

</style>
