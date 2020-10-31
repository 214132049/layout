<template>
  <a-button @click="showAlert">alert</a-button>
</template>

<script>
  import pkg from '../package.json'

  export default {
    name: pkg.name,
    custom: {
      type: pkg.name,
      name: 'Alert组件',
      options: {
        message: ''
      }
    },
    methods: {
      showAlert() {
        window.alert(this.$options.custom.options.message)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .red {
    color red
  }
</style>
