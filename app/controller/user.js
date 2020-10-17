const BaseController = require('./base')

const RULES = {
  email: { required: true, type: 'email' },
  password: { required: true, type: 'password' }
}

class UserController extends BaseController {
  async login () {
    const { ctx, service } = this
    await ctx.validate(RULES, this.body)
    const exist = await this.findUser()
    if (!exist) {
      ctx.throw('登录失败，用户不存在！', 200)
    }
    const res = await service.user.login(this.body)
    if (!res) {
      ctx.throw('登录失败，用户密码错误！', 200)
    }
    const token = await this.createUserToken(res)
    this.success({
      token
    }, '登录成功')
  }

  async register () {
    const { ctx, service } = this
    await ctx.validate(RULES, this.body)
    const exist = await this.findUser()
    if (exist) {
      ctx.throw('注册失败，用户已存在！', 200)
    }
    const res = await service.user.register(ctx.request.body)
    if (!res) {
      ctx.throw('注册失败！', 200)
    }
    const token = await this.createUserToken(res)
    this.success({
      token
    }, '注册成功')
  }

  async logout () {
    const { ctx } = this
    ctx.cookies.set('Authorization', '')
    this.success()
  }

  async getInfo () {
    const { ctx } = this
    const res = await this.findUser(ctx.state.user)
    this.success({
      data: {
        id: res.id,
        email: res.email,
        name: res.name || ''
      }
    })
  }

  async updatePassword () {
    const { ctx } = this
    await ctx.service.user.updatePwd({
      user: ctx.state.user,
      password: this.body.password
    })
    this.success()
  }

  async findUser (userInfo) {
    const { service } = this
    return service.user.find(userInfo || this.body)
  }

  async getAllUser () {
    const { service } = this
    const list = await service.user.getAllUser()
    this.success({
      list
    })
  }

  async createUserToken ({ id, email }) {
    const { app } = this
    return app.jwt.sign({
      email,
      id
    }, app.config.jwt.secret, {
      expiresIn: '0.5h'
    })
  }
}

module.exports = UserController
