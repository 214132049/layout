import Vue from 'vue'

const defaultHeaderIcon = require('../assets/image/header/default.png')
const defaultProjectIcon = require('../assets/image/project/cover-media.jpg')
/**
 * 时间格式化
 */
Vue.filter('datetime', function (value, format) {
  return (new Date(value)).Format(format || 'yyyy-MM-dd hh:mm')
})

/**
 * 时间格式化，只显示月日
 */
Vue.filter('daytime', function (value, format) {
  return (new Date(value)).Format(format || 'MM-dd')
})

/**
 * 默认头像
 */
Vue.filter('defaultHeader', function (value) {
  value = value || defaultHeaderIcon
  return value
})
/**
 * 默认项目图片
 */
Vue.filter('defaultProject', function (value) {
  value = value || defaultProjectIcon
  return value
})
