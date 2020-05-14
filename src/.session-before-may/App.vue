<template lang="pug">
  .minota-app
    h1 Hey, world!
    router-view
</template>

<script>
export default {
  name: 'App',

  created () {
    console.log('Minotá UI created')
  },

  beforeDestroy () {
    console.log('Minotá UI destroyed')
  }
}
</script>

<style lang="stylus">
</style>
