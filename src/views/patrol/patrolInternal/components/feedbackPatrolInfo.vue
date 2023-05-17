<template>
	<div>
		<el-form :model="baseDataForm" ref="baseDataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px" :rules="rules">
            <el-form-item label="文件：" prop="feedbackFiles">
				<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
			</el-form-item>
			<el-form-item label="巡查反馈：" prop="beInspectionObjectName">
				<!-- <el-select class="form-item" v-model="baseDataForm.inspectionObjectId" clearable placeholder="请选择巡查对象">
					<el-option v-for="item in examTypes" :key="item.code" :label="item.value" :value="item.code">
					</el-option>
				</el-select> -->
				<el-input v-model="baseDataForm.beInspectionObjectName" placeholder="点击右侧按钮选择被巡查对象" readonly>
					<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
						<el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
							</span>
						</el-tree>
						<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
					</el-popover>
				</el-input>
			</el-form-item>
			<el-form-item label="意见和要求：">
				<el-input class="textarea-info form-item" type="textarea" placeholder=" 请提出整改意见和要求..." resize="none" :rows="4" v-model="baseDataForm.opinionRequire"
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
		getFeedbackObj,
		addFeedbackObj,
		updateFeedbackObj,
		getPlanObj
	} from 'api/patrol/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
	export default {
		data() {
			this.rules = {
				feedbackFiles: [
					{ 
						required: true, 
						validator: (rule, val, cb) => {
							if (!val.length) return cb(new Error('请上传文件'))
							cb()
						} 
					}
				],
				beInspectionObjectName: [
					{ required: true, message: '请选择被巡查对象', trigger: 'blur'}
				],
			}
			return {
				baseDataForm: {
					inspectionRecordId: undefined,
					beInspectionObjectId: undefined,
					beInspectionObjectName: '',
					feedbackFiles: [],
					opinionRequire: ''
				},
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				subLoading: false,
				dictType: "examType",
				examTypes: [],
				times: [],
				uploadFile: {
					textFirst: ' +《××党组织落实党委第二轮巡查反馈意见整改清单》',
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
			this.getTreeInfo();
			this.init();
			this.getPlan();
		},
		methods: {
			// 获取巡查计划详情
			getPlan() {
				this.$nextTick(() => {
					if (this.$route.query.id) {
						getPlanObj(this.$route.query.id)
							.then(response => {
								this.baseDataForm.beInspectionObjectName = response.data.inspectionObjectName;
								this.baseDataForm.beInspectionObjectId = response.data.inspectionObjectId;
							});
					}
				})
			},
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
                            beInspectionObjectId: undefined,
                            beInspectionObjectName: '',
                            feedbackFiles: [],
                            opinionRequire: ''
						}
					} else {
						// this.baseDataForm.inspectionRecordId = this.$route.query.id;
						if (this.$route.query.operation !== 'add') this.getBaseDateDetail();
					}
				})
			},

			// 获取基础信息详情
			getBaseDateDetail(val) {
				getFeedbackObj(this.baseDataForm.inspectionRecordId)
					.then(response => {
						this.baseDataForm = response.data;
						this.baseDataForm.beInspectionObjectId = response.data.beInspectionId;
						this.baseDataForm.beInspectionObjectName = response.data.beInspectionName;
						// if (this.baseDataForm.userFilePath) {
						// 	let index = this.baseDataForm.userFilePath.lastIndexOf('&');
						// 	this.$set(this.baseDataForm, 'fileName', this.baseDataForm.userFilePath.substring(index + 1, this.baseDataForm.userFilePath
						// 		.length))
						// }
						// this.$emit('refreshData', response.data, val);
						if (this.baseDataForm.feedbackFiles && this.baseDataForm.feedbackFiles.length) {
							this.fileArray = this.baseDataForm.feedbackFiles.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles.init(this.fileArray);
							})
						}
					});
			},

			handlePartyBranch(data) {
				this.baseDataForm.beInspectionObjectId = data.id;
				this.baseDataForm.beInspectionObjectName = data.departmentFullName;
				this.baseDataForm.beInspectionId = data.id;
				this.baseDataForm.beInspectionName = data.departmentFullName;
				this.treeVisible = false;
			},

			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
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
				addFeedbackObj(this.baseDataForm)
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
				updateFeedbackObj(this.baseDataForm)
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
					this.baseDataForm.feedbackFiles = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
					this.$nextTick(() => {
                      this.$refs.baseDataForm.clearValidate('feedbackFiles');
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
