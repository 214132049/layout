import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import 'normalize.css/normalize.css'
import App from './formEdit.vue'
import MakingForm from './components/Container.vue'
import GenerateForm from './components/GenerateForm.vue'
import './assets/style/form.styl'

Vue.use(Antd)

Vue.component(MakingForm.name, MakingForm)
Vue.component(GenerateForm.name, GenerateForm)

Vue.config.devtools = process.env.NODE_ENV !== 'production'

export default new Vue({
  el: '#app',
  render: h => h(App)
})
