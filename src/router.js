import Vue from 'vue';
import Router from 'vue-router';
// import Home from './views/Home.vue';
import NewView from './views/NewView.vue';
import ConfigView from './views/ConfigView.vue';
import NotesView from './views/NotesView.vue';
import NoteView from './views/NoteView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/new',
    },
    {
      path: '/config',
      name: 'config-view',
      component: ConfigView,
    },
    {
      path: '/new',
      name: 'new-view',
      component: NewView,
    },
    {
      path: '/notes',
      name: 'notes-view',
      component: NotesView,
    },
    {
      path: '/notes/:id',
      name: 'note-view',
      component: NoteView,
    },
  ],
});
