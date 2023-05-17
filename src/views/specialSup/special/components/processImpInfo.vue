<template>
	<div>
		<el-form :model="memberForm" ref="memberForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px" :rules="memberFormRules">
			<el-form-item label="自查自检报告：" prop="fileUrls">
				<UploadFiles v-if="!special_btn_inspection && !isDetail" ref="uploadFiles0" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="(data) => getFiles(data, 'fileUrls')"></UploadFiles>
                <template v-else>
                    <div class="file-info" v-for="(item, index) in superviseOrgInfo.selfCheckReportFiles" :key="index">
                        <div class="file-img">
                            <img src="~@/assets/img/file.png" alt="图标"></img>
                        </div>
                        <div class="file-text">{{item | formatFile}}</div>
                        <div class="file-download" @click="downloadHadle(item, 'special')">下载</div>
                    </div>
                </template>
			</el-form-item>
        </el-form>
        <el-form :model="deptForm" ref="deptForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px" :rules="deptFormRules">
			<el-form-item label="监督检查报告：" prop="supervisionInspectionReportFiles">
				<UploadFiles v-if="special_btn_inspection && !isDetail" ref="uploadFiles1" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="(data) => getFiles(data, 'supervisionInspectionReportFiles')"></UploadFiles>
                <template v-else>
                    <div class="file-info" v-for="(item, index) in superviseOrgInfo.supervisionInspectionReportFiles" :key="index">
                        <div class="file-img">
                            <img src="~@/assets/img/file.png" alt="图标"></img>
                        </div>
                        <div class="file-text">{{item | formatFile}}</div>
                        <div class="file-download" @click="downloadHadle(item, 'special')">下载</div>
                    </div>
                </template>
			</el-form-item>
            <el-form-item label="问题清单：" required>
                <div  v-if="special_btn_inspection && !isDetail && !superviseOrgInfo.problemList.length"> 
                    <UploadFiles ref="uploadFiles2" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts1" :limit="1" :size="uploadFile.size"
					@refreshData="(data) => getFiles(data, 'problemListFile')"></UploadFiles>
                    <span class="click-text demo-download" @click="downloadDemo">问题清单模板下载</span>
                </div>
                <el-table v-else ref="table" :height="500" :data="superviseOrgInfo.problemList" v-loading="listLoading" border style="width: 100%">
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
                    <el-table-column align="center" label="具体整改情况">
                        <el-table-column align="center" label="立行立改">
                            <template slot-scope="{row}">
                                {{row.correctImmediately}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="整改期限">
                            <template slot-scope="{row}">
                                {{row.rectificationPeriod}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </el-form-item>
		</el-form>
		<div style="width:100%;margin: 30px auto;text-align: center;">
			<el-button v-if="!isDetail" @click="cancel" style="width:180px;">取消</el-button>
			<el-button v-if="!isDetail" type="primary" style="width:180px;" @click="baseDataFormSubmit()" :loading="subLoading">确定提报</el-button>
			<el-button v-if="special_btn_inspection && !isDetail" type="primary" style="width:180px;" @click="goRec" :disabled="!canNext">进入整改阶段</el-button>
		</div>
        <el-dialog
			title=""
			:visible.sync="dialogVisible"
			width="30%"
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
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		mapGetters
	} from 'vuex';
	import {
        supervisionReport,
        selefCheckReport,
        toRectification,
        problemListValidate
	} from 'api/special/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile, downloadFile
	} from 'utils/file';
	export default {
		data() {
			return {
				memberForm: {
					fileUrls: []
				},
                deptForm: {
                    problemListFile: [],
                    supervisionInspectionReportFiles: []
                },
				subLoading: false,
				uploadFile: {
					textFirst: ' 上传文件',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=special`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png',
					accepts1: '.xls,.xlsx'
				},
				fileArray: [],
				operation: '',
                list: [{}],
                listLoading: false,
                isDetail: false,
                special_btn_inspection: false,
                superviseOrgInfo: {
                    selfCheckReportFiles: [],
                    supervisionInspectionReportFiles: [],
                    problemList: []
                },
                dialogVisible: false,
                errorData: {}
			}
		},
		components: {
			UploadFiles
		},
		computed: {
			...mapGetters([
				'name', 'elements'
			]),
            memberFormRules() {
                return {
                    // fileUrls: [{ 
                    //     required: !this.special_btn_inspection && !this.isDetail, 
                    //     validator: (rule, val, cb) => {
                    //         if (!val.length) return cb(new Error('请选择文件'))
                    //         cb()
                    //     } 
                    // }]
                }
            },
            deptFormRules() {
                // return {
                //     supervisionInspectionReportFiles: [{ 
                //         required: this.special_btn_inspection && !this.isDetail, 
                //         validator: (rule, val, cb) => {
                //             if (!val.length) return cb(new Error('请选择文件'))
                //             cb()
                //         } 
                //     }],
                //     problemListFile: [{ 
                //         required: this.special_btn_inspection && !this.isDetail, 
                //         validator: (rule, val, cb) => {
                //             if (!val.length && !this.superviseOrgInfo.problemList.length) return cb(new Error('请选择文件'))
                //             cb()
                //         } 
                //     }]
                // }
            },
            canNext() {
                // const {supervisionInspectionReportFiles} = this.deptForm
                const {problemList} = this.superviseOrgInfo

                return problemList.length
            }
		},
		created() {
            this.special_btn_inspection = this.elements['special:btn_inspection']
            // this.special_btn_inspection = false
			this.isDetail = this.$route.query.operation === 'detail';
		},
		methods: {
            getList() {

            },
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
                
                this.deptForm.supervisionInspectionReportFiles = this.superviseOrgInfo.supervisionInspectionReportFiles || []
                this.memberForm.fileUrls = this.superviseOrgInfo.selfCheckReportFiles || []
                function getFiles(list) {
                    list = list || []
                    return list.map(file => ({
                        name: formatFile(file),
                        url: file
                    }))
                }
                const {uploadFiles0, uploadFiles1} = this.$refs
                uploadFiles0 && uploadFiles0.init(getFiles(data.selfCheckReportFiles))
                uploadFiles1 && uploadFiles1.init(getFiles(data.supervisionInspectionReportFiles))
			},

			// 表单提交
			baseDataFormSubmit() {
                const ref = this.special_btn_inspection ? 'deptForm' : 'memberForm'
				this.$refs[ref].validate((valid) => {
					if (valid) {
						this.post();
					}
				})
			},

            post() {
			    this.subLoading = true;
                const fn = this.special_btn_inspection ? supervisionReport : selefCheckReport
                const data = this.special_btn_inspection
                            ? {
                                problemListFile: this.superviseOrgInfo.problemList.length ? undefined : this.deptForm.problemListFile[0],
                                supervisionInspectionReportFiles: this.deptForm.supervisionInspectionReportFiles
                            }
                            : this.memberForm.fileUrls
                fn(this.id, data).then(res => {
                    if (res?.status === 200) {
                        this.$message.success('提交成功')
                        this.$emit('refreshData')
                        if (this.special_btn_inspection && this.deptForm.problemListFile[0]) {
                            this.$confirm(`提报完成，是否进入整改阶段？`, '提示', {
                                type: 'info'
                            }).then(() => {
                                this.goRec()
                            }).catch(() => {
                                this.cancel()
                            })
                        } else {
                            this.$confirm(`提报完成，是否留在当前页面？`, '提示', {
                                type: 'info'
                            }).catch(() => {
                                this.cancel()
                            })
                        }
                    } else {
                        return Promise.reject(res.msg)
                    }
                }).catch(msg => {
                    this.$message.error(msg)
                }).finally(() => {
                    this.subLoading = false
                })
            },

			// 获取批量上传文件
			getFiles(data, type) {
				try {
					const files = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
                    if (type === 'supervisionInspectionReportFiles') this.deptForm.supervisionInspectionReportFiles = files
                    else if (type === 'problemListFile') {
                        this.deptForm.problemListFile = files
                        if (files.length) {
                            problemListValidate(this.id, files[0]).then(res => {
                                if (res?.data?.errolRows !== 0) {
                                    this.dialogVisible = true
                                    this.errorData = res.data
                                }
                            })
                        }
                    }
                    else this.memberForm.fileUrls = files

                    if  (files.length) this.$refs[type === 'fileUrls' ? 'memberForm' : 'deptForm'].clearValidate(type)
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},

			cancel() {
				this.$emit('cancel')
			},
            goRec() {
                toRectification(this.id).then(res => {
                    if (res?.status === 200) {
                        this.$emit('finish')
                    } else {
                        this.$message.error(res?.msg)
                    }
                })
            },
            downloadDemo() {
                window.location.href = `/api/pecial-supervision/problem-list/template?token=${getToken()}`;
            },
            downloadTxt() {
                window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${this.errorData.fileUrl}&token=${getToken()}&bucketName=errorfile`
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

    .postion {
		color: #000000d9;
		font-weight: 500;
		font-size: 16px;
		line-height: 1.4;

		i {
			color: #efbd47;
		}
	}

	.upload-error {
		color: #909399;
		margin-left: 30px;

		.error-download {
			color: #bc0000;
			cursor: pointer;
		}
	}
</style>
