<template>
  <component :is="name"></component>
</template>
<style lang="stylus">
  .hideHeader {
    > .a-tabs__header {
      display: none;
    }
  }
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BaseComponent from 'src/extend/BaseComponent'
  import noPage from '../pages/noPage'
  var pagePrex = 'page-'
  export default {
    mixins: [BaseComponent],
    name: 'PageRouter',
    data: function () {
      return {
        name: '',
      }
    },
    components: { 'page-noPage': noPage },
    mounted: function () {
      this.loadPage(this.$route.params, (data) => {
        this.setPage(data)
      })
    },
    watch: {
      '$route' (to, from) {
        if (to.path !== from.path) {
          // 如果页面改变。load新页面加入
          this.loadPage(to.params, (data) => {
            this.setPage(data)
          })
        }
      }
    },
    methods: {
      loadPage: function (data, fn, isAddPage) {
        var path = isAddPage ? data.name : this.getPath()
        import('../pages/' + path + '').then(module => {
          var tempModule = Vue.extend(module.default || module)
          tempModule = tempModule.extend({
            data: function () {
              return data.data || {}
            },
            methods: data.methods || {}
          })
          const name = `${pagePrex}${path.replace(/\//gi, '-')}`
          Vue.component(name, tempModule)
          fn({
            pageName: data.pageName || module.pageName || '无名',
            name: name,
          })
        }).catch(() => {
          console.error('不存在该页面', path)
          fn({
            pageName: '该页面不存在',
            name: `${pagePrex}noPage`,
            key: `${pagePrex}noPage`
          })
        })
      },
      setPage: function (data) {
        this.name = data.name
      },
      getPath () {
        var params = this.$route.params
        var arr = []
        for (var k in params) {
          arr.push(params[k])
        }
        if (arr.length === 0) arr.push('home')
        return arr.join('/')
      }
    }
  }
</script>

