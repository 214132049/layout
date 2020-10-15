'use strict'

module.exports = app => {
  class TagsController extends app.Controller {
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
        }
      }
      ctx.validate(searchRule)
      console.log('validate success')
      ctx.body = yield ctx.service.tags.list(ctx.request.body)
    }
  }

  return TagsController
}
