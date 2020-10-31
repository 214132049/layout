const path = require('path')
const fs = require('fs')
const pump = require('mz-modules/pump')
const unzip = require('unzip')

const CountersService = require('./counters')


function unzipSync(fileName, mbDir) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(fileName).pipe(unzip.Extract({
      path: mbDir
    })).on('close', () => {
      resolve()
    }).on('error', (err) => {
      reject(err)
    })
  })
}

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
      ...params.fields
    }
    if (body.id) {
      const id = body.id
      // 更新校验id和version
      await this.checkIdAndVersion(body)
      delete body.id
      await ctx.model.Component.findOneAndUpdate({
        id
      }, {
        $set: {
          ...body,
          modifyDate: new Date()
        }
      })
      return this.savePath(params, body, id)
    }
    // 新增校验只校验name
    await this.checkNpmName(body)
    const componentId = await this.getNextId('component')
    body.status = 1
    await this.savePath(params, body, componentId)
    await ctx.model.Component.create({ ...body, id: componentId })
  }

  async savePath (stream, body, componentId) {
    const { ctx } = this
    try {
      const basePath = path.join(this.config.baseDir, 'app/public')
      // 要储存的zip路径
      const zipFilePath = path.join(basePath, `${body.npmName}.zip`)
      // 写入上传文件
      const writeStream = fs.createWriteStream(zipFilePath)
      await pump(stream, writeStream)
      // 解压上传zip文件
      const unzipPath = path.join(basePath, `${body.npmName}_${body.npmVersion}`)
      await unzipSync(zipFilePath, unzipPath)
      // del zip
      await fs.unlinkSync(zipFilePath)
      const jsPath = path.join(unzipPath, `${body.npmName}.js`)
      await ctx.model.ComponentCompiled.create({ npmVersion: body.npmVersion, id: componentId, path: jsPath })
    } catch (e) {
      console.log(e)
      ctx.throw('上传失败', 200)
    }
  }

  async checkIdAndVersion (params) {
    const { ctx } = this
    const res = await ctx.model.Component.findOne({
      id: params.id,
      npmVersion: params.npmVersion,
      status: 1
    })
    if (res) {
      ctx.throw('相同版本的组件已存在', 200)
    }
  }
  
  async checkNpmName (params) {
    const { ctx } = this
    const res = await ctx.model.Component.findOne({
      npmName: params.npmName,
      status: 1
    })
    if (res) {
      ctx.throw('相同命名的组件已存在', 200)
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
