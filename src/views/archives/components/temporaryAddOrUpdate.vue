<template>
<el-dialog title="新增临时人员" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="130px"
		 label-position="left">
			<div>
                <!-- <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="任务标题：" prop="taskTitle">
							<el-input class="form-item input-info" v-model="form.taskTitle" placeholder="请输入任务标题" clearable
							></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
				<el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="任务表格：" prop="formTypeIds" class="box-form">
							<!-- <el-select style="width: 100%;" multiple
								v-model="form.formIds" clearable placeholder="请选择表格">
								<el-option v-for="(item,index) in typePareChilds" :value='item.value' :key='index'
									:label="item.label">
								</el-option>
							</el-select> -->
							<el-button @click="tableHandle()" type="text"
								class="but-css">
								批量选择表格
								<span>({{form.formTypeIds.length ? form.formTypeIds.length : 0}})</span>
							</el-button>
							<el-select class="input-item input-select elinput" v-model="form.formTypeIds" multiple @focus="closeIttable" ref="selectIttable" style="width:100%;"
							placeholder="">
							</el-select>
							<!-- <el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
								<el-tree :data="typeData" ref="tree" show-checkbox @check="handleCheckChange" style="min-width: 350px;" node-key="id" :expand-on-click-node="false" 
									@node-click="handlePartyBranch" :props="defaultPropsType" highlight-current class="roll-containers">
									<span class="custom-tree-node show-hide" slot-scope="{ node, data }" tabindex="1">
										<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
										<span style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 15px;">{{ node.label }}
										</span>
									</span>
								</el-tree>
								<el-select style="width: 100%;" v-model="form.formTypeIds" multiple placeholder="" class="input-item input-select" slot="reference"
									ref="selectIt1" @focus="closeIt1">
								</el-select>
							</el-popover> -->
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item>
							<el-checkbox v-model="form.personalReportForm">个人有关事项报告表</el-checkbox>
						</el-form-item>
					</el-col>
				</el-row> -->
                <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="M8及以上：" prop="aboveM8">
                            <el-select v-model="form.aboveM8" value-key="userId" filterable multiple placeholder="请选择" style="width: 100%;" @change="aboveM8Change">
                                <el-option v-for="item in aboveM8" :key="item.userId" :label="item.name" :value="item"> </el-option>
                            </el-select>
                        </el-form-item>
					</el-col>
				</el-row>
                <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="关键岗位人员：" prop="highRiskPosition">
                            <el-select v-model="form.highRiskPosition" value-key="userId" filterable multiple placeholder="请选择" style="width: 100%;">
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
				<!-- <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="备注：" prop="note">
							<el-input v-model="form.note" type="textarea" rows="4" maxlength="500" resize="none"
							placeholder="请输入其他注意事项..."></el-input>
						</el-form-item>
					</el-col>
				</el-row> -->
			</div>
			<!-- <el-divider></el-divider> -->
		</el-form>
		<div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">取消</el-button>
			<!-- <el-button v-if="operation == 'edit'" type="primary" @click="update('form')" :loading="loading">修 改</el-button> -->
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</div>

		<!-- 弹窗, 选择表 -->
		<table-tree-check v-if="tableTreeCheckVisible" ref="tableTreeCheck" @refreshData="tableInitTreeData">
		</table-tree-check>
    </el-dialog>
</template>

<script>
	import {
		personnelpool,
		temporaryTask,
		listSimple
	} from 'api/archives/index';
    import {
		getTree
	} from 'api/admin/department/index';
	import {
		formtypeTree
	} from 'api/bpm/categoryMan';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	import {
		toDate
	} from '@/utils'
	import tableTreeCheck from '@/components/table-tree-check';
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
				tableTreeCheckVisible: false,
				flag: false,
				form: {
					aboveM8: [],
					highRiskPosition: [],
					commitTime: undefined,
					note: undefined,
					taskTitle: undefined,
					formTypeIds: [],
					personalReportForm: false
				},
				rules: {
					formTypeIds: {
						required: true,
						message: '请选择表格',
						trigger: 'change'
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
				aboveM8: [],
				highRiskPosition: [],
				typePareChilds: [],
				typeData: [],
				popoverVisibel: false,
				defaultPropsType: {
					children: 'children',
					label: 'name'
				},
			}
		},
		components: {
			tableTreeCheck
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
		// mounted() {
		// 	this.currentTime();
		// },
		methods: {
			getTime() {
				var _this = this;
				let yy = new Date().getFullYear();
				var mm =
					new Date().getMonth() > 9
					? new Date().getMonth() + 1
					: new Date().getMonth() == 9
					? new Date().getMonth() + 1
					: '0' + (new Date().getMonth() + 1);
				var dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
				let hh = new Date().getHours();
				let mf =
					new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
				let ss =
					new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
				let mmAft = new Date().getMonth() + 2 > 12 ? '01' : '0' + (new Date().getMonth() + 2)
				_this.form.commitTime = yy + '-' + mmAft + '-' + dd + ' ' + hh + ':' + mf;
			},
			currentTime() {
				setInterval(this.getTime, 1000);
			},
			closeIttable() {
				this.$refs.selectIttable.blur();
			},
			// 选择表
			tableHandle() {
				this.tableTreeCheckVisible = true;
				this.$nextTick(() => {
					this.$refs.tableTreeCheck.title = '任务表格';
					this.$refs.tableTreeCheck.init(this.form.formTypeIds);
				})
			},
			// 获取表
			tableInitTreeData(data) {
				this.form.formTypeIds = data.nodes;
			},
			// 获取树结构
			getTypeTreeInfo() {
				formtypeTree({ name: '', type: '' })
					.then(res => {
						if (res && res.status === 200) {
							this.typeData = res.data ? res.data : [];
							// this.loading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取树结构失败",
								type: 'error',
								duration: 2000
							});
							// this.loading = false;
						}
					});
			},
			// 隐藏下拉框
			closeIt1() {
				this.$refs.selectIt1.blur();
			},
			// 选择
			handleCheckChange(data, checked, indeterminate) {
				this.form.formTypeIds = checked.checkedKeys;
			},
			 // 表格
			typePareList() {
				listSimple({
					type: 0
				}).then(res => {
						if (res && res.status === 200) {
							this.typePareChilds = res.data ? res.data.map(item => { return {label: item.name,
						value: item.id}}) : [];
						} else {
							this.$notify({
								title: '失败',
								message: "获取动态表单列表失败",
								type: 'error',
								duration: 1000
							});
						}
					});

			},
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
						this.aboveM8 = response.data.aboveM8;
						this.highRiskPosition = response.data.highRiskPosition;
					});
			},

			aboveM8Change(event) {
			},

			// 初始化当前页面
			init() {
				this.visible = true
				this.getInfo();
				this.getTypeTreeInfo();
				this.typePareList();
				// this.currentTime();
				this.getTime();
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
										message: '操作成功',
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
											message: '操作成功',
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
										message: '操作失败',
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
					aboveM8: [],
					highRiskPosition: [],
					commitTime: undefined,
					note: undefined,
					taskTitle: undefined,
					formTypeIds: [],
					personalReportForm: false
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
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

	.box-form{
		/deep/ .el-select__tags span:first-child{
			margin-left: 160px;
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
</style>
