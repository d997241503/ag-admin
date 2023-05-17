<template>
  <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false">
    <el-form ref="dialogForm" label-width="130px" :model="sFormData" :rules="rules">
        <el-form-item label="办理过程：" prop="rectificationProcess">
            <el-checkbox-group v-model="sFormData.rectificationProcess" @change="handleCheckChange">
                <el-checkbox
                    v-for="item in recProOptions"
                    :key="item.value"
                    :label="item.value"
                >{{item.label}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="办理结果：" prop="rectificationResult">
            <el-input type="textarea" v-model="sFormData.rectificationResult"  placeholder="请输入办理结果" class="form-item-content"></el-input>
        </el-form-item>
      <el-form-item label="附件：" prop="rectificationFiles">
        <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
          :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
          @refreshData="getFiles"></UploadFiles>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
		getToken
	} from 'utils/auth';
  import cloneDeep from 'lodash/cloneDeep'
  import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
  import {updateTopicRec} from 'api/meeting'
  import {recProOptions} from './common'
  import {
		getTree
	} from 'api/admin/department/index';
    import {formatFile} from 'utils/file'
  export default {
    name:'SuperviseModal',
    components: { UploadFiles },
    data() {
      this.rules = {
        rectificationProcess: [
          { required: true, trigger: 'blur',
            validator: (rule, val, cb) => {
                if (!val.length) return cb(new Error('请选择办理过程'))
                cb()
            } 
          }
        ],
        rectificationResult: [
          { required: true, message: '请输入办理结果', trigger: 'blur' }
        ],
        rectificationFiles: [
            { 
                required: true, 
                validator: (rule, val, cb) => {
                    if (!val.length) return cb(new Error('请选择附件'))
                    cb()
                } 
            }
        ]
      }
      this.uploadFile = {
        textFirst: ' +上传文件',
        limit: 9,
        size: 30,
        url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
        accepts: '.pdf,.jpg,.png,.doc,.docx,.xls,.xlsx'
      }
      this.recProOptions = recProOptions
      return {
        sFormData: {},
        visible: false,
      }
    },
    methods: {
      handleOk() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.postData()
            this.visible = false
          } else {
            return false;
          }
        });
      },
      getFiles({files}) {
        this.sFormData.rectificationFiles = files
        if (files.length) this.clearVali('rectificationFiles')
      },
      handleCheckChange(val) {
        if (val.length) this.clearVali('rectificationProcess')
      },
      init(data) {
        this.visible = true
        const {rectificationFiles, rectificationProcess, rectificationResult, id} = data
        if (data.rectificationProcess) {
            this.title = '编辑办理情况'
        } else {
            this.title = '添加办理情况'
        }
        this.sFormData = {
            rectificationFiles: rectificationFiles
            ?   rectificationFiles.map(fileUrl => ({
                    name: formatFile(fileUrl),
                    url: fileUrl
                }))
            :   [],
            rectificationProcess: rectificationProcess || [],
            rectificationResult: rectificationResult || '',
            id
        }
        this.$nextTick(() => {
            this.$refs['uploadFiles'].init(this.sFormData.rectificationFiles || [])
            this.$refs['dialogForm'].clearValidate()
        })
      },
      postData() {
        const {rectificationFiles, id} = this.sFormData
        let data = {
            ...this.sFormData,
            rectificationFiles: rectificationFiles.map(file => file.response?.fileUrl || file.url)
        }
        updateTopicRec(id, data)
        .then((res) => {
            if (res?.status === 200) {
                this.$notify({
                    title: '成功',
                    message: '操作成功',
                    type: 'success',
                    duration: 2000
                });
                this.visible = false
                this.$emit('update')
            } else {
                return Promise.reject(res.msg)
            }
        }).catch((msg) => {
            this.$notify({
                title: '失败',
                message: msg || '操作失败',
                type: 'error',
                duration: 2000
            });
        })
      },
      clearVali(prop) {
        this.$refs['dialogForm'].clearValidate(prop)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form-item-content {
    width: 86%;
  }
  .seldept-item {
    display: block;
    width: 86%;
    >>> .el-popover__reference-wrapper {
        display: block;
        .el-select {
            width: 100%;
        }
    }
  }
</style>