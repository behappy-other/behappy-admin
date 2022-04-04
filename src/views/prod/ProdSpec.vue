<template>
  <div>
    <!--搜索区-->
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="属性名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>
    <!--按钮区-->
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
              row-key="id" default-expand-all @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="propName" label="属性名称"></el-table-column>
      <el-table-column label="属性值">
        <template v-slot="scope">
          <el-tag class="ml-5" v-for="item in scope.row.prodPropValues" :key="item.valueId">
            {{ item.propValue }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template v-slot="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm
            class="ml-5"
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="您确定删除吗？"
            @confirm="del(scope.row.propId)"
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
    <!--dialog区域-->
    <el-dialog :title="!this.dataList[0].propId ? '新增' : '修改'"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <el-table :data="dataList"
                border
                style="width: 100%;">
        <el-table-column prop="propName"
                         header-align="center"
                         align="center"
                         label="属性名称">
          <template slot-scope="scope">
            <el-input placeholder="请输入内容"
                      v-model="scope.row.propName"
                      maxlength="10"
                      show-word-limit
                      clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="prodPropValues"
                         header-align="center"
                         align="center"
                         label="属性值">
          <template slot-scope="scope">
            <el-col :span="12"
                    v-for="item in scope.row.prodPropValues"
                    :key="item.valueId">
              <el-input placeholder="请输入内容"
                        v-model="item.propValue"
                        @clear="clearProdPropValues"
                        maxlength="20"
                        show-word-limit
                        clearable></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary"
                         icon="el-icon-circle-plus"
                         @click="addInput()"></el-button>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="save">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import prodPropService from '@/service/ProdPropService'
import { Debounce } from '@/utils'

export default {
  name: 'ProdSpec',
  data () {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name: '',
      form: {},
      multipleSelection: [],
      options: [],
      // 配置动态table header颜色
      headerBg: 'headerBg',
      // dialog
      visible: false,
      dataList: [{
        propId: 0,
        propName: '',
        prodPropValues: [{ propValue: '' }]
      }]
    }
  },
  created () {
    this.load()
  },
  methods: {
    async load () {
      const res = await prodPropService.page({
        current: this.pageNum,
        size: this.pageSize,
        propName: this.name
      })
      this.tableData = res.records
      this.total = res.total
    },
    // 批量删除
    async delBatch () {
      // [{}, {}, {}] => [1,2,3]
      const ids = this.multipleSelection.map(value => value.propId)
      await prodPropService.del(ids) && this.$message.success('删除成功')
      await this.load()
    },
    // 单个删除
    async del (id) {
      console.log(id)
      await prodPropService.del([id]) && this.$message.success('删除成功')
      await this.load()
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存,表单提交
    save: Debounce(async function () {
      if (this.dataList[0].prodPropValues) {
        const temp = []
        for (const key in this.dataList[0].prodPropValues) {
          // eslint-disable-next-line no-prototype-builtins
          if (this.dataList[0].prodPropValues.hasOwnProperty(key)) {
            const element = this.dataList[0].prodPropValues[key]
            if (element.propValue) {
              temp.push(this.dataList[0].prodPropValues[key])
            }
          }
        }
        this.dataList[0].prodPropValues = temp
      }
      await prodPropService.save({
        propId: this.dataList[0].propId || undefined,
        propName: this.dataList[0].propName,
        prodPropValues: this.dataList[0].prodPropValues
      }) && this.$message.success('保存成功')
      await this.load()
      this.visible = false
    }),
    // 当size放生变化
    handleSizeChange (pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    handleEdit (row) {
      this.dataList = [JSON.parse(JSON.stringify(row))]
      this.visible = true
    },
    handleAdd () {
      this.visible = true
      this.dataList = [
        { propId: 0, propName: '', prodPropValues: [{ propValue: '' }] }
      ]
    },
    reset () {
      this.name = ''
      this.load()
    },
    clearProdPropValues () {
      if (this.dataList[0].prodPropValues.length === 1) {
        return
      }
      for (let i = 0; i < this.dataList[0].prodPropValues.length; i++) {
        const element = this.dataList[0].prodPropValues[i]
        if (!element.propValue) {
          this.dataList[0].prodPropValues.splice(i, 1)
        }
      }
    },
    addInput () {
      const temp = this.dataList[0].prodPropValues
      if (temp[temp.length - 1].propValue) {
        temp.push({})
      }
    }
  }
}
</script>
