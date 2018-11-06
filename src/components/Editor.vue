<template>
  <div class="editor">
    <textarea></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde';

export default {
  name: 'editor',
  mounted() {
    // Init
    this.mde = new SimpleMDE({
      element: this.$el.querySelector('textarea'),
    });
  },
};
</script>

<style lang="stylus">
@import '~simplemde/dist/simplemde.min.css';
.editor
  display block
  background-color ghostwhite

  textarea
    width 100%
    display block

</style>
