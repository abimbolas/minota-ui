<template lang="pug">
  .minota-viewer(v-html="content")
</template>

<script>
import marked from 'marked'

export default {
  name: 'Viewer',

  props: {
    value: {
      type: String,
      required: true,
      default: '(no content)'
    }
  },

  computed: {
    content () {
      return marked(this.value)
    }
  }
}
</script>
