<template>
<el-dialog title="固化任务设置" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
	<div class="page-form">
		<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="130px"
		 label-position="left">
			<div>
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
								<span v-if="form.formNum">({{form.formNum ? form.formNum : 0}})</span>
								<span v-else>({{form.formTypeIds.length ? form.formTypeIds.length : 0}})</span>
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
				<span style="display: none;">{{form.issueOrg}}</span>
				<el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="下发子公司：" prop="deptName" class="box-form">
							<el-button @click="selectHandle()" type="text"
								class="but-css">
								批量选择子公司
								<span v-if="form.issueOrg.length <= 100">({{form.issueOrg.length}})</span>
								<span v-else>(100+)</span>
							</el-button>
							<el-select class="input-item elinput" v-model="form.deptName" clearable multiple @focus="closeIt" ref="selectIt" style="width:100%;"
							placeholder="" @clear="clear" @remove-tag="removeTag">
							</el-select>
                        </el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="下发时间：" prop="issueTime">
							<el-date-picker style="width: 100%;" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="form.issueTime"
								align="right" type="date" placeholder="请选择下发时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
                    <!-- <el-col :span="4" :offset="1">
							<el-checkbox v-model="form.issueEveryYear" :label="true">每年</el-checkbox>
					</el-col> -->
				</el-row>
                <el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="提报时间：" prop="commitTime">
							<el-date-picker style="width: 100%;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" v-model="form.commitTime"
								align="right" type="datetime" placeholder="请选择表格提报时间">
							</el-date-picker>
						</el-form-item>
					</el-col>
                    <!-- <el-col :span="4" :offset="1"> -->
							<!-- <el-checkbox v-model="form.commitEveryYear" :label="true">每年</el-checkbox> -->
					<!-- </el-col> -->
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
		</div>
		<div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">取消</el-button>
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</div>

		<!-- 弹窗, 选择表 -->
		<table-tree-check v-if="tableTreeCheckVisible" ref="tableTreeCheck" @refreshData="tableInitTreeData">
		</table-tree-check>

		<!-- 弹窗, 选择下发子公司 -->
		<fuhsi-tree-check v-if="fuhsiTreeCheckVisible" ref="fuhsiTreeCheck" @refreshData="initTreeData">
		</fuhsi-tree-check>
    </el-dialog>
</template>

