import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import filters from './filters'
// import '@/Material'
// import './registerServiceWorker';

// Object.keys(filters).forEach(key => {
//   Vue.filter(key, filters[key])
// })

// Register global components (uses webpack)
// https://vuejs.org/v2/guide/components-registration.html
const requireComponent = require.context('./components/global', false, /.+\.vue/)
requireComponent.keys().forEach(fileName => {
  const config = requireComponent(fileName)
  const name = config.default.name // expect to export as 'export default'
  Vue.component(name, config.default)
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
