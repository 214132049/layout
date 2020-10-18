const CountersService = require('./counters')

class ProjectService extends CountersService {
  async list (params) {
    const { ctx } = this
    return ctx.model.Project.find({
      member: { $elemMatch: { $eq: params.userId } },
      status: 1
    }, {
      _id: 0
    })
  }

  async findProject (params) {
    const { ctx } = this
    const res = await ctx.model.Project.findOne({
      id: params.id,
      status: 1
    }, {
      _id: 0,
      __v: 0
    })
    if (!res) {
      ctx.throw('项目不存在', 200)
    }
    if (!res.member.includes(params.userId)) {
      ctx.throw('您没有权限', 200, {
        code: -403
      })
    }
    return res
  }

  async save (params) {
    const { ctx } = this
    const body = {
      ...params
    }
    if (params.id) {
      delete body.id
      return ctx.model.Project.findOneAndUpdate({
        id: params.id
      }, {
        $set: {
          ...body,
          modifyDate: new Date()
        }
      })
    }
    const id = await this.getNextId('projects')
    body.status = 1
    return ctx.model.Project.create({ ...body, id })
  }

  async delete (params) {
    const { ctx } = this
    return ctx.model.Project.findOneAndUpdate({ id: params.id }, {
      $set: {
        status: 0
      }
    })
  }
}

module.exports = ProjectService
