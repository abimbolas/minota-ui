<template lang="pug">
  .minota-note
    textarea(placeholder="Что в голове?" v-model="note.content")
    //- .minota-actions_vertical
      a.minota-actions__action_icon(
        v-on:click.prevent="onClose()"
        href)
        span(style="font-size: 110%;") &times;
</template>

<script>
import { mapActions } from 'vuex'
import Note from '@/models/note'

export default {
  name: 'Note',

  props: {
    note: {
      type: Object,
      required: true,
      default () {
        return new Note()
      }
    }
  },

  watch: {
    'note.content' () {
      this.$emit('update', this.note)
      this.updateNoteAction({ note: this.note })
    }
  },

  mounted () {
    // this.$el.querySelector('textarea').focus()
  },

  methods: {
    // onClose () {
    //   this.$emit('close', this.note)
    // },

    ...mapActions([
      'updateNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-note
  margin 1rem 0
  display flex
  position relative
  textarea
    width 100%
    margin 0
    max-width none
    border-radius 0.25rem
    min-height 21rem
    font-family sans-family
    padding-right 2rem

.minota-actions_vertical
  display flex
  flex-direction column
  margin-left 0.5rem
  position absolute
  right 0
  top 0

.minota-actions__action_icon
  width 1.5rem
  height 1.5rem
  text-align center
  line-height 1.5rem
</style>
