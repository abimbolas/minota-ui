<template lang="pug">
  screen-placeholder-component(
    v-bind:text="item.text"
    v-bind:image="item.image"
  )
</template>

<script>
import { mapGetters } from 'vuex'
import ScreenPlaceholderComponent from '@/components/ScreenPlaceholder'

export default {
  name: 'ScreenQuotePlaceholder',

  components: {
    ScreenPlaceholderComponent
  },

  data () {
    return {
      item: {
        text: '',
        image: ''
      }
    }
  },

  computed: {
    ...mapGetters([
      'getPlaceholderQuotes'
    ])
  },

  created () {
    this.refreshPlaceholder()
  },

  methods: {
    refreshPlaceholder () {
      this.item = this.getPlaceholderQuotes[parseInt(Math.random() * this.getPlaceholderQuotes.length, 10)]
    }
  }
}
</script>
