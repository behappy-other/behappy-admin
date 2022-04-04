import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error/404.vue')
  }]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 提供一个重置路由的方法
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}
export const setRoutes = () => {
  const storeMenus = localStorage.getItem('menus')
  // console.log(storeMenus)
  if (storeMenus) {
    // 获取当前的路由对象名称数组
    const currentRouteNames = router.getRoutes().map(v => v.name)
    console.log(currentRouteNames)
    // 以此判断是否重置路由(刷新页面会重置路由)
    if (!currentRouteNames.includes('Manage')) {
      // 拼装动态路由
      const manageRoute = {
        path: '/',
        name: 'Manage',
        component: () => import('../views/Manage.vue'),
        // 从/重定向到/home
        redirect: '/home',
        // 当前路由下的子路由
        children: [
          {
            path: 'home',
            name: '主页',
            component: () => import('../views/HomeView.vue')
          },
          {
            path: 'person',
            name: '个人信息',
            component: () => import('../views/system/Person.vue')
          },
          {
            path: 'password',
            name: '修改密码',
            component: () => import('../views/system/Password.vue')
          }
        ]
      }
      const menus = JSON.parse(storeMenus)
      for (const item of menus) {
        // 仅当path不为空时才设置路由(因为父级菜单没有path)
        if (item.path) {
          const itemMenu = {
            path: item.path.replace('/', ''),
            name: item.name,
            component: () => import('../views/' + item.pagePath + '.vue')
          }
          manageRoute.children.push(itemMenu)
          // eslint-disable-next-line brace-style
        }
        // 如果item还存在child,则继续添加下级路由
        else if (item.children.length) {
          for (const child of item.children) {
            if (child.path) {
              const itemMenu = {
                path: child.path.replace('/', ''),
                name: child.name,
                component: () => import('../views/' + child.pagePath + '.vue')
              }
              manageRoute.children.push(itemMenu)
            }
          }
        }
      }
      console.log(manageRoute)
      // 动态添加到现在的路由对象中去
      router.addRoute(manageRoute)
    }
  }
}
setRoutes()
// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置当前的路由名称，为了在Header组件中去使用
  localStorage.setItem('currentPathName', to.name)
  // 触发store的数据更新
  store.commit('user/setPath')
  // 未找到路由的情况
  if (!to.matched.length) {
    const storeMenus = localStorage.getItem('menus')
    // 未找到路由的情况但有菜单页的情况,说明当前用户不具备此页面的权限
    if (storeMenus) {
      return next('/404')
    } else {
      // 跳到login页面
      return next('/login')
    }
  }
  // 其他的情况都放行
  return next()
})
export default router
