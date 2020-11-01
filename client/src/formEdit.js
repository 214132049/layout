import Vue from 'vue'
import Antd from 'ant-design-vue'
import VueRouter from 'vue-router'
import EmaProxy from 'ema-proxy'
import 'ant-design-vue/dist/antd.css'
import 'normalize.css/normalize.css'
import App from './formEdit.vue'
import routerMap from './RouterMap'
import MakingForm from './components/Container.vue'
import GenerateForm from './components/GenerateForm.vue'
import './assets/style/form.styl'


Vue.use(Antd)
Vue.use(VueRouter)
Vue.component(MakingForm.name, MakingForm)
Vue.component(GenerateForm.name, GenerateForm)
window.EMA = EmaProxy
Vue.config.devtools = process.env.NODE_ENV !== 'production'
const router = new VueRouter(routerMap)

export default new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
