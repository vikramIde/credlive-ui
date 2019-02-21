import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
// import '@/bootstrap/bootstrap.min.css'// A bootstrap css

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import VueParticles from 'vue-particles'
// import VuePrism from 'vue-prism'


import '@/icons' // icon
import '@/permission' // permission control

//Hi

Vue.use(ElementUI, { locale })
Vue.use(VueParticles)
Vue.config.productionTip = false

// export const globalStore = new Vue({
//   data: {
//     userDetails: {}
//   }
// })

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
