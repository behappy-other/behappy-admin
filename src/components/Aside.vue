<template>
  <el-menu :default-openeds="opens" style="min-height: 100%; overflow-x: hidden"
           background-color="rgb(48, 65, 86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img src="../assets/logo.png" alt="" style="width: 20px; position: relative; top: 5px;">
      <b style="color: white; margin-left: 5px" v-show="logoTextShow">behappy后台系统</b>
    </div>
    <!--主页-->
    <el-menu-item :index="'/home'">
      <i class="el-icon-house"></i>
      <span slot="title">主页</span>
    </el-menu-item>
    <!--菜单区(动态路由)-->
    <div v-for="item in menus" :key="item.id">
      <!--是否展示-->
      <div v-if="item.isShow === 1">
        <!--带path的为子级菜单-->
        <div v-if="item.path">
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </div>
        <div v-else>
          <el-submenu :index="item.id + ''">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <div v-for="subItem in item.children" :key="subItem.id">
              <!--是否展示-->
              <div v-if="subItem.isShow === 1">
                <el-menu-item :index="subItem.path">
                  <i :class="subItem.icon"></i>
                  <span slot="title">{{ subItem.name }}</span>
                </el-menu-item>
              </div>
            </div>
          </el-submenu>
        </div>
      </div>
    </div>
  </el-menu>
</template>

<script>

export default {
  name: 'Aside_vue',
  // 父组件通过 props 向下传递数据给子组件，子组件通过 events 给父组件发送消息
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },
  data () {
    return {
      menus: localStorage.getItem('menus') ? JSON.parse(localStorage.getItem('menus')) : [],
      opens: localStorage.getItem('menus') ? JSON.parse(localStorage.getItem('menus')).map(v => v.id + '') : []

    }
  }
}
</script>

<style scoped>
/*解决收缩菜单文字不消失问题*/
.el-menu--collapse span {
  visibility: hidden;
}
</style>
