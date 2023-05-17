<template>
	<div class="app-container calendar-list-container nav-content">
        <!-- <div class="search-info page-info" style="padding-bottom:0;">
            <div class="page-title">
				{{$route.name}}
			</div>
        </div> -->
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
					<!-- <el-form-item>
						<el-input clearable placeholder="请输入晋升职级查询" v-model="listQuery.promotionPosition">
						</el-input>
					</el-form-item>
					<el-form-item>
					<el-select v-model="listQuery.matterType" clearable placeholder="请选择事项类别">
						<el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					</el-form-item> -->
                    <el-form-item>
						<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
							<el-tree style="min-width: 350px;" ref="treeData" :props="defaultProps" :data="treeData"
								:default-expanded-keys="[index]" node-key="id" :expand-on-click-node="false" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
										<span
											v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
										</span>
									</span>
								</el-tree>
							<el-select v-model="deptName" placeholder="请选择下发公司" class="input-item" slot="reference" clearable @clear="deptClear"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="下发开始时间" end-placeholder="下发结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<!-- <el-form-item>
						<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
							<el-tree style="min-width: 350px;" ref="treeData" :props="defaultProps" :data="treeData"
								:default-expanded-keys="[index]" node-key="id" :expand-on-click-node="false" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
										<span
											v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
										</span>
									</span>
								</el-tree>
							<el-select v-model="deptName" placeholder="请选择单位" class="input-item" slot="reference" clearable @clear="deptClear"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item> -->
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-waves type="primary" @click="handleReset">重置</el-button>
					</el-form-item>
					<!-- <el-form-item>
						<el-button v-if="employment_btn_add" class="filter-item" type="primary" v-waves icon="search" @click="addOrUpdateHandle()">新增选人用人情况</el-button>
					</el-form-item> -->
				</el-form>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column label="序号" width="50px" align="center" type="index" />
				<el-table-column min-width="200" align="center" label="任务表格" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<!-- <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"> -->
                            <span v-for="(item,index) in scope.row.issueForms" :key="index">
                                <span>{{item.formTypeName}}</span>
                                <span v-if="index !== scope.row.issueForms.length-1">、</span>
                            </span>
                        <!-- </div> -->
					</template>
				</el-table-column>
                <el-table-column min-width="200" align="center" label="下发公司" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<!-- <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"> -->
                            <span v-for="(item,index) in scope.row.issueOrgs" :key="index">
                                <span>{{item.orgName}}</span>
                                <span v-if="index !== scope.row.issueOrgs.length-1">、</span>
                            </span>
                        <!-- </div> -->
					</template>
				</el-table-column>
				<el-table-column min-width="200" align="center" label="人员" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<!-- <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"> -->
                            <span v-for="(item,index) in scope.row.issueMembers" :key="index">
                                <span>{{item.name}}</span>
                                <span v-if="index !== scope.row.issueMembers.length-1">、</span>
                            </span>
                        <!-- </div> -->
					</template>
				</el-table-column>
				<el-table-column min-width="130" align="center" label="所属分类">
					<template slot-scope="scope">
						<span v-if="scope.row.taskType == '0'">固化任务</span>
						<span v-if="scope.row.taskType == '1'">新增人员</span>
					</template>
				</el-table-column>
                <el-table-column min-width="120" header-align="center" align="center" label="下发时间">
					<template slot-scope="scope">
						{{scope.row.issueTime}}
					</template>
				</el-table-column>
				<el-table-column min-width="120" header-align="center" align="center" label="应提报时间">
					<template slot-scope="scope">
						{{scope.row.commitTime}}
					</template>
				</el-table-column>
                <!-- <el-table-column min-width="150" align="center" label="备注" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.note}}</div>
					</template>
				</el-table-column> -->
				<el-table-column fixed="right" header-align="center" align="center" min-width="100" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleDetail(scope.row.id)">查看详情</el-button>
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
		<!-- 弹窗, 新增选人用人情况 -->
		<!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update> -->
	</div>
</template>

<script>
	// import AddOrUpdate from './addOrEdit';
	import {
		getHiarchivesissuetask,
		delHiarchivesissuetaskObj
	} from 'api/archives/index';
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
				tableHeight: undefined,
				addOrUpdateVisible: false,
				popoverVisibel: false,
				list: null,
				total: null,
				loading: true,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					orgId: undefined,
					startDate: '',
					endtDate: ''
				},
				deptName: '',
				matterType: [
					{label: '竞聘', value: 1},
					{label: '访谈', value: 2},
					{label: '考察', value: 3},
					{label: '其他', value: 4}
				],
				// treeVisible: false,
				// treeData: [],
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentFullName'
				// },
				times: [],
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
				treeVisible: false,
				treeData: [],
				index: 0,
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
			}
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		components: {
			// AddOrUpdate
		},
		created() {
			// this.getDataList();
			this.getTreeInfo();
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
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
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			
			deptClear(e) {
				this.listQuery.orgId = undefined;
			},
			// 选择部门
			handleCheckChange(data) {
				this.listQuery.orgId = data.id;
				this.deptName = data.departmentFullName;
				this.popoverVisibel = false;
			},
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				getHiarchivesissuetask(this.listQuery)
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
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal
				this.tableHeight = computedHeight > 500 ? computedHeight : 500
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},

			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					orgId: undefined,
					startDate: '',
					endtDate: ''
				};
				this.deptName = '';
				this.times = [];
				this.getList();
			},

			// 新增/修改
			addOrUpdateHandle(row,operation) {
				// this.$nextTick(() => {
				// 	this.$router.push({
				// 		path: '/newlyemploy',
				// 		query: {
				// 			operation: operation,
				// 			row: row
				// 		}
				// 	})
				// })
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(row,operation);
				})
			},

			// 查看详情
			handleDetail(id) {
				this.$router.push({
                    path: '/filesPrepare/filesPer/index/history/detailsHis',
                    query: {
                        id: id
                    }
                })
			},

			// // 删除
			// handleDelete(id) {
			// 	this.$confirm('此操作将永久删除, 是否继续?', '提示', {
			// 			confirmButtonText: '确定',
			// 			cancelButtonText: '取消',
			// 			type: 'warning'
			// 		})
			// 		.then(() => {
			// 			delHiarchivesissuetaskObj(
			// 					id
			// 				)
			// 				.then(res => {
			// 					if (res && res.status === 200) {
			// 						this.$notify({
			// 							title: '成功',
			// 							message: '删除成功',
			// 							type: 'success',
			// 							duration: 2000
			// 						});
			// 						this.getList();
			// 					} else {
			// 						this.$notify({
			// 							title: '失败',
			// 							message: '删除失败',
			// 							type: 'error',
			// 							duration: 2000
			// 						});
			// 					}
			// 				}).catch(() => {
			// 					this.$notify({
			// 						title: '失败',
			// 						message: '删除失败',
			// 						type: 'error',
			// 						duration: 2000
			// 					});
			// 				});
			// 		}).catch(() => {

			// 		});
			// },
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

    .page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: 20px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}
</style>
