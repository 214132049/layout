import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './formEdit'
import FormMaking from './formMarking'

Vue.use(Antd)
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.use(FormMaking)

export default new Vue({
  el: '#app',
  render: h => h(App)
})
