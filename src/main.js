import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/global.css'
import _ from 'lodash'

Vue.config.productionTip = false
Vue.prototype._ = _
// 组件适配大小
Vue.use(ElementUI, { size: 'small' })
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
