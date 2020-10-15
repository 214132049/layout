<template>
  <header class="navbar navbar-fixed-top navbar-gitlab"
          :class="[{'header-collapsed':!theme.isOpen,'header-expanded':theme.isOpen,'header-pinned-nav':theme.isLock}]">
    <div class="container-fluid">
      <div class="header-content">
        <button @click.stop="toggle" aria-label="Toggle global navigation" class="side-nav-toggle" type="button">
          <span class="sr-only">Toggle navigation</span>
          <i class="ifont icon-menu"></i>
        </button>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="hidden-sm hidden-xs">

            </li>

            <li>
              <router-link title="New project" aria-label="New project" data-toggle="tooltip" data-placement="bottom"
                           data-container="body" to="/projects/new">
                <i class="a-icon-plus"></i>
              </router-link>
            </li>
            <li class="header-user dropdown">
              <a-popover
                  ref="user-tip"
                  placement="bottom"
                  width="260"
                  v-model="visibleUser">
                <div class="dropdown-menu-nav dropdown-menu-align-right">
                  <ul>
                    <li>
                      <router-link class="profile-link" aria-label="Profile" data-user="wangkm" to="/user">用户信息
                      </router-link>
                    </li>
                    <li>
                      <router-link aria-label="Profile Settings" to="/profile">用户设置</router-link>
                    </li>
                    <li class="divider"></li>
                    <li>
                      <a @click="logout" class="sign-out-link" aria-label="Sign out" rel="nofollow"
                         data-method="delete">退出登录</a>
                    </li>
                  </ul>
                </div>
              </a-popover>
              <a v-popover:user-tip class="header-user-dropdown-toggle" data-toggle="dropdown">
                <img width="26" height="26" class="header-user-avatar"
                     :src="userInfo.photo|defaultHeader">
                <span class="caret"></span>
              </a>
            </li>
          </ul>
        </div>
        <h1 class="title"><a href=""></a></h1>
        <router-link :to="{path:'/home'}" class="header-logo">
          <img src="../assets/image/logo.png" alt="logo">
        </router-link>
      </div>
    </div>
  </header>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .dropdown-menu-nav
    display block
    position relative
    border none

  .header-logo
    img
      width 105px
      height 40px

  .search
    margin-right: 10px;
    margin-left: 10px;
    margin-top: 7.5px;
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Server from '../extend/Server'
  import { mapState } from 'vuex'
  export default {
    mixins: [BaseComponent],
    name: 'Header',
    data: function () {
      return {
        visibleUser: false,
        input2: 1
      }
    },
    computed: mapState({
      theme: state => state.app.theme,
      packageInfo: state => state.app.packageInfo, // 项目信息
      userInfo: state => state.userInfo, // 用户信息
    }),
    mounted: function () {
      this.getMessageNum()
    },
    methods: {
      getMessageNum: function () {
      },
      toggle: function () {
        var isOpen = !this.theme.isOpen
        this.$store.dispatch('updataTheme', {
          isOpen: isOpen
        })
      },
      handleIconClick: function () {

      },
      /**
       * 登出
       */
      logout: function () {
        this.$confirm('确认登出系统', '提示', {
          type: 'warning'
        }).then(() => {
          Server({
            url: 'api/logout',
            method: 'post'
          }).then((response) => {
            this.ema.fire('logout')
          }).catch(() => {
            this.$message('登出失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  }
</script>
