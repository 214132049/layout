<template>
  <a-layout>
    <a-layout-sider>
      <div class="logo">
        <router-link to="/">可视化表单系统</router-link>
      </div>
      <a-menu theme="dark" mode="inline">
        <a-menu-item key="1">
          <router-link to="/dashboard/projects" title="Projects" class="dashboard-shortcuts-projects">
            项目
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/dashboard/resources" class="dashboard-shortcuts-resources" title="resources">
            资源
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/dashboard/component" class="dashboard-shortcuts-resources" title="resources">
            组件
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 10px; text-align: right;">
        <a-popover placement="bottom">
          <template slot="content">
            <div>
              <router-link to="/profile">设置</router-link>
            </div>
            <div>
              <a @click="logoutAction" class="sign-out-link" aria-label="Sign out" rel="nofollow"
                 data-method="delete">注销</a>
            </div>
          </template>
          <img class="header-user-avatar" :src="photo|defaultHeader">
        </a-popover>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<style lang="stylus">
  @import "assets/style/app.styl";
  .ant-layout
    height: 100%;
    overflow hidden
  .logo
    font-size: 16px;
    padding 20px 24px
    a
      color #ffffff
</style>
<script type='text/ecmascript-6'>
  import { mapState } from 'vuex'
  import Server from './extend/Server'
  const config = require('src/config')
  export default {
    data: function () {
      return {
        photo: ''
      }
    },
    mounted: function () {
      window.EMA.bind('logout', () => {
        this.logout()
      })
      window.EMA.bind('alert.show', (title, fn) => {
        this.$error({
          title: '注意',
          content: title,
          onOk () {
            typeof fn == 'function' && fn()
          },
        })
      })
      this.getUserInfo()
    },
    computed: mapState({
      theme: state => state.app.theme,
      packageInfo: state => state.app.packageInfo
    }),
    methods: {
      logout: function () {
        window.localStorage.removeItem('token')
        // 删除指定的cookie信息
        window.location.replace(`${config.ADMIN_PATH}login`)
      },
      getUserInfo () {
        Server({
          url: 'api/user/info',
          method: 'get'
        }).then((response) => {
          this.loading = false
          this.user = response.data.data
          // 初始化导航信息
          // 设置用户信息
          this.$store.dispatch('initUserInfo', this.user)
          this.initAllCategory()
        }).catch(() => {
          // this.$alert('获取用户信息失败')
          this.loading = false
        })
      },
      logoutAction: function () {
        this.$confirm({
          title: '提示',
          content: '确认登出系统',
          type: 'warning'
        }).then(() => {
          Server({
            url: 'api/user/logout',
            method: 'post'
          }).then(() => {
            this.ema.fire('logout')
          }).catch(() => {
            this.$error({
              title: '登出失败'
            })
          })
        }).catch(() => {
          this.$info({
            title: '已取消'
          })
        })
      }
    }
  }
</script>
