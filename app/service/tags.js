/**
 * Created with WebStorm.
 * User: kevan
 * Email:258137678@qq.com
 * Date: 2017/5/3
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */
var md5 = require('md5');
'use strict'
module.exports = app => {
  class Tags extends app.Service {
    * list (query) {
      let _where = {
        status: 1
      }
      if (query.categoryId) _where.categoryId = query.categoryId
      if (query.name) _where.name = { $like: `%${query.name || ''}%` }

      return yield this.ctx.model.Tags.findAll({
        where: _where,
        attributes: [ 'id', 'name' ]
      });
    }
  }

  return Tags
}
