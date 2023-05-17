<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="search-info page-info">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
					<el-form-item>
						<el-input @keyup.enter.native="handleFilter" style="width: 200px;" clearable class="filter-item" placeholder="请输入标题查询"
						v-model="listQuery.taskTitle">
						</el-input>
					</el-form-item>
					<el-form-item v-if="integrityArchives_btn_inspection">
						<el-select v-model="listQuery.violationCategory" class="filter-item" placeholder="请选择分类" @change="classificationTaskHandle"
						clearable style="width: 200px;">
							<el-option v-for="item in classificationTask" :key="item.code" :label="item.value" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
							unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" style="margin-left: 10px;">查询</el-button>
					<el-button v-if="integrityArchives_btn_inspection && integrityArchives_btn_solidification" class="filter-item" style="margin-left: 10px;" @click="solidificationHandle"
					type="primary" icon="edit">固化任务设置</el-button>
					<el-button v-if="integrityArchives_btn_inspection && integrityArchives_btn_temporary" class="filter-item" style="margin-left: 10px;" @click="temporaryHandle"
					type="primary" icon="edit">新增临时任务</el-button>
					<!-- <el-button class="filter-item" style="margin-left: 10px;" @click="solidificationPutHandle('add')"
					type="primary" icon="edit">固化任务提报</el-button>
					<el-button class="filter-item" style="margin-left: 10px;" @click="temporaryPutHandle"
					type="primary" icon="edit">临时任务提报</el-button> -->
				</el-form>
			</div>
			<div v-if="integrityArchives_btn_inspection && integrityArchives_btn_personnelpool">
				<el-button class="filter-item" type="primary" v-waves icon="search" @click="personnelHandle()">人员库管理</el-button>
			</div>
		</div>
		<!-- 纪检 -->
		<div v-if="integrityArchives_btn_inspection" class="tree-info tree-roll-containers" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div>
		<!-- M6+高风险岗位/纪检 -->
		<div v-if="integrityArchives_btn_inspection || integrityArchives_btn_m6high" class="page-info" ref="pageInfo" :style="integrityArchives_btn_inspection?'margin-left:310px' : 'margin-left:0px'">
			<el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<!-- <el-table-column align="center" type="index" label="序号" width="65">
				</el-table-column> -->
				<el-table-column min-width="360" align="center" label="标题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.taskTitle}}</div>
					</template>
				</el-table-column>
				<el-table-column min-width="130" align="center" label="姓名">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="!integrityArchives_btn_inspection" min-width="120" align="center" label="提报时间">
					<template slot-scope="scope">
						<span>{{scope.row.commitTime}}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="!integrityArchives_btn_inspection" min-width="120" align="center" label="提交时间">
					<template slot-scope="scope">
						<span>{{scope.row.actualCommitTime}}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="integrityArchives_btn_inspection" min-width="360" align="center" label="子公司">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.orgName}}</div>
					</template>
				</el-table-column>
				<el-table-column min-width="180" align="center" label="所属分类">
					<template slot-scope="scope">
						<span>{{classificationTaskType(scope.row.type)}}</span>
					</template>
				</el-table-column>
				<el-table-column v-if="integrityArchives_btn_inspection" min-width="120" align="center" label="提报时间">
					<template slot-scope="scope">
						<span>{{scope.row.actualCommitTime}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" min-width="300"> <template slot-scope="scope">
						<el-button v-if="integrityArchives_btn_detail" size="small" type="text" @click="solidificationPutHandle('detail',scope.row)">查看
						</el-button>
						<el-button v-if="integrityArchives_btn_edit" size="small" type="text" @click="solidificationPutHandle('add',scope.row)">编辑
						</el-button>
						<el-button v-if="integrityArchives_btn_delete" size="small" type="text" @click="handleDelete(scope.row)">删除
						</el-button>
						<el-button v-if="integrityArchives_btn_m6high && integrityArchives_btn_putforward" size="small" type="text" @click="solidificationPutHandle('add',scope.row)">去提报
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div v-if="integrityArchives_btn_inspection || integrityArchives_btn_m6high" class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				:page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>
		<!-- 部门一把手 -->
		<div v-else>
			<!-- <div v-if="integrityArchives_btn_first" class="tree-info tree-roll-containers" ref="tree-info">
				<tree @refreshData="treeHandle" ref="tree"></tree>
			</div> -->
			<!-- <div v-if="integrityArchives_btn_first" class="page-info" ref="pageInfo" style="margin-left:310px"> -->
				<el-row :gutter="10">
					<el-col :span="13">
						<!-- 左 -->
						<div class="page-info" ref="pageInfo">
							<el-row :gutter="10">
								<el-col :span="6">
									<div class="tree-info-first tree-roll-containers-first" ref="tree-info">
										<treeFirst @refreshData="treeHandle" ref="tree"></treeFirst>
									</div>
								</el-col>
								<el-col :span="18">
									<el-table :key='tableKey' :data="headLeaderList" v-loading="listLoading" border fit highlight-current-row style="width: 100%;max-height: 480px;min-height: 480px;">
										<el-table-column width="175" align="center" label="标题">
											<template slot-scope="scope">
												<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.taskTitle}}</div>
											</template>
										</el-table-column>
										<el-table-column width="80px" align="center" label="姓名">
											<template slot-scope="scope">
												<span>{{scope.row.name}}</span>
											</template>
										</el-table-column>
										<el-table-column width="80px" align="center" label="所属分类">
											<template slot-scope="scope">
												<span>{{classificationTaskType(scope.row.type)}}</span>
											</template>
										</el-table-column>
										<el-table-column width="100px" align="center" label="提报时间">
											<template slot-scope="scope">
												<span>{{scope.row.actualCommitTime}}</span>
											</template>
										</el-table-column>
										<el-table-column width="100px" align="center" label="当前状态">
											<template slot-scope="scope">
												<span v-if="scope.row.status == '0'">审批通过</span>
												<span v-if="scope.row.status == '1'">待审批</span>
												<span v-if="scope.row.status == '2'">未提交</span>
												<span v-if="scope.row.status == '3'">审批未通过</span>
											</template>
										</el-table-column>
										<el-table-column fixed="right" align="center" label="操作" width="160px"> <template slot-scope="scope">
												<el-button v-if="integrityArchives_btn_detail" size="small" type="text" @click="solidificationPutHandle('detail',scope.row)">查看
												</el-button>
												<el-button v-if="(scope.row.status == '1' || scope.row.status == '3') && integrityArchives_btn_examine" size="small" type="text" @click="solidificationPutHandle('detail',scope.row)">去审核
												</el-button>
											</template>
										</el-table-column>
									</el-table>
								</el-col>
							</el-row>
							<div class="pagination-container">
								<el-pagination @size-change="headLeaderHandleSizeChange" @current-change="headLeaderHandleCurrentChange" :current-page.sync="page"
									:page-sizes="[10,20,30,50]" :page-size="limit" align="right" layout="total, sizes, prev, pager, next, jumper"
									:total="headLeaderTotal">
								</el-pagination>
							</div>
						</div>
					</el-col>
					<el-col :span="11">
						<!-- 右 -->
						<div class="page-info" ref="pageInfo">
							<el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;max-height: 480px;min-height: 480px;">
								<el-table-column width="150" align="center" label="标题">
									<template slot-scope="scope">
										<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.taskTitle}}</div>
									</template>
								</el-table-column>
								<el-table-column width="80px" align="center" label="姓名">
									<template slot-scope="scope">
										<span>{{scope.row.name}}</span>
									</template>
								</el-table-column>
								<el-table-column width="100px" align="center" label="提报时间">
									<template slot-scope="scope">
										<span>{{scope.row.commitTime}}</span>
									</template>
								</el-table-column>
								<el-table-column width="100px" align="center" label="提交时间">
									<template slot-scope="scope">
										<span>{{scope.row.actualCommitTime}}</span>
									</template>
								</el-table-column>
								<el-table-column width="80px" align="center" label="所属分类">
									<template slot-scope="scope">
										<span>{{classificationTaskType(scope.row.type)}}</span>
									</template>
								</el-table-column>
								<el-table-column fixed="right" align="center" label="操作" width="300px"> <template slot-scope="scope">
										<el-button v-if="integrityArchives_btn_detail" size="small" type="text" @click="solidificationPutHandle('detail',scope.row)">查看
										</el-button>
										<el-button v-if="integrityArchives_btn_edit" size="small" type="text" @click="solidificationPutHandle('add',scope.row)">编辑
										</el-button>
										<el-button v-if="integrityArchives_btn_delete" size="small" type="text" @click="handleDelete(scope.row)">删除
										</el-button>
										<el-button v-if="scope.row.status !== '0' && integrityArchives_btn_putforward" size="small" type="text" @click="solidificationPutHandle('add',scope.row,'first')">去提报
										</el-button>
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
					</el-col>
				</el-row>
			<!-- </div> -->
		</div>
		<!-- 弹窗, 固化任务设置 -->
		<SolidificationAddOrUpdate v-if="solidificationAddOrUpdateVisible" ref="solidificationAddOrUpdate" @refreshDataList="getList"></SolidificationAddOrUpdate>
		<!-- 弹窗, 新增临时任务 -->
		<TemporaryAddOrUpdate v-if="temporaryAddOrUpdateVisible" ref="temporaryAddOrUpdate" @refreshDataList="getList"></TemporaryAddOrUpdate>
		<!-- 弹窗, 人员库管理 -->
		<PersonnelAddOrUpdate v-if="personnelAddOrUpdateVisible" ref="personnelAddOrUpdate"></PersonnelAddOrUpdate>
	</div>
