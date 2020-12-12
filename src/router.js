import Vue from 'vue'
import Router from 'vue-router'

import Note from '@/components/Note'
import Notes from '@/components/Notes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      redirect: '/note'
    },
    {
      name: 'note',
      path: '/note',
      component: Note
    },
    {
      name: 'notes',
      path: '/notes',
      component: Notes
    }
  ]
})

router.beforeEach(function (to, from, next) {
  if (document && document.body) {
    document.documentElement.setAttribute('name', to.name)
  }
  next()
})

export default router
