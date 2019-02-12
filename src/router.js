import Vue from 'vue'
import Router from 'vue-router'
// import NoteView from "./views/NoteView.vue";
// import NotesView from "./views/NotesView.vue";
import TableComponent from './components/screens/Table.vue'
import DrawerComponent from './components/screens/Drawer.vue'
// import Config from "./components/Config.vue";
// import Home from './views/Home.vue';
// import NewNote from "./views/new.vue";
// import Notes from "./views/notes.vue";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      // component: TableComponent
      redirect: "/table"
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
    // {
    //   path: "/config",
    //   name: "config",
    //   component: Config
    // },
    // {
    //   path: "/table",
    //   name: "table",
    //   component: Table
    // },
    // {
    //   path: "/notes",
    //   name: "notes",
    //   component: NotesView
    // },
    // {
    //   path: "/notes/:id",
    //   name: "note",
    //   component: NoteView
    // }
  ]
})
