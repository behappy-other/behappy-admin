<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
        class="ml-5"
        confirm-button-text='确定'
        cancel-button-text='我再想想'
        icon="el-icon-info"
        icon-color="red"
        title="您确定批量删除这些数据吗？"
        @confirm="delBatch"
      >
        <el-button type="danger" slot="reference" :disabled="multipleSelection.length <= 0">批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="flag" label="唯一标识"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template v-slot="scope">
          <el-button type="info" @click="selectMenu(scope.row)">分配菜单 <i class="el-icon-menu"></i></el-button>
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
    <!--新增/update角色 dialog-->
    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%" >
      <el-form label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识">
          <el-input v-model="form.flag" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
    <!--  菜单分配-->
    <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%">
      <!--expends/checks设置默认展开和默认选中的节点-->
      <el-tree
        :props="props"
        :data="menuData"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="expends"
        :default-checked-keys="checks">
        <template v-slot="{ data }">
          <span><i :class="data.icon"></i> {{ data.name }}</span>
        </template>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVis = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleService from '@/service/RoleService'
import { ROLE_ADMIN } from '@/utils/constant'
import menuService from '@/service/MenuService'
import roleMenuService from '@/service/RoleMenuService'

export default {
  name: 'Role_vue',
  data () {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: '',
      form: {},
      dialogFormVisible: false,
      menuDialogVis: false,
      multipleSelection: [],
      menuData: [],
      // 配置动态table header颜色
      headerBg: 'headerBg',
      expends: [],
      checks: [],
      props: {
        label: 'name'
      },
      // 匹配当前角色所有menu_id
      ids: []
    }
  },
  created () {
    this.load()
  },
  methods: {
    async load () {
      // 初始化加载分页数据
      const res = await roleService.load({
        current: this.pageNum,
        size: this.pageSize,
        name: this.name
      })
      this.tableData = res.records
      this.total = res.total
      this.ids = await menuService.menuIds()
    },
    // 批量删除
    async delBatch () {
      // [{}, {}, {}] => [1,2,3]
      const ids = this.multipleSelection.map(value => value.id)
      await roleService.del(ids) && this.$message.success('删除成功')
      await this.load()
    },
    // 单个删除
    async del (id) {
      await roleService.del([id]) && this.$message.success('删除成功')
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
      await roleService.save(this.form) && this.$message.success('保存成功')
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
      this.name = ''
      this.load()
    },
    async selectMenu (role) {
      this.roleId = role.id
      this.roleFlag = role.flag
      // 请求菜单数据
      this.menuData = await menuService.menus()
      // 把后台返回的菜单数据处理成 id数组
      this.expends = this.menuData.map(v => v.id)
      this.checks = await roleMenuService.getRoleMenu(this.roleId)
      // 匹配当前角色所有menu_id
      this.ids.forEach(id => {
        if (!this.checks.includes(id)) {
          // 可能会报错：Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'setChecked')
          this.$nextTick(() => {
            this.$refs.tree.setChecked(id, false)
          })
        }
      })
      this.menuDialogVis = true
    },
    async saveRoleMenu () {
      await roleMenuService.setRoleMenu(this.roleId, this.$refs.tree.getCheckedKeys()) && this.$message.success('绑定成功')
      this.menuDialogVis = false
      // 操作管理员角色后需要重新登录
      if (this.roleFlag === ROLE_ADMIN) {
        this.$store.commit('logout')
      }
    }
  }
}
</script>

<style scoped>
</style>
