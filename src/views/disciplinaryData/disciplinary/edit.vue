<template>
	<div class="tier-page page-content">
		<!-- <loading v-if="hide"></loading> -->
		<!-- <div class="page-title">{{$route.path.indexOf('add') != -1 ? '新增' : '修改'}}</div> -->
		<!-- <el-divider></el-divider> -->
		<div class="box-content">
			<div class="box-left">
				<FormType ref="formType" @refreshData="getType"></FormType>
			</div>
			<div class="box-right roll-containers">
				<!-- <component ref="tableForm" class="table-info" :typeInfo="typeInfo" :dataObj="dataObj"
					:is="NextTickName"></component> -->
				<k-form-build :key="new Date().getTime()" ref="kfb" :disabled="disabled" :value="formVariables" />
			</div>
		</div>
		<div v-if="operation == 'add'" class="footer-btn" align="right">
			<el-button @click="goBack()">返 回</el-button>
			<el-button class="btn-submit" type="primary" @click="create('form')"
				:loading="subLoding">确 定</el-button>
			<!-- <el-button class="btn-submit" v-else type="primary" @click="update('form')" :loading="loading">确 定
			</el-button> -->
		</div>
		<el-dialog :visible.sync="dialogFormVisible">
			<el-form v-if="status !== '0'" :model="approveForm" :rules="approveRules" ref="approveForm" label-width="100px">
				<el-form-item label="意见选择：" prop="auditStatus">
					<el-select v-model="approveForm.auditStatus" placeholder="请选择" style="width: 100%;">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="批示意见：" prop="auditAdvice">
					<el-input type="textarea" :rows="4"
						placeholder="请输入批示意见" v-model="approveForm.auditAdvice" clearable>
					</el-input>
				</el-form-item>
			</el-form>
			<div v-if="status !== '0'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click="approveHandle('approveForm')">确定</el-button>
			</div>
			<el-table v-if="status == '0'" :data="approveList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
				<el-table-column width="100" align="center" label="意见选择"> <template slot-scope="scope">
						<span v-if="scope.row.auditStatus == '1'">同意</span>
						<span v-if="scope.row.auditStatus == '0'">不同意</span>
					</template> </el-table-column>
				<el-table-column align="center" label="批示意见"> <template slot-scope="scope">
						<span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.auditAdvice}}</span>
					</template> </el-table-column>
			</el-table>
			<!-- <div v-show="!listLoading" class="pagination-container" align="right">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
					:page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div> -->
		</el-dialog>
		<div v-if="operation == 'detail' && integrityArchives_btn_first" class="footer-btn" align="right">
			<el-button v-if="status == '0'" class="btn-submit" type="primary" @click="handleComments()">查看审批意见</el-button>
			<el-button v-else class="btn-submit" type="primary" @click="handleComments()">添加审批意见</el-button>
		</div>
	</div>
</template>

