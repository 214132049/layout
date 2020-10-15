/**
 * Created with WebStorm.
 * User: kevan
 * Email:258137678@qq.com
 * Date: 2017/5/3
 * Time: 上午9:30
 * To change this template use File | Settings | File Templates.
 */
var md5 = require('md5')
'use strict'
module.exports = app => {
  class Pages extends app.Service {
    * list (query) {
      console.log('service start --list', query, query.status == undefined)
      let _where = {
        projectId: query.projectId,
        status: (query.status == undefined) ? { $ne: 0 } : query.status
      }
      let list = yield this.ctx.model.Pages.findAll({
        where: _where,
        order: 'create_time DESC'
      })
      if (list && list.length) {
        list = list.map(item => {
          var it = item.dataValues || {}
          if (it.id) {
            it.isPublish = !it.draft
            delete it.content
            delete it.draft
          }
          return it
        })
      }
      return list
    }

    * detail (query) {
      let project = (yield this.ctx.model.Project.findOne({
        where: {
          key: query.projectKey,
          status: { $ne: 0 }
        }
      })) || {}
      let info = (yield this.ctx.model.Pages.findOne({
        where: {
          key: query.pageKey,
          projectId: project.id,
          status: { $ne: 0 }
        }
      })) || {}
      info = info.dataValues || {}
      if (info.id) {
        if (query.isEdit) {
          info.content = info.draft || info.content
        }
        info.isPublish = !info.draft
        delete info.draft
      }
      return info
    }

    * save (query) {
      try {
        var _item = {
          key: query.key,
          name: query.name,
          projectId: query.projectId,
          isHomePage: (query.isHomePage == undefined) ? 0 : query.isHomePage,
          draft: query.content || '',
          desc: query.desc,
          image: query.image
        }
        if (query.id) {
          // 编辑
          // 参数验证，1判断是否存在该id，2是否重名
          if (!(yield this.ctx.model.Pages.findOne({
            where: {
              status: { $ne: 0 },
              key: query.key
            }
          }))) throw this.ctx.getError({ msg: `不存在key为${query.key}的页面信息` })
          yield this.ctx.model.Pages.update(_item, { where: { id: query.id } })
        } else {
          _item.status = 1
          // 参数验证 是否重名
          if (yield this.ctx.model.Pages.findOne({
            where: {
              projectId: query.projectId,
              key: query.key,
              status: { $ne: 0 }
            }
          })) throw this.ctx.getError({ msg: `已经存在key为:${query.key}的页面信息` })
          // _item.id = (md5(`${query.name}${new Date().getTime()}`) || new Date().getTime()).substr(0, 20)
          var newItem = yield this.ctx.model.Pages.create(_item)
          query.id = newItem.id
        }
        if (query.isHomePage == 1) {
          // 将其他页面的isHomePage 设置为0
          yield this.ctx.model.Pages.update({ isHomePage: 0 }, {
            where: {
              projectId: query.projectId,
              id: { $ne: query.id }
            }
          })
        }
        return { id: query.id }
      } catch (e) {
        throw this.ctx.getError({ msg: e.msg || `${query.id ? '更新失败' : '新增失败'}`, error: e })
      }
    }

    * setHomePage (query) {
      try {
        // 设置当前项为"首页"
        yield this.ctx.model.Pages.update({ isHomePage: 1 }, { where: { id: query.id } })

        var pageInfo = yield this.ctx.model.Pages.findOne({
          where: {
            id: query.id
          }
        })
        // 将其他页面的isHomePage 设置为0
        yield this.ctx.model.Pages.update({ isHomePage: 0 }, {
          where: {
            projectId: pageInfo.projectId,
            id: { $ne: query.id }
          }
        })
        return null
      } catch (e) {
        throw this.ctx.getError({ msg: e.msg || `操作失败`, error: e })
      }
    }

    * changeStatus (query) {
      try {
        // 参数验证，1判断是否存在该id，2是否重名
        if (!(yield this.ctx.model.Pages.findOne({
          where: {
            id: query.id
          }
        }))) throw this.ctx.getError({ msg: `不存在id为${query.id}的页面` })
        yield this.ctx.model.Pages.update({ status: query.status }, { where: { id: query.id } })
        return null
      } catch (e) {
        throw this.ctx.getError({ msg: e.msg || `操作失败`, error: e })
      }
    }

    * delete (id) {
      var item = yield this.ctx.model.Pages.findOne({ where: { id: id } })
      if (item) {
        yield this.ctx.model.Pages.update({ status: 0 }, { where: { id: id } })
        return true
      }
    }

    * publish (query) {
      yield this.ctx.model.Pages.update({ content: query.content, draft: '' }, { where: { id: query.id } })
      return true
    }
  }

  return Pages
}
