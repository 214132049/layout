const fs = require('fs')
const path = require('path')
const pump = require('mz-modules/pump')
const CountersService = require('./counters')

class PagesService extends CountersService {
  async list (params) {
    return this.ctx.model.Pages.find({
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
    if (params.id) {
      delete body.id
      return ctx.model.Pages.findOneAndUpdate({
        id: params.id
      }, {
        $set: {
          ...body,
          modifyDate: new Date()
        }
      })
    }
    const id = await this.getNextId('pages')
    body.status = 1
    return ctx.model.Pages.create({ ...body, id })
  }

  async delete (params) {
    const { ctx } = this
    return ctx.model.Pages.findOneAndUpdate({ id: params.id }, {
      $set: {
        status: 0
      }
    })
  }

  async publish (query) {
    const { ctx } = this
    const fileBuffer = new Uint8Array(Buffer.from(query.pageContent))
    const fileName = `${ctx.helper.uuid()}.html`
    const htmlPath = path.join(this.config.baseDir, 'app/public/view', fileName)
    const writeStream = fs.createWriteStream(htmlPath)
    await pump(fileBuffer, writeStream)
    return ctx.model.Pages.findOneAndUpdate({ id: query.id }, {
      content: query.content,
      pageUrl: path.join('app/public/view', fileName)
    })
  }

  async find (params) {
    const { ctx } = this
    const res = await ctx.model.Pages.findOne({
      id: params.id,
      status: 1
    }, {
      _id: 0,
      __v: 0
    })
    if (!res) {
      ctx.throw('页面不存在', 200)
    }
    await ctx.service.project.findProject({ id: res.projectId, userId: params.userId })
    return res
  }
}

module.exports = PagesService
