<template lang="pug">
  .minota-actions(v-bind:class="actionsClasses")
    //- .left
      div {{ getView }}
      .action
        i.material-icons menu
    .title(v-if="getView === 'table'")
      //- .context.text-overline(v-if="topicContext") {{ topicContext }}
      //- .specific.text-h6 {{ topicSpecific }}
      .specific.text-overline {{ topic }}
      //- .specific.text-h6 Заметка
    .right
      .action.search(
        v-if="getView === 'table'"
        v-on:click="setView({ view: 'drawer' })")
        i.material-icons search
      //- .action.more(
        v-if="getView === 'table' && getFocus.length")
        i.material-icons more_vert
      .action.close(
        v-if="getView === 'drawer'"
        v-on:click="setView({ view: 'table' })")
        i.material-icons close
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { Reference } from '@/store/reference'
export default {
  name: 'Actions',

  computed: {
    topic () {
      const focus = this.getFocus
      return focus.length ? Reference[focus[0]].config.topic : ''
    },
    topicSpecific () {
      return this.topic ? this.topic.split(' / ').slice(-1)[0] : ''
    },
    topicContext () {
      return this.topic ? this.topic.split(' / ').slice(0, -1).join(' / ') : ''
    },
    actionsClasses () {
      return this.getView
    },
    ...mapGetters([
      'getFocus',
      'getView'
    ])
  },

  methods: {
    setDrawerView () {
      this.setView({ view: 'drawer' })
    },
    ...mapMutations([
      'setView',
      'clearFocus'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-actions
  display flex
  color alpha(black, high-emphasis)
  z-index 100
  line-height 48px
  // align-items flex-start
  // box-shadow 0px 1px 0px 0px gainsboro
  .left
    display flex
    align-items center
    flex-basis 48px
    flex-shrink 0
  .right
    display flex
    align-items center
    margin-left auto
    flex-shrink 0
    flex-basis 48px

  .action
    height 48px
    width 48px
    text-align center
    line-height 48px
    cursor pointer
    .material-icons
      line-height inherit

  .title
    flex-shrink 1
    font-size 20px
    overflow hidden
    position relative
    &:first-child
      margin-left 1rem
  .context
  .specific
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
  .context + .specific
    margin-top -1.25rem
  .specific + .context
    margin-top -1.25rem

</style>
