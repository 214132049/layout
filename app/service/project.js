const { Service } = require('egg')

let id = 0

class ProjectService extends Service {
  async list (params) {
    const { ctx } = this
    return ctx.model.Project.find({
      ...params,
      status: 1
    })
  }

  async find (params) {
    const { ctx } = this
    return ctx.model.Project.find({
      ...params,
      status: 1
    })
  }

  async save (params) {
    const { ctx } = this
    const body = {
      ...params,
      status: 1,
    }
    if (params.id) {
      await ctx.model.Project.findOneAndUpdate({ id: params.id }, body)
      return
    }
    await ctx.model.Project.create({ ...body, id: ++id })
  }

  async delete (params) {
    const { ctx } = this
    return ctx.model.Project.findOneAndUpdate({ id: params.id }, {
      status: 0
    })
  }
}

module.exports = ProjectService
