<template>
  <div>
    <el-form :model="dataForm"
             ref="dataForm"
             label-width="100px">
      <!--<el-form-item label="产品图片">-->
      <!--  <mul-pic-upload v-model="dataForm.imgs"></mul-pic-upload>-->
      <!--</el-form-item>-->
      <el-form-item label="状态">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="产品分类"
                    :rules="[{ required: true, message: '请选择产品分类'}]"
                    prop="categoryId">
        <el-col :span="8">
          <el-cascader props.expandTrigger="hover"
                       :options="category.list"
                       :props="category.props"
                       v-model="category.selected"
                       props.checkStrictly
                       @change="handleCategoryChange">
          </el-cascader>
        </el-col>
      </el-form-item>
      <el-form-item label="产品名称"
                    prop="prodName"
                    :rules="[{ required: true, message: '产品名称不能为空'}]">
        <el-col :span="8">
          <el-input v-model="dataForm.prodName"
                    placeholder="产品名称"
                    maxlength="50"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="产品卖点"
                    prop="brief">
        <el-col :span="8">
          <el-input v-model="dataForm.brief"
                    type="textarea"
                    :autosize="{minRows: 2, maxRows: 4}"
                    placeholder="产品卖点"></el-input>
        </el-col>
      </el-form-item>
      <sku-tag ref="skuTag"
               :skuList="dataForm.skuList"
               @change="skuTagChangeSkuHandler"></sku-tag>
      <sku-table ref="skuTable"
                 v-model="dataForm.skuList"
                 :prodName.sync="dataForm.prodName">
      </sku-table>
      <el-form-item label="产品详情"
                    prop="content">
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="dataFormSubmit()">确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Debounce, idList, isNumber } from '@/utils'
import SkuTag from './SkuTag'
import SkuTable from './SkuTable'
import categoryService from '@/service/CategoryService'
import prodService from '@/service/ProdService'

export default {
  name: 'ProdInfo',
  data () {
    return {
      // 分类树展示与回显
      category: {
        list: [],
        selected: [],
        props: {
          value: 'categoryId',
          label: 'categoryName'
        }
      },
      // 规格列表
      dataForm: {
        prodName: '',
        brief: '',
        pic: '',
        imgs: '',
        categoryId: 0,
        prodId: 0,
        skuList: [],
        tagList: [],
        content: '',
        status: 1
      },
      tags: [],
      resourcesUrl: ''
    }
  },
  components: {
    SkuTag,
    SkuTable
  },
  computed: {},
  async activated () {
    // 判断: prodId=%5Bobject%20PointerEvent%5D
    console.log(this.$route.query.prodId)
    if (isNumber(this.$route.query.prodId)) {
      this.dataForm.prodId = this.$route.query.prodId
    }
    await this.getDataList()
  },
  methods: {
    // 获取分类数据
    async getDataList () {
      await this.getCategoryList()
      if (this.dataForm.prodId) {
        // 获取产品数据
        const data = await prodService.info(this.dataForm.prodId)
        console.log(data)
        this.dataForm = data
        this.$refs.skuTag.init(data.skuList)
        this.$refs.skuTable.init()
        this.category.selected = idList(this.category.list, this.dataForm.categoryId, 'categoryId', 'children').reverse()
      } else {
        // $nextTick: 待界面渲染完毕执行
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
          this.$refs.skuTag.init()
          this.dataForm.pic = ''
          this.dataForm.imgs = ''
        })
      }
    },
    // 获取分类信息
    async getCategoryList () {
      // 2级品类层级树
      this.category.list = this.categoryList = await categoryService.load({
        grade: 2
      })
      console.log(this.category.list)
      console.log(this.categoryList)
    },
    // 选择分类改变事件
    handleCategoryChange (val) {
      this.dataForm.categoryId = val[val.length - 1]
    },
    // 表单提交
    dataFormSubmit: Debounce(function () {
      this.$refs.dataForm.validate(async (valid) => {
        if (!valid) {
          return
        }
        const param = Object.assign({}, this.dataForm)
        // 设置价格和库存
        this.paramSetPriceAndStocks(param)
        // 商品主图
        param.pic = this.dataForm.imgs.split(',')[0]
        await prodService.saveOrUpdate(param)
      })
    }),
    paramSetPriceAndStocks (param) {
      // 获取规格属性信息
      // param.skuList = this.$refs.prodSpec.getTableSpecData()
      // 商品库存
      param.totalStocks = 0
      // 商品价格
      param.price = 0
      // 商品原价
      param.oriPrice = 0
      // 商品实际库存
      for (let i = 0; i < param.skuList.length; i++) {
        const element = param.skuList[i]
        if (element.status !== 1) {
          continue
        }
        if (param.price === 0) {
          param.price = element.price ? Number.parseFloat(element.price) : 0
        }
        // 商品价格为最低价的那件商品的价格
        param.price = Math.min(param.price, element.price)
        if (param.price === element.price) {
          param.oriPrice = element.oriPrice ? Number.parseFloat(element.oriPrice) : 0
        }
        param.totalStocks += element.stocks ? Number.parseInt(element.stocks) : 0
      }
      // 如果sku没有商品名称，则使用商品的商品名称
      if (param.skuList.length === 1) {
        param.skuList[0].prodName = this.dataForm.prodName
      }
    },
    skuTagChangeSkuHandler (skuList) {
      const prodName = this.dataForm.prodName
      skuList.forEach(sku => {
        if (sku.properties) {
          sku.skuName = ''
          const properties = sku.properties.split(';')
          for (const propertiesKey in properties) {
            sku.skuName += properties[propertiesKey].split(':')[1] + ' '
          }
          sku.prodName = prodName + ' ' + sku.skuName
        }
      })
      this.dataForm.skuList = skuList
    }
  }
}
</script>
