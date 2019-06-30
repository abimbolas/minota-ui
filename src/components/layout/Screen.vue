<template lang="pug">
  .minota-screen
    slot
</template>

<script>
export default {
  name: 'Screen'
}
</script>

<style lang="stylus">
.minota-screen
  flex-grow 1
  position relative
  & > main
    padding-left 16px
    padding-right 16px
    &:last-child
      padding-bottom 16px
</style>
