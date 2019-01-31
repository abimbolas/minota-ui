<template lang="pug">
  .minota-app
    .minota-app-header(v-bind:class="viewClasses")
      actions-component
    .minota-app-main
      .minota-app-views(v-bind:class="viewClasses")
        .minota-app-view
          table-component
        .minota-app-view
          drawer-component
    .minota-app-footer(v-bind:class="viewClasses")

</template>

<script>
import { mapGetters } from 'vuex'
import ActionsComponent from '@/components/Actions'
import DrawerComponent from '@/components/Drawer'
import TableComponent from '@/components/Table'
import BodyScrollTopOn from '@/directives/body-scroll-top-on'
import ScrollStartOn from '@/directives/scroll-start-on'

export default {
  name: 'App',

  components: {
    ActionsComponent,
    DrawerComponent,
    TableComponent
  },

  directives: {
    BodyScrollTopOn,
    ScrollStartOn
  },

  computed: {
    viewClasses () {
      return {
        table: this.getView === 'table',
        drawer: this.getView === 'drawer'
      }
    },
    ...mapGetters([
      'getFocus',
      'getView'
    ])
  },

  mounted () {
    // Remove preloader screen
    setTimeout(() => {
      // const appPreloader = document.getElementById('app-preloader')
      // appPreloader.classList.add('app-loaded')
      setTimeout(() => {
        // appPreloader.remove()
      }, 1000)
    }, 3000)
  }
}
</script>

<style lang="stylus">
@import "~@/assets/styles/index"
@import "~@/assets/styles/variables"

html
body
  margin 0
  padding 0
  background-color ghostwhite
  color alpha(black, high-emphasis)

.minota-app
  width 100vw
  height 100vh
  overflow hidden
  z-index 0
  display flex
  flex-direction column
  justify-content value

.minota-app-header
.minota-app-footer
  flex-basis 48px
  min-height 48px
  flex-shrink 0
  z-index 1
  // transition background-color 0.3s ease-out

.minota-app-main
  flex-grow 1
  overflow hidden
  display flex
  z-index 0

.minota-app-views
  display flex
  position relative
  // transition left 0.3s ease-out

.minota-app-view
  overflow-y auto
  -webkit-overflow-scrolling touch
  display flex
  width 100vw

.minota-app-views.table
  left 0vw

.minota-app-views.drawer
  left -100vw

.minota-app-header.table
.minota-app-footer.table
  background-color white
.minota-app-header.drawer
.minota-app-footer.drawer
  background-color ghostwhite
</style>
