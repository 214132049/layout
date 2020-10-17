const { Controller } = require('egg')
class BaseController extends Controller {
  get user () {
    return this.ctx.state.user
  }

  get body () {
    return this.ctx.request.body
  }

  success (data = {}, message = '成功') {
    this.ctx.status = 200
    this.ctx.body = {
      code: 1,
      message,
      ...data,
    }
  }
}
module.exports = BaseController
