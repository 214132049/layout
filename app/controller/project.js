const BaseController = require('./base')

class ProjectController extends BaseController {
  async list () {
    const { ctx } = this
    ctx.body = await ctx.service.project.list({ userId: this.user.id })
  }

  async save () {
    const { ctx } = this
    const RULES = {
      name: { required: true, type: 'string' },
      member: { required: true, type: 'array' },
      image: { required: true, type: 'string' },
      desc: { required: true, type: 'string' }
    }
    console.log(this.body)
    await ctx.validate(RULES, this.body)
    if (this.body.id) {
      await this.find(this.body.id)
    }
    await ctx.service.project.save({ ...this.body, userId: this.user.id })
    this.success()
  }

  async delete () {
    const { ctx } = this
    await this.find(this.body.id)
    await ctx.service.project.delete(this.body)
    this.success()
  }

  async info () {
    const res = await this.find(this.body.id)
    this.success({
      data: res
    })
  }

  async find () {
    const { ctx } = this
    const rule = {
      id: { required: true, type: 'string' }
    }
    await ctx.validate(rule, this.body)
    const res = await ctx.service.project.find({ ...this.body, userId: ctx.state.user.id })
    if (!res) {
      ctx.throw({ msg: '项目不存在' })
    }
    return res
  }
}

module.exports = ProjectController
