<template>
	<div class="app-container calendar-list-container nav-content">
		<div  ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getDataList()">
					<el-form-item>
						<el-input clearable placeholder="请输入主题查询" v-model="listQuery.inspectionTheme" maxlength="20">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-if="patrolInternal_btn_office" v-model="listQuery.id" clearable placeholder="请选择巡查小组">
							<el-option v-for="item in teamList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="patrolInternal_btn_team">
						<!-- <el-input v-model="listQuery.inspectionObjectName" placeholder="点击右侧按钮选择巡查对象" readonly>
							<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
								<el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }">
										<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
									</span>
								</el-tree>
								<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
							</el-popover>
						</el-input> -->
						<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
							<el-tree style="min-width: 350px;" ref="treeData" :props="defaultProps" :data="treeData"
								:default-expanded-keys="[index]" node-key="id" :expand-on-click-node="false" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }" @click="handlePartyBranch(data)">
										<span
											v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
										</span>
									</span>
								</el-tree>
							<el-select v-model="listQuery.inspectionObjectName" placeholder="请选择巡查对象" class="input-item" slot="reference" clearable @clear="deptClear"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
                        <el-button v-waves icon="search" type="primary" @click="handleReset">重置</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-if="patrolInternal_btn_office" class="filter-item" type="primary" v-waves icon="search" @click="addOrUpdateHandle()">新增巡查计划</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<el-button v-if="patrolInternal_btn_personnelPatrol" class="filter-item" type="primary" v-waves icon="search" @click="personnelPatrolHandle()">巡查人员库</el-button>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column width="300" align="center" label="巡查主题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.inspectionTheme}}</div>
					</template>
				</el-table-column>
				<el-table-column width="300" align="center" label="巡查对象">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.inspectionObjectName}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="巡查时间">
					<template slot-scope="scope">
						{{scope.row.inspectionStartDate}}至{{scope.row.inspectionEndDate}}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="巡查小组">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.inspectionTeamName}}</div>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<!-- <el-button v-if="patrolInternal_btn_detail" type="text" @click="handleDetail(scope.row.id, scope.row.step)">查看</el-button> -->
						<!-- <el-button v-if="patrolInternal_btn_edit" type="text" @click="addOrUpdateHandle(scope.row.id,scope.row.step,'edit')">编辑</el-button>
						<el-button v-if="scope.row.step == 1 && patrolInternal_btn_team" type="text" @click="addOrUpdateHandle(scope.row.id,2,'add')">添加资料</el-button>
						<el-button v-if="scope.row.step == 2 && patrolInternal_btn_team" type="text" @click="addOrUpdateHandle(scope.row.id,3,'add')">添加整改报告</el-button>
						<el-button v-if="scope.row.step == 3 && patrolInternal_btn_office" type="text" @click="addOrUpdateHandle(scope.row.id,4,'add')">添加巡查反馈</el-button>
						<el-button v-if="(scope.row.step == 4 || scope.row.step == 5) && patrolInternal_btn_object" type="text" @click="addOrUpdateHandle(scope.row.id,5,'add')">添加整改情况</el-button>
						<el-button v-if="scope.row.step == 5 && patrolInternal_btn_office" type="text" @click="addOrUpdateHandle(scope.row.id,6,'add')">添加整改评价</el-button>
						<el-button v-if="patrolInternal_btn_delete" type="text" @click="handleDelete(scope.row.id)">删除</el-button> -->

						<el-button v-if="patrolInternal_btn_detail" type="text" @click="handleDetail(scope.row.id, scope.row.step)">查看</el-button>
                        <el-divider direction="vertical"/>
                        <el-dropdown @command="fn => fn()" trigger="click">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="patrolInternal_btn_edit" type="text" :command="() => {addOrUpdateHandle(scope.row.id,scope.row.step,'edit')}">编辑</el-dropdown-item>
								<el-dropdown-item v-if="scope.row.step == 1 && patrolInternal_btn_team" type="text" :command="() => {addOrUpdateHandle(scope.row.id,2,'add')}">添加资料</el-dropdown-item>
								<el-dropdown-item v-if="scope.row.step == 2 && patrolInternal_btn_team" type="text" :command="() => {addOrUpdateHandle(scope.row.id,3,'add')}">添加整改报告</el-dropdown-item>
								<el-dropdown-item v-if="scope.row.step == 3 && patrolInternal_btn_office" type="text" :command="() => {addOrUpdateHandle(scope.row.id,4,'add')}">添加巡查反馈</el-dropdown-item>
								<el-dropdown-item v-if="(scope.row.step == 4 || scope.row.step == 5) && patrolInternal_btn_object" type="text" :command="() => {addOrUpdateHandle(scope.row.id,5,'add')}">添加整改情况</el-dropdown-item>
								<el-dropdown-item v-if="scope.row.step == 5 && patrolInternal_btn_office" type="text" :command="() => {addOrUpdateHandle(scope.row.id,6,'add')}">添加整改评价</el-dropdown-item>
								<el-dropdown-item v-if="patrolInternal_btn_delete" type="text" :command="() => {handleDelete(scope.row.id)}">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		pageTeam,
		page,
		delObj
	} from 'api/patrol/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		MessageBox
	} from 'element-ui';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	export default {
		name: "index",
		data() {
			return {
				list: null,
				total: null,
				loading: true,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					id: undefined,
					inspectionObjectId: undefined,
					inspectionObjectName: '',
					inspectionTheme: '',
					startDate: '',
					endDate: ''
				},
				teamList: [],
				treeVisible: false,
				popoverVisibel: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				times: [],
				// status: [{
				// 	label: "未开始",
				// 	value: "0"
				// }, {
				// 	label: "考试中",
				// 	value: "1"
				// }, {
				// 	label: "已结束",
				// 	value: "2"
				// }],
				patrolInternal_btn_office: false,
				patrolInternal_btn_team: false,
				patrolInternal_btn_object: false,
				patrolInternal_btn_add_planPatrol: false,
				patrolInternal_btn_add_processImp: false,
				patrolInternal_btn_add_reportRectification: false,
				patrolInternal_btn_add_feedbackPatrol: false,
				patrolInternal_btn_add_situationRectification: false,
				patrolInternal_btn_detail: false,
				patrolInternal_btn_delete: false,
				patrolInternal_btn_personnelPatrol: false,
				patrolInternal_btn_edit: false,
				patrolInternal_btn_add_assessment: false,
				tableKey: 0,
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
				examTypes: [],
				name: '',
				query: '',
				index: 0,
				tableHeight: undefined
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

		// 	// 筛选符合条件的参数
		// 	toTheme() {
		// 		// 闭包
		// 		return (val) => {
		// 			// 获取到对应的数组
		// 			let examType = this.examTypes.filter((item) => {
		// 				return (item.code.indexOf(val) >= 0)
		// 			})
		// 			return examType.length ? examType[0].value : ''
		// 		}
		// 	},

		// 	fomatType() {
		// 		// 闭包
		// 		return (val) => {
		// 			// 获取到对应的类型
		// 			let label = this.educationTypes.filter((item) => {
		// 				return (item.code.indexOf(val) >= 0)
		// 			});
		// 			return label.length ? label[0].value : '';
		// 		}
		// 	}
		},
		created() {
			this.getDataList();
			this.getTreeInfo();
			// 获取权限
			this.patrolInternal_btn_office = this.elements['patrolInternal:btn_office'];
			this.patrolInternal_btn_team = this.elements['patrolInternal:btn_team'];
			this.patrolInternal_btn_object = this.elements['patrolInternal:btn_object'];
			this.patrolInternal_btn_add_planPatrol = this.elements['patrolInternal:btn_add_planPatrol'];
			this.patrolInternal_btn_add_processImp = this.elements['patrollnternal:btn_add_processImp'];
			this.patrolInternal_btn_add_reportRectification = this.elements['patrollnternal:btn_add_reportRectification'];
			this.patrolInternal_btn_add_feedbackPatrol = this.elements['patrollnternal:btn_add_feedbackPatrol'];
			this.patrolInternal_btn_add_situationRectification = this.elements['patrollnternal:btn_add_situationRectification'];
			this.patrolInternal_btn_detail = this.elements['patrollnternal:btn_detail'];
			this.patrolInternal_btn_delete = this.elements['patrollnternal:btn_delete'];
			this.patrolInternal_btn_personnelPatrol = this.elements['patrollnternal:btn_personnelPatrol'];
			this.patrolInternal_btn_edit = this.elements['patrollnternal:btn_edit'];
			this.patrolInternal_btn_add_assessment = this.elements['patrolInternal:btn_add_assessment'];
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
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
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			
			deptClear(e) {
				this.listQuery.inspectionObjectId = undefined;
			},
			handlePartyBranch(data) {
				this.listQuery.inspectionObjectId = data.id;
				this.listQuery.inspectionObjectName = data.departmentFullName;
				this.popoverVisibel = false;
			},
			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							this.loading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
							this.loading = false;
						}
					});
			},
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				if(this.patrolInternal_btn_team) this.query = 'group-list';
				if(this.patrolInternal_btn_object) this.query = 'be-inspection-object-list';
				if(this.patrolInternal_btn_office) this.query = 'jw-list';
				page(this.listQuery,this.query)
					.then(response => {
						if (response && response.status === 200) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.tableLayout();
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			handleFilter() {
				this.listQuery.page = 1;
				this.getList();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
			// 表格有合并单元格和fixed的时候会错位，需要获取完数据重新布局
			tableLayout(option) {
				const {searchRefName = 'searchSection', tableRefName = 'table', subtractVal = 270} = option || {}
				const minHeight = 500
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal
				this.tableHeight = computedHeight > minHeight ? computedHeight : minHeight
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},

			// 详情
			handleDetail(id,step) {
				switch (step) {
					case 1:
						this.name = 'first'
						break;
					case 2:
						this.name = 'second'
						break;
					case 3:
						this.name = 'third'
						break;
					case 4:
						this.name = 'fourth'
						break;
					case 5:
						this.name = 'fifth'
						break;
					case 6:
						this.name = 'sixth'
						break;
					default:
						break;
				}
				this.$nextTick(() => {
					// 巡查计划详情
					// if(this.$store.state.user.isBackstage) {
					// 	this.$router.push({
					// 		path: '/backstage/newlyPatrolInternal',
					// 		query: {
					// 			operation: 'detail',
					// 			id: id,
					// 			name: this.name
					// 		}
					// 	});
					// } else {
						this.$router.push({
							path: '/newlyPatrolInternal',
							query: {
								operation: 'detail',
								id: id,
								name: this.name
							}
						});
					// }
				})
			},

			// 巡查人员库
			personnelPatrolHandle() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/personnelPatrolPatrolInternal',
				// 	})
				// } else {
					this.$router.push({
						path: '/personnelPatrolPatrolInternal',
					})
				// }
			},

			// 新增/修改
			addOrUpdateHandle(id,step,operation) {
				switch (step) {
					case 1:
						this.name = 'first'
						break;
					case 2:
						this.name = 'second'
						break;
					case 3:
						this.name = 'third'
						break;
					case 4:
						this.name = 'fourth'
						break;
					case 5:
						this.name = 'fifth'
						break;
					case 6:
						this.name = 'sixth'
						break;
					default:
						break;
				}
				this.$nextTick(() => {
					// if(this.$store.state.user.isBackstage) {
					// 	this.$router.push({
					// 		path: '/backstage/newlyPatrolInternal',
					// 		query: {
					// 			operation: operation,
					// 			id: id,
					// 			name: this.name
					// 		}
					// 	})
					// } else {
						this.$router.push({
							path: '/newlyPatrolInternal',
							query: {
								operation: operation,
								id: id,
								name: this.name
							}
						})
					// }
				})
			},

			// 删除
			handleDelete(id) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delObj(
								id
							)
							.then(res => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '删除成功',
										type: 'success',
										duration: 2000
									});
									this.getList();
								} else {
									this.$notify({
										title: '失败',
										message: '删除失败',
										type: 'error',
										duration: 2000
									});
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '删除失败',
									type: 'error',
									duration: 2000
								});
							});
					}).catch(() => {

					});
			},
            handleReset() {
                this.listQuery = {
					page: 1,
					limit: 10,
					id: undefined,
					inspectionObjectId: undefined,
					inspectionObjectName: '',
					inspectionTheme: '',
					startDate: '',
					endDate: ''
				}
                this.times = []
                this.getList()
            }
		}
	}
</script>

<style lang="scss" scoped>
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.tree-info {
		position: absolute;
	}

	.query {
		// margin-left: 10px;
	}
</style>
