import Vue from 'vue'
import Vuex from 'vuex'
import router, { resetRouter } from '@/router'
import prod from './modules/prod'
import user from './modules/user'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    prod,
    user
  }
})