<script>
	import {
		listSimple,
		fixtaskconfigInfo,
		updateFixtaskconfig
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
	import fuhsiTreeCheck from '@/components/fuhsi-tree-check';
	import tableTreeCheck from '@/components/table-tree-check';
	export default {
		name: 'honestReport',
		data() {
			return {
				pickerOptionsStart: {
					// 时间不能大于当前时间
					disabledDate: (time) => {
						// if(!this.form.commitEveryYear) return time.getTime() > Date.now();
						return time.getTime() > Date.now()
					}
				},
				visible: false,
				fuhsiTreeCheckVisible: false,
				tableTreeCheckVisible: false,
                treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				flag: false,
				form: {
					commitEveryYear: false,
					commitTime: undefined,
					formTypeIds: [],
					formNames: [],
					issueEveryYear: false,
					deptName: [],
					issueOrg: [],
					issueTime: undefined,
					note: undefined,
					personalReportForm: false
				},
				rules: {
					formTypeIds: {
						required: true,
						message: '请选择表格',
						trigger: 'change'
					},
					// deptName: {
					// 	required: true,
					// 	message: '请选择下发子公司',
					// 	trigger: 'change'
					// },
					issueTime: {
						required: true,
						message: '请选择下发时间',
						trigger: 'change'
					},
					commitTime: {
						required: true,
						message: '请选择提报时间',
						trigger: 'change'
					}
				},
				loading: false,
				userVisible: false,
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
				typePareChilds: [],
				resultList: [],
				typeData: [],
				popoverVisibel: false,
				defaultPropsType: {
					children: 'children',
					label: 'name'
				},
			}
		},
		components: {
			fuhsiTreeCheck,
			tableTreeCheck
		},
		watch: {
			'form.issueOrg': {
				handler(newV, oldV) {
					this.form.issueOrg = newV;
				},
				immediate: true
			}
		},
		created() {
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
				_this.form.issueTime = yy + '-' + mm + '-' + dd;
				let mmAft = new Date().getMonth() + 2 > 12 ? '01' : '0' + (new Date().getMonth() + 2);
				_this.form.commitTime = yy + '-' + mmAft + '-' + dd + ' ' + hh + ':' + mf;
				},
			currentTime() {
				setInterval(this.getTime, 1000);
			},
			// 获取树结构
			getTypeTreeInfo() {
				// formtypeTree({ name: '', type: '' })
				// 	.then(res => {
				// 		if (res && res.status === 200) {
				// 			this.typeData = res.data ? res.data : [];
				// 			this.loading = false;
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: "获取树结构失败",
				// 				type: 'error',
				// 				duration: 2000
				// 			});
				// 			this.loading = false;
				// 		}
				// 	});
			},
			// 隐藏下拉框
			closeIt1() {
				this.$refs.selectIt1.blur();
			},
			// 选择
			handleCheckChange(data, checked, indeterminate) {
				this.form.formNum = '';
				this.form.formTypeIds = checked.checkedKeys;
			},

			goBack() {
				this.resetTemp();
				this.visible = false;
			},
			
			// 获取详情
			getInfo() {
				fixtaskconfigInfo().then(response => {
					if(response.data) {
						this.form = response.data;
						this.form.issueTime = '';
						this.form.commitTime = '';
						this.getTime();
						if(!this.form.commitTime) this.getTime();
						// this.form.formNames = null;
						if(response.data.formTypeIds && response.data.formTypeIds.length) {
							// this.form.formTypeIds = this.form.formTypeIds
							this.$nextTick(() => {
								this.form.formTypeIds.forEach(item => {
									var node = this.$refs.tree.getNode(item);
									if(node.isLeaf){
										this.$refs.tree.setChecked(node, true);
									}
								});
							})
						} else {
							this.form.formTypeIds = [];
							this.form.formNames = [];
						}
						// this.form.deptName = this.form.issueOrg
					}
						// this.dataForm.highRiskPosition = response.data.highRiskPosition;
						// if(response.data.aboveM6.length) this.dataForm.aboveM6Name = response.data.aboveM6.map(item => { return item.name });
						// if(response.data.highRiskPosition.length) this.dataForm.highRiskPositionName = response.data.highRiskPosition.map(item => { return item.name });
					});
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

			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},

			closeIttable() {
				this.$refs.selectIttable.blur();
			},

			clear() {
				this.form.issueOrg = [];
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
				// this.form.deptName = data.checkedNodes.map(item => { return item.departmentFullName });
				this.form.formNum = '';
				this.form.formTypeIds = data.nodes;
			},
			
			// 选择下发子公司
			selectHandle() {
				// let selectedData = this.getSelectedNum(roleId, type);
				// let treeType = '0';
				// let title = "选择管辖行政部门";
				// if (type === 'partyResources') {
				// 	treeType = '1';
				// 	title = "选择管辖党组织";
				// }
				this.fuhsiTreeCheckVisible = true;
				this.$nextTick(() => {
					this.$refs.fuhsiTreeCheck.title = '下发子公司';
					// this.$refs.fuhsiTreeCheck.type = treeType;
					this.$refs.fuhsiTreeCheck.init(this.form.issueOrg);
				})
			},

			// 获取下发子公司
			initTreeData(data) {
				// this.form.deptName = data.checkedNodes.map(item => { return item.departmentFullName });
				this.form.issueOrg = data.nodes;
			},

			removeTag(val){
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

			// // 个人有关事项报告表
			// mattersTypePareList() {
			// 	listSimple({
			// 		type: 0
			// 	}).then(res => {
			// 			if (res && res.status === 200) {
			// 			// 	this.typePareChilds = res.data ? res.data.map(item => { return {label: item.name,
			// 			// value: item.id}}) : [];
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取动态表单列表失败",
			// 					type: 'error',
			// 					duration: 1000
			// 				});
			// 			}
			// 		});

			// },

			// 初始化当前页面
			init() {
				this.visible = true
				this.getTreeInfo();
				this.getTypeTreeInfo();
				this.typePareList();
				// this.getInfo();
				this.$nextTick(() => {
					this.$refs['form'].clearValidate();
					this.getInfo();
                    // this.resetTemp();
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
						updateFixtaskconfig(this.form)
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

			// 重置数据
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					commitEveryYear: false,
					commitTime: undefined,
					formTypeIds: [],
					formNames: [],
					issueEveryYear: false,
					deptName: [],
					issueOrg: [],
					issueTime: undefined,
					note: undefined,
					personalReportForm: false
				};
				this.resultList = [];
			}
		}
	}
</script>

<style lang="scss" scoped>

	.page-form {
		max-height: 600px;
		overflow-x: auto;
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

	.setstyle {
		min-height: 200px;
		padding: 0 !important;
		margin: 0;
		overflow: auto;
		cursor: default !important;
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
	.elinput{
		/deep/ .el-input__inner{
			text-indent: 100px;
		}
		/deep/ .el-icon-arrow-up:before {
			content: '';
		}
		/deep/ .el-select__input{
			text-indent: 100px;
		}
		/deep/ .el-select__tags {
			span:first-child{
				margin-top: 0px;
			}
		}
		/deep/ .el-tag.el-tag--info .el-tag__close {
			display: none;
		}
	}
	.input-item {
		width: 90%;
		
		li {
		    line-height: normal;
		    padding: 7px;
		
		    .name {
		      text-overflow: ellipsis;
		      overflow: hidden;
		    }
		    .addr {
		      font-size: 12px;
		      color: #b4b4b4;
			  
		    }
		
		    .highlighted .addr {
		      color: #ddd;
			 
		    }
		  }
	}
	.custom-tree-node {
		position: relative;
	}
	// .disabled {
	// 	cursor: not-allowed;
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	right: 0;
	// 	bottom: 0;
	// 	z-index: 1;
	// 	opacity: 0.7;
	// }
	.input-select {
		>>> .el-select__tags {
			display: none !important;
		}
	}
</style>
