const BaseController = require('./base')

class PagesController extends BaseController {
  async list () {
    const { ctx } = this
    const rule = {
      projectId: { type: 'int', required: true }
    }
    ctx.validate(rule, this.body)
    const res = await ctx.service.pages.list(this.body)
    this.success({
      list: res
    })
  }

  async detail () {
    const res = await this.find()
    this.success({
      data: res
    })
  }

  async save () {
    const { ctx } = this
    const searchRule = {
      name: { type: 'string', max: 50, required: true },
      content: { type: 'string', required: false, allowEmpty: true },
      projectId: { type: 'int', required: true }
    }
    ctx.validate(searchRule, this.body)
    if (this.body.id) {
      await this.find()
    }
    await ctx.service.pages.save(this.body)
    this.success()
  }

  async delete () {
    const { ctx } = this
    await this.find()
    await ctx.service.pages.delete(this.body)
    this.success()
  }

  async publish () {
    const { ctx } = this
    await this.find()
    await ctx.service.pages.publish(this.body)
    this.success()
  }

  async find () {
    const { ctx } = this
    const rule = {
      id: { required: true, type: 'int' }
    }
    await ctx.validate(rule, this.body)
    return ctx.service.pages.find({ id: this.body.id, userId: this.user.id })
  }
}

module.exports = PagesController
