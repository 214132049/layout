const BaseController = require('./base')

class PagesController extends BaseController {
  async list () {
    const { ctx } = this
    const searchRule = {
      projectId: {
        type: 'int',
        required: true,
        allowEmpty: false
      },
      status: {
        type: 'int',
        required: false,
        allowEmpty: true
      }
    }
    ctx.validate(searchRule)
    ctx.body = await ctx.service.pages.list(ctx.request.body)
  }

  * detail () {
    const {
      ctx
    } = this
    const createRule = {
      projectKey: {
        type: 'string',
        required: true
      },
      pageKey: {
        type: 'string',
        required: true
      },
      isEdit: {
        type: 'int',
        required: false,
        allowEmpty: true
      }
    }
    ctx.validate(createRule)
    var body = ctx.request.body
    if (!body.isEdit) {
      var retval = this.ctx.app.getH5CacheList(`${body.projectKey}_${body.pageKey}`)
      if (retval) {
        console.info(`内存中获取H5缓存信息，${body.projectKey}_${body.pageKey}`, '，结果集=', retval)
        ctx.body = retval
        return true
      }
    }
    console.log('读取数据库获取数据------')
    var info = yield ctx.service.pages.detail(ctx.request.body)
    if (!body.isEdit) {
      this.ctx.app.setH5CacheList(`${body.projectKey}_${body.pageKey}`, info)
    }
    ctx.body = info
  }

  * save () {
    const {
      ctx
    } = this
    const searchRule = {
      id: {
        type: 'int',
        required: false,
        allowEmpty: true
      },
      key: {
        type: 'string',
        max: 50,
        required: true,
        allowEmpty: false
      },
      name: {
        type: 'string',
        max: 50,
        required: true,
        allowEmpty: false
      },
      // image: {
      //   type: 'string',
      //   max: 500,
      //   required: false,
      //   allowEmpty: true
      // },
      content: {
        type: 'string',
        required: false,
        allowEmpty: true
      },
      projectId: {
        type: 'int',
        required: true,
        allowEmpty: false
      },
      isHomePage: {
        type: 'int',
        required: false,
        allowEmpty: true
      }
      // desc: {
      //   type: 'string',
      //   max: 500,
      //   required: false,
      //   allowEmpty: true
      // }
    }
    ctx.validate(searchRule)
    console.log('validate success')
    ctx.body = yield ctx.service.pages.save(ctx.request.body)
  }

  * changeStatus () {
    const {
      ctx
    } = this
    const searchRule = {
      id: {
        type: 'int',
        required: true,
        allowEmpty: false
      },
      status: {
        type: 'int',
        required: true,
        allowEmpty: false
      }
    }
    ctx.validate(searchRule)
    console.log('validate success')
    ctx.body = yield ctx.service.pages.changeStatus(ctx.request.body)
  }

  * setHomePage () {
    const {
      ctx
    } = this
    const searchRule = {
      id: {
        type: 'int',
        required: true,
        allowEmpty: false
      }
    }
    ctx.validate(searchRule)
    console.log('validate success')
    ctx.body = yield ctx.service.pages.setHomePage(ctx.request.body)
  }

  * delete () {
    const {
      ctx
    } = this
    const createRule = {
      id: {
        type: 'int',
        required: true
      }
    }
    ctx.validate(createRule)
    yield ctx.service.pages.delete(ctx.request.body.id)
  }

  * publish () {
    const {
      ctx
    } = this
    const createRule = {
      id: {
        type: 'int',
        required: true
      },
      content: {
        type: 'string',
        required: true,
        allowEmpty: false
      }
    }
    ctx.validate(createRule)
    this.ctx.app.setH5CacheList('all', null) // 将数据保存在app中
    yield ctx.service.pages.publish(ctx.request.body)
  }
}

module.exports = PagesController
