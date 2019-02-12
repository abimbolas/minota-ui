<template lang="pug">
  .minota-archive-note(v-on:click="$emit('open')" theme="light")
    //- .date.text-overline {{ config.date | date }}
    .topic.text-overline(v-if="config.topic") {{ config.topic }}
    .title.text-subtitle(v-if="title") {{ title }}
    .description.text-caption(
      v-if="description"
      v-bind:class="descriptionClass"
    ) {{ description }}
    //- .actions Actions
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
import Note from '@/models/note'
import { Reference } from '@/store/reference'
import { time } from '@/utils/time'
import bus from '@/event-bus'

export default {
  name: 'ArchiveNote',

  filters: {
    date (input) {
      return time(input).format('l', 'ru')
    }
  },

  props: {
    note: {
      type: [ String, Object ],
      required: true,
      default: new Note({
        content: 'I am loading...',
        config: {
          id: 'loading',
          date: new Date()
        }
      })
    }
  },

  computed: {
    computedNote () {
      return typeof this.note === 'string' ? Reference[this.note] : this.note
    },
    content () {
      return this.computedNote.content
    },
    title () {
      const match = this.computedNote.content.match(/^#.+\n/g)
      return match ? match[0].replace(/^#+/, '').trim() : ''
    },
    description () {
      const lines = this.computedNote.content.split('\n')
      if (lines[0].match(/^#.+$/)) {
        return lines.slice(1).join('\n')
      } else {
        return lines.join('\n')
      }
    },
    descriptionClass () {
      const topic = this.computedNote.config.topic
      const title = this.title
      return {
        'one-line': topic && title,
        'two-line': (topic && !title) || (!topic && title),
        'three-line': !topic && !title
      }
    },
    config () {
      return this.computedNote.config
    }
  },

  methods: {
    openNote () {
      bus.$emit('scroll-top')
      bus.$emit('scroll-start')
      this.setView({ view: 'table' })
      this.focusNoteAction({ note: this.computedNote })
    },
    ...mapMutations([
      'setView'
    ]),
    ...mapActions([
      'focusNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-archive-note
  padding 1rem 0
  line-height 1.25rem
  min-height 3rem
  overflow hidden
  position relative

  &:after
    content ''
    display block
    height 1px
    // margin 0px 1rem
    position absolute
    bottom 0
    left 0
    right 0
    background-color alpha(white, 0.1)
  &:last-child:after
    content none

  .title
    position relative
    top -1px
    color alpha(white, high-emphasis)
    white-space nowrap
    overflow hidden
    text-overflow ellipsis

  .topic
    color alpha(white, low-emphasis)
    white-space nowrap
    overflow hidden
    text-overflow ellipsis

  .date
    color alpha(white, low-emphasis)
    float right
    margin-left 1rem
    margin-bottom 1rem

  .description
    overflow hidden
    color alpha(white, medium-emphasis)
    &.one-line
      white-space nowrap
      text-overflow ellipsis
    &.two-line
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      height 2.5rem
    &.three-line
      display -webkit-box
      -webkit-line-clamp 3
      -webkit-box-orient vertical
      height 3.75rem

  &[theme="light"]
    &:after
      background-color gainsboro
    .title
      color alpha(black, medium-emphasis)
      font-weight 500
    .topic
      color alpha(black, low-emphasis)
    .date
      color alpha(black, low-emphasis)
    .description
      color alpha(black, medium-emphasis)
      font-weight 400

</style>
