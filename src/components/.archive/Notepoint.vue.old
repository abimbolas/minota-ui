<template lang="pug">
  .minota-notepoint
    .minota-notepoint__item
      small {{ noteContent }}
</template>

<script>
import Notepoint from '@/domain/user/notepoint'

export default {
  name: 'Notepoint',

  props: {
    item: {
      type: Object,
      required: true,
      default () {
        return new Notepoint()
      }
    }
  },

  computed: {
    content () {
      return this.item.content
    },

    noteContent () {
      if (this.item.note) {
        return this.item.note.content
      } else {
        return this.item.content
      }
    }
  },

  created () {
    // console.log(this.item)
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-notepoint
  width calc(0.7 * 50vh )
  height 50vh
  padding 2px
  box-sizing border-box

.minota-notepoint__item
  width 100%
  height 100%
  // max-width 40rem
  box-shadow 0px 0px 0px 2px alpha(black, 0.05)
  border-radius 0.25rem
  background-color white
  // debug
  overflow hidden
</style>