</template>

<script>
	import SolidificationAddOrUpdate from './components/solidificationAddOrUpdate';
	import TemporaryAddOrUpdate from './components/temporaryAddOrUpdate';
	import PersonnelAddOrUpdate from './components/personnelAddOrUpdate';
	import {
		headLeaderPage,
		individualTaskPage,
		jwPage,
		delIndividualtaskObj
	} from 'api/archives/index';
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
	import treeFirst from "./components/treeFirst";
	export default {
		name: "index",
		components: {
			tree,
			treeFirst,
			PersonnelAddOrUpdate,
			SolidificationAddOrUpdate,
			TemporaryAddOrUpdate
		},
		data() {
			return {
				personnelAddOrUpdateVisible: false,
				solidificationAddOrUpdateVisible: false,
				temporaryAddOrUpdateVisible: false,
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					endDate: '',
					startDate: '',
					taskTitle: '',
					deptId: undefined,
					userId: undefined
				},
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
				integrityArchives_btn_first: false,
				integrityArchives_btn_m6high: false,
				integrityArchives_btn_inspection: false,
				integrityArchives_btn_detail: false,
				integrityArchives_btn_edit: false,
				integrityArchives_btn_delete: false,
				integrityArchives_btn_putforward: false,
				integrityArchives_btn_examine: false,
				integrityArchives_btn_solidification: false,
				integrityArchives_btn_temporary: false,
				integrityArchives_btn_personnelpool: false,
				tableKey: 0,
				classificationTask: [], // 分类
				headLeaderList: null,
				headLeaderTotal: null,
				page: 1,
				limit: 10
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			classificationTaskType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.classificationTask.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			}
		},
		created() {
			// 获取个人档案分类
			this.getDataDicts("classificationTask").then((res) => {
				this.classificationTask = res;
			});

			// 获取权限
			this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];	
			this.integrityArchives_btn_m6high = this.elements['integrityArchives:btn_m6high'];
			this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection'];
			// this.integrityArchives_btn_first = false;	
			// this.integrityArchives_btn_m6high = false;
			// this.integrityArchives_btn_inspection = true;
			this.integrityArchives_btn_detail = this.elements['integrityArchives:btn_detail'];	
			// this.integrityArchives_btn_edit = this.elements['integrityArchives:btn_edit'];
			this.integrityArchives_btn_delete = this.elements['integrityArchives:btn_delete'];
			this.integrityArchives_btn_putforward = this.elements['integrityArchives:btn_putforward'];	
			this.integrityArchives_btn_examine = this.elements['integrityArchives:btn_examine'];
			this.integrityArchives_btn_solidification = this.elements['integrityArchives:btn_solidification'];
			this.integrityArchives_btn_temporary = this.elements['integrityArchives:btn_temporary'];	
			this.integrityArchives_btn_personnelpool = this.elements['integrityArchives:btn_personnelpool'];
			
			this.$nextTick(() => {
				// 获取列表
				this.getList();
			})
		},
		methods: {
			// 固化任务设置
			solidificationHandle() {
				this.solidificationAddOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.solidificationAddOrUpdate.init();
				})
			},
			// 新增临时任务
			temporaryHandle() {
				this.temporaryAddOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.temporaryAddOrUpdate.init();
				})
			},
			// 人员库管理
			personnelHandle() {
				this.personnelAddOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.personnelAddOrUpdate.init();
				})
			},
			// 固化任务提报
			solidificationPutHandle(path, row, first) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/solidificationPut/add',
				// 		query: {
				// 			id: row ? row.id : undefined,
				// 			// templateId: row ? row.templateId : undefined
				// 			operation: path,
				// 			status: row.status ? row.status : undefined,
				// 			first: first
				// 		}
				// 	})
				// } else {
					this.$router.push({
						path: '/solidificationPut/add',
						query: {
							id: row ? row.id : undefined,
							// templateId: row ? row.templateId : undefined
							operation: path,
							status: row.status ? row.status : undefined,
							first: first
						}
					})
				// }
			},
			// // 临时任务提报
			// temporaryPutHandle() {
			// 	this.$router.push({
			// 		path: '/temporaryPut'
			// 	});
			// },
			// 监听个人档案分类
			classificationTaskHandle(val) {
				if (val) {
					let ary = this.classificationTask.filter((item) => {
						return (item.code.indexOf(val) >= 0);
					});
					this.listQuery.violationType = ary.length ? ary[0].description : '';
					this.listQuery.violationCategory = val;
				} else {
					this.listQuery.violationType = undefined;
					this.listQuery.violationCategory = undefined;
				}
			},

			// 点击部门刷新列表数据
			treeHandle(val) {
				if(!val.isPersonnel) this.listQuery.deptId = val.id;
				if(val.isPersonnel) {
					this.listQuery.deptId = undefined;
					 this.listQuery.userId = val.id;
				}
				this.getList(val.isPersonnel);
			},

			// 获取数据列表
			getList(type) {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				if(this.integrityArchives_btn_inspection) {
					jwPage(this.listQuery)
						.then(response => {
							if (response && response.status === 200) {
								this.list = response.data.rows;
								this.total = parseInt(response.data.total);
							} else {
								this.total = 0;
							}
							this.listLoading = false;
						}).catch(() => {
							this.listLoading = false;
						})
				} else if(this.integrityArchives_btn_m6high) {
					individualTaskPage(this.listQuery)
						.then(response => {
							if (response && response.status === 200) {
								this.list = response.data.rows;
								this.total = parseInt(response.data.total);
							} else {
								this.total = 0;
							}
							this.listLoading = false;
						}).catch(() => {
							this.listLoading = false;
						})
				} else if(this.integrityArchives_btn_first) {
					headLeaderPage({
						page: this.page,
						limit: this.limit,
						endDate: this.listQuery.endDate,
						startDate: this.listQuery.startDate,
						taskTitle: this.listQuery.taskTitle,
						deptId: this.listQuery.deptId,
						userId: this.listQuery.userId
					}).then(response => {
							if (response && response.status === 200) {
								this.headLeaderList = response.data.rows;
								this.headLeaderTotal = parseInt(response.data.total);
							} else {
								this.headLeaderTotal = 0;
							}
							this.listLoading = false;
						}).catch(() => {
							this.listLoading = false;
						})
					if(!type) {
						individualTaskPage(this.listQuery)
							.then(response => {
								if (response && response.status === 200) {
									this.list = response.data.rows;
									this.total = parseInt(response.data.total);
								} else {
									this.total = 0;
								}
								this.listLoading = false;
							}).catch(() => {
								this.listLoading = false;
							})
					}
					
				}
			},

			// 获取字典
			getDataDicts(type) {
				if (!type) return;
				let val = null;
				val = getByType({
						type: type
					})
					.then(res => {
						if (res && res.code === 0) {
							return res.data;
						} else {
							this.$notify({
								title: '失败',
								message: '获取数据字典失败',
								type: 'success',
								duration: 2000
							});
						}
					});
				return Promise.resolve(val);
			},

			handleFilter() {
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
			headLeaderHandleSizeChange(val) {
				this.limit = val;
				this.getList();
			},
			headLeaderHandleCurrentChange(val) {
				this.page = val;
				this.getList();
			},

			// // 新增
			// handleCreate() {
			// 	this.$router.push({
			// 		path: '/newlyHonestReport'
			// 	});
			// },

			// 修改
			handleUpdate(row) {
				this.$router.push({
					path: '/editHonestReport',
					query: {
						id: row.reportInfoId
					}
				});
			},

			// // 详情
			// handleDetail(row) {
			// 	this.$router.push({
			// 		path: '/solidificationPut/detail',
			// 		query: {
			// 			id: row.id,
			// 			templateId: row.templateId
			// 		}
			// 	})
			// },

			// 删除
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delIndividualtaskObj(row.id)
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
	
	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.tree-info-first {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 10px;
		background-color: #FFFFFF;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;

		/* 滚动条的宽度 */
		/deep/ .el-table__body-wrapper::-webkit-scrollbar {
			width: 6px; // 横向滚动条
			height: 6px; // 纵向滚动条 必写
		}
		/* 滚动条的滑块 */
		/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
			background-color: #ddd;
			border-radius: 3px;
		}
	}

	.pagination-container {
		margin-top: 15px;
	}

	.tree-roll-containers-first {
		max-height: 480px;
    	overflow: auto;
	}
</style>
