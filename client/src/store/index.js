import Vuex from 'vuex'
import Vue from 'vue'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
const debug = process.env.NODE_ENV !== 'production'
if (debug) {
  Vue.use(Vuex)
}

const state = {
  userInfo: {}
}

export default new Vuex.Store({
  strict: debug,
  state,
  actions,
  getters,
  mutations
})
