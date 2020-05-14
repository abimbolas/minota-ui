<template lang="pug">
  .minota-note
    textarea(v-model="note.content" placeholder="Что в голове?")
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
    'note.content' (content) {
      this.$emit('update', { content })
    }
  }
}
</script>
