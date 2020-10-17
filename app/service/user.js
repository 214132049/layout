const { Service } = require('egg')

class UserService extends Service {
  find (params) {
    const { ctx } = this
    if (params.email) {
      return ctx.model.User.findOne({
        email: params.email.trim()
      })
    }
    return ctx.model.User.find()
  }

  getAllUser () {
    const { ctx } = this
    return ctx.model.User.find({}, {
      email: 1,
      id: 1,
      _id: 0
    })
  }

  login (params) {
    const { ctx } = this
    return ctx.model.User.findOne({
      email: params.email.trim(),
      password: params.password.trim()
    })
  }

  register (params) {
    const { ctx } = this
    return ctx.model.User.create({
      id: ctx.helper.uuid(),
      name: params.name.trim(),
      email: params.email.trim(),
      password: params.password.trim()
    })
  }

  updatePwd (params) {
    const { ctx } = this
    return ctx.model.User.findOneAndUpdate({
      email: params.email.trim()
    }, {
      password: params.password.trim()
    })
  }
}

module.exports = UserService
