<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="tree-info" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div>
		<div class="page-info" ref="pageInfo" style="margin-left: 310px;">
			<Detail v-if="detailVisible" ref="detail" @refreshData="init"></Detail>
			<AddOrEdit v-if="addOrEditVisible" ref="addOrEdit" @refreshData="init"></AddOrEdit>
			<div v-if="pageVisible">
				<div class="filter-container">
					<el-input @keyup.enter.native="handleFilter" style="width: 200px;" clearable class="filter-item"
						placeholder="部门名称" v-model="listQuery.departmentFullName">
					</el-input>
					<el-select v-model="listQuery.departmentAttribute" class="filter-item" placeholder="请选择" clearable
						style="width: 200px;">
						<el-option v-for="item in departmentTypes" :key="item.code" :label="item.value"
							:value="item.code">
						</el-option>
					</el-select>
					<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索
					</el-button>
					<el-button class="filter-item" v-waves type="primary" @click="handleReset">重置</el-button>
					<!-- <el-button class="filter-item" v-if="baseDepartmentManager_btn_add" style="margin-left: 10px;"
						@click="handleCreate" type="primary" icon="edit">添加</el-button>
					<el-button class="filter-item" v-if="baseDepartmentManager_btn_export" style="margin-left: 10px;"
						@click="handleExport" type="primary" icon="edit">导出</el-button> -->
				</div>
				<el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row
					style="width: 100%">
					<el-table-column align="center" type="index" label="序号" width="65">
					</el-table-column>
					<el-table-column align="center" label="部门名称">
						<template slot-scope="scope">
							<span>{{scope.row.departmentFullName}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="部门编码">
						<template slot-scope="scope">
							<span>{{scope.row.departmentCode}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="部门属性">
						<template slot-scope="scope">
							<span>{{toDepartmentType(scope.row.departmentAttribute)}}</span>
						</template>
					</el-table-column>
					<!-- <el-table-column width="200px" align="center" label="创建时间">
						<template slot-scope="scope">
							<span>{{scope.row.crtTime}}</span>
						</template>
					</el-table-column>
					<el-table-column width="200px" align="center" label="创建者用户名">
						<template slot-scope="scope">
							<span>{{scope.row.crtName}}</span>
						</template>
					</el-table-column>
					<el-table-column width="200px" align="center" label="创建地址">
						<template slot-scope="scope">
							<span>{{scope.row.crtHost}}</span>
						</template>
					</el-table-column>
					<el-table-column width="200px" align="center" label="修改时间">
						<template slot-scope="scope">
							<span>{{scope.row.updTime}}</span>
						</template>
					</el-table-column>
					<el-table-column width="200px" align="center" label="修改者用户名">
						<template slot-scope="scope">
							<span>{{scope.row.updName}}</span>
						</template>
					</el-table-column>
					<el-table-column width="200px" align="center" label="修改地址">
						<template slot-scope="scope">
							<span>{{scope.row.updHost}}</span>
						</template>
					</el-table-column> -->
					<el-table-column fixed="right" align="center" label="操作" width="350"> <template slot-scope="scope">
							<el-button size="small" @click="handleDetail(scope.row)">查看
							</el-button>
							<!-- <el-button v-if="baseDepartmentManager_btn_edit" size="small" type="success"
								@click="handleUpdate(scope.row)">编辑
							</el-button> -->
							<el-button v-if="baseDepartmentManager_btn_authority" size="small" type="success"
								@click="handlerAuthority(scope.row)">部门权限
							</el-button>
							<!-- <el-button v-if="baseDepartmentManager_btn_del" size="small" type="danger"
								@click="handleDelete(scope.row)">删除
							</el-button> -->
						</template> </el-table-column>
				</el-table>
				<div v-show="!listLoading" class="pagination-container">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
						:current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
						align="right" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</div>
		</div>

		<el-dialog width="1000px" top="10vh" :title="dialogAuthorityName" :visible.sync="dialogAuthorityVisible">
			<el-tabs v-model="activeName" style="margin-top: -30px;">
				<el-tab-pane label="权限配置" name="first">
					<group-authority :deptId="currentId" @closeAuthorityDialog="closeAuthorityDialog"
						ref="groupAuthority">
					</group-authority>
				</el-tab-pane>
				<el-tab-pane label="管辖组织范围" name="second">
					<group-dept :deptId="currentId" ref="groupDept"></group-dept>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
	</div>
</template>

<script>
	import {
		page,
		addObj,
		getObj,
		delObj,
		putObj,
		exportPage
	} from 'api/admin/department/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import Detail from './components/detail';
	import AddOrEdit from './components/addOrEdit';
	import tree from "./components/tree";
	import groupAuthority from "./components/groupAuthority";
	import groupDept from "./components/groupDept";
	export default {
		name: "index",
		components: {
			tree,
			Detail,
			AddOrEdit,
			groupAuthority,
			groupDept
		},
		data() {
			return {
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					departmentFullName: '',
					departmentAttribute: '',
				},
				activeName: "first",
				currentId: -1,
				dialogAuthorityName: '部门权限',
				dialogAuthorityVisible: false,
				dialogFormVisible: false,
				dialogStatus: '',
				addOrEditVisible: false,
				detailVisible: false,
				pageVisible: true,
				baseDepartmentManager_btn_edit: false,
				baseDepartmentManager_btn_del: false,
				baseDepartmentManager_btn_add: false,
				baseDepartmentManager_btn_export: false,
				baseDepartmentManager_btn_authority: false,
				tableKey: 0,
				departmentTypes: [],
				baseDict: {
					type: 'department'
				},
				exportQuery: {
					departmentFullName: '',
					departmentAttribute: '',
				},
			}
		},
		created() {
			this.getList();
			this.getDataDict();
			this.baseDepartmentManager_btn_edit = this.elements['baseDepartmentManager:btn_edit'];
			this.baseDepartmentManager_btn_del = this.elements['baseDepartmentManager:btn_del'];
			// this.baseDepartmentManager_btn_add = this.elements['baseDepartmentManager:btn_add'];
			this.baseDepartmentManager_btn_export = this.elements['baseDepartmentManager:btn_export'];
			this.baseDepartmentManager_btn_authority = this.elements['baseDepartmentManager:btn_authority'];
		},
		computed: {
			...mapGetters([
				'elements'
			]),

			// // 筛选符合条件的参数
			toDepartmentType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.departmentTypes.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},
		},
		methods: {
			init(val) {
				this.addOrEditVisible = false;
				this.detailVisible = false;
				this.pageVisible = true;
				if (val) {
					this.$nextTick(() => {
						this.getList();
						this.$refs.tree.getTreeInfo();
					})
				}
			},
			handleExport() {
				window.location.href =
					`/api/admin/baseDepartment/export?token=${getToken()}&departmentFullName=${this.listQuery.departmentFullName}&departmentAttribute=${this.listQuery.departmentAttribute}`;
			},
			treeHandle(val) {
				switch (val.status) {
					case 'detail':
						this.addOrEditVisible = false;
						this.pageVisible = false;
						this.detailVisible = true;
						this.$nextTick(() => {
							this.$refs.detail.init(val);
						})
						break;
					case 'add':
					case 'edit':
						this.pageVisible = false;
						this.detailVisible = false;
						this.addOrEditVisible = true;
						this.$nextTick(() => {
							this.$refs.addOrEdit.init(val);
						})
						break;
					case 'delete':
						this.getList();
						break;
					default:
						break;
				}
			},
			getList() {
				this.listLoading = true;
				page(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.listLoading = false;
					})
			},

			// 获取部门属性
			getDataDict() {
				getByType(this.baseDict)
					.then(response => {
						if (response && response.code === 0) {
							this.departmentTypes = response.data ? response.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: '获取部门属性失败',
								type: 'success',
								duration: 2000
							});
						}
					});
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
			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					departmentFullName: '',
					departmentAttribute: '',
				};
				this.getList();
			},
			handleCreate() {
				this.addOrEditVisible = true;
				this.detailVisible = false;
				this.pageVisible = false;
				this.$nextTick(() => {
					let obj = {
						status: 'add',
						formTree: false
					};
					this.$refs.addOrEdit.init(obj);
				});
			},
			// handleUpdate(row) {
			// 	this.addOrEditVisible = true;
			// 	this.detailVisible = false;
			// 	this.pageVisible = false;
			// 	this.$nextTick(() => {
			// 		let obj = {
			// 			status: 'edit',
			// 			formTree: true,
			// 			id: row.id
			// 		};
			// 		this.$refs.addOrEdit.init(obj);
			// 	});
			// },
			handleDetail(row) {
				this.addOrEditVisible = false;
				this.pageVisible = false;
				this.detailVisible = true;
				this.$nextTick(() => {
					let obj = {
						status: 'detail',
						formTree: true,
						id: row.id
					};
					this.$refs.detail.init(obj)
				})
			},
			// handleDelete(row) {
			// 	this.$confirm('此操作将永久删除, 是否继续?', '提示', {
			// 			confirmButtonText: '确定',
			// 			cancelButtonText: '取消',
			// 			type: 'warning'
			// 		})
			// 		.then(() => {
			// 			delObj(row.id)
			// 				.then(() => {
			// 					this.$notify({
			// 						title: '成功',
			// 						message: '删除成功',
			// 						type: 'success',
			// 						duration: 2000
			// 					});
			// 					const index = this.list.indexOf(row);
			// 					this.list.splice(index, 1);
			// 				});
			// 		}).catch(() => {});
			// },

			handlerAuthority(row) {
				this.activeName = "first";
				this.currentId = row.id;
				this.dialogAuthorityVisible = true;
				this.$nextTick(() => {
					this.$refs.groupAuthority.deptId = this.currentId;
					this.$refs.groupAuthority.getDeptElementList();
					this.$refs.groupAuthority.initAuthoritys();
					this.$refs.groupDept.deptId = this.currentId;
					this.$refs.groupDept.initDept();
				})
			},
			closeAuthorityDialog() {
				this.dialogAuthorityVisible = false;
			}
		}
	}
</script>

<style scoped>
	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
		height: calc(100vh - 166px);
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}
</style>
