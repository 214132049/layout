const { Service } = require('egg')

class UserService extends Service {
  find (params) {
    const { ctx } = this
    if (params.email) {
      return ctx.model.User.findOne({
        email: params.email.trim()
      }, {
        _id: 0,
        __v: 0,
        password: 0
      })
    }
    return ctx.model.User.find()
  }

  getAllUser () {
    const { ctx } = this
    return ctx.model.User.find({}, {
      _id: 0,
      __v: 0,
      password: 0
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

  update (params) {
    const { ctx } = this
    return ctx.model.User.findOneAndUpdate({
      email: params.email.trim()
    }, {
      $set: {
        ...params.body,
        modifyDate: new Date()
      }
    })
  }
}

module.exports = UserService
