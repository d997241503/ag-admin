<template>
  <el-dialog :visible.sync="visible" title="廉审发起" :close-on-click-modal="false">
    <el-form ref="dialogForm" label-width="130px" :model="sFormData" :rules="rules">
        <el-form-item label="发起人：" prop="initiatorUserId" class="box-form">
            <!-- <el-select v-model="sFormData.userId" placeholder="请选择发起人" filterable clearable class="form-item-content">
                <el-option v-for="item in UserData" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
            </el-select> -->
            <el-button @click="personnelFistHandle('发起人')" type="text"
                class="but-css">
                选择人员
                <span v-if="!sFormData.initiatorName">(未选择)</span>
                <span v-else>(已选择{{sFormData.initiatorName ? sFormData.initiatorName : ''}})</span>
            </el-button>
            <el-select class="form-item-content input-item input-select elinput" v-model="sFormData.initiatorUserId" multiple @focus="closeIt" ref="selectIt"
                placeholder="">
            </el-select>
        </el-form-item>
        <el-form-item label="廉审对象：" prop="auditMemberFileUrl">
            <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
            :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
            @refreshData="getFiles"></UploadFiles>
            <span class="demo-download click-text" @click="demoDownload">模板下载</span>
        </el-form-item>
        <el-form-item label="申请事项：" prop="type">
            <el-select v-model="sFormData.type" placeholder="请选择申请事项" clearable class="form-item-content">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="附件：">
					<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="2"
						:accepts="uploadFile.accepts1" :limit="uploadFile.limit1" :size="uploadFile.size"
						@refreshData="getFiles"></UploadFiles>
				</el-form-item>
        <el-form-item label="备注：" prop="remarks">
            <el-input type="textarea" v-model="sFormData.remarks" :autosize="{minRows: 4}"  placeholder="请输入备注" class="form-item-content"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleOk" :loading="loading">确定</el-button>
    </div>
    <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="30%"
        class="dialog"
        >
        <div slot="title" class="postion">
            <i class="el-icon-warning-outline"></i>
            <span>文件导入成功，但有错误。</span>
        </div>
        <div class="upload-error">
            <span>总上传行数：{{errorData.allRows}}</span>
            <span>已导入行数：{{errorData.successRows}}</span>
            <span>错误行数：{{errorData.errolRows}}</span>
        </div>
        <div class="upload-error">
            <span>具体详情请</span>
            <span class="error-download" @click="downloadTxt">点击下载</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 弹窗 选择人员 -->
    <fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" :choiceSingle="true" ref="personnelFist" title="人员">
    </fuhsiSelectPersonnel>
  </el-dialog>
</template>

