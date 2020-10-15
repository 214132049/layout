const BaseController = require('./base')

const RULES = {
  userEmail: { required: true, type: 'email' },
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
      data: res
    })
  }

  async findUser (userInfo) {
    const { service } = this
    return service.user.find(userInfo || this.body)
  }

  async createUserToken ({ userId, userEmail }) {
    const { ctx, app } = this
    const token = app.jwt.sign({
      userEmail,
      userId
    }, app.config.jwt.secret, {
      expiresIn: '0.5h'
    })
    ctx.cookies.set('Authorization', `Bearer ${token}`, {
      encrypt: true, // 加密传输
    })
    return token
  }
}

module.exports = UserController
