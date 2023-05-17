<template>
	<el-dialog :title="title" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
	<!-- <div class="tier-page"> -->
		<div class="page-form">
		<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="150px"
		 label-position="right">
		 	<el-form-item label="谈话人单位：" prop="deptName">
				<el-input style="width: 86%;" v-model="form.deptName" placeholder="点击右侧按钮选择单位" readonly>
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
			<!-- <div style="margin-top: 20px;">
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item label="谈话人：" prop="talkUserName" class="box-form">
							<!-- <el-input style="width: 86%;" v-model="form.talkUser[0].name" placeholder="点击右侧按钮选择谈话人" @input="(val) => changeInputEvent(val, item)" readonly>
								<el-button slot="append" icon="el-icon-thumb" @click="userDialogHandle('谈话人')">选择</el-button>
							</el-input> -->
							<el-button @click="personnelFistHandle('谈话人')" type="text"
								class="but-css">
								批量选择人员
								<span>(已选{{form.talkUserName.length ? form.talkUserName.length : 0}}人)</span>
							</el-button>
							<el-select style="width: 86%;" class="input-item elinput input-select" v-model="form.talkUserName" multiple @focus="closeIt1" ref="selectIt1"
							@remove-tag="talkUserRemoveTag" placeholder="">
							</el-select>
						</el-form-item>
					<!-- </el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item label="被谈话人：" prop="beTalkUserName" class="box-form">
							<!-- <el-input style="width: 86%;" v-model="form.beTalkUser[0].name" placeholder="点击右侧按钮选择被谈话人" readonly>
								<el-button slot="append" icon="el-icon-thumb" @click="userDialogHandle('被谈话人')">选择</el-button>
							</el-input> -->
							<el-button @click="personnelFistHandle('被谈话人')" type="text"
								class="but-css">
								批量选择人员
								<span>(已选{{form.beTalkUserName.length ? form.beTalkUserName.length : 0}}人)</span>
							</el-button>
							<el-select style="width: 86%;" class="input-item elinput input-select" v-model="form.beTalkUserName" multiple @focus="closeIt2" ref="selectIt2"
							@remove-tag="beTalkUserRemoveTag" placeholder="">
							</el-select>
						</el-form-item>
					<!-- </el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item label="谈话地点：" prop="talkPlace">
							<el-input style="width: 86%;" class="form-item input-info" v-model="form.talkPlace" placeholder="请输入谈话地点" maxlength="30" clearable
							></el-input>
						</el-form-item>
					<!-- </el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item label="谈话时间：" prop="talkTime">
							<el-date-picker style="width: 86%;" format="yyyy-MM-dd HH:mm" value-format='yyyy-MM-dd HH:mm' v-model="form.talkTime"
								align="right" type="datetime" placeholder="请选择谈话时间">
							</el-date-picker>
						</el-form-item>
					<!-- </el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item label="谈话类型：" prop="talkType">
							<el-select style="width: 86%;" v-model="form.talkType" clearable placeholder="请选择谈话类别">
								<el-option v-for="item in talkType" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					<!-- </el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item label="事由：" prop="reason">
							<el-input style="width: 86%;" v-model="form.reason" type="textarea" rows="4" maxlength="500" resize="none"
							placeholder="请输入事由"></el-input>
						</el-form-item>
				<el-form-item label="附件：">
					<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
						:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
						@refreshData="getFiles"></UploadFiles>
				</el-form-item>
					<!-- </el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item label="是否立卷存档：">
							<el-radio-group v-model="form.fileOrNot" @change="fileOrNotChange">
								<el-radio :label="true">是</el-radio>
								<el-radio :label="false">否</el-radio>
							</el-radio-group>
						</el-form-item>
					<!-- </el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :offset="2"> -->
						<el-form-item v-if="fileOrNotNoteVisible" label="立卷存档备注：" prop="fileOrNotNote">
							<el-input style="width: 86%;" v-model="form.fileOrNotNote" type="textarea" rows="4" maxlength="500" resize="none"
							placeholder="请输入立卷存档备注"></el-input>
						</el-form-item>
					<!-- </el-col>
				</el-row> -->
			<!-- </div> -->
			<!-- <el-divider></el-divider> -->
		</el-form>
		</div>
		<div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">返 回</el-button>
			<el-button v-if="operation == 'edit'" type="primary" @click="create('form')" :loading="loading">提
				交</el-button>
			<el-button v-else type="primary" @click="create('form')" :loading="loading">提
				交</el-button>
		</div>
		<!-- <UserDialog v-if="userVisible" ref="userDialog" @refreshData="getUserInfo"></UserDialog> -->
		<!-- 弹窗 选择人员 -->
		<fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
	<!-- </div> -->
	</el-dialog>
