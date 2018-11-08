<template>
  <div class="editor">
    <textarea spellcheck="false"></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';

export default {
  name: 'editor',
  props: {
    value: String,
  },
  mounted() {
    this.simplemde = new SimpleMDE({
      element: this.$el.querySelector('textarea'),
      spellChecker: false,
      toolbar: false,
      status: false,
      autofocus: true,
      initialValue: this.value,
    });

    this.simplemde.codemirror.on('change', () => {
      this.$emit('input', this.simplemde.value());
    });
  },
  watch: {
    value(val) {
      if (val !== this.simplemde.value()) {
        this.simplemde.value(val);
      }
    },
  },
  destroyed() {
    this.simplemde.toTextArea();
    this.simplemde = null;
  },
};
</script>

<style lang="stylus">
@import '~simplemde/dist/simplemde.min.css';

.editor
  display block

  /*background-color ghostwhite*/
  /*padding 1rem*/
  /*box-shadow 0px 0px 1px 1px rgba(255, 100, 50, 0.2)*/
  cursor text

  .CodeMirror
    border none
    background-color transparent
    padding 0px
    margin-left -4px
    width calc(100% + 8px)

  .CodeMirror-line
    /*padding-left 0px*/
    /*padding-right 0px*/

  .CodeMirror,
  .CodeMirror-scroll
    min-height 50vh

  .cm-header,
  .cm-strong
    font-weight 500

</style>
