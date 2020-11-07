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
import Server from './extend/Server'
import { advanceComponents } from './components/componentsConfig'
import config from './config'

Vue.use(Antd)
Vue.use(VueRouter)
Vue.component(MakingForm.name, MakingForm)
Vue.component(GenerateForm.name, GenerateForm)
window.EMA = EmaProxy

window.EMA.bind('alert.show', (title, fn) => {
  Vue.prototype.$error({
    title: '注意',
    content: title,
    onOk () {
      typeof fn == 'function' && fn()
    },
  })
})

window.EMA.bind('logout', () => {
  logout()
})

function logout () {
  window.localStorage.removeItem('token')
  // 删除指定的cookie信息
  window.location.replace(`${config.ADMIN_PATH}login`)
}

function getUrlParams(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

async function getComponent () {
  const projectId = getUrlParams('projectId')
  if (!projectId) {
    return;
  }
  return Server({
    url: 'api/component/list',
    method: 'post',
    needLoading: true,
    data: {
      projectId: +projectId,
      includeContent: true
    }
  }).then(({ data }) => {
    return data.list || []
  })
}

Vue.config.devtools = process.env.NODE_ENV !== 'production'
const router = new VueRouter(routerMap)

async function startApp () {
  const list = await getComponent()
  const promises = list.map(async ({ path, npmName }) => {
    const res = await fetch(`http://127.0.0.1:7001${path}`).then(res => res.text())
    return { content: res, npmName }
  })
  for (let promise of promises) {
    const { content, npmName: name } = await promise
    eval(content)
    const componentOptions = window[name].default
    advanceComponents.push(componentOptions.custom)
    delete componentOptions.custom
    Vue.component(componentOptions.name, componentOptions)
  }

  new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  })
}

startApp()
