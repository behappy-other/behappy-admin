<template>
  <el-card style="width: 500px;">
    <el-form label-width="80px" size="small">
      <el-form-item label="头像">
        <single-upload v-model="form.avatarUrl"></single-upload>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input type="textarea" v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>

import userService from '@/service/UserService'
import SingleUpload from '@/components/upload/singleUpload'

export default {
  name: 'Person_vue',
  components: { SingleUpload },
  data () {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
        // callback:'',
      },
      form: {},
      user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
    }
  },
  created () {
    this.getUser().then(res => {
      this.form = res
    })
  },
  methods: {
    async getUser () {
      return await userService.username({ username: this.user.username })
    },
    async save () {
      await userService.save(this.form) && this.$message.success('保存成功')
      // 触发父级更新User的方法
      this.$emit('refreshUser')
      // 更新浏览器存储的用户信息
      this.getUser().then(res => {
        localStorage.setItem('user', JSON.stringify(res))
      })
    }
  }
}
</script>

<style>
.avatar-uploader {
  text-align: center;
  padding-bottom: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}

.avatar {
  width: 138px;
  height: 138px;
  display: block;
}
</style>
