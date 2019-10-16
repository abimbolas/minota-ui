<template lang="pug">
  .minota-topic-breadcrumbs
    .topic-item(v-for="topicItem in topicItems" v-bind:key="topicItem.index")
      router-link(v-bind:to="getContextLink(topicItem)") {{ topicItem.label }}
</template>

<script>
import { topicDelimiter } from '@/store/ui'

export default {
  name: 'TopicBreadcrumbs',

  props: {
    topic: {
      type: String,
      required: true
    }
  },

  computed: {
    topicItems () {
      return this.topic
        .split(topicDelimiter)
        .map((label, index) => ({ label, index }))
    }
  },

  methods: {
    getContextLink (topicItem) {
      const context = this.topicItems
        .slice(0, topicItem.index + 1)
        .map(item => item.label)
        .join(topicDelimiter)
      return `/notes?topic=${context}`
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-topic-breadcrumbs
  display flex
  .topic-item
    &:after
      content '/'
      margin 0 0.25rem
      color text-dark-medium-emphasis
    &:last-child:after
        content ''
    a
      color text-dark-high-emphasis
      text-decoration none
      &:hover
        text-decoration underline
</style>
