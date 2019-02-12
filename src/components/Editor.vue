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
    }
  },

  data () {
    return {
      placeholder: 'Write down your mind'
    }
  },

  watch: {
    // Update editor on model changes
    value (val) {
      if (val !== this.simplemde.value()) {
        this.simplemde.value(val)
      }
    }
  },

  mounted () {
    // Init DOM elements
    this.simplemde = new SimpleMDE({
      element: this.$el.querySelector('textarea'),
      spellChecker: false,
      toolbar: false,
      status: false,
      autofocus: true,
      initialValue: this.value,
      placeholder: this.placeholder,
      renderingConfig: {
        codeSyntaxHighlighting: true
      }
    })

    // Bind model update (on timeout)
    this.simplemde.codemirror.on('change', () => {
      clearTimeout(this.changeTimeout)
      this.clearTimeout = setTimeout(() => {
        this.$emit('input', this.simplemde.value())
      }, this.delay)
    })

    // // Bind special events
    // this.unsubscribe = this.$store.subscribe(mutation => {
    //   if (mutation.type === 'toggleEditorFullscreen') {
    //     setTimeout(() => {
    //       this.simplemde.codemirror.refresh()
    //     }, 200)
    //   }
    // })
  },

  beforeDestroy () {
    this.simplemde.toTextArea()
    this.simplemde = null
    // this.unsubscribe()
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

  .CodeMirror
    border none
    background-color transparent
    padding 0px
    margin-left -4px
    width calc(100% + 8px)
    min-height 3rem

    .CodeMirror-scroll
      min-height 3rem

    .CodeMirror-code
      .cm-header
        line-height 1.5
        font-weight 400
      .cm-link
        word-break break-word
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
