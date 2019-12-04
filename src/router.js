import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import ConfigComponent from '@/components/screen/Config'
import PoolComponent from '@/components/screen/Pool'
import TableComponent from '@/components/screen/Table'
import { tableNavigationGuard } from '@/store/table'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/note/'
    },
    //
    // Actions
    //
    {
      path: '/new',
      name: 'new',
      redirect: '/note/new'
    },
    {
      path: '/table',
      name: 'table',
      redirect: '/note'
    },
    //
    // Core
    //
    {
      path: '/note/:noteId?',
      name: 'note',
      props: route => ({
        topic: route.query.topic,
        noteId: route.params.noteId
      }),
      component: TableComponent
    },
    {
      path: '/notes',
      name: 'notes',
      props: route => ({
        topic: route.query.topic
      }),
      component: PoolComponent
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigComponent
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})

router.beforeEach(function (to, from, next) {
  if (to.name.match(/note|table|new/)) {
    tableNavigationGuard(store, to, from, next)
  } else {
    next()
  }
})

export default router
