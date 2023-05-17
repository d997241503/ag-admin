<template>
	<div>
		<el-form :model="formData" ref="form" :rules="rules" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px">
			<el-form-item label="整改报告：" prop="rectificationFiles">
				<UploadFiles v-if="!special_btn_inspection && !isDetail" ref="uploadFiles2" :btnText="uploadFile.textFirst2" :url="uploadFile.url" :index="2"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
                <template v-else>
                    <div class="file-info" v-for="(item, index) in superviseOrgInfo.rectificationFiles" :key="index">
                        <div class="file-img">
                            <img src="~@/assets/img/file.png" alt="图标"></img>
                        </div>
                        <div class="file-text">{{item | formatFile}}</div>
                        <div class="file-download" @click="downloadHadle(item, 'special')">下载</div>
                    </div>
                </template>
			</el-form-item>
		</el-form>
        <el-table ref="table" :height="500" :data="dataList" v-loading="listLoading" border style="width: 100%">
            <el-table-column align="center" label="项目">
                <template slot-scope="{row}">
                    {{row.projectName}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="问题">
                <el-table-column align="center" label="问题定性">
                    <template slot-scope="{row}">
                        {{row.problemCharacterization}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="具体问题">
                    <template slot-scope="{row}">
                        {{row.specificProblem}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="具体描述">
                    <template slot-scope="{row}">
                        {{row.specificDescription}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column align="center" label="整改责任部门/公司">
                <template slot-scope="{row}">
                    {{row.rectificationResponsibleDepartment}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="整改期限">
                <template slot-scope="{row}">
                    {{row.rectificationPeriod}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="整改措施">
                <template slot-scope="{row}">
                    {{row.recData ? row.recData.correctiveMeasures : row.correctiveMeasures}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="整改情况">
                <template slot-scope="{row}">
                    {{row.recData ? row.recData.rectificationSituation : row.rectificationSituation}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="备注">
                <template slot-scope="{row}">
                    {{row.recData ? row.recData.remarks : row.remarks}}
                </template>
            </el-table-column>
            <el-table-column v-if="!special_btn_inspection && !isDetail" fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button v-if="!scope.row.remarks && !scope.row.recData" type="text" size="small" @click="handleRec(scope.row)">添加整改情况</el-button>
                    <el-button v-else type="text" size="small" @click="handleRec(scope.row)">修改整改情况</el-button>
                </template>
            </el-table-column>
        </el-table>
		<div style="width:100%;margin: 50px auto;text-align: center;">
			<el-button v-if="!isDetail" @click="cancel" style="width:180px;">取消</el-button>
			<el-button v-if="!special_btn_inspection && !isDetail" type="primary" style="width:180px;" @click="baseDataFormSubmit()" :loading="subLoading">确定</el-button>
		</div>
        <el-dialog :visible.sync="visible" :rules="dialogRules" :title="dialogTitle" :close-on-click-modal="false">
            <el-form ref="dialog" label-width="130px" :model="dialogForm" :rules="dialogRules">
                <el-form-item prop="correctiveMeasures" label="整改措施：" class="form-item-content">
                    <el-input type="textarea" :rows="4" v-model="dialogForm.correctiveMeasures"></el-input>
                </el-form-item>
                <el-form-item prop="rectificationSituation" label="整改情况：" class="form-item-content">
                    <el-input type="textarea" :rows="4" v-model="dialogForm.rectificationSituation"></el-input>
                </el-form-item>
                <el-form-item prop="remarks" label="备注：" class="form-item-content">
                    <el-input type="textarea" :rows="4" v-model="dialogForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="handleModalOk">确定</el-button>
            </div>
        </el-dialog>
	</div>
</template>
<script>
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		mapGetters
	} from 'vuex';
	import {
		rectificationSituation
	} from 'api/special/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile, downloadFile
	} from 'utils/file';
	export default {
		data() {
            this.dialogRules = {
                correctiveMeasures: [{
                    required: true, message: '请输入整改措施', trigger: 'blur'
                }],
                rectificationSituation: [{
                    required: true, message: '请输入整改情况', trigger: 'blur'
                }]
            }
			return {
                listLoading: false,
                dialogForm: {
                    rectificationSituation: '',
                    correctiveMeasures: '',
                    remarks: ''
                },
                visible: false,
                dialogTitle: '',
				baseDataForm: {
					id: undefined,
					listProblemFiles: [],
					rectificationReportFiles: [],
					rectificationReportRemarks: ''
				},
				subLoading: false,
				uploadFile: {
					textFirst1: ' +专项监督整改清单',
					textFirst2: ' +专项监督整改报告',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=special`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray1: [],
				fileArray2: [],
				operation: '',
                special_btn_inspection: false,
                isDetail: false,
                superviseOrgInfo: {
                    problemList: [],
                    rectificationFiles: []
                },
                formData: {
                    rectificationFiles: []
                },
                recFormList: {}
			}
		},
		components: {
			UploadFiles
		},
		computed: {
			...mapGetters([
				'name', 'elements'
			]),
            rules() {
                return {
                    rectificationFiles: [{ 
                        required: !this.special_btn_inspection && !this.isDetail, 
                        validator: (rule, val, cb) => {
                            if (!val.length) return cb(new Error('请选择文件'))
                            cb()
                        } 
                    }]
                }
            },
            dataList() {
                const {recFormList, superviseOrgInfo} = this
                this.$nextTick(() => {
                    this.$refs.table.doLayout()
                })
                return superviseOrgInfo.problemList.map(problem => {
                    problem.recData = recFormList[problem.id]
                    return problem
                })
            }
		},
		created() {
			this.operation = this.$route.query.operation;
            this.special_btn_inspection = this.elements['special:btn_inspection']
            this.isDetail = this.$route.query.operation === 'detail'
			// this.init();
		},
		methods: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
            downloadHadle: downloadFile,
			goBack() {
				this.$router.go(-1);
			},
			init(data) {
                this.id = this.$route.query.id;
				this.superviseOrgInfo = data
                
                this.formData.rectificationFiles = this.superviseOrgInfo.rectificationFiles || []
                function getFiles(list) {
                    list = list || []
                    return list.map(file => ({
                        name: formatFile(file),
                        url: file
                    }))
                }
                const {uploadFiles2} = this.$refs
                uploadFiles2 && uploadFiles2.init(getFiles(data.rectificationFiles))
			},

			// 表单提交
			baseDataFormSubmit() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						// this.add();
                        this.post()
					}
				})
			},

            post() {
                this.subLoading = true
                const data = {
                    rectificationFiles: this.formData.rectificationFiles,
                    problemList: Object.values(this.recFormList)
                }
                rectificationSituation(this.id, data).then(res => {
                    if (res?.status === 200) {
                        this.$message.success('提交成功')
                        this.subLoading = false
                        this.$router.go(-1)
                    }
                })
            },

			// 获取批量上传文件
			getFiles(data) {
                this.formData.rectificationFiles = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
                if (this.formData.rectificationFiles.length) this.$refs['form'].clearValidate()
			},

			cancel() {
				this.$emit('cancel')
			},
            handleRec(row) {
                if (!row.recData && !row.remarks) {
                    this.dialogTitle = '新增整改情况'
                    this.dialogForm.id = row.id
                    this.$nextTick(() => {
                        this.$refs['dialog'].resetFields()
                    })
                } else {
                    const data = row.recData || row
                    this.dialogForm = {
                        ...data
                    }
                    this.dialogTitle = '修改整改情况'
                }
                this.visible = true
            },
            handleModalOk() {
                this.$refs['dialog'].validate(valid => {
                    if (valid) {
                        this.$set(this.recFormList, this.dialogForm.id, this.dialogForm)
                        this.visible = false
                    }
                })
            }
		}

	}
</script>
<style lang="scss" scoped>
	.goback-info {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.form-item {
		width: 100%;
	}

	/* 	.input-info>>>.el-input__count-inner {
		height: 33px;
	}

	.textarea-info>>>.el-textarea__inner {
		padding-right: 50px;
	} */

	.go-handle {
		font-weight: 700;
		cursor: pointer;
	}

	.go-handle:hover {
		color: #FF4C52;
	}

	.tab-info {
		margin-top: 20px;
	}

	.tab-content {
		padding: 10px 20px;
	}

	.download-template {
		width: 90px;
		float: right;
		margin-top: 0;
		margin-right: -90px;
		text-align: center;
		color: #666;
		text-decoration: underline;
	}

	.download-template:hover {
		color: #888;
		cursor: pointer;
	}

    .form-item-content {
        width: 86%;
    }

    .file-info {
        display: flex;

        .file-img {
            width: 30px;
            // margin-top: 5px;

            img {
                width: 25px;
                height: 25px
            }
        }

        .file-text {
            width: 200px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #555555;
            text-align: left;
            margin-left: 5px;
        }

        .file-download {
            width: 50px;
            text-align: center;
            color: #555555;
            text-decoration: underline;
        }

        .file-download:hover {
            cursor: pointer;
            color: #888888;
        }
    }
</style>
