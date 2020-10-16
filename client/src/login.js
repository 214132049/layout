import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import EmaProxy from 'ema-proxy'
import './assets/js/base'

import Login from './login.vue'

Vue.use(Antd)
Vue.config.devtools = process.env.NODE_ENV !== 'production'

window.EMA = EmaProxy

new Vue({
  el: '#app',
  render: h => h(Login)
})
