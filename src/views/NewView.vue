<template>
  <div id="new">
    <div class="note">
      <editor>zok</editor>
    </div>
  </div>
</template>

<script>
import editor from '@/components/Editor.vue';

export default {
  name: 'new-view',
  components: {
    editor,
  },
};
</script>

<style lang="stylus">
.note
  background-color white
  box-shadow 0px 1px 5px 0px rgba(0, 0, 0, 0.05)
  border-radius 3px
  padding 3rem
  margin 0rem auto
  max-width 45rem
  @media (min-width: 960px)
    margin 2rem auto

</style>
s
