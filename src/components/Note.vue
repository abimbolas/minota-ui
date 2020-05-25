<template lang="pug">
  .minota-note
    textarea(v-model="note.content" placeholder="Что в голове?" v-on:focus="onFocus")
    .minota-note__actions
      a(href v-on:click.prevent="onDelete") Delete
</template>

<script>
export default {
  name: 'Note',

  props: {
    note: {
      type: Object,
      required: true,
      default () {
        return {}
      }
    }
  },

  watch: {
    'note.content' () {
      this.$emit('update', this.note)
    }
  },

  methods: {
    onFocus () {
      this.$emit('focus', this.note)
      setTimeout(() => {
        this.$el.querySelector('textarea').focus()
      })
    },

    onDelete () {
      this.$emit('delete', this.note)
    }
  }
}
</script>

<style lang="stylus">
.minota-note
  margin 0.5rem 0
.minota-note__actions
  font-size 80%
  text-align right
</style>
