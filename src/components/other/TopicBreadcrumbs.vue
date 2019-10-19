<template lang="pug">
  .minota-topic-breadcrumbs
    .topic-item(v-for="topicItem in topicItems" v-bind:key="topicItem.index")
      a(v-on:click="$emit('set-topic', getFullTopic(topicItem))") {{ topicItem.label }}
      //- router-link(v-bind:to="getContextLink(topicItem)") {{ topicItem.label }}
    //- .topic-item
      i.material-icons(style="font-size: 1rem") highlight_off
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
    // getContextLink (topicItem) {
    //   const context = this.topicItems
    //     .slice(0, topicItem.index + 1)
    //     .map(item => item.label)
    //     .join(topicDelimiter)
    //   return `/notes?topic=${context}`
    // },
    getFullTopic (topicItem) {
      return this.topicItems
        .slice(0, topicItem.index + 1)
        .map(item => item.label)
        .join(topicDelimiter)
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
      cursor pointer
      &:hover
        text-decoration underline
</style>
