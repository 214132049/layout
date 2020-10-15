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
  class Resources extends app.Service {
    * list (query) {

      // 查询条件
      var sqlQuery = ''
      let _where = { status: 1 }
      if (query.categoryId) {
        _where.categoryId = query.categoryId;
        sqlQuery = ` r.category_id=${query.categoryId} and`;
      }
      if (query.name) _where.name = { $like: `%${query.name || ''}%` }

      // 分页计算
      let offset = 0, page = query.page || 1, pageSize = query.pageSize || 10
      if (query.page < 1) query.page = 1
      if (query.pageSize < 1) query.pageSize = 10
      offset = (page - 1) * pageSize
      // 查询语句
      var sql = `SELECT 
                GROUP_CONCAT(t.name,',',t.id SEPARATOR ';') as tags, 
                r.id,r.name,r.content,r.category_id as categoryId,r.create_time as createTime,r.update_time as updateTime   
                from tb_resources r left join tb_res_tags_rel rel on r.id=rel.rid left join tb_tags t on rel.tid=t.id 
                where r.status=1 and ${sqlQuery} r.name LIKE '%${query.name || ''}%' 
                GROUP BY r.id ORDER BY r.create_time DESC LIMIT ${offset}, ${pageSize};`
      // 查询总条数
      var total = yield this.ctx.model.Resources.count({ where: _where });
      // 查询列表数据
      var list = yield this.ctx.model.query(sql, { type: 'SELECT' }) || []
      list = list.map(it => {
        it.tags = it.tags ? ((it.tags.split(';') || []).map(t => {
          var ts = t.split(',') || []
          return { id: ts[ 1 ], name: ts[ 0 ] }
        })) : []
        return it
      })
      return { total, list };
    }

    * save (query) {
      let t = yield app.model.transaction();
      try {
        var _item = {
          name: query.name,
          categoryId: query.categoryId,
          content: query.content
        }

        if (query.tags && query.tags.length) {
          var tagsStr = query.tags.map(it => {return it.name;}).join('')
          if (tagsStr.includes(';') || tagsStr.includes(',')) {
            throw this.ctx.getError({ msg: `标签名称不能包含有,;等特殊字符` });
          }
        }

        if (query.id) {
          // 编辑
          if (!(yield this.ctx.model.Resources.findOne({
              where: {
                status: 1,
                id: query.id
              }
            }))) throw this.ctx.getError({ msg: `不存在id为${query.id}的资源` });
          yield this.ctx.model.Resources.update(_item, { where: { id: query.id } }, { transaction: t })
        } else {
          _item.status = 1
          var newItem = yield this.ctx.model.Resources.create(_item, { transaction: t })
          query.id = newItem.id
        }
        // 移除标签和资源的关系
        yield this.ctx.model.query(` DELETE FROM tb_res_tags_rel WHERE rid=${query.id}; `, { type: 'BULKDELETE' });

        query.tags = query.tags || []
        console.info(query.tags)
        for (let tag of query.tags) {
          // 如果没有id，表示自定义标签，先创建标签对象
          if (!tag.id) {
            tag = yield this.ctx.model.Tags.create({
              name: tag.name,
              status: 1,
              categoryId: query.categoryId
            }, { transaction: t })
          }
          // 绑定标签和资源的关系
          yield this.ctx.model.ResTagsRel.create({ rid: query.id, tid: tag.id }, { transaction: t })
        }
        yield t.commit();
        return { id: query.id }

      } catch (e) {
        yield t.rollback();
        throw this.ctx.getError({ msg: e.msg || `${query.id ? '更新失败' : '新增失败'}`, error: e });
      }
    }

    * delete (id) {
      var item = yield this.ctx.model.Resources.findOne({ where: { id: id } })
      if (item) {
        yield this.ctx.model.Resources.update({ status: 0 }, { where: { id: id } });
        return true
      }
    }
  }

  return Resources
}
