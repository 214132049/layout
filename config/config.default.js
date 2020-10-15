const I18n = require('i18n')
const path = require('path')

// 配置i18n
I18n.configure({
  locales: ['zh-CN'],
  defaultLocale: 'zh-CN',
  directory: path.join(__dirname, '/locale')
})

module.exports = (appInfo) => {
  const config = {}

  config.middleware = ['errorHandler']

  config.errorHandler = {
    enable: true,
    match: '/api'
  }

  config.validate = {
    translate () {
      const args = Array.prototype.slice.call(arguments)
      return I18n.__.apply(I18n, args)
    },
  }

  config.jwt = {
    secret: '123456'
  }

  // should change to your own
  config.keys = appInfo.name + '123456789'

  config.mongoose = {
    client: {
      url: 'mongodb+srv://214132049:aixixi062426@cluster0.jx18s.azure.mongodb.net/layout?retryWrites=true&w=majority',
      options: {}
    }
  }

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }

  config.security = {
    csrf: {
      enable: false
    }
  }

  return config
}
