import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import './assets/js/base'
import './assets/style/base.css'

import Login from './login.vue'

Vue.use(Antd)
Vue.config.devtools = process.env.NODE_ENV !== 'production'

new Vue({
  el: '#app',
  render: h => h(Login)
})
