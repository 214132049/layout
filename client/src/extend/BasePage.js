import { mapState } from 'vuex'
export default {
  props: [],
  computed: mapState({
    userInfo: state => state.userInfo
  }),
  data: function () {
    return {}
  },
  created: function () {
    this.ema = window.EMA.getProxy()
  },
  mounted: function () {
    this.$options.initPageTitle()
  },
  destroyed: function () {
    this.ema.dispose()
  },
  initPageTitle: function () {
    if (this.pageName) {
      document.title = this.pageName
    }
  },
  methods: {
    bindEvent: function (key, fn) {
      if (!this.$options.name) {
        console.warn('绑定事件的组件不存在组件名称', key)
      }
      this.ema.bind(`${this.$options.name}.${key}`, fn)
    },
  }
}
