const BaseController = require('./base')

class ComponentController extends BaseController {
  async list () {
    const { ctx } = this
    const rule = {
      projectId: { type: 'int', required: true }
    }
    ctx.validate(rule, this.body)
    const res = await ctx.service.component.list(this.body)
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
      projectId: { type: 'string', required: true },
      npmVersion: { type: 'string', required: true },
      npmName: { type: 'string', required: true }
    }
    const res = await ctx.getFileStream()
    ctx.validate(searchRule, res.fields)
    if (this.body.id) {
      await this.find()
    }
    await ctx.service.component.save(res)
    this.success()
  }

  async delete () {
    const { ctx } = this
    await this.find()
    await ctx.service.component.delete(this.body)
    this.success()
  }

  async find () {
    const { ctx } = this
    const rule = {
      id: { required: true, type: 'int' }
    }
    await ctx.validate(rule, this.body)
    return ctx.service.component.find({ id: this.body.id, userId: this.user.id })
  }
}

module.exports = ComponentController
