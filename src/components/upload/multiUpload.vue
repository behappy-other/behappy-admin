<template>
  <div>
    <el-upload
      action="http://behappy-xiaowu.oss-cn-beijing.aliyuncs.com"
      :data="dataObj"
      :list-type="listType"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
      :show-file-list="showFile"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>
<script>
import { getUUID } from '@/utils'
import policyService from '@/service/PolicyService'
export default {
  name: 'multiUpload',
  props: {
    // 图片属性数组
    value: Array,
    // 最大上传图片数量
    maxCount: {
      type: Number,
      default: 30
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    showFile: {
      type: Boolean,
      default: true
    }

  },
  data () {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: '',
        uuid: ''
      },
      dialogVisible: false,
      dialogImageUrl: null
    }
  },
  computed: {
    fileList () {
      const fileList = []
      for (let i = 0; i < this.value.length; i++) {
        fileList.push({ url: this.value[i] })
      }

      return fileList
    }
  },
  mounted () {},
  methods: {
    emitInput (fileList) {
      const value = []
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url)
      }
      this.$emit('input', value)
    },
    handleRemove (file, fileList) {
      this.emitInput(fileList)
    },
    handlePreview (file) {
      this.dialogVisible = true
      this.dialogImageUrl = file.url
    },
    beforeUpload (file) {
      const _self = this
      return new Promise((resolve, reject) => {
        policyService.policy()
          .then(response => {
            console.log(response)
            _self.dataObj.policy = response.policy
            _self.dataObj.signature = response.signature
            _self.dataObj.ossaccessKeyId = response.accessId
            // eslint-disable-next-line no-template-curly-in-string
            _self.dataObj.key = response.dir + getUUID() + '_${filename}'
            _self.dataObj.dir = response.dir
            _self.dataObj.host = response.host
            _self.dataObj.expire = response.expire
            resolve(true)
          })
          .catch(err => {
            console.error(err)
            reject(err)
          })
      })
    },
    handleUploadSuccess (res, file) {
      this.fileList.push({
        name: file.name,
        // url: this.dataObj.host + "/" + this.dataObj.dir + "/" + file.name； 替换${filename}为真正的文件名
        // eslint-disable-next-line no-template-curly-in-string
        url: this.dataObj.host + '/' + this.dataObj.key.replace('${filename}', file.name)
      })
      this.emitInput(this.fileList)
    },
    handleExceed (files, fileList) {
      this.$message({
        message: '最多只能上传' + this.maxCount + '张图片',
        type: 'warning',
        duration: 1000
      })
    }
  }
}
</script>
<style>
</style>
