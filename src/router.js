import Vue from 'vue'
import Router from 'vue-router'

import Note from '@/components/Note'
import Notepad from '@/components/Notepad'
import Notebook from '@/components/Notebook'

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
      name: 'notepad',
      path: '/notepad',
      component: Notepad
    },
    {
      name: 'notebook',
      path: '/notebook',
      component: Notebook
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
