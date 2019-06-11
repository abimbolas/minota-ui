import Vue from 'vue'
import Router from 'vue-router'
import TableComponent from './components/screens/Table.vue'
import DrawerComponent from './components/screens/Drawer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/table'
    },
    {
      path: '/table',
      name: 'table',
      component: TableComponent
    },
    {
      path: '/drawer',
      name: 'drawer',
      component: DrawerComponent
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
