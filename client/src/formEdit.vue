<template>
  <fm-making-form ref="makingForm" />
</template>

<script>
  import config from 'src/config'
  export default {
    name: 'FormEdit',
    mounted() {
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
    },
    methods: {
      logout: function () {
        window.localStorage.removeItem('token')
        // 删除指定的cookie信息
        window.location.replace(`${config.ADMIN_PATH}login`)
      }
    }
  }
</script>

<style lang="stylus">
  .header{
    height: 50px;
    padding: 0 10px;
    position: relative;
    text-align right
    background #fff
  }
  .container{
    height: calc(100% - 50px);
  }
  *, :after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  html,body{
    height: 100%;
  }
  .app {
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 100%;
    height: 100%;
  }
</style>
