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

  async find (params) {
    const { ctx } = this
    return ctx.model.Project.findOne({
      member: { $elemMatch: { $eq: params.userId } },
      id: params.id,
      status: 1
    }, {
      _id: 0,
      __v: 0
    })
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
    console.log(id)
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
