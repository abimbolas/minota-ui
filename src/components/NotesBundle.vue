<template lang="pug">
  .minota-notes-bundle
    .minota-notes-bundle__body
      .minota-notes-bundle__note(
        v-for="(note, index) in notesByDate"
        v-bind:key="note.id"
        v-bind:style="styleForIndex(index)")
        div(style="white-space: pre-wrap; overflow: hidden;" v-if="index > notesByDate.length - 5") {{ note.content }}
        div(style="white-space: pre-wrap; overflow: hidden;" v-else) {{ index }}
</template>

<script>
function r (a, b) {
  return parseInt(Math.random() * (b - a), 10) + a
}

export default {
  name: 'NotesBundle',

  props: {
    notes: {
      type: Array,
      required: false,
      default () {
        return []
      }
    }
  },

  computed: {
    notesByDate () {
      return this.notes.slice(0, 20).sort((a, b) => a.config.date - b.config.date)
    }
  },

  watch: {
    'notes' (notes) {
      console.log('notes', notes.length)
    }
  },

  methods: {
    styleForIndex (index) {
      return {
        'left': '50%',
        'top': '50%',
        'transform-origin': `${r(20, 80)}% ${r(20, 80)}%`,
        'transform': `translateX(calc(-50% + ${r(-3, 3)}px)) translateY(calc(-50% + ${r(-3, 3)}px)) rotateZ(${r(-3, 3)}deg) scale(0.875)`
      }
    }
  }
}
</script>

<style lang="stylus">
.minota-notes-bundle
  // display flex
  // justify-content center
  // align-items center
  height 100%
  width 100%
  box-sizing border-box
  margin-top 0.5rem

.minota-notes-bundle__body
  height 100%
  width 100%
  overflow auto
  display block
  position relative

.minota-notes-bundle__note
  height 95vh
  // width 46rem
  position absolute
  background-color white
  border-radius 0.25rem
  border solid gainsboro 2px
  top 0
  box-sizing border-box
  // padding 2rem 1rem
  overflow hidden
  padding 10vh 8% 10vh 8%
  width 90vw
  max-width calc(35rem + 16%)
  font-size 18px
  & > *
    overflow hidden
    height 100%
</style>
