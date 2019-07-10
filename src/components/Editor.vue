<template lang="pug">
  .minota-editor
    textarea(spellcheck="false")
</template>

<script>
import SimpleMDE from 'simplemde'

export default {
  name: 'Editor',

  props: {
    value: {
      type: String,
      required: true,
      default: ''
    },
    delay: {
      type: Number,
      required: false,
      default: 250
    },
    autofocus: {
      type: Boolean,
      required: false,
      default: false
    },
    cursor: {
      type: Object,
      required: false,
      default () {
        return { line: 0, ch: 0 }
      }
    }
  },

  data () {
    return {
      placeholder: 'Write down your mind'
    }
  },

  watch: {
    value (val) {
      if (val !== this.simplemde.value()) {
        this.simplemde.value(val)
      }
    }
  },

  mounted () {
    // Init DOM
    this.simplemde = new SimpleMDE({
      element: this.$el.querySelector('textarea'),
      autofocus: this.autofocus,
      spellChecker: false,
      toolbar: false,
      status: false,
      initialValue: this.value,
      placeholder: this.placeholder,
      renderingConfig: {
        codeSyntaxHighlighting: true
      }
    })

    // set cursor position
    this.simplemde.codemirror.setCursor(this.cursor)
    this.simplemde.codemirror.focus()

    // export Esc key event
    this.simplemde.codemirror.on('keyHandled', (instance, name) => {
      if (name.toLowerCase() === 'esc') {
        this.$emit('editor-esc')
      }
    })

    // Bind model update (on timeout)
    this.simplemde.codemirror.on('change', () => {
      clearTimeout(this.changeTimeout)
      this.clearTimeout = setTimeout(() => {
        this.$emit('input', this.simplemde.value())
      }, this.delay)
    })
  },

  beforeDestroy () {
    this.simplemde.toTextArea()
    this.simplemde = null
    clearTimeout(this.changeTimeout)
  }
}
</script>

<style lang="stylus">
@import '~simplemde/dist/simplemde.min.css'
@import '~@/assets/styles/variables'

.minota-editor
  display block
  margin 0 auto
  cursor text
  font-size 14px
  font-weight 400
  line-height: 1.75

  .CodeMirror
    border none
    background-color transparent
    padding 0px
    margin-left -4px
    width calc(100% + 8px)
    min-height 3rem

    .CodeMirror-scroll
      min-height 3rem

    .CodeMirror-line
      color alpha(black, medium-emphasis)

    .CodeMirror-code
      .cm-header
        line-height 1.5
        font-weight 400
        color alpha(black, high-emphasis)
      .cm-link
        word-break break-word
        color inherit
      .cm-header-6
        font-size 1em
      .cm-header-5
        font-size 1em
      .cm-header-4
        font-size 1em
      .cm-header-3
        font-size 1.125em
      .cm-header-2
        font-size 1.25em
        line-height 1.375
      .cm-header-1
        font-size 1.5em
        line-height 1.375
      .cm-formatting-header
        color gainsboro
        font-weight 300

      .cm-strong
        font-weight 500
</style>
