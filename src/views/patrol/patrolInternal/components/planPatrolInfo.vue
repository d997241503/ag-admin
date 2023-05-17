<template>
	<div>
		<el-form :model="baseDataForm" :rules="dataRule" ref="baseDataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px">
			<el-form-item label="巡查主题：" prop="inspectionTheme">
				<el-input class="form-item input-info" v-model="baseDataForm.inspectionTheme" placeholder="请输入巡查主题" maxlength="30" clearable
				 ></el-input>
			</el-form-item>
			<el-form-item label="巡查时间：" prop="times">
				<el-date-picker class="form-item" v-model="baseDataForm.times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
				 	@input="timesChange"
					unlink-panels range-separator="-" start-placeholder="请选择开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="巡查小组：" prop="inspectionTeamId">
				<el-select class="form-item" v-model="baseDataForm.inspectionTeamId" clearable placeholder="请选择巡查小组" @change="inspectionTeamIdChange">
					<el-option v-for="item in teamList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="巡查对象：" prop="inspectionObjectName">
				<!-- <el-select class="form-item" v-model="baseDataForm.inspectionObjectId" clearable placeholder="请选择巡查对象">
					<el-option v-for="item in examTypes" :key="item.code" :label="item.value" :value="item.code">
					</el-option>
				</el-select> -->
				<el-input v-model="baseDataForm.inspectionObjectName" placeholder="点击右侧按钮选择巡查对象" readonly>
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
			<el-form-item label="文件：">
				<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
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
		pageTeam,
		getPlanObj,
		addPlanObj,
		updatePlanObj
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
			return {
				baseDataForm: {
					id: undefined,
					inspectionTeamId: undefined,
					inspectionTheme: '',
					inspectionStartDate: '',
					inspectionEndDate: '',
					inspectionObjectId: undefined,
					planFiles: [],
					note: '',
					inspectionObjectName: '',
					times: []
				},
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				subLoading: false,
				dictType: "examType",
				teamList: [],
				times: [],
				pickerOptions: {
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
				},
				uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray: [],
				dataRule: {
					inspectionTheme: [{
						required: true,
						message: '巡查主题不能为空',
						trigger: 'blur'
					}],
					times: [{
						required: true,
						message: '请选择巡查时间',
						trigger: 'change'
					}],
					inspectionTeamId: [{
						required: true,
						message: '请选择巡查小组',
						trigger: 'change'
					}],
					inspectionObjectName: [{
						required: true,
						message: '请选择巡查对象',
						trigger: 'change'
					}]
				}
			}
		},
		watch: {
			baseDataForm: {
				handler(newVal, oldVal) {
					this.baseDataForm = newVal //监听后的操作
				},
				deep: true, // 加这个属性，深度监听
			},
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
			this.getDataList();
			this.getTreeInfo();
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
			timesChange(time) {
				// this.baseDataForm.times = time;
				this.$set(this.times,0,time[0])
				this.$set(this.times,1,time[1])
				this.baseDataForm.times = this.times
	   			// this.baseDataForm.inspectionEndDate = time[1];
				// if(e.length) {
				// 	this.$nextTick(() => {
				// 		this.$refs['baseDataForm'].clearValidate(['times']);
				// 	})
				// }
			},
			inspectionTeamIdChange(e) {
			},
			// 获取巡查小组数据列表
			getDataList() {
				this.teamList = [];
				pageTeam({
					'page': 1,
					'limit': 100
				}).then(data => {
					if (data && data.status === 200) {
						for(let i = 0; i < data.data.rows.length; i++) {
							this.teamList.push({label: data.data.rows[i].teamName, value: data.data.rows[i].id})
						}
					} else {
						this.teamList = [];
						this.$notify.error(data.msg)
					}
				}).catch(() => {
					this.teamList = [];
					this.$notify.error("获取数据列表失败")
				})
			},
			init() {
				this.$nextTick(() => {
					this.$refs['baseDataForm'].resetFields();
					if (!this.$route.query.id) {
						this.baseDataForm = {
							id: undefined,
							inspectionTeamId: undefined,
							inspectionTheme: '',
							inspectionStartDate: '',
							inspectionEndDate: '',
							inspectionObjectId: undefined,
							planFiles: [],
							note: '',
							inspectionObjectName: '',
							times: []
						}
					} else {
						this.baseDataForm.id = this.$route.query.id;
						this.getBaseDateDetail();
					}
				})
			},

			// 获取基础信息详情
			getBaseDateDetail(val) {
				getPlanObj(this.baseDataForm.id)
					.then(response => {
						this.baseDataForm = response.data;
						// if (this.baseDataForm.userFilePath) {
						// 	let index = this.baseDataForm.userFilePath.lastIndexOf('&');
						// 	this.$set(this.baseDataForm, 'fileName', this.baseDataForm.userFilePath.substring(index + 1, this.baseDataForm.userFilePath
						// 		.length))
						// }
						// this.$emit('refreshData', response.data, val);
						if (this.baseDataForm.planFiles && this.baseDataForm.planFiles.length) {
							this.fileArray = this.baseDataForm.planFiles.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles.init(this.fileArray);
							})
						}
						// if(this.baseDataForm.inspectionStartDate) this.times[0] = this.baseDataForm.inspectionStartDate;
						// if(this.baseDataForm.inspectionEndDate) this.times[1] = this.baseDataForm.inspectionEndDate;
						// if(this.baseDataForm.inspectionStartDate) this.$set(this.times,0,this.baseDataForm.inspectionStartDate)
						// if(this.baseDataForm.inspectionEndDate) this.$set(this.times,1,this.baseDataForm.inspectionEndDate)
						if(this.baseDataForm.inspectionStartDate) {
							this.baseDataForm.inspectionStartDate = response.data.inspectionStartDate;
							this.baseDataForm.inspectionEndDate = response.data.inspectionEndDate;
							// this.baseDataForm.times = [this.baseDataForm.inspectionStartDate,this.baseDataForm.inspectionEndDate];
							this.baseDataForm.times = [response.data.inspectionStartDate,response.data.inspectionEndDate];
							this.$set(this.times,0,response.data.inspectionStartDate)
							this.$set(this.times,1,response.data.inspectionEndDate)
							this.baseDataForm.times = this.times
						}
					});
			},

			handlePartyBranch(data) {
				this.baseDataForm.inspectionObjectId = data.id;
				this.baseDataForm.inspectionObjectName = data.departmentFullName;
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

			// 获取字典
			getDataDicts(type) {
				if (!type) return;
				let val = null
				val = getByType({
						type: type
					})
					.then(res => {
						if (res && res.status === 200) {
							return res.data;
						} else {
							this.$notify({
								title: '失败',
								message: '获取数据字典失败',
								type: 'error',
								duration: 2000
							});
						}
					});
				return Promise.resolve(val);
			},

			// 表单提交
			baseDataFormSubmit() {
				this.baseDataForm.inspectionStartDate = this.baseDataForm.times && this.baseDataForm.times.length ? this.baseDataForm.times[0] : '';
				this.baseDataForm.inspectionEndDate = this.baseDataForm.times && this.baseDataForm.times.length ? this.baseDataForm.times[1] : '';
				// if(this.times.length) {
				// 	this.$nextTick(() => {
				// 		this.$refs['baseDataForm'].clearValidate(['times']);
				// 	})
				// }
				this.$refs['baseDataForm'].validate((valid,object) => {
					if (valid) {
						this.subLoading = true;
						if (!this.baseDataForm.id) this.add();
						else this.update();
					}
				})
			},

			add() {
				addPlanObj(this.baseDataForm)
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
				updatePlanObj(this.baseDataForm)
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
					this.baseDataForm.planFiles = data.files.map(item => {
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
