import Vue from 'vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import EmaProxy from 'ema-proxy'
import App from './app'
import store from './store'
import './assets/js/base'
import './extend/filter'
import './assets/style/base.css'
import routerMap from './RouterMap'

Vue.use(Antd)
Vue.use(VueRouter)
Vue.config.devtools = process.env.NODE_ENV !== 'production'

window.EMA = EmaProxy

const router = new VueRouter(routerMap)

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    return next()
  }
  if (!window.localStorage.getItem('loginuser')) {
    next('/login')
  }
})

export default new Vue({
  el: '#app',
  store: store,
  router: router,
  render: h => h(App)
})
