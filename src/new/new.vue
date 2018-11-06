<template>
  <div id="new">
    <h1>New note</h1>
    <editor>zok</editor>
  </div>
</template>

<script>
import editor from '@/components/Editor.vue';

export default {
  name: 'new',
  components: {
    editor,
  },
};
</script>

<style lang="stylus">
#new
  background-color whitesmoke

</style>
