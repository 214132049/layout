import Vue from 'vue'
import BaseComponent from 'src/extend/BaseComponent'
import noPage from 'src/pages/noPage'

export default {
  name: 'PageRoute',
  mixins: [BaseComponent],
  data () {
    return {
      instance: null
    }
  },
  watch: {
    $route: {
      async handler (_, oldRoute) {
        this.instance = await this.loadPage(oldRoute)
      },
      immediate: true
    }
  },
  methods: {
    getPath () {
      const params = this.$route.params
      const arr = Object.values(params)
      if (arr.length === 0) arr.push('guide')
      return arr.join('/')
    },
    async loadPage (oldRoute) {
      const path = this.getPath()
      try {
        const module = await import('../pages/' + path + '')
        const tempModule = Vue.extend(module.default)
        return tempModule.extend({
          data () {
            return {
              oldRoute$$: oldRoute
            }
          }
        })
      } catch (e) {
        return noPage
      }
    }
  },
  render (createElement) {
    return createElement(this.instance, {
      ref: 'pageInstance',
    })
  }
}
