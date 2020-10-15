const BaseController = require('./base')

class ProjectController extends BaseController {
  async list () {
    const { ctx } = this
    const searchRule = {
      key: {
        type: 'string',
        allowEmpty: true,
        required: false
      },
      name: {
        type: 'string',
        allowEmpty: true,
        required: false
      },
      categoryId: {
        type: 'int',
        required: false,
        allowEmpty: true
      },
      status: {
        type: 'int',
        required: false,
        allowEmpty: true
      },
      page: {
        type: 'int',
        required: false,
        allowEmpty: true
      },
      pageSize: {
        type: 'int',
        required: false,
        allowEmpty: true
      }
    }
    ctx.validate(searchRule)
    ctx.body = await ctx.service.project.list(this.body)
  }

  async save () {
    const { ctx } = this
    const searchRule = {
      id: {
        type: 'int',
        required: false,
        allowEmpty: true
      },
      key: {
        type: 'string',
        allowEmpty: true,
        required: false
      },
      name: {
        type: 'string',
        max: 50,
        required: true,
        allowEmpty: false
      },
      categoryId: {
        type: 'int',
        required: true,
        allowEmpty: false
      },
      image: {
        type: 'string',
        max: 255,
        required: false,
        allowEmpty: true
      }
    }
    ctx.validate(searchRule)
    console.log('validate success')
    ctx.body = await ctx.service.project.save(this.body)
  }

  async changeStatus () {
    const { ctx } = this
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
    ctx.body = await ctx.service.project.changeStatus(this.body)
  }

  async delete () {
    const { ctx } = this
    const createRule = {
      id: {
        type: 'int',
        required: true
      }
    }
    ctx.validate(createRule)
    await ctx.service.project.delete(this.body.id)
  }
}

module.exports = ProjectController
