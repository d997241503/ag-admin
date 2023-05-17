<template>
	<div>
		<div v-if="operation == 'add' && form[0] && form[0].rectificationConditionFiles.length">
			<div v-for="(item,index) in form" :key="index">
				<div style="width: 70%;margin:10px auto;">
					<el-form ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="120px">
						<el-form-item label="文件提报时间：">
							<div class="form-text">{{form[index].fileSubmitTime}}</div>
						</el-form-item>
						<el-form-item label="实施过程文件：">
							<div v-if="form[index].rectificationConditionFiles && form[index].rectificationConditionFiles.length" class="file-roll-containers">
								<div class="file-info" v-for="(item, index) in form[index].rectificationConditionFiles" :key="index">
									<div class="file-img">
										<img src="~@/assets/img/file.png" alt="图标"></img>
									</div>
									<div class="file-text">{{item | formatFile}}</div>
									<div class="file-download" @click="downloadHadle(item)">下载</div>
								</div>
							</div>
						</el-form-item>
					</el-form>
				</div>
				<el-divider></el-divider>
			</div>
		</div>
		<div v-for="(item,index) in baseDataForm" :key="index">
			<div style="width: 70%;margin:10px auto;">
				<el-form :model="baseDataForm[index]" ref="baseDataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
				label-width="150px">
					<el-form-item label="整改反馈材料：">
						<UploadFiles :ref="`uploadFiles${index+4}`" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="index+4"
							:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
							@refreshData="getFiles"></UploadFiles>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input class="textarea-info form-item" type="textarea" placeholder="请输入备注" resize="none" :rows="4" v-model="baseDataForm[index].note"
						maxlength="300">
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<el-divider></el-divider>
		</div>
		<div style="width: 70%;margin:10px auto;">
			<el-form :model="DataForm" ref="DataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px">
            <el-form-item label="文书：">
				<UploadFiles ref="uploadFiles1" :btnText="uploadFile.textFirst1" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
                <UploadFiles ref="uploadFiles2" :btnText="uploadFile.textFirst2" :url="uploadFile.url" :index="2"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
                <UploadFiles ref="uploadFiles3" :btnText="uploadFile.textFirst3" :url="uploadFile.url" :index="3"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
			</el-form-item>
			<el-form-item label="备注：">
				<el-input class="textarea-info form-item" type="textarea" placeholder="请输入备注" resize="none" :rows="4" v-model="DataForm.note"
				 maxlength="300">
				</el-input>
			</el-form-item>
		</el-form>
		</div>
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
		getSituationObj,
		addSituationObj,
		updateSituationObj,
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
				form: [],
				baseDataForm: [
					{
						inspectionRecordId: undefined,
						rectificationConditionFiles: [],
						note: ''
					}
				],
				DataForm: {
					inspectionRecordId: undefined,
                    fileList1: [],
                    fileList2: [],
                    fileList3: [],
					note: ''
				},
				subLoading: false,
				uploadFile: {
					textFirst: ' +上传材料',
					textFirst1: ' +党支部书记履行第一责任人责任抓好反馈意见落实情况的报告',
                    textFirst2: ' +党集团党委××年第×轮巡查的整改报告',
                    textFirst3: ' +巡查反馈意见的整改清单',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray: [],
				operation: '',
				fileArray1: [],
                fileArray2: [],
				fileArray3: [],
				existence: false
			}
		},
		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
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
			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=bucket`;
			},
			init() {
				this.baseDataForm[0].inspectionRecordId = this.$route.query.id;
				this.DataForm.inspectionRecordId = this.$route.query.id;
				this.$nextTick(() => {
					// this.$refs['baseDataForm'].resetFields();
					if (!this.$route.query.id) {
						this.baseDataForm[0] = {
							inspectionRecordId: undefined,
                            rectificationConditionFiles: [],
                            note: ''
						}
					} else {
						// this.baseDataForm.inspectionRecordId = this.$route.query.id;
						this.getBaseDateDetail();
					}
					// this.getBaseDateDetail();
				})
			},

			// 获取基础信息详情
			getBaseDateDetail(val) {
				getSituationObj(this.baseDataForm[0].inspectionRecordId)
					.then(response => {
						if(response.data && response.data.length) { 
							if(this.operation == 'add') this.form = response.data
							else this.baseDataForm = response.data
						} else {
							this.baseDataForm[0].rectificationConditionFiles = [];
							this.baseDataForm[0].note = '';
						}
						// if (this.baseDataForm.userFilePath) {
						// 	let index = this.baseDataForm.userFilePath.lastIndexOf('&');
						// 	this.$set(this.baseDataForm, 'fileName', this.baseDataForm.userFilePath.substring(index + 1, this.baseDataForm.userFilePath
						// 		.length))
						// }
						// this.$emit('refreshData', response.data, val);
						if(response.data && response.data.length) {
							for(let i = 0; i < this.baseDataForm.length; i++) {
								this['fileArray'+i+4] = []
								this['fileArray'+i+4] = this.baseDataForm[i].rectificationConditionFiles.map(item => { return {name: this.formatFile(item),
									response: {fileUrl: item}}})
								this.$nextTick(() => {
									this.$refs[`uploadFiles${i+4}`][0].init(this['fileArray'+i+4]);
								})
							}
						}
						if (this.baseDataForm.rectificationConditionFiles && this.baseDataForm.rectificationConditionFiles.length) {
							this.fileArray = this.baseDataForm.rectificationConditionFiles.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles.init(this.fileArray);
							})
						}
						
					});
				getDocumentObj(this.DataForm.inspectionRecordId)
					.then(response => {
						if(response.data && response.data.id) {
							this.DataForm = response.data;
							this.existence = true;
						} else {
							this.DataForm.fileList1 = [];
							this.DataForm.fileList2 = [];
							this.DataForm.fileList3 = [];
							this.DataForm.note = '';
						}
						// if (this.baseDataForm.userFilePath) {
						// 	let index = this.baseDataForm.userFilePath.lastIndexOf('&');
						// 	this.$set(this.baseDataForm, 'fileName', this.baseDataForm.userFilePath.substring(index + 1, this.baseDataForm.userFilePath
						// 		.length))
						// }
						// this.$emit('refreshData', response.data, val);
						if (this.DataForm.fileList1 && this.DataForm.fileList1.length) {
							this.fileArray1 = this.DataForm.fileList1.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles1.init(this.fileArray1);
							})
                        }
                        if (this.DataForm.fileList2 && this.DataForm.fileList2.length) {
							this.fileArray2 = this.DataForm.fileList2.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles2.init(this.fileArray2);
							})
                        }
                        if (this.DataForm.fileList3 && this.DataForm.fileList3.length) {
							this.fileArray3 = this.DataForm.fileList3.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles3.init(this.fileArray3);
							})
						}
					});
			},

			// 表单提交
			baseDataFormSubmit() {
				// this.$refs['baseDataForm'].validate((valid) => {
				// 	if (valid) {
						this.subLoading = true;
						if (this.operation !== 'edit') {
							this.addSituation();
							if(!this.existence) {
								this.addDocument();
							} else {
								this.updateDocument();
							}
							// this.addDocument();
						} else {
							this.updateSituation();
							if(!this.existence) {
								this.addDocument();
							} else {
								this.updateDocument();
							}
						}
					// }
				// })
			},

			addSituation() {
				for(let i = 0 ; i < this.baseDataForm.length; i++) {
					addSituationObj(this.baseDataForm[i])
						.then((res) => {
							if (res && res.status === 200) {
								// this.$notify({
								// 	title: '成功',
								// 	message: '操作成功',
								// 	type: 'success',
								// 	duration: 2000,
								// 	onClose: () => {
								// 		// if (!this.baseDataForm.dateId) {
								// 		// 	this.baseDataForm.dateId = res.data.dateId;
								// 		// 	this.getBaseDateDetail('second');
								// 		// } else {
								// 		// 	this.getBaseDateDetail('second');
								// 		// }
								// 		// this.goBack();
								// 		this.subLoading = false;
								// 	}
								// });
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
				}
			},
			addDocument() {
				// if(this.operation == 'add' && !this.existence) {
					addDocumentObj(this.DataForm)
						.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000,
									onClose: () => {
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
				// }
			},

			updateSituation() {
				for(let i = 0 ; i < this.baseDataForm.length; i++) {
					updateSituationObj(this.baseDataForm[i])
						.then((res) => {
							if (res && res.status === 200) {
								// this.$notify({
								// 	title: '成功',
								// 	message: '操作成功',
								// 	type: 'success',
								// 	duration: 2000,
								// 	onClose: () => {
								// 		// if (!this.baseDataForm.dateId) {
								// 		// 	this.baseDataForm.dateId = res.data.dateId;
								// 		// 	this.getBaseDateDetail('second');
								// 		// } else {
								// 		// 	this.getBaseDateDetail('second');
								// 		// }
								// 		// this.goBack();
								// 		this.subLoading = false;
								// 	}
								// });
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
				}
			},
			updateDocument() {
				updateDocumentObj(this.DataForm)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000,
								onClose: () => {
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
					if(data.index > 3) {
						this.baseDataForm[data.index-4].rectificationConditionFiles = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
					}
					if(data.index == 1) {
						this.DataForm.fileList1 = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
					}
					if(data.index == 2) {
						this.DataForm.fileList2 = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
					}
					if(data.index == 3) {
						this.DataForm.fileList3 = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
					}
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},
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
			flex: 1;
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
