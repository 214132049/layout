const path = require('path')
const fs = require('fs').promises
const CountersService = require('./counters')

class ComponentService extends CountersService {
  async list (params) {
    return this.ctx.model.Component.find({
      projectId: params.projectId,
      status: 1
    }, {
      __v: 0,
      _id: 0
    })
  }

  async save (params) {
    const { ctx } = this
    const body = {
      ...params
    }
    await this.checkNpmInfo(body)
    if (params.id) {
      delete body.id
      await ctx.model.Component.findOneAndUpdate({
        componentId: params.id
      }, {
        $set: {
          ...body,
          modifyDate: new Date()
        }
      })
      return this.savePath(body, params.id)
    }
    const componentId = await this.getNextId('component')
    body.status = 1
    await ctx.model.Component.create({ ...body, componentId })
    await this.savePath(body, componentId)
  }

  async savePath (body, componentId) {
    const { ctx } = this
    const filePath = path.join(__dirname, `app/public/upload/${body.npmName}_${body.npmVersion}`)
    const ws = fs.createWriteStream(filePath)
    await ws.write(Buffer.from(body.file))
    await ctx.model.ComponentCompiled.create({ npmVersion: body.npmVersion, componentId, filePath })
  }

  async checkNpmInfo (params) {
    const { ctx } = this
    const res = await ctx.model.Component.findOne({
      npmName: params.npmName,
      npmVersion: params.npmVersion,
      status: 1
    })
    if (res) {
      ctx.throw('相同版本的组件已存在', 200)
    }
  }

  async delete (params) {
    const { ctx } = this
    return ctx.model.Component.findOneAndUpdate({ id: params.id }, {
      $set: {
        status: 0
      }
    })
  }

  async find (params) {
    const { ctx } = this
    const res = await ctx.model.Component.findOne({
      id: params.id,
      status: 1
    }, {
      _id: 0,
      __v: 0
    })
    if (!res) {
      ctx.throw('组件不存在', 200)
    }
    await ctx.service.project.findProject({ id: res.projectId, userId: params.userId })
    return res
  }
}

module.exports = ComponentService
