<template>
  <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false">
    <el-form ref="dialogForm" label-width="130px" :model="sFormData" :rules="rules">
        <el-form-item label="选择上报单位：" prop="deptId">
            <el-select v-model="sFormData.deptId" placeholder="请选择单位" clearable class="form-item-content">
                <el-option v-for="item in treeData" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                </el-option>
            </el-select>
        </el-form-item>
      <el-form-item label="监督项目名称：" prop="name">
        <el-input v-model="sFormData.name"  placeholder="请输入名称" class="form-item-content"></el-input>
      </el-form-item>
        <el-form-item label="监督时间：" prop="times">
            <el-date-picker v-model="sFormData.times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions" class="form-item-content">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="发现的问题：" prop="problem">
            <el-input type="textarea" v-model="sFormData.problem"  placeholder="请输入发现的问题" class="form-item-content"></el-input>
        </el-form-item>
        <el-form-item label="整改情况：" prop="rectificationSituation">
            <el-input type="textarea" v-model="sFormData.rectificationSituation"  placeholder="请输入整改情况" class="form-item-content"></el-input>
        </el-form-item>
      <el-form-item label="附件：" prop="fileList">
        <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
          :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
          @refreshData="getFiles"></UploadFiles>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleOk" :loading="saveBtnLoading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
  import {
		getToken
	} from 'utils/auth';
  import cloneDeep from 'lodash/cloneDeep'
  import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
  import {addMeetingSupervise} from 'api/meeting'
  import {formatFile} from 'utils/file'
      import {
		getGroupdeptlist
	} from 'api/admin/group/index';
  import {
		getTree
	} from 'api/admin/department/index';
  export default {
    name:'SuperviseModal',
    components: { UploadFiles },
    data() {
      this.rules = {
        name: [
          { required: true, message: '请输入监督项目名称', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择单位', trigger: 'blur' }
        ],
        times: [
            { required: true, trigger: 'blur',
                validator: (rule, val, cb) => {
                    if (!val.length) {
                        cb(new Error('请选择时间'))
                    } else cb()
                }
            }
        ],
        rectificationSituation: [
            { required: true, message: '请输入整改情况', trigger: 'blur'}
        ],
        problem: [
            { required: true, message: '请输入发现的问题', trigger: 'blur'}
        ],
        fileList: [
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
    this.pickerOptions = {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
      return {
        sFormData: {},
        title: '',
        visible: false,
        treeData: [],
        loading: false,
        meetingJoint_btn_department: false,
        saveBtnLoading: false
      }
    },
    created() {
        this.meetingJoint_btn_department = this.elements['meetingJoint:btn_department']
        this.getTreeInfo()
    },
    computed: {
        ...mapGetters([
            'elements', 'userId'
        ]),
    },
    methods: {
        getTreeInfo() {
            getGroupdeptlist({
                    code: 'dept',
                    userId: this.meetingJoint_btn_department ? undefined : this.userId
                                })
                            .then(res => {
                                if (res && res.status === 200) {
                                    this.treeData = res.data ? res.data : [];
                                } else {
                                    this.$notify({
                                        title: '失败',
                                        message: "获取部门树失败",
                                        type: 'error',
                                        duration: 2000
                                    });
                                }
                });
        },
      handleOk() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.postData()
          } else {
            return false;
          }
        });
      },
      getFiles({files}) {
        this.sFormData.fileList = files
      },
      init(data) {
        this.visible = true
        if (data) {
            this.title = '编辑监督情况'
            this.sFormData = {
                ...data,
                times: [data.startTime, data.endTime],
                fileList: data.superviseFiles.map(fileUrl => ({
                    name: formatFile(fileUrl),
                    url: fileUrl
                }))
            }
        } else {
            this.title = '添加监督情况'
            this.sFormData = {
                name: '',
                deptId: this.treeData[0]?.deptId,
                times: [],
                deptName: '',
                problem: '',
                rectificationSituation: '',
                fileList: []
            }
        }
        this.$nextTick(() => {
            this.$refs['uploadFiles'].init(this.sFormData.fileList)
            this.$refs['dialogForm'].clearValidate()
        })
      },
      postData() {
        const {id, times, fileList, deptId} = this.sFormData
        let method = id ? 'put' : 'post'
        let data = {
            ...this.sFormData,
            startTime: times[0],
            endTime: times[1],
            superviseFiles: fileList.map(file => file.url || file.response.fileUrl),
            deptName: this.treeData.find(dept => dept.deptId === deptId).deptName
        }
        this.saveBtnLoading = true
        addMeetingSupervise(data, method)
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
        }).finally(() => this.saveBtnLoading = false)
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