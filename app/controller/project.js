const BaseController = require('./base')

class ProjectController extends BaseController {
  async list () {
    const { ctx } = this
    const res = await ctx.service.project.list({ userId: this.user.id })
    this.success({
      list: res
    })
  }

  async save () {
    const { ctx } = this
    const RULES = {
      name: { required: true, type: 'string' },
      member: { required: true, type: 'array' },
      image: { required: true, type: 'string', allowEmpty: true },
      desc: { required: true, type: 'string' }
    }
    await ctx.validate(RULES, this.body)
    if (this.body.id) {
      await this.find()
    }
    await ctx.service.project.save({ ...this.body, userId: this.user.id })
    this.success()
  }

  async delete () {
    const { ctx } = this
    await this.find()
    await ctx.service.project.delete(this.body)
    this.success()
  }

  async info () {
    const res = await this.find()
    this.success({
      data: res
    })
  }

  async updateMember () {
    const { ctx } = this
    await this.find()
    await ctx.service.project.save(this.body)
    this.success()
  }

  async changeAdmin () {
    const { ctx } = this
    await this.find()
    await ctx.service.project.save(this.body)
    this.success()
  }

  async find () {
    const { ctx } = this
    const rule = {
      id: { required: true, type: 'int' }
    }
    await ctx.validate(rule, this.body)
    return await ctx.service.project.findProject({ id: this.body.id, userId: this.user.id })
  }
}

module.exports = ProjectController
