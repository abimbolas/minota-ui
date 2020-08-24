<template lang="pug">
  .minota-note(v-bind:mode="mode")
    //- Header
    .minota-note__header(v-bind:scroll-overflow="hasTopOverflow")
      slot(name="header-actions")
    //- Main
    .minota-note__main(
      v-scroll-overflow
      v-on:scroll-overflow="scrollOverflow = $event.detail")
      .minota-note__editor(
        contenteditable
        v-on:input="onInput($event)"
        v-cursor-position
        v-on:cursor-near-start="$emit('cursor-near-start')"
        v-on:cursor-near-end="$emit('cursor-near-end')")
    //- Footer
    .minota-note__footer(v-bind:scroll-overflow="hasBottomOverflow")
      slot(name="footer-actions")
</template>

<script>
import { mapActions } from 'vuex'
import bus from '@/event-bus'
import Note from '@/models/note'
import cursorPosition from '@/directives/cursor-position'
import scrollOverflow from '@/directives/scroll-overflow'

export default {
  name: 'Note',

  directives: {
    cursorPosition,
    scrollOverflow
  },

  props: {
    note: {
      type: Object,
      required: true,
      default () {
        return new Note()
      }
    },

    mode: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      scrollOverflow: ''
    }
  },

  computed: {
    hasBottomOverflow () {
      return this.scrollOverflow.match('bottom')
    },

    hasTopOverflow () {
      return this.scrollOverflow.match('top')
    }
  },

  watch: {
    'note' (note) {
      this.syncEditor()
    },

    'note.content' (content) {
      let innerText = this.$el.querySelector('[contenteditable]').innerText
      if (content !== innerText) {
        console.warn('note out of sync', content, innerText)
      }
    },

    'mode' (mode) {
      this.updateScrollOverflow()
    }
  },

  created () {
    bus.$on(`focus-note-${this.note.id}`, this.onFocusNote.bind(this))
  },

  mounted () {
    this.syncEditor()
  },

  methods: {
    onInput (event) {
      this.updateNoteAction({
        note: this.note,
        update: {
          content: event.target.innerText,
          config: {
            updated: new Date()
          }
        }
      })
    },

    onFocusNote () {
      this.$el.querySelector('[contenteditable]').focus()
      requestAnimationFrame(() => {
        this.$el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start'
        })
      })
    },

    syncEditor () {
      this.$el.querySelector('[contenteditable]').innerText = this.note.content || ''
      this.updateScrollOverflow()
    },

    updateScrollOverflow () {
      let el = this.$el.querySelector('.minota-note__main')
      if (el) {
        requestAnimationFrame(() => {
          el.dispatchEvent(new CustomEvent('observe-overflow'))
        })
      }
    },

    ...mapActions([
      'updateNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import '~@/assets/styles/variables'

.minota-note
  display flex
  flex-direction column
  position relative
  border-radius 0.25rem
  font-family sans-family
  font-size 18px
  width 100%
  min-height 100%
  // padding 8vh 8% 10vh 8%
  // max-width calc(42rem + 16%)
  background-color white
  box-sizing border-box
  box-shadow 0px 0px 0px 2px alpha(black, 0.05)

  &[mode]
    min-height 0
    height 100%

.minota-note__header
.minota-note__footer
  font-size 1rem
  line-height 1.5rem
  padding 0.5rem
  box-sizing border-box
  flex-basis 2rem
  min-height 2rem
  flex-grow 0
  flex-shrink 0

.minota-note__header
  top 0
  left 0
  right 0
  display flex
  align-items flex-start
  flex-basis 4.5rem
  min-height 4.5rem

.minota-note__footer
  bottom 0
  left 0
  right 0
  flex-basis 4.5rem
  min-height 4.5rem
  align-items flex-end
  display flex

.minota-note__main
  flex-shrink 1
  flex-grow 1
  padding 0 8%
  overflow scroll
  padding-top 0rem
  padding-bottom 1.5rem

.minota-note__header[scroll-overflow]
  position relative
  &:before
    content ' '
    position absolute
    border-bottom dashed 2px alpha(black, 0.125)
    bottom -2px
    left 50%
    transform translateX(-50%)
    width 100%

.minota-note__footer[scroll-overflow]
  position relative
  &:before
    content ' '
    position absolute
    border-top dashed 2px alpha(black, 0.125)
    top -2px
    left 50%
    transform translateX(-50%)
    width 100%

.minota-note__action
  cursor pointer
  width 32px
  text-align center
  height 32px
  display block
  user-select none
  color alpha(black, medium-emphasis)
  .material-icons
    line-height 32px
    display block

.minota-note__editor
  width 100%
  flex-grow 1
  outline none
  &:empty:before
    content '(Заметка девственно чиста)'
    opacity low-emphasis
</style>
