<template>
  <div class="mod-prod-sku-table">
    <el-form-item>
      <el-table
        :data="value"
        border
        style="width: 100%; margin-top: 20px"
         :span-method="tableSpanMethod">
        <el-table-column v-for="(leftTitle, index) in tableLeftTitles" :key="index" :label="leftTitle">
          <template slot-scope="scope">
            {{scope.row.properties.split(';')[index].split(':')[1]}}
          </template>
        </el-table-column>
        <el-table-column v-if="tableLeftTitles.length"
          prop="pic"
          label="sku图片"
          width="180">
          <template slot-scope="scope">
            <single-upload v-model="scope.row.pic"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="prodName"
          label="商品名称"
          width="250"  v-if="tableLeftTitles.length">
          <template slot-scope="scope">
            <el-input v-model="scope.row.prodName" type="textarea" :disabled="!scope.row.status"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="销售价">
          <template slot-scope="scope">
             <el-input-number
              size="small"
              v-model="scope.row.price"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status">
          </el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="oriPrice"
          label="市场价">
          <template slot-scope="scope">
            <el-input-number
              size="small"
              v-model="scope.row.oriPrice"
              controls-position="right"
              :precision="2"
              :max="1000000000"
              :min="0.01"
              :disabled="!scope.row.status">
            </el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          prop="stocks"
          label="库存">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stocks" type="number" :disabled="!scope.row.status"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="商品重量(kg)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.weight" :disabled="!scope.row.status"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="volume"
          label="商品体积(m³)">
          <template slot-scope="scope">
            <el-input v-model="scope.row.volume" :disabled="!scope.row.status"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changeSkuStatus(`${scope.$index}`)" v-if="scope.row.status">禁用</el-button>
            <el-button type="text" size="small" @click="changeSkuStatus(`${scope.$index}`)" v-else>启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </div>
</template>

<script>
import prodPropService from '@/service/ProdPropService'
import singleUpload from '@/components/upload/singleUpload'
export default {
  data () {
    return {
      // 数据库中的规格
      dbSpecs: [],
      // 根据选定的规格所查询出来的规格值
      dbSpecValues: [],
      specs: [], // 使用的规格
      initing: false
    }
  },
  components: {
    singleUpload
  },
  props: {
    value: {
      default: function () {
        return []
      },
      type: Array
    },
    prodName: {
      default: ''
    }
  },
  watch: {
    prodName: function () {
      this.skuAddProdName()
    }
  },
  created: function () {
    prodPropService.list().then(({ data }) => {
      this.dbSpecs = data
    })
  },
  computed: {
    tableLeftTitles () {
      const res = []
      for (let i = 0; i < this.skuTags.length; i++) {
        const skuTag = this.skuTags[i]
        res.push(skuTag.tagName)
      }
      return res
    },
    skuTags: {
      get () { return this.$store.state.prod.skuTags }
    },
    defaultSku () {
      return this.$store.state.prod.defaultSku
    },
    getValue: function () {
      return this.value
    }
  },
  methods: {
    init () {
      this.initing = true
    },
    tableSpanMethod ({ row, column, rowIndex, columnIndex }) {

    },
    changeSkuStatus (tagIndex) {
      this.getValue[tagIndex].status = this.getValue[tagIndex].status ? 0 : 1
    },
    skuAddProdName () {
      if (this.initing) {
        return
      }
      const skuList = []
      for (let i = 0; i < this.value.length; i++) {
        const sku = Object.assign({}, this.value[i])
        if (!sku.properties) {
          return
        }
        sku.skuName = ''
        const properties = sku.properties.split(';')
        for (const propertiesKey in properties) {
          sku.skuName += properties[propertiesKey].split(':')[1] + ' '
        }
        sku.prodName = this.prodName + ' ' + sku.skuName
        skuList.push(sku)
      }
      this.$emit('input', skuList)
    }
  }
}
</script>
