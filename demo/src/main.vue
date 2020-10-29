<template>
  <a-button @click="showAlert">alert</a-button>
</template>

<script>
  import pkg from '../package.json'

  export default {
    name: pkg.name,
    custom: {
      type: {
        name: ''
      }
    },
    methods: {
      showAlert() {
        window.alert('this is alert button')
      }
    }
  }
</script>

<style scoped lang="stylus">
  .red {
    color red
  }
</style>
