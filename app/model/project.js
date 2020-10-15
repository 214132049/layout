'use strict';
module.exports = app => {
  return app.model.define('project', {
    id: { field: 'id', type: app.Sequelize.INTEGER, primaryKey: true },
    key: { field: 'key', type: app.Sequelize.STRING },
    name: { field: 'name', type: app.Sequelize.STRING },
    categoryId: { field: 'category_id', type: app.Sequelize.INTEGER },
    status: { field: 'status', type: app.Sequelize.INTEGER },
    desc: { field: 'desc', type: app.Sequelize.STRING },
    image: { field: 'image', type: app.Sequelize.STRING },
    updateTime: { field: 'update_time', type: app.Sequelize.BIGINT },
    createTime: { field: 'create_time', type: app.Sequelize.BIGINT }
  }, {
    timestamps: true,
    tableName: 'tb_project',
    createdAt: 'createTime',
    updatedAt: 'updateTime',
  }, {
    classMethods: {},
  });
};
