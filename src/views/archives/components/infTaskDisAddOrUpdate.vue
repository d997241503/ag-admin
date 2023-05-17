<template>
<el-dialog title="单位信息档案任务下发" :close-on-click-modal="false" top="9vh" :visible.sync="visible" @close="resetTemp">
	<div class="page-form">
		<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="130px"
		 label-position="left">
			<div>
				<span style="display: none;">{{form.issueOrg}}</span>
				<el-row>
					<el-col :span="20" :offset="2">
						<el-form-item label="下发子公司：" prop="issueOrg" class="box-form">
							<el-button @click="selectHandle()" type="text"
								class="but-css">
								批量选择子公司
								<span v-if="form.issueOrg.length <= 100">({{form.issueOrg.length}})</span>
								<span v-else>(100+)</span>
							</el-button>
							<el-select class="input-item elinput input-select" v-model="form.issueOrg" multiple @focus="closeIt" ref="selectIt" style="width:100%;"
							placeholder="">
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
			</div>
		</el-form>
		</div>
		<div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">取消</el-button>
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</div>

		<!-- 弹窗, 选择下发子公司 -->
		<fuhsi-tree-check v-if="fuhsiTreeCheckVisible" ref="fuhsiTreeCheck" :checkAll="true" @refreshData="initTreeData">
		</fuhsi-tree-check>
    </el-dialog>
</template>

<script>
	import {
		unitarchivesIssue,
		lastTimeInfo
    } from 'api/archives/index';
    import {
		getTree
	} from 'api/admin/department/index';
	import {
		mapGetters
	} from 'vuex';
	import fuhsiTreeCheck from '@/components/fuhsi-tree-check';
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
				treeData: [],
				form: {
					issueOrg: [],
					issueTime: undefined,
					commitTime: undefined
				},
				rules: {
					issueOrg: {
						required: true,
						message: '请选择下发子公司',
						trigger: 'change'
					},
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
				loading: false
			}
		},
		components: {
			fuhsiTreeCheck,
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

			goBack() {
				this.resetTemp();
				this.visible = false;
			},
            
            // 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							// this.form.issueOrg = res.data ? res.data.map(item => { return item.id}) : [];
                            if(res.data && res.data.length) this.form.issueOrg = this.getAllIds(res.data, this.form.issueOrg)
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

            getAllIds(tree, result) {
                //遍历树  获取id数组
                for (const i in tree) {
                    result.push(tree[i].id); // 遍历项目满足条件后的操作
                    if (tree[i].children) {
                        //存在子节点就递归
                        this.getAllIds(tree[i].children, result);
                    }
                }
                return result;
            },

			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			
			// 选择下发子公司
			selectHandle() {
				this.fuhsiTreeCheckVisible = true;
				this.$nextTick(() => {
					this.$refs.fuhsiTreeCheck.title = '下发子公司';
					this.$refs.fuhsiTreeCheck.init(this.form.issueOrg);
				})
			},

			// 获取下发子公司
			initTreeData(data) {
				this.form.issueOrg = data.nodes;
			},

			// 初始化当前页面
			init() {
				this.visible = true
				this.getObj();
				// this.getTreeInfo();
                // this.getTime();
            },

			getObj() {
				lastTimeInfo()
					.then((res) => {
						if (res && res.status === 200) {
							if(res.data.issueOrg && res.data.issueOrg.length) {
								this.form.issueOrg = res.data.issueOrg;
								this.getTime();
							} else {
								this.form = {
									issueOrg: [],
									issueTime: undefined,
									commitTime: undefined
								};
								this.getTreeInfo();
								this.getTime();
							}
						} else {
							this.form = {
								issueOrg: [],
								issueTime: undefined,
								commitTime: undefined
							};
							this.getTreeInfo();
                			this.getTime();
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 2000
						});
					})
			},

			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						unitarchivesIssue(this.form)
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
					issueOrg: [],
					issueTime: undefined,
					commitTime: undefined
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
