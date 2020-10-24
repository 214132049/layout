<template>
  <a-config-provider :locale="locale">
    <a-layout>
      <a-layout-header class="header">
        <div class="logo">
          <router-link to="/">可视化表单系统</router-link>
        </div>
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
          <img class="header-avatar" :src="userInfo.photo | defaultHeader">
        </a-popover>
      </a-layout-header>
      <a-breadcrumb style="margin: 16px 0 16px 16px">
        <a-breadcrumb-item v-for="item in breadcrumbData" :key="item">{{ item }}</a-breadcrumb-item>
      </a-breadcrumb>
      <a-layout-content
        :style="{ margin: '0 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>
<style lang="stylus">
  @import "assets/style/app.styl";
  .ant-layout
    height: 100%;
    overflow hidden
    > .header
      display flex
      align-items center
      justify-content space-between
      background: #fff
      padding: 0 16px
      .logo
        font-size: 16px
        padding 20px 24px
        a
          color #333333
      .header-avatar
        border-radius: 50%
        width: 30px
        height: 30px
</style>
<script type='text/ecmascript-6'>
  import BasePage from 'src/extend/BasePage'
  import Server from './extend/Server'
  import config from 'src/config'
  import locale from 'src/assets/meta/locale'
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

  export default {
    mixins: [BasePage],
    data: function () {
      return {
        photo: '',
        locale: zhCN,
        breadcrumbData: []
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
    watch: {
      '$route.path': {
        handler () {
          this.breadcrumbData = this.getBreadcrumbData()
        },
        immediate: true
      }
    },
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
        }).catch(() => {
          // this.$alert('获取用户信息失败')
          this.loading = false
        })
      },
      logoutAction: function () {
        this.$confirm({
          title: '提示',
          content: '确认登出系统',
          onOk: async () => {
            await Server({
              url: 'api/user/logout',
              method: 'post'
            })
            this.ema.fire('logout')
          }
        })
      },
      getBreadcrumbData () {
        const params = this.$route.params
        return Object.values(params).map(v => locale[v]).filter(Boolean)
      }
    }
  }
</script>
