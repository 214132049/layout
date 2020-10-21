<template>
  <div id="app">
    <header class="header">
      <a-button>保存</a-button>
    </header>
    <main class="container">
      <fm-making-form ref="makingForm" upload preview generate-code generate-json clearable>
        <template slot="action">
        </template>
      </fm-making-form>
    </main>
  </div>
</template>

<script>
  import Home from './pages/home'
  export default {
    name: 'app',
    components: { Home },
    methods: {
    }
  }
</script>

<style lang="scss">
  .header{
    height: 50px;
    box-shadow: 0 2px 10px rgba(70,160,252, 0.6);
    padding: 0 10px;
    background-image: linear-gradient(to right,#1278f6,#00b4aa);
    position: relative;
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
  #app {
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-height: 100%;
    height: 100%;
  }
</style>
