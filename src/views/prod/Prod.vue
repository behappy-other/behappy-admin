<template>
  <div>
    <!--搜索区-->
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入产品名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <!--按钮区-->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="save">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm
        class="ml-5"
        confirm-button-text='确定'
        cancel-button-text='我再想想'
        icon="el-icon-info"
        icon-color="red"
        title="您确定批量删除这些数据吗？"
        @confirm="delBatch"
      >
        <el-button type="danger" slot="reference" :disabled="multipleSelection.length <= 0">批量删除 <i
          class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
    </div>
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"
              row-key="id" default-expand-all @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="prodName" label="产品名称"></el-table-column>
      <el-table-column prop="oriPrice" label="商品原价"></el-table-column>
      <el-table-column prop="price" label="商品现价"></el-table-column>
      <el-table-column label="状态">
        <template v-slot="scope">
          <el-tag :type="scope.row.status === 1? 'success':'warning'">{{ scope.row.status === 1 ? '已上架' : '已下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="产品图片" class-name="fontSize18" align="center" label-class-name="fontSize12">
        <template v-slot="scope">
          <img :src="scope.row.pic"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template v-slot="scope">
          <el-button type="success" @click="save(scope.row.prodId)">编辑 <i class="el-icon-edit"></i></el-button>
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
  </div>
</template>

<script>
import prodService from '@/service/ProdService'

export default {
  name: 'prod_vue',
  data () {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: '',
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      options: [],
      // 配置动态table header颜色
      headerBg: 'headerBg'
    }
  },
  created () {
    this.load()
  },
  methods: {
    async load () {
      const res = await prodService.page({
        current: this.pageNum,
        size: this.pageSize,
        name: this.name
      })
      this.tableData = res.records
      this.total = res.total
      for (const key in this.tableData) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.tableData.hasOwnProperty(key)) {
          const element = this.tableData[key]
          element.imgs = element.imgs.split(',')[0]
        }
      }
    },
    async save (id) {
      await this.$router.push({
        path: '/prodInfo',
        query: { prodId: id }
      })
    },
    // 判断是否带着pid来的
    handleAdd (pid) {
      this.dialogFormVisible = true
      this.form = {}
      if (pid) {
        this.form.pid = pid
      }
    },
    handleEdit (row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    async del (id) {
      await prodService.del([id]) && this.$message.success('删除成功')
      await this.load()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    async delBatch () {
      const ids = this.multipleSelection.map(v => v.id)
      await prodService.del(ids) && this.$message.success('批量删除成功')
      await this.load()
    },
    reset () {
      this.name = ''
      this.load()
    }
  }
}
</script>
