<template lang="pug">
  .minota-editor
    textarea(spellcheck="false")
</template>

<script>
import { mapActions } from 'vuex'
import SimpleMDE from 'simplemde'
import bus from '@/event-bus'

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
    },
    focusOn: {
      type: String,
      required: false,
      default: ''
    }
  },

  data () {
    return {
      placeholder: 'Write down your mind',
      historyInitialized: false
    }
  },

  watch: {
    'value' (val) {
      if (val !== this.simplemde.value()) {
        this.simplemde.value(val)
      }
      // Remove first entry from undo history
      if (val && !this.historyInitialized) {
        this.simplemde.codemirror.getDoc().clearHistory()
        this.historyInitialized = true
      }
    },
    'cursor' (val) {
      this.simplemde.codemirror.setCursor(val)
    }
  },

  created () {
    // Bind manual programmatic focus
    if (this.focusOn) {
      bus.$on(this.focusOn, this.focusEditor)
    }
  },

  mounted () {
    // Init SimpleMDE/CodeMirror
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

    // Set initial cursor position
    this.simplemde.codemirror.setCursor(this.cursor)
    this.simplemde.codemirror.focus()

    // Bind events
    this.simplemde.codemirror.on('keyHandled', this.codemirrorOnKeyHandled)
    this.simplemde.codemirror.on('change', this.codemirrorOnChange)
    this.simplemde.codemirror.on('mousedown', this.codemirrorOnMousedown)
  },

  beforeDestroy () {
    if (this.focusOn) {
      bus.$off(this.focusOn, this.focusEditor)
    }
    this.simplemde.codemirror.off('keyHandled', this.codemirrorOnKeyHandled)
    this.simplemde.codemirror.off('change', this.codemirrorOnChange)
    this.simplemde.codemirror.off('mousedown', this.codemirrorOnMousedown)
    this.simplemde.toTextArea()
    this.simplemde = null
    clearTimeout(this.changeTimeout)
  },

  methods: {
    focusEditor () {
      this.simplemde.codemirror.focus()
    },

    codemirrorOnKeyHandled (instance, name) {
      if (name.toLowerCase() === 'esc') {
        this.$emit('editor-esc')
      }
    },

    codemirrorOnChange (instance, change) {
      clearTimeout(this.changeTimeout)
      this.changeTimeout = setTimeout(() => {
        this.$emit('input', this.simplemde.value())
      }, this.delay)
    },

    codemirrorOnMousedown (instance, event) {
      if (event.target.closest('.cm-link')) {
        this.redirectToTextContent(event.target)
      } else if (event.target.closest('.cm-formatting-task')) {
        this.toggleTask(instance)
      }
    },

    redirectToTextContent (element) {
      const url = element.textContent
      this.openModalAction({
        modal: {
          header: 'Open URL',
          body: url,
          ok: {
            label: 'Open'
          }
        }
      }).then(() => {
        window.open(url, '_blank')
      }).catch(() => {
        this.simplemde.codemirror.focus()
      })
    },

    toggleTask (instance) {
      setTimeout(() => {
        let cursor = instance.doc.sel.ranges[0].anchor
        let textLines = this.simplemde.value().split('\n')
        let textLine = textLines[cursor.line]
        let task = textLine.substring(cursor.ch - 3, cursor.ch + 3)
        if (task.indexOf('[ ]') > -1) {
          task = task.replace('[ ]', '[x]')
        } else if (task.indexOf('[x]') > -1) {
          task = task.replace('[x]', '[ ]')
        }
        textLines[cursor.line] = [
          textLine.substring(0, cursor.ch - 3),
          task,
          textLine.substring(cursor.ch + 3, textLine.length)
        ].join('')
        this.simplemde.value(textLines.join('\n'))
        this.simplemde.codemirror.setCursor(cursor)
      })
    },

    ...mapActions([
      'openModalAction'
    ])
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
  font-weight 400
  font-size 15px
  line-height: 1.75
  @media (min-width screen-sm)
    font-size 17px

  .CodeMirror
    border none
    background-color transparent
    padding 0px
    margin-left -4px
    width calc(100% + 8px)
    min-height 3rem
    font-family mono-family
    letter-spacing -0.0125rem

    .CodeMirror-scroll
      min-height 3rem

    .CodeMirror-line
      color alpha(black, medium-emphasis)

    .cm-header
      line-height 1.5
      font-weight 500
      color alpha(black, high-emphasis)
      // font-family sans-family
    .cm-link
      word-break break-word
      color steelblue
      cursor pointer
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
      font-size 1.75em
      line-height 1.375
    .cm-formatting-header
      color gainsboro
      font-weight 300
    .cm-strong
      font-weight 600
      color alpha(black, high-emphasis - 0.1)
    .cm-formatting-list-ul
      font-family mono-family
    .cm-formatting-task
      font-family mono-family
      cursor pointer
    .cm-formatting-task.cm-property ~ span[class*='cm-']
      text-decoration line-through
</style>
