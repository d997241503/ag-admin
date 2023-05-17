<template>
	<div class="app-container calendar-list-container nav-content">
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getDataList()">
					<el-form-item>
						<el-date-picker v-model="listQuery.issueYear" type="year" value-format='yyyy' placeholder="选择年">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-waves type="primary" @click="handleReset">重置</el-button>
					</el-form-item>
					<el-form-item v-if="responsibility_btn_issued && responsibility_btn_inspection">
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="addOrUpdateHandle()">下发责任清单</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<!-- <el-button class="filter-item" type="primary" v-waves icon="search" @click="responsibilityCategoryHandle()">两个责任类别管理</el-button> -->
			</div>
		</div>
		<!-- <div class="tree-info tree-roll-containers" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div> -->
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" v-if="responsibility_btn_inspection" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column width="300" align="center" label="责任清单主题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.issueTheme}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="下发时间">
					<template slot-scope="scope">
						{{scope.row.issueTime}}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="下发单位数量">
					<template slot-scope="scope">
						{{scope.row.issueOrgNum}}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="单位提报数量">
					<template slot-scope="scope">
						{{scope.row.reportOrgNum}}
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
					<template slot-scope="scope">
						<template v-if="responsibility_btn_detail">
							<el-button v-if="responsibility_btn_inspection" type="text" @click="handleDetailInspection(scope.row.id, 'detail')">查看</el-button>
							<!-- <el-button v-else type="text" @click="handleDetail(scope.row.id, scope.row.step)">查看</el-button> -->
						</template>
						<el-button v-if="responsibility_btn_edit" type="text" @click="addOrUpdateHandle(scope.row.id,scope.row.step,'edit')">编辑</el-button>
						<!-- <el-button v-if="scope.row.step == 1 && patrolInternal_btn_add_processImp" type="text" @click="addOrUpdateHandle(scope.row.id,2,'add')">添加资料</el-button>
						<el-button v-if="scope.row.step == 2 && patrolInternal_btn_add_reportRectification" type="text" @click="addOrUpdateHandle(scope.row.id,3,'add')">添加整改报告</el-button>
						<el-button v-if="scope.row.step == 3 && patrolInternal_btn_add_feedbackPatrol" type="text" @click="addOrUpdateHandle(scope.row.id,4,'add')">添加巡查反馈</el-button>
						<el-button v-if="(scope.row.step == 4 || scope.row.step == 5) && patrolInternal_btn_add_situationRectification" type="text" @click="addOrUpdateHandle(scope.row.id,5,'add')">添加整改情况</el-button>
						<el-button v-if="scope.row.step == 5 && patrolInternal_btn_add_assessment" type="text" @click="addOrUpdateHandle(scope.row.id,6,'add')">添加考核评价</el-button> -->
						<el-button v-if="responsibility_btn_delete" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-table v-else-if="responsibility_btn_user || responsibility_btn_chiefsecretary" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column min-width="300" align="center" label="责任清单主题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.issueTheme}}</div>
					</template>
				</el-table-column>
				<el-table-column min-width="150" header-align="center" align="center" label="下发时间">
					<template slot-scope="scope">
						{{scope.row.issueTime}}
					</template>
				</el-table-column>
				<el-table-column v-if="responsibility_btn_chiefsecretary" min-width="150" header-align="center" align="center" label="填报时间">
					<template slot-scope="scope">
						{{scope.row.commitTime}}
					</template>
				</el-table-column>
				<el-table-column v-if="responsibility_btn_chiefsecretary" min-width="150" header-align="center" align="center" label="填报人">
					<template slot-scope="scope">
						{{scope.row.commitUserName}}
					</template>
				</el-table-column>
				<el-table-column v-if="responsibility_btn_chiefsecretary" min-width="150" header-align="center" align="center" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.approverStatus == '0'">未提交</span>
						<span v-if="scope.row.approverStatus == '1'">未通过</span>
						<span v-if="scope.row.approverStatus == '2'">进行中</span>
						<span v-if="scope.row.approverStatus == '3'">已通过</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
					<template slot-scope="scope">
						<el-button v-if="responsibility_btn_detail" type="text" size="small" @click="handleDetail(scope.row.id, scope.row.step)">查看
						</el-button>
						<!-- <el-button v-if="responsibility_btn_detail" type="text" @click="handleDetailInspection(scope.row.id, 'detail')">查看
						</el-button> -->
						<el-button v-if="responsibility_btn_user && (scope.row.approverStatus == '0' || scope.row.approverStatus == '1' || !scope.row.approverStatus)" type="text" @click="putHandle(scope.row.id,'edit')">提报</el-button>
						<el-button v-if="responsibility_btn_chiefsecretary && scope.row.approverStatus == '2' && (scope.row.currentApproverUserId == userId || (!scope.row.currentApproverUserId && scope.row.isHeadLeader))" type="text" @click="examineHandle(scope.row.id,'detail')">审核</el-button>
						<el-button v-if="responsibility_btn_delete" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
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
		<!-- 弹窗, 下发责任清单 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
	</div>
</template>

