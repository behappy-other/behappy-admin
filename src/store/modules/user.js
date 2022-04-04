import router, { resetRouter } from '@/router'

export default {
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
