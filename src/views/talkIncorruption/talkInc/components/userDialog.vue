<template>
	<el-dialog :title="'选择'+title" :visible.sync="visible" style="width: 120%;margin-left: -10%;" top="10vh">
		<div class="filter-container">
			<el-input @keyup.enter.native="handleFilter" style="width: 200px;" clearable :placeholder="title+'姓名'"
			 v-model="listQuery.name">
			</el-input>
			<el-input v-model="listQuery.organizationName" style="width: 250px;" placeholder="点击右侧按钮选择部门" readonly>
				<el-popover v-model="treeVisible" slot="append" placement="right-start" trigger="click">
					<el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
						<span class="custom-tree-node" slot-scope="{ node, data }">
							<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
						</span>
					</el-tree>
					<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
				</el-popover>
			</el-input>
			<el-button type="primary" v-waves icon="search" @click="handleFilter" style="margin-left: 10px;">搜索</el-button>
		</div>
		<el-table :key='tableKey' :data="dataList" v-loading="listLoading" border highlight-current-row style="width: 100%;font-size: 15px;"
		 size="mini">
			<el-table-column align="center" type="index" label="序号" width="65">
			</el-table-column>
			<el-table-column align="center" label="姓名">
				<template slot-scope="scope">
					<span>{{scope.row.name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="职务">
				<template slot-scope="scope">
					<span>{{scope.row.post}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="部门">
				<template slot-scope="scope">
					<span>{{scope.row.organizationName}}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" align="center" label="操作" width="250">
				<template slot-scope="scope">
					<el-button size="small" @click="selectedHandle(scope.row)">选择</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
			 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
			 :total="total">
			</el-pagination>
		</div>
	</el-dialog>
</template>

<script>
	import {
		getUser,
		getTree
	} from 'api/incorrupt/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				visible: false,
				dataList: [],
				tableKey: 0,
				list: null,
				total: null,
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 10,
					deptId: undefined,
					organizationName: undefined,
					userId: undefined,
					name: undefined,
				},
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentName'
				},
				title: ''
			}
		},
		computed: {
			...mapGetters([
				'deptFields'
			])
		},
		created() {
			this.defaultProps.label = this.deptFields;
		},
		methods: {
			// 初始化
			init(deptId) {
				if (deptId) this.listQuery.deptId = deptId;
				this.visible = true;
				this.$nextTick(() => {
					// this.getDataList();
					this.getTreeInfo();
				})
			},
			// 获取人员列表
			getDataList() {
				this.listLoading = true;
				getUser(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.dataList = response.data.rows;
							this.total = response.data.total;
							this.listLoading = false;
						} else {
							this.total = 0;
							this.listLoading = false;
						}
						// this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			handleFilter() {
				if(this.listQuery.deptId) this.getDataList();
				else this.$message.warning('请选择部门');
				
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getDataList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getDataList();
			},

			// 选择人员
			selectedHandle(row) {
				this.$confirm('确认选择当前人员并关闭窗口?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						this.$emit('refreshData', row, this.title);
						this.visible = false;
					}).catch(() => {});
			},

			// 选择部门
			handlePartyBranch(data) {
				this.listQuery.deptId = data.id;
				this.listQuery.organizationName = data.departmentName;
				this.treeVisible = false;
			},

			// 清除已选部门
			organizationClearHanle() {
				this.listQuery.deptId = undefined;
				this.listQuery.organizationName = undefined;
			},

			// 获取部门树
			getTreeInfo() {
				getTree()
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
		}
	}
</script>

<style>
</style>
