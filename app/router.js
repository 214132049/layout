module.exports = app => {
  const { router, controller, jwt } = app
  router.post('/api/user/login', controller.user.login)
  router.post('/api/user/logout', jwt, controller.user.logout)
  router.post('/api/user/register', controller.user.register)
  router.get('/api/user/info', jwt, controller.user.getInfo)
  router.get('/api/user/find', jwt, controller.user.getAllUser)
  router.post('/api/user/update', jwt, controller.user.update)

  // project
  router.post('/api/project/list', jwt, controller.project.list)
  router.post('/api/project/save', jwt, controller.project.save)
  router.post('/api/project/delete', jwt, controller.project.delete)
  router.post('/api/project/info', jwt, controller.project.info)
  router.post('/api/project/updateMember', jwt, controller.project.updateMember)
  router.post('/api/project/changeAdmin', jwt, controller.project.changeAdmin)

  // pages
  router.post('/api/pages/list', jwt, controller.pages.list)
  router.post('/api/pages/save', jwt, controller.pages.save)
  router.post('/api/pages/delete', jwt, controller.pages.delete)
  router.post('/api/pages/detail', jwt, controller.pages.detail)
  router.post('/api/pages/publish', jwt, controller.pages.publish)
}
