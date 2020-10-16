module.exports = app => {
  const { router, controller, jwt } = app
  router.post('/api/user/login', controller.user.login)
  router.post('/api/user/logout', jwt, controller.user.logout)
  router.post('/api/user/register', controller.user.register)
  router.post('/api/user/updatePassword', controller.user.updatePassword)
  router.get('/api/user/info', jwt, controller.user.getInfo)
  router.get('/api/user/find', jwt, controller.user.findUser)

  // project
  router.post('/api/project/list', jwt, controller.project.list)
  router.post('/api/project/save', jwt, controller.project.save)
  router.post('/api/project/delete', jwt, controller.project.delete)
  router.post('/api/project/info', jwt, controller.project.info)
  router.post('/api/project/change-status', jwt, controller.project.changeStatus)

  // pages
  router.post('/api/pages/list', jwt, controller.pages.list)
  router.post('/api/pages/save', jwt, controller.pages.save)
  router.post('/api/pages/delete', jwt, controller.pages.delete)
  router.post('/api/pages/detail', jwt, controller.pages.detail)
  router.post('/api/pages/change-status', jwt, controller.pages.changeStatus)
  router.post('/api/pages/set-home-page', jwt, controller.pages.setHomePage)
  router.post('/api/pages/publish', jwt, controller.pages.publish)

  // category
  router.post('/api/category/list', jwt, controller.category.list)
  router.post('/api/category/save', jwt, controller.category.save)
  router.post('/api/category/delete', jwt, controller.category.delete)

  // resources
  router.post('/api/resources/list', jwt, controller.resources.list)
  router.post('/api/resources/save', jwt, controller.resources.save)
  router.post('/api/resources/delete', jwt, controller.resources.delete)
}
