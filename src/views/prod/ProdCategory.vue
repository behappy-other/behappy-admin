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
              @selection-change="handleSelectionChange" row-key="categoryId">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称" treeKey="categoryId"></el-table-column>
      <el-table-column label="图片">
        <template v-slot="scope">
          <img :src="scope.row.pic " style="width: 150px;height: 60px"/>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0"
                  size="small"
                  type="danger">下线</el-tag>
          <el-tag v-else
                  size="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="seq"
                       header-align="center"
                       align="center"
                       label="排序号">
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template v-slot="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm
            class="ml-5"
            confirm-button-text='确定'
            cancel-button-text='我再想想'
            icon="el-icon-info"
            icon-color="red"
            title="您确定删除吗？"
            @confirm="del(scope.row.categoryId)"
          >
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--dialog区域-->
    <el-dialog :title="!dataForm.currentId ? '新增' : '修改'"
               :close-on-click-modal="false"
               :visible.sync="visible">
      <el-form :model="dataForm"
               ref="dataForm"
               @keyup.enter.native="dataFormSubmit()"
               label-width="80px">
        <el-form-item v-if="dataForm.type !== 2"
                      label="分类图片"
                      prop="pic">
          <single-upload v-model="dataForm.pic"></single-upload>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2"
                      label="分类名称"
                      prop="categoryName">
          <el-input v-model="dataForm.categoryName"
                    controls-position="right"
                    :min="0"
                    label="分类名称"></el-input>
        </el-form-item>
        <el-form-item label="上级分类">
          <el-cascader expand-trigger="hover"
                       :options="categoryList"
                       :props="categoryTreeProps"
                       change-on-select
                       :clearable="true"
                       v-model="selectedCategory"
                       @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2"
                      label="排序号"
                      prop="seq">
          <el-input-number v-model="dataForm.seq"
                           controls-position="right"
                           :min="0"
                           label="排序号"></el-input-number>
        </el-form-item>
        <el-form-item label="状态"
                      size="mini"
                      prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">下线</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
      <el-button size="small"
                 @click="visible = false">取消</el-button>
      <el-button size="small"
                 type="primary"
                 @click="dataFormSubmit">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import { Debounce, idList } from '@/utils'
import categoryService from '@/service/CategoryService'
import SingleUpload from '@/components/upload/singleUpload'

export default {
  name: 'ProdCategory',
  components: { SingleUpload },
  data () {
    return {
      tableData: [],
      name: '',
      multipleSelection: [],
      // 配置动态table header颜色
      headerBg: 'headerBg',
      // dialog
      visible: false,
      dataForm: {
        categoryId: 0,
        currentId: 0,
        grade: 0,
        categoryName: '',
        seq: 1,
        status: 1,
        parentId: 0,
        pic: ''
      },
      categoryList: [],
      selectedCategory: [],
      categoryTreeProps: {
        value: 'categoryId',
        label: 'categoryName'
      }
    }
  },
  created () {
    this.load()
  },
  methods: {
    async load () {
      // 初始化加载分页数据
      this.tableData = await categoryService.load({
        categoryName: this.name
      })
      // 2级品类层级树
      this.categoryList = await categoryService.load({
        grade: 2
      })
    },
    // 批量删除
    async delBatch () {
      // [{}, {}, {}] => [1,2,3]
      const ids = this.multipleSelection.map(value => value.categoryId)
      await categoryService.del(ids) && this.$message.success('删除成功')
      await this.load()
    },
    // 单个删除
    async del (id) {
      await categoryService.del([id]) && this.$message.success('删除成功')
      await this.load()
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleAdd () {
      this.visible = true
      // $nextTick: 当数据更新了，在dom中渲染后，自动执行该函数
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.selectedCategory = []
      })
      this.dataForm = {
        categoryId: 0,
        currentId: 0,
        grade: 0,
        categoryName: '',
        seq: 1,
        status: 1,
        parentId: 0,
        pic: ''
      }
    },
    // 单个编辑
    handleEdit (row) {
      this.visible = true
      // $nextTick: 当数据更新了，在dom中渲染后，自动执行该函数
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.selectedCategory = []
      })
      this.dataForm.categoryId = row.categoryId
      this.dataForm.categoryName = row.categoryName
      this.dataForm.seq = row.seq
      this.dataForm.pic = row.pic
      this.dataForm.parentId = row.parentId
      this.dataForm.status = row.status
      this.selectedCategory = idList(this.categoryList, row.parentId, 'categoryId', 'children').reverse()
    },
    handleChange (val) {
      this.dataForm.parentId = val[val.length - 1]
    },
    // 保存,表单提交
    dataFormSubmit: Debounce(async function () {
      if (this.selectedCategory.length === 1) {
        this.dataForm.grade = 0
      }
      if (this.selectedCategory.length === 2) {
        this.dataForm.grade = 1
      }
      if (this.selectedCategory.length === 3) {
        this.dataForm.grade = 2
      }
      await categoryService.save({
        categoryId: this.dataForm.categoryId || undefined,
        categoryName: this.dataForm.categoryName,
        status: this.dataForm.status,
        seq: this.dataForm.seq,
        grade: this.dataForm.grade,
        parentId: this.dataForm.parentId,
        pic: this.dataForm.pic
      }) && this.$message.success('保存成功')
      this.visible = false
      this.load()
    }),
    reset () {
      this.name = ''
      this.load()
    }
  }
}
</script>

<style scoped>
</style>
