import Vue from 'vue'
import axios from 'axios'
const config = require('../config')

const vueInstance = new Vue()

const instance = axios.create({
  baseURL: config.API_PATH,
  timeout: 30000,
  headers: {},
  withCredentials: true,
  needLoading: false,  // 是否需要加载效果
  ignoreCode: false  // 是否忽略服务端的错误提示
})
let hide = null
instance.interceptors.request.use(function (config) {
  if (config.needLoading) {
    hide = vueInstance.$message.loading('数据加载中...', 0)
  }
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  if (response.config.needLoading) {
    hide()
  }
  const code = response.data.code
  if (response.data.code && response.data.code !== 1 && !response.config.ignoreCode) {
    switch (code) {
      case 999:
        window.EMA.fire('alert.show', '用户认证失败,重新登录', function () {
          window.EMA.fire('logout')
        })
        break
      case -403:
        break
      default:
        window.EMA.fire('alert.show', response.data.message, function () {})
    }
    return Promise.reject(response)
  }
  return response
}, function (error) {
  const status = error.response.status
  const message = error.message
  if (status !== 200) {
    if (status === 401) {
      window.EMA.fire('alert.show', '用户认证失败,重新登录', function () {
        window.EMA.fire('logout')
      })
    } else if (status === 403) {
      window.EMA.fire('alert.show', '用户无权限,重新登录', function () {
        window.EMA.fire('logout')
      })
    } else if (status === 404) {
      window.EMA.fire('alert.show', '接口地址不存在', function () {})
    } else if (status === 422) {
      window.EMA.fire('alert.show', '传递参数错误', function () {})
    } else {
      window.EMA.fire('alert.show', message, function () {})
    }
  }
  return Promise.reject(error)
})

export default instance
