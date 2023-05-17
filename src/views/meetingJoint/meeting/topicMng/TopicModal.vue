<template>
  <el-dialog :visible.sync="sVisible" :title="title" width="900px" @closed="$emit('closed')" :close-on-click-modal="false">
    <el-form ref="dialogForm" label-width="100px" :model="sFormData" :rules="rules">
      <el-form-item label="议题：" prop="topicName">
        <el-input v-model="sFormData.topicName"  placeholder="请输入议题" class="form-item-content"></el-input>
      </el-form-item>
      <el-form-item label="类别：" prop="type">
        <el-select v-model="sFormData.type" placeholder="请选择类别" class="form-item-content">
          <el-option label="任务" value="0"></el-option>
          <el-option label="监督" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传附件：" prop="fileList">
        <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
          :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
          @refreshData="getFiles"></UploadFiles>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="sVisible = false">取消</el-button>
      <el-button type="primary" @click="handleOk" :loading="btnLoading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
		getToken
	} from 'utils/auth';
  import cloneDeep from 'lodash/cloneDeep'
  import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
  export default {
    name:'TopicModal',
    components: { UploadFiles },
    data() {
      this.rules = {
        topicName: [
          { required: true, message: '请输入议题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类别', trigger: 'change' }
        ]
      }
      this.uploadFile = {
        textFirst: ' +上传文件',
        limit: 9,
        size: 30,
        url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
        accepts: '.pdf,.jpg,.png,.doc,.docx,.xls,.xlsx'
      }
      return {
        sFormData: {},
        btnLoading: false
      }
    },
    props: {
      title: String,
      visible: Boolean,
      formData: {
        default: () => {}
      }
    },
    computed: {
      sVisible: {
        get() {
          return this.visible
        },
        set(newVal) {
          this.$emit('update:visible', newVal)
        }
      }
    },
    watch: {
      formData: {
        handler(newVal, oldVal) {
          if (newVal.id) {
            this.sFormData = cloneDeep(newVal)
            this.$nextTick(() => {
                this.$refs['uploadFiles']?.init(this.sFormData.fileList)
            })
          } else {
            this.$nextTick(() => {
                this.$refs['dialogForm']?.clearValidate()
                this.$refs['uploadFiles']?.init([])
            })
            this.sFormData = {
              topicName: '',
              type: '',
              fileList: []
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      handleOk() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.$emit('confirm', this.sFormData)
          } else {
            return false;
          }
        });
      },
      getFiles({files}) {
        this.sFormData.fileList = files
      } 
    }
  }
</script>

<style lang="scss" scoped>
  .form-item-content {
    width: 86%;
  }
</style>