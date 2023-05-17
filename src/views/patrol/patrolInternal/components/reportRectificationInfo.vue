<template>
	<div>
		<el-form :model="baseDataForm" ref="baseDataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px" :rules="rules">
			<el-form-item label="文件：" prop="rectificationReportFiles">
				<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
			</el-form-item>
		</el-form>
		<div style="width:100%;margin: 50px auto;text-align: center;">
			<el-button type="primary" style="width:180px;" @click="baseDataFormSubmit()" :loading="subLoading">确定</el-button>
		</div>
	</div>
</template>
<script>
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		mapGetters
	} from 'vuex';
	import {
		getReportObj,
		addReportObj,
		updateReportObj
	} from 'api/patrol/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
	export default {
		data() {
			this.rules = {
				rectificationReportFiles: [
					{ 
						required: true, 
						validator: (rule, val, cb) => {
							if (!val.length) return cb(new Error('请上传文件'))
							cb()
						} 
					}
				],
			}
			return {
				baseDataForm: {
					inspectionRecordId: undefined,
					rectificationReportFiles: []
				},
				subLoading: false,
				dictType: "examType",
				examTypes: [],
				uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray: [],
				operation: ''
			}
		},
		// props: {
		// 	dateId: {
		// 		type: Number
		// 	}
		// },
		components: {
			UploadFiles
		},
		computed: {
			...mapGetters([
				'name'
			])
		},
		created() {
			this.operation = this.$route.query.operation;
			this.init();
		},
		methods: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
			goBack() {
				this.$router.go(-1);
			},
			init() {
				this.baseDataForm.inspectionRecordId = this.$route.query.id;
				this.$nextTick(() => {
					this.$refs['baseDataForm'].resetFields();
					if (!this.$route.query.id) {
						this.baseDataForm = {
							inspectionRecordId: undefined,
					        rectificationReportFiles: []
						}
					} else {
						// this.baseDataForm.inspectionRecordId = this.$route.query.id;
						if (this.$route.query.operation !== 'add') this.getBaseDateDetail();
					}
				})
			},

			// 获取基础信息详情
			getBaseDateDetail(val) {
				getReportObj(this.baseDataForm.inspectionRecordId)
					.then(response => {
						this.baseDataForm.rectificationReportFiles = response.data;
						// if (this.baseDataForm.userFilePath) {
						// 	let index = this.baseDataForm.userFilePath.lastIndexOf('&');
						// 	this.$set(this.baseDataForm, 'fileName', this.baseDataForm.userFilePath.substring(index + 1, this.baseDataForm.userFilePath
						// 		.length))
						// }
						// this.$emit('refreshData', response.data, val);
						if (this.baseDataForm.rectificationReportFiles && this.baseDataForm.rectificationReportFiles.length) {
							this.fileArray = this.baseDataForm.rectificationReportFiles.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles.init(this.fileArray);
							})
						}
					});
			},
            
			// 表单提交
			baseDataFormSubmit() {
				this.$refs['baseDataForm'].validate((valid) => {
					if (valid) {
						this.subLoading = true;
						if (this.operation !== 'edit') this.add();
						else this.update();
					}
				})
			},

			add() {
				addReportObj(this.baseDataForm)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000,
								onClose: () => {
									// if (!this.baseDataForm.dateId) {
									// 	this.baseDataForm.dateId = res.data.dateId;
									// 	this.getBaseDateDetail('second');
									// } else {
									// 	this.getBaseDateDetail('second');
									// }
									// this.goBack();
									this.$router.push({
										path: '/filesImplementation/patrolInternal',
									});
									this.subLoading = false;
								}
							});
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 2000,
								onClose: () => {
									this.subLoading = false;
								}
							});
						}
					}).catch(() => {
						this.subLoading = false;
					})
			},

			update() {
				updateReportObj(this.baseDataForm)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000,
								onClose: () => {
									// if (!this.baseDataForm.dateId) {
									// 	this.baseDataForm.dateId = res.data.dateId;
									// 	this.getBaseDateDetail('second');
									// } else {
									// 	this.getBaseDateDetail('second');
									// }
									this.goBack();
									this.subLoading = false;
								}
							});
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 2000,
								onClose: () => {
									this.subLoading = false;
								}
							});
						}
					}).catch(() => {
						this.subLoading = false;
					})
			},

			// 获取批量上传文件
			getFiles(data) {
				try {
					this.baseDataForm.rectificationReportFiles = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
					this.$nextTick(() => {
                      this.$refs.baseDataForm.clearValidate('rectificationReportFiles');
                    })
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},
		}

	}
</script>
<style scoped>
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
</style>
