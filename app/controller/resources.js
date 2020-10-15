'use strict'

module.exports = app => {
  class ResourcesController extends app.Controller {
    * list () {
      const {
        ctx
      } = this
      const searchRule = {
        name: {
          type: 'string',
          max: 50,
          required: false,
          allowEmpty: true
        },
        categoryId: {
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
      console.log('validate success')
      ctx.body = yield ctx.service.resources.list(ctx.request.body)
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
        name: {
          type: 'string',
          required: true
        },
        content: {
          type: 'string',
          required: true
        },
        categoryId: {
          type: 'int',
          required: true
        },
        tags: {
          type: 'array',
          required: false
        },
      }
      ctx.validate(searchRule)
      console.log('validate success1')
      ctx.body = yield ctx.service.resources.save(ctx.request.body)
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
      yield ctx.service.resources.delete(ctx.request.body.id)
    }
  }

  return ResourcesController
}
