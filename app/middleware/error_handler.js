const I18n = require('i18n');

// 配置i18n
I18n.configure({
  locales: ['zh-CN'],
  defaultLocale: 'zh-CN',
  directory: 'config/locale',
});

module.exports = () => {
  return async function errorHandler (ctx, next) {
    try {
      await next()
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx)

      let status = err.status || 500
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message

      // 从 error 对象上读出各个属性，设置到响应中
      let body = {
        code: err.code || -1, // TODO: 使用传入的code
        message: error
      }

      if (status === 422 && err.errors.length > 0) {
        const [first] = err.errors
        const {message, field} = first
        body.message = I18n.__(field) + message
        body.code = -1
        status = 200
      }
      ctx.body = body
      ctx.status = status
    }
  }
}
