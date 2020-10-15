const { Service } = require('egg')

class UserService extends Service {
  find (params) {
    const { ctx } = this
    return ctx.model.User.findOne({
      userEmail: params.userEmail.trim()
    })
  }

  login (params) {
    const { ctx } = this
    return ctx.model.User.findOne({
      userEmail: params.userEmail.trim(),
      password: params.password.trim()
    })
  }

  register (params) {
    const { ctx } = this
    return ctx.model.User.create({
      userId: ctx.helper.uuid(),
      userEmail: params.userEmail.trim(),
      password: params.password.trim()
    })
  }
}

module.exports = UserService
