import router, { resetRouter } from '@/router'

export default {
  // 使用模块中的mutations、getters、actions时候，要加上模块名
  // eg: 模块名/模块中的mutations
  namespaced: true,
  state: {
    // 当前菜单页名
    currentPathName: ''
  },
  mutations: {
    setPath (state) {
      state.currentPathName = localStorage.getItem('currentPathName')
    },
    logout () {
      // 清空缓存
      localStorage.removeItem('user')
      localStorage.removeItem('menus')
      // 重置路由
      router.push('/login')
      resetRouter()
    }
  }
}
