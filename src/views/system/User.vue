<template>
  <div>
    <!--搜索框区-->
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5" v-model="email"></el-input>
      <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <!--按钮区-->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
        class="ml-5"
        confirm-button-text='好的'
        cancel-button-text='不用了'
        icon="el-icon-info"
        icon-color="red"
        title="确定删除吗？"
        @confirm="delBatch"
      >
        <el-button type="danger" slot="reference" :disabled="multipleSelection.length <= 0">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <!--table表格-->
    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="username" label="用户名" width="140"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template v-slot="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm
            class="ml-5"
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="您确定删除吗？"
            @confirm="del(scope.row.id)"
          >
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--添加/修改用户信息-->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select clearable v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
          </el-select>
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
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userService from '@/service/UserService'
import roleService from '@/service/RoleService'

export default {
  name: 'User_vue',
  data () {
    return {
      // 批量删除
      multipleSelection: [],
      tableData: [],
      pageNum: 1,
      pageSize: 2,
      total: 0,
      username: '',
      email: '',
      address: '',
      // 配置动态table header颜色
      headerBg: 'headerBg',
      // 新增/删除
      form: {},
      dialogFormVisible: false,
      roles: []
    }
  },
  async created () {
    await this.load()
  },
  methods: {
    async load () {
      // 初始化加载分页数据
      const res = await userService.load({
        current: this.pageNum,
        size: this.pageSize,
        username: this.username,
        email: this.email,
        address: this.address
      })
      this.tableData = res.records
      this.total = res.total
      this.roles = await roleService.roles()
    },
    // 批量删除
    async delBatch () {
      // [{}, {}, {}] => [1,2,3]
      const ids = this.multipleSelection.map(value => value.id)
      await userService.del(ids) && this.$message.success('删除成功')
      await this.load()
    },
    // 单个删除
    async del (id) {
      await userService.del([id]) && this.$message.success('删除成功')
      await this.load()
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.dialogFormVisible = true
      this.form = {}
    },
    // 单个编辑
    handleEdit (row) {
      this.form = row
      this.dialogFormVisible = true
    },
    // 保存
    async save () {
      await userService.save(this.form) && this.$message.success('保存成功')
      this.dialogFormVisible = false
      // 重新刷新数据
      await this.load()
    },
    // 当size放生变化
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    reset () {
      this.username = ''
      this.email = ''
      this.address = ''
      this.load()
    }
  }
}
</script>
<style scoped>
</style>
