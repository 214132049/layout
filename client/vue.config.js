const path = require('path')

const configureWebpack = {
  resolve: {
    alias: {
      src: path.join(__dirname, 'src'),
    }
  },
  externals: {
    jQuery: 'jQuery',
    plupload: 'plupload',
  },
  module: {
    rules: []
  }
}

if (process.env.NODE_ENV === 'production') {
  configureWebpack.externals.vue = 'Vue'
  configureWebpack.externals['vue-router'] = 'VueRouter'
  configureWebpack.externals.vuex = 'Vuex'
}

module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  outputDir: 'dist',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pages: {
    index: {
      title: '可视化表单系统',
      entry: './src/main.js',
      filename: 'index.html',
      template: './index.ejs'
    },
    login: {
      title: '登录',
      entry: './src/login.js',
      filename: 'login.html',
      template: './login.ejs'
    },
    updatePassword: {
      title: '修改密码',
      entry: './src/updatePassword.js',
      filename: 'updatePassword.html',
      template: './updatePassword.ejs'
    },
    formEdit: {
      title: '表单编辑',
      entry: './src/formEdit.js',
      filename: 'formEdit.html',
      template: './formEdit.ejs'
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 3000,
    host: '127.0.0.1',
    publicPath: '/',
  },
  configureWebpack: configureWebpack,
  chainWebpack: config => {
    config.plugins.delete('preload-index')
    config.plugins.delete('prefetch-index')

    config.plugin('define').tap(args => {
      args[0]['process.env'].CODE_ENV = JSON.stringify(process.env.CODE_ENV)
      return args
    })
  }
}
