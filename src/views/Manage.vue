<template>
  <el-container style="min-height: 100vh">
    <el-aside :width="sideWidth + 'px'" style="box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside :is-collapse="isCollapse" :logo-text-show="logoTextShow"/>
    </el-aside>
    <el-container>
      <el-header style="border-bottom: 1px solid #ccc;">
        <Header :collapseBtnClass="collapseBtnClass" @asideCollapse="collapse" :collapse="isCollapse"/>
      </el-header>
      <el-main>
        <keep-alive>
          <!--表示当前页面的子路由会在 <router-view /> 里面展示-->
          <router-view @refreshUser="getUser"/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Aside from '@/components/Aside'
import Header from '@/components/Header'
import userService from '@/service/UserService'

export default {
  name: 'Manage_vue',
  data () {
    return {
      // 默认展开图标
      collapseBtnClass: 'el-icon-s-fold',
      // 默认展开/不缩进
      isCollapse: false,
      // 默认aside框200px
      sideWidth: 200,
      // 默认菜单栏上方字体展示
      logoTextShow: true
    }
  },
  // 引入组件
  components: {
    Aside,
    Header
  },
  methods: {
    // 点击收缩按钮触发
    collapse () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        // 收缩
        this.sideWidth = 60
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {
        // 展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },
    async getUser () {
      const username = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : ''
      if (username) {
        // 从后台获取User数据,重新赋值后台的最新User数据
        this.user = await userService.username({ username })
      }
    }
  }
}
</script>

<style scoped>

</style>
