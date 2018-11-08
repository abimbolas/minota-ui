<template>
  <div id="app">
    <!-- Debug nav -->
    <div id="nav">
      <div>
        <router-link to="/new">New</router-link> |
        <router-link to="/notes">Notes</router-link> |
        <!-- <router-link to="/about">About</router-link> -->
        <router-link to="/config">Config</router-link>
      </div>
      <div><small>Dropbox/Notes</small></div>
    </div>
    <!-- views -->
    <router-view/>
  </div>
</template>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Rubik:300,400,500&amp;subset=all');

body
  background-color ghostwhite
  padding 1em
  font-size 16px

body,
textarea,
input
  font-family Rubik, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  line-height 1.5
  font-weight 300
  color #333

h1
h2
h3
h4
h5
h6
strong
  font-weight 500

#nav
  display flex
  justify-content space-between

#nav a
  font-weight 500
  color #2c3e50

#nav a.router-link-exact-active
  color #42b983

</style>
