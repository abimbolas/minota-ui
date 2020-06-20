import Vue from 'vue'
import Router from 'vue-router'

import TableComponent from '@/components/Table'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      redirect: '/table'
    },
    {
      name: 'table',
      path: '/table',
      component: TableComponent
    }
  ]
})
