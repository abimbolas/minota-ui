<template>
  <div id="app">
    <div id="nav">
      <div>
        <router-link to="/new">New</router-link> |
        <!-- <router-link to="/about">About</router-link> -->
        <router-link to="/config">Config</router-link>
      </div>

      <div><small>Dropbox/Notes</small></div>

    </div>
    <router-view/>
  </div>
</template>

<style lang="stylus">
body
  padding 3em

#app
  font-family Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

#nav
  display flex
  justify-content space-between

#nav a
  font-weight bold
  color #2c3e50

#nav a.router-link-exact-active
  color #42b983

</style>