</template>

<script>
	// import UserDialog from './components/userDialog';
	import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		addObj,
		updateObj
	} from 'api/talkInc/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	import {
		toDate
	} from '@/utils'
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		formatFile
	} from 'utils';
	export default {
		name: 'honestReport',
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			return {
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				personnelFistVisible: true,
				visible: false,
				flag: false,
				fileOrNotNoteVisible: false,
				form: {
					fileOrNot: undefined,
					fileOrNotNote: undefined,
					reason: undefined,
					talkPlace: undefined,
					talkTime: undefined,
					talkType: undefined,
					beTalkUserName: [],
					talkUserName: [],
					talkUser: [
						// {
						// 	deptId: undefined,
						// 	deptName: undefined,
						// 	id: undefined,
						// 	name: '',
						// 	userId: undefined
						// }
					],
					beTalkUser: [
						// {
						// 	deptId: undefined,
						// 	deptName: undefined,
						// 	id: undefined,
						// 	name: '',
						// 	userId: undefined
						// }
					],
					talkFiles: [],
					deptId: undefined,
					deptName: ''
				},
				rules: {
					deptName: {
						required: true,
						message: '请选择谈话人单位',
						trigger: 'change'
					},
					reason: {
						required: true,
						message: '请输入事由',
						trigger: 'blur'
					},
					beTalkUserName: {
						required: true,
						message: '请选择被谈话人',
						trigger: 'change'
					},
					talkUserName: {
						required: true,
						message: '请选择谈话人',
						trigger: 'change'
					},
					talkType: {
						required: true,
						message: '请选择谈话类型',
						trigger: 'change'
					},
					talkPlace: {
						required: true,
						message: '请输入谈话地点',
						trigger: 'blur'
					},
					talkTime: {
						required: true,
						message: '请选择谈话时间',
						trigger: 'change'
					}
				},
				loading: false,
				// treeVisible: false,
				userVisible: false,
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentName'
				// },
				informationSources: [],
				categorys: [],
				subclassCh: [],
				informerWaies: [],
				// 文件上传
				url: '',
				num: 0,
				successNum: 0,
				fileList: [],
				talkType: [
					{label: '例行廉政谈话', value: '1'},
					{label: '任前廉政谈话', value: '2'},
					{label: '提醒谈话', value: '3'},
					{label: '约谈', value: '4'},
					{label: '批评教育', value: '5'},
					{label: '谈话提醒', value: '6'}
				],
				operation: '',
				title: '',
				checkedData:{},
				method: '',
				uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=talkinc`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray: []
			}
		},
		components: {
			// UserDialog
			fuhsiSelectPersonnel,
			UploadFiles
		},
		created() {
			// if(this.$route.query.row) {
			// 	this.operation = this.$route.query.operation;
			// 	this.form = this.$route.query.row;
			// 	if(this.$route.query.row.talkUser.length) this.form.talkUserName = this.$route.query.row.talkUser[0].name;
			// 	if(this.$route.query.row.beTalkUser.length) this.form.beTalkUserName = this.$route.query.row.beTalkUser[0].name;
			// 	if(this.$route.query.row.fileOrNot) this.fileOrNotNoteVisible = true;
			// } 
			// else {
			// 	this.flag = true;
			// }
		},
		watch : {
			// 'form.conferenceType': {
			// 	handler(newV, oldV) {
			// 		if(newV) this.typeListData();
			// 	},
			// 	immediate: true
			// },

			// 'form.compereName': {
			// 	handler(newV, oldV) {
			// 		if(newV) this.form.compereName = newV;
			// 	},
			// 	immediate: true
			// },

			checkedData: {
				handler(newVal, oldVal) {
					if(newVal.label == '谈话人') this.form.talkUserName = [];
					if(newVal.label == '被谈话人') this.form.beTalkUserName = [];
					if(newVal && newVal.resultList && newVal.resultList.length) {
						for(let i=0;i<newVal.resultList.length;i++){
							if(newVal.label == '谈话人') this.form.talkUserName.push(newVal.resultList[i].name);
							if(newVal.label == '被谈话人') this.form.beTalkUserName.push(newVal.resultList[i].name);
							// this.$set(this.form,'compereName',this.form.compereName)
							// this.$forceUpdate()
						}
						this.personnelFistVisible=false;
						this.$nextTick(()=>{
							this.personnelFistVisible=true;
						})
						// this.$set(this.form,'compereName',this.form.compereName)
						// this.$forceUpdate()
					}
					if(newVal.label == '谈话人') this.form.talkUser = newVal.resultList;
					if(newVal.label == '被谈话人') this.form.beTalkUser = newVal.resultList;
				},
				immediate: true
			},
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
			// 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					if(label == '谈话人') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.talkUser));
					if(label == '被谈话人') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.beTalkUser));
   	  				this.$refs.personnelFist.init();
    			})
   			},

			// 隐藏下拉框
			closeIt1() {
				this.$refs.selectIt1.blur();
			},

			closeIt2() {
				this.$refs.selectIt2.blur();
			},

			// 谈话人
			talkUserRemoveTag(val){
				for(let i = 0; i < this.form.talkUser.length; i++) {
					if(this.form.talkUser[i].name == val) {
						this.form.talkUser.splice(i,1)
						this.$forceUpdate()
						// this.form.compereName = this.form.compereName.splice(i,1)
						// this.$set(this.form, 'compereName', this.form.compereName.splice(i,1))
					}
				}
			},

			// talkUserClear() {
			// 	this.form.talkUser = [];
			// 	// this.form.compereName = [];
			// },

			// 被谈话人
			beTalkUserRemoveTag(val){
				for(let i = 0; i < this.form.beTalkUser.length; i++) {
					if(this.form.beTalkUser[i].name == val) {
						this.form.beTalkUser.splice(i,1)
						this.$forceUpdate()
					}
				}
			},

			// beTalkUserClear() {
			// 	this.form.beTalkUser = [];
			// },

			// 获取批量上传文件
			getFiles(data) {
				try {
					this.form.talkFiles = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},

			goBack() {
				this.visible = false;
			},

			// 初始化当前页面
			init(row,operation) {
				this.visible = true;
				this.getTreeInfo();
				if(operation) {
					this.operation = operation;
					this.title = '编辑';
				} else {
					this.title = '新增';
				}
				if(row) {
					this.form = {...row};
					if(row.talkUser.length) this.form.talkUserName = row.talkUser.map( item => { return item.name});
					if(row.beTalkUser.length) this.form.beTalkUserName = row.beTalkUser.map( item => { return item.name});
					if(row.fileOrNot) this.fileOrNotNoteVisible = true;
					if (row.talkFiles && row.talkFiles.length) {
						this.fileArray = row.talkFiles.map(item => { return {name: this.formatFile(item),
							response: {fileUrl: item}}})
						this.$nextTick(() => {
							this.$refs.uploadFiles.init(this.fileArray);
						})
					} else {
						this.$nextTick(() => {
							this.$refs.uploadFiles.init([]);
						})
					}
				} else {
					this.$nextTick(() => {
						this.$refs.form.clearValidate();
					})
					this.form = {
						fileOrNot: undefined,
						fileOrNotNote: undefined,
						reason: undefined,
						talkPlace: undefined,
						talkTime: undefined,
						talkType: undefined,
						beTalkUserName: [],
						talkUserName: [],
						talkUser: [
							// {
							// 	deptId: undefined,
							// 	deptName: undefined,
							// 	id: undefined,
							// 	name: '',
							// 	userId: undefined
							// }
						],
						beTalkUser: [
							// {
							// 	deptId: undefined,
							// 	deptName: undefined,
							// 	id: undefined,
							// 	name: '',
							// 	userId: undefined
							// }
						],
						talkFiles: [],
						deptId: undefined,
						deptName: ''
					}
					this.fileOrNotNoteVisible = false;
					this.$nextTick(() => {
						this.$refs.uploadFiles.init([]);
					})
				}
				// this.$nextTick(() => {
				// 	this.resetTemp();
				// })
				// if (this.$route.query.id) {
				// 	getObj(this.$route.query.id)
				// 		.then(response => {
				// 			this.form = response.data;
				// 		});
				// }
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

			fileOrNotChange(e) {
				if(e) {
					this.fileOrNotNoteVisible = true;
				}
				else {
					this.form.fileOrNotNote = '';
					this.fileOrNotNoteVisible = false;
				}
			},

			// 打开人员列表框
			userDialogHandle(title) {
				this.userVisible = true;
				this.$nextTick(() => {
					this.$refs.userDialog.title = title;
					this.$refs.userDialog.init();
				})
			},

			changeInputEvent(val, item){
				item.searchText = val;
				this.$forceUpdate()
			},

			// // 获取所选人员信息
			// getUserInfo(data,title) {
			// 	if(title == '谈话人') {
			// 		this.form.talkUser[0].deptId = data.deptId;
			// 		this.form.talkUser[0].deptName = data.organizationName;
			// 		this.form.talkUser[0].userId = data.userId;
			// 		this.form.talkUser[0].name = data.name;
			// 		this.form.talkUser[0].position = data.post;
			// 		this.form.talkUserName = data.name;
			// 		this.$nextTick(() => {
			// 			this.$refs['form'].clearValidate(['talkUserName']);
			// 		})
			// 	}
			// 	if(title == '被谈话人') {
			// 		this.form.beTalkUser[0].deptId = data.deptId;
			// 		this.form.talkUser[0].deptName = data.organizationName;
			// 		this.form.beTalkUser[0].userId = data.userId;
			// 		this.form.beTalkUser[0].name = data.name;
			// 		this.form.beTalkUser[0].position = data.post;
			// 		this.form.beTalkUserName = data.name;
			// 		this.$nextTick(() => {
			// 			this.$refs['form'].clearValidate(['beTalkUserName']);
			// 		})
			// 	}
			// },

			// // 清除已选人员
			// beReportedNameClearHanle() {
			// 	this.form.position = undefined;
			// 	this.form.userId = undefined;
			// 	this.form.beReportedName = undefined;
			// },

			// 选择部门
			handlePartyBranch(data) {
				this.form.deptId = data.id;
				this.form.deptName = data.departmentFullName;
				this.treeVisible = false;
			},

			// // 清除已选部门
			// organizationClearHanle() {
			// 	this.form.deptId = undefined;
			// 	this.form.organizationName = undefined;
			// },

			create(formName) {
				this.form.id ? this.method = 'put' : this.method = 'post'
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addObj(this.form,this.method)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										// this.goBack();
										this.loading = false;
										this.visible = false;
										this.$emit('refreshDataList');
									}, 2000)
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000
									});
									this.loading = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '操作失败',
									type: 'error',
									duration: 2000
								});
								this.loading = false;
							})
					} else {
						return false;
					}
				});
			},

			// // 修改
			// update(formName) {
			// 	this.$confirm('确定进行修改?', '提示', {
			// 			confirmButtonText: '确定',
			// 			cancelButtonText: '取消',
			// 			type: 'warning'
			// 		})
			// 		.then(() => {
			// 			const set = this.$refs;
			// 			set[formName].validate(valid => {
			// 				if (valid) {
			// 					this.loading = true;
			// 					updateObj(this.form).then(res => {
			// 						if (res && res.status === 200) {
			// 							this.$notify({
			// 								title: '成功',
			// 								message: '修改成功',
			// 								type: 'success',
			// 								duration: 2000
			// 							});
			// 							setTimeout(() => {
			// 								this.goBack();
			// 								this.loading = false;
			// 							}, 2000)
			// 						} else {
			// 							this.$notify({
			// 								title: '失败',
			// 								message: res.msg,
			// 								type: 'error',
			// 								duration: 2000
			// 							});
			// 							this.loading = false;
			// 						}
			// 					}).catch(() => {
			// 						this.$notify({
			// 							title: '失败',
			// 							message: '修改谈话记录失败',
			// 							type: 'error',
			// 							duration: 2000
			// 						});
			// 						this.loading = false;
			// 					});
			// 				} else {
			// 					return false;
			// 				}
			// 			});
			// 		}).catch(() => {

			// 		});
			// },

			// 重置数据
			resetTemp() {
				// this.$refs.form.resetFields();
				// this.$refs.form.clearValidate();
				this.form = {
					fileOrNot: undefined,
					fileOrNotNote: undefined,
					reason: undefined,
					talkPlace: undefined,
					talkTime: undefined,
					talkType: undefined,
					beTalkUserName: [],
					talkUserName: [],
					talkUser: [
						// {
						// 	deptId: undefined,
						// 	deptName: undefined,
						// 	id: undefined,
						// 	name: '',
						// 	userId: undefined
						// }
					],
					beTalkUser: [
						// {
						// 	deptId: undefined,
						// 	deptName: undefined,
						// 	id: undefined,
						// 	name: '',
						// 	userId: undefined
						// }
					],
					talkFiles: [],
					deptId: undefined,
					deptName: ''
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-form {
		max-height: 600px;
		overflow-x: auto;
	}
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
			// position:fixed;
			position: absolute;
			z-index:9999;
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
	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}

	.page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: -24px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}

	.select-item>>>.el-radio {
		min-width: 140px;
	}
</style>