<script>
    import {
        validator,
        addObj
    } from 'api/employ/index';
    import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
    import {mapGetters} from 'vuex'
  import {
		getToken
	} from 'utils/auth';
  import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
  import {addMeetingSupervise} from 'api/meeting'
  import {downloadFile} from 'utils/file'
  import {getUserDeptInfo} from 'api/admin/user'
  export default {
    name:'SuperviseModal',
    components: { UploadFiles, fuhsiSelectPersonnel },
    data() {
      this.rules = {
        initiatorUserId: [
          { required: true, message: '请选择发起人', trigger: 'change' }
        ],
        auditMemberFileUrl: [
            { 
                required: true, 
                validator: (rule, val, cb) => {
                    if (!val.length) return cb(new Error('请上传文件'))
                    cb()
                } 
            }
        ],
        type: [
            { required: true, message: '请选择申请事项', trigger: 'change'}
        ],
      }
      this.uploadFile = {
        textFirst: ' +上传文件',
        limit: 1,
        limit1: 9,
        size: 50,
        url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=employ`,
        // url: ``,
        accepts: '.xls,.xlsx',
        accepts1: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
      }
      this.typeOptions = [
            {name: '竞聘', value: '竞聘'},
            {name: '访谈', value: '访谈'},
            {name: '考察', value: '考察'},
            {name: '其他', value: '其他'},
        ]
      return {
        sFormData: {
            auditMemberFileUrl: [],
            initiatorDeptId: undefined,
            initiatorDeptName: '',
            initiatorName: '',
            initiatorOrgId: undefined,
            initiatorOrgName: '',
            initiatorUserId: undefined,
            remarks: '',
            type: '',
            attachment: []
        },
        visible: false,
        loading: false,
        UserData: [
            { name: '张三', value: '123' },
            { name: '违法', value: '1231' },
            { name: '阿斯蒂芬', value: '1232' },
            { name: '告诉对方', value: '1233' },
            { name: '张23', value: '1234' }
        ],
        personnelFistVisible:false,
        checkedData:[],
        dialogVisible: false,
		    errorData: {},
        title: ''
      }
    },
    watch : {
			checkedData: {
				handler(newVal, oldVal) {
					// if(newVal && newVal.resultList && newVal.resultList.length) {
					// 	for(let i=0;i<newVal.resultList.length;i++){
					// 		// if(newVal.label == 'M8及以上') this.dataForm.aboveM8Name.push(newVal.resultList[i].name);
					// 		// if(newVal.label == '关键岗位人员') this.dataForm.highRiskPositionName.push(newVal.resultList[i].name);
					// 	}
                    // }
					if(newVal.label == '发起人' && newVal.resultList && newVal.resultList.length) {
                        this.sFormData.initiatorUserId = newVal.resultList[0].userId;
                        this.sFormData.initiatorName = newVal.resultList[0].name;
                        this.sFormData.initiatorDeptId = newVal.resultList[0].deptId;
                        this.sFormData.initiatorDeptName = newVal.resultList[0].deptName;
                        this.sFormData.initiatorOrgId = newVal.resultList[0].orgId;
                        this.sFormData.initiatorOrgName = newVal.resultList[0].orgName;
                    } else {
                        this.sFormData.initiatorUserId = undefined;
                        this.sFormData.initiatorName = '';
                        this.sFormData.initiatorDeptId = undefined;
                        this.sFormData.initiatorDeptName = '';
                        this.sFormData.initiatorOrgId = undefined;
                        this.sFormData.initiatorOrgName = '';
                    }
				},
				immediate: true
			},
		},
    created() {

    },
    computed: {
        ...mapGetters([
            'elements',
        ]),
    },
    methods: {
      handleOk() {
        this.$refs['dialogForm'].validate((valid) => {
          if (valid) {
            this.postData()
          } else {
            return false;
          }
        });
      },
      getFiles(data) {
        try {
          if(data.index == 1) {
              const file = data.files.map(item => {
                  return item.response ? item.response.fileUrl : item.url;
              });
              // let file = data.files[0].response.fileUrl;
              if(file && file[0]) this.addValidator(file);
          }
          if(data.index == 2) {
            this.sFormData.attachment = data.files.map(item => {
              return item.response ? item.response.fileUrl : item.url;
            });
          }
        } catch (e) {
            //TODO handle the exception
            this.$message.error("获取文件失败，请重新上传");
            return
        }
      },
      addValidator(file) {
           validator(file[0])
            .then((res) => {
                if (res?.data?.errolRows !== 0) {
                    this.errorData = res.data;
					          this.dialogVisible = true;
                } else {
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.sFormData.auditMemberFileUrl = file[0];
                    this.$nextTick(() => {
                      this.$refs.dialogForm.clearValidate('auditMemberFileUrl');
                    })
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
      downloadTxt() {
        window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${this.errorData.fileUrl}&token=${getToken()}&bucketName=errorfile`;
    },
      init() {
        this.visible = true
        this.sFormData = {
            auditMemberFileUrl: [],
            initiatorDeptId: undefined,
            initiatorDeptName: '',
            initiatorName: '',
            initiatorOrgId: undefined,
            initiatorOrgName: '',
            initiatorUserId: undefined,
            remarks: '',
            type: '',
            attachment: []
        }
        this.getuserDeptInfo();
        this.$nextTick(() => {
            this.$refs['uploadFiles'].init(this.sFormData.auditMemberFileUrl)
            this.$refs['dialogForm'].clearValidate()
        })
      },
        // 获取用户组织信息
        getuserDeptInfo() {
            getUserDeptInfo()
                .then(response => {
                    if (response && response.status === 200) {
                        // this.list = response.data.rows;
                        if(response.data.orgInfos && response.data.orgInfos.length) {
                            this.sFormData.initiatorDeptId = response.data.orgInfos[0].deptId;
                            this.sFormData.initiatorDeptName = response.data.orgInfos[0].deptName;
                            this.sFormData.initiatorOrgId = response.data.orgInfos[0].orgId;
                            this.sFormData.initiatorOrgName = response.data.orgInfos[0].orgName;
                        }
                        this.sFormData.initiatorName = response.data.name;
                        this.sFormData.initiatorUserId = response.data.userId;
                    } else {
                    }
                }).catch(() => {
                })
        },
        // 隐藏下拉框
        closeIt() {
            this.$refs.selectIt.blur();
        },
        // 批量选择人员
        personnelFistHandle(label) {
            this.personnelFistVisible = true;
            this.$nextTick(() => {
                this.$refs.personnelFist.label = label;
                if(label == '发起人' && this.sFormData.initiatorUserId && this.sFormData.initiatorName) this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify([{
                    userId: this.sFormData.initiatorUserId,
                    name: this.sFormData.initiatorName ? this.sFormData.initiatorName : '',
                    deptId: this.sFormData.initiatorDeptId,
                    deptName: this.sFormData.initiatorDeptName ? this.sFormData.initiatorDeptName : '',
                    orgId: this.sFormData.initiatorOrgId,
                    orgName: this.sFormData.initiatorOrgName ? this.sFormData.initiatorOrgName : ''
                }]));
                this.$refs.personnelFist.init();
            })
        },
      postData() {
        // const {id, times, auditMemberFileUrl, deptId} = this.sFormData
        // let method = id ? 'put' : 'post'
        // let data = {
        //     ...this.sFormData,
        //     startTime: times[0],
        //     endTime: times[1],
        //     superviseFiles: auditMemberFileUrl.map(file => file.response.fileUrl),
        //     deptName: this.UserData.find(dept => dept.deptId === deptId).deptName
        // }
        this.loading = true;
        addObj(this.sFormData)
        .then((res) => {
            if (res?.status === 200) {
                this.$notify({
                    title: '成功',
                    message: '操作成功',
                    type: 'success',
                    duration: 2000
                });
                this.loading = false;
                this.visible = false
                this.$emit('refreshDataList')
            } else {
                this.loading = false;
                return Promise.reject(res.msg)
            }
        }).catch((msg) => {
            this.$notify({
                title: '失败',
                message: msg || '操作失败',
                type: 'error',
                duration: 2000
            });
            this.loading = false;
        })
      },
      demoDownload() {
        window.location.href = `/api/choose-employ-member/object/template?token=${getToken()}`;
      }
    }
  }
</script>

<style lang="scss" scoped>
    .box-form{
		/deep/ .el-select__tags span:first-child{
			margin-left: 105px;
			margin-top: 4px;
		}
		/deep/ .el-select__tags span span .el-select__tags-text{
			margin-left: 0px;
			margin-top: 0px;
		}

		.but-css{
			border: 1px dashed rgb(188,0,0);
			color:rgb(188,0,0);
			position:fixed;
			z-index:999;
			text-align: center;
			padding-bottom: 5px;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: 6px;
			margin-left: 6px;
		}
    }
    .input-select {
		>>> .el-select__tags {
			display: none !important;
		}
	}
  .form-item-content {
    width: 86%;
  }
  .demo-download {
    position: absolute;
    top: 3px;
    right: 14%;
  }
  .dialog {
      z-index: 9999;

    .upload-error {
		color: #909399;
		margin-left: 30px;

		.error-download {
			color: #bc0000;
			cursor: pointer;
		}
    }
    
    >>> .el-dialog__footer {
        text-align: right;
    }
  }
</style>