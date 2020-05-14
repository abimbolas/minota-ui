import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import ConfigComponent from '@/components/Config'
import PoolComponent from '@/components/Pool'
import TableComponent from '@/components/Table'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/table'
    },
    //
    // Actions
    //
    {
      path: '/new',
      name: 'new'
    },
    //
    // Core
    //
    {
      path: '/table',
      name: 'table',
      props: route => ({
        context: route.query.context,
        focus: !route.query.focus ? [] : (Array.isArray(route.query.focus) ? route.query.focus : [route.query.focus]),
        pool: route.query.pool === 'true'
      }),
      component: TableComponent
    },
    {
      path: '/pool',
      name: 'pool',
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
  const guards = {
    new: navigationGuardNew
  }
  if (guards[to.name]) {
    guards[to.name](store, to, from, next)
  } else {
    next()
  }
})

function navigationGuardNew (store, to, from, next) {
  store.dispatch('newNoteAction', {
    note: {
      config: {
        topic: to.query.topic || ''
      }
    }
  }).then(note => {
    next({
      name: 'table',
      query: {
        focus: note.id
      }
    })
  }).catch(error => {
    console.warn('navigationGuardNew:', error)
    next()
  })
}

export default router