<script>
	import {
		taskarchives,
		taskarchivesLeader,
		archivesAudit,
		archivesAuditInfo
	} from 'api/archives/index';
	import {
		getObj
	} from 'api/admin/user/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import FormType from './components/FormType';
	export default {
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			return {
				hide: true,
				loading: false,
				subLoding: false,
				typeInfo: {
					code: '1',
					title: ''
				},
				dataObj: {},
				form: {
					selfAnalysisId: undefined,
					userId: undefined,
					deptId: undefined,
					deptName: undefined,
					selfAnalysis: undefined,
					file: []
				},
				formVariables: {},
				disabled: false,
				taskarchivesId: undefined,
				operation: '',
				dialogFormVisible: false,
				options: [{
					value: '1',
					label: '同意'
				}, {
					value: '0',
					label: '不同意'
				}],
				approveForm: {
					individualTaskId: undefined,
					auditAdvice: '',
					auditStatus: ''
				},
				approveRules: {
					auditStatus: [{
						required: true,
						message: '请选择意见',
						trigger: 'change'
					}],
					auditAdvice: [{
						required: true,
						message: '请输入批示意见',
						trigger: 'blur'
					}]
				},
				integrityArchives_btn_first: false,
				status: '',
				listLoading: true,
				approveList: [],
				first: '',
				index: undefined
			}
		},

		components: {
			FormType
		},

		created() {
			if (this.$route.path.indexOf('add') != -1) this.hide = false;
			this.operation = this.$route.query.operation;
			this.status = this.$route.query.status;
			this.first = this.$route.query.first;
			// 获取权限
			this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];
			// if (this.$route.path.indexOf('add') != -1) this.getUserInfo();
			// else this.getDetail();

		},

		computed: {
			...mapGetters([
				'userId','elements'
			]),

			// NextTickName() {
			// 	if (this.typeInfo.code) {
			// 		let c = () => import(`@/components/OATables/Table_${this.typeInfo.code}.vue`); // 动态组件
			// 		return c
			// 	}
			// }
		},

		methods: {
			goBack() {
				this.$router.go(-1);
			},

			closeLoading() {
				this.hide = false;
			},

			// 获取所选表类型
			getType(data,index) {
				this.hide = true;
				// this.typeInfo = data;
				// this.formVariables = data;
				this.index = index;
				this.taskarchivesId = data.id;
				if(this.$route.query.operation == 'detail') this.disabled = true;
				this.formVariables = {
					config: undefined,
					list: []
				}
				this.formVariables.config = JSON.parse(data.formConf);
				// for(let i = 0; i < data.formFields.length; i++) {
				// 	this.formVariables.list[i] = JSON.parse(data.formFields[i]);
				// }
				Promise.all([
					data.formFields.forEach(item => {
						this.formVariables.list.push(JSON.parse(item));
					})
				]).then(() => {
					this.$nextTick(() => {
						setTimeout(() => {
							this.$refs.kfb.setData(data
								.formVariables);
						}, 300)
					})
				})
				setTimeout(() => {
					this.hide = false;
				}, 400);
			},

			// 创建表单
			create(formName) {
				// if (!this.$refs.tableForm) return;
				// var data = this.$refs.tableForm.form;
				// this.$set(data, 'templateId', this.typeInfo.code);
				// this.$set(data, 'createId', this.userId);
				this.loading = true;
				// 使用getData函数获取数据
				this.$refs.kfb.getData().then(values => {
					this.subLoding = true;
					// if(!this.integrityArchives_btn_first) {
					// 	taskarchives({
					// 		id: this.taskarchivesId,
					// 		formVariables: values
					// 	}).then(res => {
					// 		if (res && res.status === 200) {
					// 			this.$notify({
					// 				title: '成功',
					// 				message: '创建成功',
					// 				type: 'success',
					// 				duration: 2000
					// 			});
					// 			// setTimeout(() => {
					// 				// this.goBack();
					// 				this.$refs.formType.getTreeInfo();
					// 				this.subLoding = false;
					// 			// }, 1000)
					// 		} else {
					// 			this.$notify({
					// 				title: '失败',
					// 				message: res.msg,
					// 				type: 'error',
					// 				duration: 2000
					// 			});
					// 			this.subLoding = false;
					// 		}
					// 		// this.$notify({
					// 		// 	title: '提示',
					// 		// 	message: '填写档案成功',
					// 		// 	type: 'success',
					// 		// 	duration: 2000
					// 		// });
					// 		// 关闭当前窗口
					// 		// this.$router.go(-1);
					// 	}).catch(() => {
					// 		// this.disabled = false; // 表单开启
					// 		// this.formBtns = true; // 按钮展示
					// 		this.$notify({
					// 			title: '失败',
					// 			message: '创建失败',
					// 			type: 'error',
					// 			duration: 2000
					// 		});
					// 		this.subLoding = false;
					// 	})
					// }
					if(this.first) {
						taskarchivesLeader({
							id: this.taskarchivesId,
							formVariables: values
						}).then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '创建成功',
									type: 'success',
									duration: 2000
								});
								// setTimeout(() => {
									// this.goBack();
									this.$refs.formType.getTreeInfo(this.index);
									this.subLoding = false;
								// }, 1000)
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
								this.subLoding = false;
							}
						}).catch(() => {
							// this.disabled = false; // 表单开启
							// this.formBtns = true; // 按钮展示
							this.$notify({
								title: '失败',
								message: '操作失败',
								type: 'error',
								duration: 2000
							});
							this.subLoding = false;
						})
					} else {
						taskarchives({
							id: this.taskarchivesId,
							formVariables: values
						}).then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '创建成功',
									type: 'success',
									duration: 2000
								});
								// setTimeout(() => {
									// this.goBack();
									this.$refs.formType.getTreeInfo(this.index);
									// this.$refs.formType.handleType(this.index);
									this.subLoding = false;
								// }, 1000)
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
								this.subLoding = false;
							}
							// this.$notify({
							// 	title: '提示',
							// 	message: '填写档案成功',
							// 	type: 'success',
							// 	duration: 2000
							// });
							// 关闭当前窗口
							// this.$router.go(-1);
						}).catch(() => {
							// this.disabled = false; // 表单开启
							// this.formBtns = true; // 按钮展示
							this.$notify({
								title: '失败',
								message: '创建失败',
								type: 'error',
								duration: 2000
							});
							this.subLoding = false;
						})
					}
					
				}).catch(() => {
					// this.disabled = false; // 表单开启
					// this.formBtns = true; // 按钮展示
					this.subLoding = false;
				})
				// addObj(data)
				// 	.then((res) => {
				// 		if (res && res.code === 0) {
				// 			this.$notify({
				// 				title: '成功',
				// 				message: '创建成功',
				// 				type: 'success',
				// 				duration: 2000
				// 			});
				// 			setTimeout(() => {
				// 				this.goBack();
				// 				this.loading = false;
				// 			}, 2000)
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: res.msg,
				// 				type: 'error',
				// 				duration: 2000
				// 			});
				// 			this.loading = false;
				// 		}
				// 	}).catch(() => {
				// 		this.loading = false;
				// 	})
			},

			// 修改表单
			update(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						// putObj(this.form)
						// 	.then((res) => {
						// 		if (res && res.code === 0) {
						// 			this.$notify({
						// 				title: '成功',
						// 				message: '修改成功',
						// 				type: 'success',
						// 				duration: 2000
						// 			});
						// 			setTimeout(() => {
						// 				this.goBack();
						// 				this.loading = false;
						// 			}, 2000)
						// 		} else {
						// 			this.$notify({
						// 				title: '失败',
						// 				message: res.msg,
						// 				type: 'error',
						// 				duration: 2000
						// 			});
						// 			this.loading = false;
						// 		}
						// 	}).catch(() => {
						// 		this.loading = false;
						// 	})
					} else {
						return false;
					}
				});
			},

			// 获取详情
			getDetail() {
				// detail({
				// 		id: this.$route.query.id
				// 	})
				// 	.then(res => {
				// 		if (res && res.code === 0) {
				// 			this.dataObj = res.data;
				// 			setTimeout(() => {
				// 				this.loading = false;
				// 			}, 300)
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: res.msg,
				// 				type: 'error',
				// 				duration: 2000
				// 			});
				// 			setTimeout(() => {
				// 				this.loading = false;
				// 			}, 300)
				// 		}
				// 	}).catch(() => {
				// 		setTimeout(() => {
				// 			this.loading = false;
				// 		}, 500)
				// 	})
			},

			// 添加审批
			handleComments() {
				// this.approveForm = {
				// 	individualTaskId: undefined,
				// 	auditAdvice: '',
				// 	auditStatus: ''
				// };
				this.dialogFormVisible = true;
				this.getInfo(this.$route.query.id);
			},

			// 获取详情
			getInfo(id) {
				this.listLoading = true;
				archivesAuditInfo(id)
					.then(response => {
						if (response && response.status === 200) {
							this.approveList = response.data;
							this.total = response.data.total;
						} else {
							this.total = 0;
						}
						this.listLoading = false;
					}).catch(Error => {
						this.listLoading = false;
					})
					// .then(response => {
					// 	this.approveList = response.data;
					// 	// for(let i = 0; i < response.data.formIds.length; i++) {
					// 	// 	this.form.formIds[i] = parseInt(this.form.formIds[i])
					// 	// }
					// 	this.listLoading = false;
					// });
			},

			approveHandle(formName) {
				this.approveForm.individualTaskId = this.$route.query.id;
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						archivesAudit(this.approveForm)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '添加成功',
										type: 'success',
										duration: 1000
									});
									this.dialogFormVisible = false;
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 1000
									});
									this.dialogFormVisible = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '添加审批意见失败',
									type: 'error',
									duration: 1000
								});
								this.dialogFormVisible = false;
							})
					} else {
						return false;
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-content {
		min-height: calc(100vh - 100px);
		background-color: #FFFFFF;

		.page-title {
			width: 350px;
			height: 50px;
			line-height: 50px;
			margin: 0 auto;
			margin-bottom: -24px;
			// background-color: #1070E1;
			background-color: #005598;
			color: #FFFFFF;
			font-size: 28px;
			font-weight: bold;
			text-align: center;
			border-radius: 5px;
		}

		.box-content {
			display: flex;
			margin: 0 auto;

			.box-right {
				flex: 1;
				margin-bottom: 10px;
				max-height: calc(100vh - 230px);

				.table-info {
					float: left;
				}
			}
		}

		.footer-btn {
			border-top: 1px solid #DCDFE6;
			z-index: 9999;
			position: fixed;
			width: 100%;
			height: 66px;
			background-color: #FFFFFF;
			right: 0;
			bottom: 0px;
			padding-right: 50px;
			padding-top: 13px;

			button {
				width: 120px;
			}

			.btn-submit {
				background-color: #005598;
				margin-left: 20px;
			}
		}
	}

	@media screen and (min-width : 1600px) {

		.box-left {
			width: 390px;
		}
	}

	@media screen and (max-width : 1599px) {

		.box-left {
			width: 390px;
		}
	}

	@media screen and (max-width : 1359px) {

		.box-left {
			width: 390px;
            // position: relative;
		}
	}
</style>
