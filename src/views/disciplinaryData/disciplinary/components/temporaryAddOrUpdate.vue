<template>
<el-dialog title="新增临时任务" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="130px"
		 label-position="left">
			<div>
                <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="任务标题：" prop="taskTitle">
							<el-input class="form-item input-info" v-model="form.taskTitle" placeholder="请输入任务标题" clearable
							></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="下发子公司：" :label-width="formLabelWidth" prop="departmentName">
                            <el-input v-model="form.deptName" placeholder="点击右侧按钮选择下发子公司" readonly>
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
					</el-col>
				</el-row> -->
                <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="M8及以上：" prop="aboveM6">
                            <el-select v-model="form.aboveM6" value-key="userId" multiple placeholder="请选择" style="width: 100%;" @change="aboveM6Change">
                                <el-option v-for="item in aboveM6" :key="item.userId" :label="item.name" :value="item"> </el-option>
                            </el-select>
                        </el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="高风险岗位人员：" prop="highRiskPosition">
                            <el-select v-model="form.highRiskPosition" value-key="userId" multiple remote placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in highRiskPosition" :key="item.userId" :label="item.name" :value="item"> </el-option>
                            </el-select>
                        </el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="提报时间：" prop="commitTime">
							<el-date-picker style="width: 100%;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" v-model="form.commitTime"
								align="right" type="datetime" placeholder="请选择表格提报时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="备注：" prop="note">
							<el-input v-model="form.note" type="textarea" rows="4" maxlength="500" resize="none"
							placeholder="请输入其他注意事项..."></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</div>
			<!-- <el-divider></el-divider> -->
		</el-form>
		<div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">取消</el-button>
			<!-- <el-button v-if="operation == 'edit'" type="primary" @click="update('form')" :loading="loading">修 改</el-button> -->
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</div>
    </el-dialog>
</template>

<script>
	import {
		personnelpool,
		temporaryTask
	} from 'api/archives/index';
    import {
		getTree
	} from 'api/admin/department/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	import {
		toDate
	} from '@/utils'
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
                visible: false,
                // treeVisible: false,
				// treeData: [],
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentFullName'
				// },
				flag: false,
				form: {
					aboveM6: [],
					highRiskPosition: [],
					commitTime: undefined,
					note: undefined,
					taskTitle: undefined
				},
				rules: {
					taskTitle: {
						required: true,
						message: '请输入任务标题',
						trigger: 'blur'
					},
					commitTime: {
						required: true,
						message: '请选择提报时间',
						trigger: 'change'
					}
				},
				loading: false,
				// treeVisible: false,
				userVisible: false,
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentFullName'
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
				operation: '',
				aboveM6: [],
				highRiskPosition: []
			}
		},
		components: {
		},
		created() {
            // this.getTreeInfo();
			if(this.$route.query.row) {
				this.operation = this.$route.query.operation;
				this.form = this.$route.query.row;
				if(this.$route.query.row.talkUser.length) this.form.talkUserName = this.$route.query.row.talkUser[0].name;
				if(this.$route.query.row.beTalkUser.length) this.form.beTalkUserName = this.$route.query.row.beTalkUser[0].name;
			} 
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			goBack() {
				// this.$router.go(-1);
				this.resetTemp();
				this.visible = false;
			},
			
			// 获取详情
			getInfo() {
				personnelpool({
					orgId: undefined
				}).then(response => {
						this.aboveM6 = response.data.aboveM6;
						this.highRiskPosition = response.data.highRiskPosition;
						// if(response.data.aboveM6.length) this.dataForm.aboveM6Name = response.data.aboveM6.map(item => { return item.name });
						// if(response.data.highRiskPosition.length) this.dataForm.highRiskPositionName = response.data.highRiskPosition.map(item => { return item.name });
					});
			},

			aboveM6Change(event) {
				// var obj={}
				// obj= this.Options.find(function(i){
				// 	return i.id ===val
				// });
			},
            
            // // 获取部门树
			// getTreeInfo() {
			// 	getTree({
			// 				departmentAttribute: '1'
			// 			})
			// 		.then(res => {
			// 			if (res && res.code === 0) {
			// 				this.treeData = res.data ? res.data : [];
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取部门树失败",
			// 					type: 'error',
			// 					duration: 2000
			// 				});
			// 			}
			// 		});
            // },
            
            // // 选择下发子公司
			// handlePartyBranch(data) {
			// 	this.form.deptId = data.id;
			// 	this.form.deptName = data.departmentFullName;
			// 	this.treeVisible = false;
            // },

			// 初始化当前页面
			init() {
				this.visible = true
				this.getInfo();
				this.$nextTick(() => {
                    // this.resetTemp();
                    this.$refs['form'].resetFields();
                })
				if (this.$route.query.id) {
					getObj(this.$route.query.id)
						.then(response => {
							this.form = response.data;
						});
				}
            },
            
            // handlePartyBranch(data) {
			// 	this.form.name = '';
			// 	if (data && data.id) {
			// 		this.form.departmentName = data.departmentName;
			// 		this.form.departmentSave = data
			// 		let qure = {
			// 			deptId: data.id
			// 		}
			// 		this.form.desp = false
			// 		archivesUserList(qure).then((res) => {
			// 			if (res.code == 0) {
			// 				this.form.names = res.data
			// 			}
			// 		})
			// 	} else this.form.desp = true
			// 	this.treeVisible = false;
			// },

			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						temporaryTask(this.form)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '创建成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										this.goBack();
										this.$emit('refreshDataList');
										this.loading = false;
									}, 1000)
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
									message: '创建临时任务失败',
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

			// 修改
			update(formName) {
				this.$confirm('确定进行修改?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						const set = this.$refs;
						set[formName].validate(valid => {
							if (valid) {
								this.loading = true;
								updateObj(this.form).then(res => {
									if (res && res.status === 200) {
										this.$notify({
											title: '成功',
											message: '修改成功',
											type: 'success',
											duration: 2000
										});
										setTimeout(() => {
											this.goBack();
											this.loading = false;
										}, 1000)
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
										message: '修改谈话记录失败',
										type: 'error',
										duration: 2000
									});
									this.loading = false;
								});
							} else {
								return false;
							}
						});
					}).catch(() => {

					});
			},

			// 重置数据
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					aboveM6: [],
					highRiskPosition: [],
					commitTime: undefined,
					note: undefined,
					taskTitle: undefined
				};
			}
		}
	}
</script>

<style scoped>
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
