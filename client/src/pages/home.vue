<template>
  <div class="content-wrapper">
    <h1 class="blank-state blank-state-welcome welcome">
      欢迎使用{{packageInfo.description}}
    </h1>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .content-wrapper {
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
