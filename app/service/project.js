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
  class Project extends app.Service {
    * list (query) {
      debugger
      console.log('service start --list', query)
      let _where = {
        status: (query.status == undefined) ? 1 : query.status
      }
      if (query.name) _where.name = { $like: `%${query.name || ''}%` }
      if (query.key) _where.key = { $like: `%${query.key || ''}%` }
      if (query.categoryId) _where.categoryId = query.categoryId
      if (query.status) _where.status = query.status
      let offset = 0, page = query.page || 1, pageSize = query.pageSize || 10

      if (query.page < 1) query.page = 1
      if (query.pageSize < 1) query.pageSize = 10

      offset = (page - 1) * pageSize
      var total = yield this.ctx.model.Project.count({ where: _where });
      var list = yield this.ctx.model.Project.findAll({
        where: _where,
        offset: offset,
        limit: pageSize,
        order: 'create_time DESC'
      });
      return { total, list }
    }

    * save (query) {
      try {
        var _item = {
          name: query.name,
          key: query.key,
          categoryId: query.categoryId,
          desc: query.desc,
          image: query.image,
          status: (query.status == undefined) ? 1 : query.status,
        }
        if (query.id) {
          // 编辑
          // 参数验证，1判断是否存在该id，2是否重名
          if (!(yield this.ctx.model.Project.findOne({
              where: {
                status: { $ne: 0 },
                id: query.id
              }
            }))) throw this.ctx.getError({ msg: `不存在id为${query.id}的项目` });
          if (yield this.ctx.model.Project.findOne({
              where: {
                name: query.name,
                status: { $ne: 0 },
                id: { $ne: query.id }
              }
            })) throw this.ctx.getError({ msg: `已经存在名称为${query.name}的项目` });
          yield this.ctx.model.Project.update(_item, { where: { id: query.id } })
          return true
        } else {
          // 参数验证 是否重名
          if (yield this.ctx.model.Project.findOne({
              where: {
                key: query.key,
                status: { $ne: 0 },
              }
            })) throw this.ctx.getError({ msg: `已经存在key为${query.key}的项目` });
          yield this.ctx.model.Project.create(_item)
          return true
        }
      } catch (e) {
        throw this.ctx.getError({ msg: e.msg || `${query.id ? '更新失败' : '新增失败'}`, error: e });
      }
    }

    * changeStatus (query) {
      try {
        // 参数验证，1判断是否存在该id，2是否重名
        if (!(yield this.ctx.model.Project.findOne({
            where: {
              id: query.id
            }
          }))) throw this.ctx.getError({ msg: `不存在id为${query.id}的项目` });
        yield this.ctx.model.Project.update({ status: query.status }, { where: { id: query.id } })
        return null

      } catch (e) {
        throw this.ctx.getError({ msg: e.msg || `操作失败`, error: e });
      }
    }

    * delete (id) {
      var item = yield this.ctx.model.Project.findOne({ where: { id: id } })
      if (item) {
        yield this.ctx.model.Project.update({ status: 0 }, { where: { id: id } });
        return true
      }
    }
  }

  return Project
}
