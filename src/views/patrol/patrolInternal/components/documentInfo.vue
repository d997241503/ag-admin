<template>
	<div>
		<el-form :model="baseDataForm" ref="baseDataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px">
            <el-form-item label="文书：">
				<UploadFiles ref="uploadFiles1" :btnText="uploadFile.textFirst2" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
                <UploadFiles ref="uploadFiles2" :btnText="uploadFile.textFirst3" :url="uploadFile.url" :index="2"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
                <UploadFiles ref="uploadFiles3" :btnText="uploadFile.textFirst4" :url="uploadFile.url" :index="3"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
			</el-form-item>
			<el-form-item label="备注：">
				<el-input class="textarea-info form-item" type="textarea" placeholder="请输入备注" resize="none" :rows="4" v-model="baseDataForm.note"
				 maxlength="300">
				</el-input>
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
		getDocumentObj,
		addDocumentObj,
		updateDocumentObj
	} from 'api/patrol/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
	export default {
		data() {
			return {
				baseDataForm: {
					inspectionRecordId: undefined,
                    fileList1: [],
                    fileList2: [],
                    fileList3: [],
					note: ''
				},
				subLoading: false,
				uploadFile: {
                    textFirst1: ' +党支部书记履行第一责任人责任抓好反馈意见落实情况的报告',
                    textFirst2: ' +党集团党委××年第×轮巡查的整改报告',
                    textFirst3: ' +巡查反馈意见的整改清单',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
                fileArray1: [],
                fileArray2: [],
                fileArray3: []
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
				this.$nextTick(() => {
					this.$refs['baseDataForm'].resetFields();
					if (!this.$route.query.id) {
						this.baseDataForm = {
							inspectionRecordId: undefined,
                            rectificationConditionFiles: [],
                            note: ''
						}
					} else {
						this.baseDataForm.inspectionRecordId = this.$route.query.id;
						this.getBaseDateDetail();
					}
				})
			},

			// 获取基础信息详情
			getBaseDateDetail(val) {
				getDocumentObj(this.baseDataForm.inspectionRecordId)
					.then(response => {
						this.baseDataForm = response.data;
						// if (this.baseDataForm.userFilePath) {
						// 	let index = this.baseDataForm.userFilePath.lastIndexOf('&');
						// 	this.$set(this.baseDataForm, 'fileName', this.baseDataForm.userFilePath.substring(index + 1, this.baseDataForm.userFilePath
						// 		.length))
						// }
						// this.$emit('refreshData', response.data, val);
						if (this.baseDataForm.fileList1 && this.baseDataForm.fileList1.length) {
							this.fileArray1 = this.baseDataForm.fileList1.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles1.init(this.fileArray1);
							})
                        }
                        if (this.baseDataForm.fileList2 && this.baseDataForm.fileList2.length) {
							this.fileArray2 = this.baseDataForm.fileList2.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles2.init(this.fileArray2);
							})
                        }
                        if (this.baseDataForm.fileList3 && this.baseDataForm.fileList3.length) {
							this.fileArray3 = this.baseDataForm.fileList3.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles3.init(this.fileArray3);
							})
						}
					});
			},

			// 表单提交
			baseDataFormSubmit() {
				this.$refs['baseDataForm'].validate((valid) => {
					if (valid) {
						this.subLoading = true;
						if (!this.baseDataForm.inspectionRecordId) this.add();
						else this.update();
					}
				})
			},

			add() {
				addDocumentObj(this.baseDataForm)
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

			update() {
				updateDocumentObj(this.baseDataForm)
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
					this.baseDataForm.rectificationConditionFiles = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
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