<script>
	import AddOrUpdate from './components/addOrEdit';
	import {
		// pageTeam,
		inspectionListPage,
		userListPage,
		delIssueliabilityObj
	} from 'api/responsibility/index';
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
	import tree from "./components/tree";
	export default {
		name: "index",
		data() {
			return {
				addOrUpdateVisible: false,
				list: null,
				total: null,
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 10,
					issueYear: '',
					startDate: '',
					endDate: ''
				},
				teamList: [],
				treeVisible: false,
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
				responsibility_btn_inspection: false,
				responsibility_btn_user: false,
				responsibility_btn_chiefsecretary: false,
				responsibility_btn_issued: false,
				responsibility_btn_edit: false,
				responsibility_btn_detail: false,
				responsibility_btn_delete: false,
				responsibility_btn_put: false,
				responsibility_btn_toexamine: false,
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
				tableHeight: undefined
			}
		},
		components: {
			tree,
			AddOrUpdate
		},

		computed: {
			...mapGetters([
				'elements','userId'
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
			this.responsibility_btn_inspection = this.elements['responsibility:btn_inspection'];
			this.responsibility_btn_user = this.elements['responsibility:btn_user'];
			this.responsibility_btn_chiefsecretary = this.elements['responsibility:btn_chiefsecretary'];
			this.responsibility_btn_issued = this.elements['responsibility:btn_issued'];
			this.responsibility_btn_edit = this.elements['responsibility:btn_edit'];
			this.responsibility_btn_detail = this.elements['responsibility:btn_detail'];
			this.responsibility_btn_delete = this.elements['responsibility:btn_delete'];
			// this.responsibility_btn_put = this.elements['responsibility:btn_put'];
			this.responsibility_btn_toexamine = this.elements['responsibility:btn_toexamine'];
			// this.responsibility_btn_inspection = false;
			// this.responsibility_btn_user = false;
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
			// // 点击部门刷新列表数据
			// treeHandle(val) {
			// 	this.listQuery.deptId = val.id;
			// 	this.getList();
			// },
			// 获取巡查小组数据列表
			getDataList() {
				// this.teamList = [];
				// pageTeam({
				// 	'page': 1,
				// 	'limit': 100
				// }).then(data => {
				// 	if (data && data.status === 200) {
				// 		for(let i = 0; i < data.data.rows.length; i++) {
				// 			this.teamList.push({label: data.data.rows[i].teamName, value: data.data.rows[i].id})
				// 		}
				// 	} else {
				// 		this.teamList = [];
				// 		this.$notify.error(data.msg)
				// 	}
				// }).catch(() => {
				// 	this.teamList = [];
				// 	this.$notify.error("获取数据列表失败")
				// })
			},
			handlePartyBranch(data) {
				this.listQuery.inspectionObjectId = data.id;
				this.listQuery.inspectionObjectName = data.departmentFullName;
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
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				// if(this.patrolInternal_btn_team) this.query = 'group-list';
				// if(this.patrolInternal_btn_object) this.query = 'be-inspection-object-list';
				// if(this.patrolInternal_btn_office) this.query = 'jw-list';
				if(this.responsibility_btn_inspection) {
					inspectionListPage(this.listQuery)
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
				} else if(this.responsibility_btn_user || this.responsibility_btn_chiefsecretary) {
					userListPage(this.listQuery)
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
				}
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

			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					issueYear: '',
					startDate: '',
					endDate: ''
				};
				this.times = [];
				this.getList();
			},

			// 纪检 - 查看详情
			handleDetailInspection(id,operation) {
				this.$router.push({
					path: '/responsibilityDel',
					query: {
						id: id,
						operation: operation
					}
				});
			},

			// 详情
			handleDetail(id,step) {
				this.$nextTick(() => {
					// if(this.$store.state.user.isBackstage) {
					// 	this.$router.push({
					// 		path: '/backstage/putRes',
					// 		query: {
					// 			operation: 'see',
					// 			id: id,
					// 			name: this.name
					// 		}
					// 	});
					// } else {
						this.$router.push({
							path: '/putDel',
							query: {
								operation: 'see',
								id: id,
								name: this.name
							}
						});
					// }
				})
			},

			// 去提报
			putHandle(id,operation) {
				this.$nextTick(() => {
					// if(this.$store.state.user.isBackstage) {
					// 	this.$router.push({
					// 		path: '/backstage/putRes',
					// 		query: {
					// 			operation: operation,
					// 			id: id,
					// 			name: this.name
					// 		}
					// 	});
					// } else {
						this.$router.push({
							path: '/putResHand',
							query: {
								operation: operation,
								id: id,
								name: this.name
							}
						});
					// }
				})
			},

			// 审核
			examineHandle(id,operation) {
				this.$nextTick(() => {
					this.$router.push({
						path: '/putResExamine',
						query: {
							operation: operation,
							id: id,
							name: this.name
						}
					});
				})
			},

			// // 巡查人员库
			// personnelPatrolHandle() {
			// 	if(this.$store.state.user.isBackstage) {
			// 		this.$router.push({
			// 			path: '/backstage/personnelPatrolPatrolInternal',
			// 		})
			// 	} else {
			// 		this.$router.push({
			// 			path: '/personnelPatrolPatrolInternal',
			// 		})
			// 	}
			// },

			// 会议类型管理
			responsibilityCategoryHandle() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/categoryRes',
				// 	})
				// } else {
					this.$router.push({
						path: '/categoryRes',
					})
				// }
			},

			// 新增/修改
			addOrUpdateHandle(id,step,operation) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(id);
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
						delIssueliabilityObj(
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
</style>
