<template>
  <div style="line-height: 60px; display: flex">
    <div style="flex: 1;">
      <!--面包屑-->
      <span :class="collapseBtnClass" style="cursor: pointer; font-size: 18px" @click="collapse"></span>
      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px">
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dropdown style="width: 100px; cursor: pointer">
      <div style="display: inline-block">
        <img
          :src="user.avatarUrl?user.avatarUrl:'https://gitee.com/xiaowu_wang/pic/raw/master/timg_%E7%9C%8B%E5%9B%BE%E7%8E%8B.jpg'"
          alt=""
          style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
        <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <router-link to="/password">修改密码</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <router-link to="/person">个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
          <span style="text-decoration: none" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Header_vue',
  props: {
    collapseBtnClass: String
  },
  data () {
    return {
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    }
  },
  methods: {
    collapse () {
      // 子组件中需要向父组件传值处使用this.$emit
      this.$emit('asideCollapse')
    },
    logout () {
      this.$store.commit('user/logout')
      this.$message.success('退出成功')
    }
  },
  computed: {
    currentPathName () {
      // 需要监听的数据
      return this.$store.state.user.currentPathName
    }
  },
  watch: {
    currentPathName (newVal, oldVal) {
      console.log(newVal)
    }
  }
}
</script>

<style scoped>

</style>
