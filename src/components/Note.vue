<template lang="pug">
  .minota-note
    header
      small.left {{ value.config.id }}
      .right
        span.note-action(
          v-if="space === 'focus'"
          @click.prevent.stop="blurNoteAction({ note: value })")
          i.material-icons call_received
        span.note-action(
          v-if="space === 'blur'"
          @click.prevent.stop="focusNoteAction({ note: value })")
          i.material-icons call_made
        span.note-action(
          @click.prevent.stop="closeNoteAction({ note: value })")
          i.material-icons(style="position: relative; top: 2px;") close
        span.note-action(@click.prevent.stop="deleteNoteAction({ note: value })")
          i.material-icons delete_outline
    editor(v-if="mode === 'edit'" v-model="content")
    viewer(v-if="mode !== 'edit'" v-model="content")
    footer
      .left {{ value.config.topic }}
      .right {{ timestamp }}
</template>

<script>
import { mapActions } from 'vuex'
import { debounce } from '@/utils/debounce'
import { time } from '@/utils/time'
import Note from '@/models/note'
import Editor from '@/components/Editor'
import Viewer from '@/components/Viewer'

export default {
  name: 'Note',

  components: {
    Editor,
    Viewer
  },

  props: {
    value: {
      type: Note,
      required: true
    },

    mode: {
      type: String,
      required: false,
      default: 'view'
    },

    space: {
      type: String,
      required: false,
      default: 'focus'
    }
  },

  data () {
    return {
      content: this.value.content,
      debounce: debounce(),
      delay: 350
    }
  },

  computed: {
    timestamp () {
      return time(this.value.config.date).format('ll', 'ru')
    }
  },

  watch: {
    content (newContent, oldContent) {
      this.debounce(() => {
        this.value.content = newContent
        this.saveNoteAction({ note: this.value })
      }, this.delay)
    }
  },

  // created () {
  //   console.log('note created', this.value.config.id)
  // },

  // mounted () {
  //   console.log('note mounted', this.value.config.id)
  // },

  methods: {
    ...mapActions([
      'saveNoteAction',
      'blurNoteAction',
      'focusNoteAction',
      'closeNoteAction',
      'deleteNoteAction'
    ])
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/variables";

.minota-note
  background-color white
  box-shadow 0px 1px 5px 0px rgba(0, 0, 0, 0.25)
  border-radius 3px
  box-sizing border-box
  width 100%
  margin-left auto
  margin-right auto
  position relative
  transition box-shadow, font-size 0.2s
  align-self stretch
  padding 1rem
  position relative
  .minota-viewer
    ul
    ol
      padding-left 1.375em
    &>:first-child
      margin-top 0
  header
  footer
    display flex
    opacity 0.75
    font-size small
    .left
      margin-right auto
    .right
      margin-left auto
      display flex
      justify-content flex-end
      align-items center
  footer
    margin-top 2rem
  header
    margin-bottom 1rem

  .note-action
    display block
    width 2rem
    line-height 2rem
    height 2rem
    text-align center
    cursor pointer
    i
      line-height inherit
      display block

.minota-focus
  .minota-note
    @media (min-width screen-sm)
      padding 2rem
    @media (min-width screen-md)
      padding 3rem
      max-width 46em
    @media (min-width screen-lg)
      padding 4rem
      max-width 48em
    @media (min-width screen-xl)
      padding 5rem
      max-width 52em
</style>
