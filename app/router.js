module.exports = app => {
  const { router, controller, jwt } = app
  router.post('/api/login', controller.user.login)
  router.post('/api/logout', jwt, controller.user.logout)
  router.post('/api/register', controller.user.register)

  router.get('/api/userInfo', jwt, controller.user.getInfo)

  // project
  router.post('api/editor/project/list', jwt, controller.project.list)
  router.post('api/editor/project/save', jwt, controller.project.save)
  router.post('api/editor/project/delete', jwt, controller.project.delete)
  router.post('api/editor/project/change-status', jwt, controller.project.changeStatus)
  // pages
  router.post('api/editor/pages/list', jwt, controller.pages.list)
  router.post('api/editor/pages/save', jwt, controller.pages.save)
  router.post('api/editor/pages/delete', jwt, controller.pages.delete)
  router.post('api/editor/pages/detail', jwt, controller.pages.detail)
  router.post('api/editor/pages/change-status', jwt, controller.pages.changeStatus)
  router.post('api/editor/pages/set-home-page', jwt, controller.pages.setHomePage)
  router.post('api/editor/pages/publish', jwt, controller.pages.publish)
  // template
  router.post('api/editor/template/list', jwt, controller.template.list)
  router.post('api/editor/template/save', jwt, controller.template.save)
  router.post('api/editor/template/delete', jwt, controller.template.delete)
  router.post('api/editor/template/detail', jwt, controller.template.detail)
  // category
  router.post('api/editor/category/list', jwt, controller.category.list)
  router.post('api/editor/category/save', jwt, controller.category.save)
  router.post('api/editor/category/delete', jwt, controller.category.delete)
  // resources
  router.post('api/editor/resources/list', jwt, controller.resources.list)
  router.post('api/editor/resources/save', jwt, controller.resources.save)
  router.post('api/editor/resources/delete', jwt, controller.resources.delete)
  // tags
  router.post('api/editor/tags/list', jwt, controller.tags.list)
};
