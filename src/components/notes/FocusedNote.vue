<template lang="pug">
  .minota-focused-note(style-elevation="2")
    //- header
      .left {{ config.topic }}
    main
      editor(v-model="computedNote.content")
    //- footer
      .left.topic {{ config.topic }}
      .right.date {{ config.date | date }}
</template>

<script>
import { Reference } from '@/store/reference'
import Note from '@/models/note'
import { time } from '@/utils/time'
import Editor from '@/components/Editor'

export default {
  name: 'FocusedNote',

  components: {
    Editor
  },

  filters: {
    date (input) {
      return time(input).format('ll', 'ru')
    }
  },

  props: {
    note: {
      type: [ String, Object ],
      required: true,
      default: new Note({
        config: { id: 'loading', date: new Date() },
        content: 'loading...'
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

    config () {
      return this.computedNote.config
    }
  },

  created () {
    console.log(Reference[this.note])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-focused-note
  background-color white
  box-sizing border-box
  padding 0 1rem
  box-sizing border-box
  // border-radius 0.25rem
  // min-height 100vh
  // max-width 46em
  width 100%
  display flex
  flex-direction column
  align-items stretch
  // & > main
    // margin-top 1rem
    // margin-bottom 1rem
  & > footer
  & > header
    display flex
    font-size 80%
    color alpha(black, low-emphasis)
    .right
      margin-left auto
  & > header
    margin-bottom 1rem
  & > footer
    margin-top auto
    align-items flex-end

  & > footer
    .left
      margin-left -1rem
      margin-bottom -1rem
      padding 1rem
    .right
      margin-right -1rem
      margin-bottom -1rem
      padding 1rem

  .date
    white-space nowrap
</style>
