<template>
  <div class="wrapper">
    <h1 class="welcome">
      欢迎使用可视化表单系统
    </h1>
    <p>先从创建项目开始吧！</p>
    <div>
      <router-link to="/projects/edit">
        <a-button type="primary">创建项目</a-button>
      </router-link>
      <router-link to="/projects/list" style="margin-left: 20px">
        <a-button type="primary">查看已有项目</a-button>
      </router-link>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .wrapper {
    text-align center
    .welcome {
      padding 100px 0
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'

  export default {
    mixins: [BasePage],
    name: 'home',
  }
</script>
