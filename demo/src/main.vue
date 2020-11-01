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
        message: {
          label: '提示内容',
          type: 'input',
          value: ''
        }
      }
    },
    methods: {
      showAlert() {
        window.alert(this.$options.custom.options.message.value)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .red {
    color red
  }
</style>
