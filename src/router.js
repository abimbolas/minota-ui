import Vue from 'vue'
import Router from 'vue-router'

// import TableComponent from '@/components/Table'
import LevelNoteComponent from '@/components/LevelNote'
import LevelNotesComponent from '@/components/LevelNotes'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
      component: LevelNoteComponent
    },
    {
      name: 'notes',
      path: '/notes',
      component: LevelNotesComponent
    }
    // {
    //   name: 'table',
    //   path: '/table',
    //   component: TableComponent
    // },
  ]
})

router.beforeEach(function (to, from, next) {
  if (document && document.body) {
    document.documentElement.setAttribute('name', to.name)
  }
  next()
})

export default router
