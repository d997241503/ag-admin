<template>
	<div class="app-container calendar-list-container">
		<div class="page-content">
			<AddOrEdit v-if="addOrEditVisible" ref="addOrEdit" @refreshData="init"></AddOrEdit>
			<div v-if="pageVisible">
				<div class="filter-container">
					<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name">
					</el-input>
					<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
					<el-button class="filter-item" v-if="userManager_btn_add" style="margin-left: 10px;" @click="handleCreate()" type="primary"
					 icon="edit">添加</el-button>
					<!-- <el-button class="filter-item" @click="batchAddHandle()">批量</el-button> -->
				</div>
				<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
					<el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
					<el-table-column width="200" align="center" label="姓名"> <template slot-scope="scope">
							<span>{{scope.row.name}}</span>
						</template> </el-table-column>
					<el-table-column width="200" align="center" label="账户"> <template slot-scope="scope">
							<span>{{scope.row.username}}</span>
						</template> </el-table-column>
					<el-table-column width="110" align="center" label="性别"> <template slot-scope="scope">
							<span>{{scope.row.sex == '1' ? '男': '女'}}</span>
						</template> </el-table-column>
					<el-table-column width="250" align="center" label="所属部门"> <template slot-scope="scope">
							<span>{{scope.row.departmentName}}</span>
						</template> </el-table-column>
					<el-table-column align="center" label="备注"> <template slot-scope="scope">
							<span>{{scope.row.description}}</span>
						</template> </el-table-column>
					<el-table-column width="180" align="center" label="更新时间"> <template slot-scope="scope">
							<span>{{scope.row.updTime}}</span>
						</template> </el-table-column>
					<el-table-column width="150" align="center" label="更新人"> <template slot-scope="scope">
							<span>{{scope.row.updName}}</span>
						</template> </el-table-column>
					<el-table-column align="center" label="操作" width="150"> <template slot-scope="scope">
							<el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
							</el-button>
							<el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
							</el-button>
						</template> </el-table-column>
				</el-table>
				<div v-show="!listLoading" class="pagination-container" align="right">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
					 :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		page,
		getPage,
		addObj,
		getObj,
		delObj,
		putObj
	} from 'api/admin/user/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import AddOrEdit from './components/addOrEdit';
	// import {
	// 	executeAdd
	// } from './components/addUser'
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: 'user',
		data() {
			return {
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					name: undefined
				},
				userManager_btn_edit: false,
				userManager_btn_del: false,
				userManager_btn_add: false,
				textMap: {
					update: '编辑',
					create: '创建'
				},
				tableKey: 0,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentName'
				},
				pageVisible: true,
				addOrEditVisible: false,
			}
		},
		components: {
			AddOrEdit
		},
		created() {
			this.defaultProps.label = this.deptFields;
			this.getList();
			this.userManager_btn_edit = this.elements['userManager:btn_edit'];
			this.userManager_btn_del = this.elements['userManager:btn_del'];
			this.userManager_btn_add = this.elements['userManager:btn_add'];
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			batchAddHandle() {
				// executeAdd(500);
			},
			init() {
				this.addOrEditVisible = false;
				this.pageVisible = true;
				this.$nextTick(() => {
					this.getList();
				})
			},
			getList() {
				this.listLoading = true;
				getPage(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.list = response.data.rows;
							this.total = response.data.total;
						} else {
							this.total = 0;
						}
						this.listLoading = false;
					}).catch(Error => {
						this.listLoading = false;
					})
			},

			handlePartyBranch(data) {
				this.form.departmentId = data.id;
				this.form.departmentName = data.departmentName;
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
			handleCreate() {
				this.pageVisible = false;
				this.addOrEditVisible = true;
				this.$nextTick(() => {
					this.$refs.addOrEdit.init();
				})
			},
			handleUpdate(row) {
				this.pageVisible = false;
				this.addOrEditVisible = true;
				this.$nextTick(() => {
					this.$refs.addOrEdit.init(row.id);
				});
			},
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delObj(row.id)
							.then(() => {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 2000
								});
								const index = this.list.indexOf(row);
								this.list.splice(index, 1);
							});
					});
			},
			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						addObj(this.form)
							.then((res) => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										this.dialogFormVisible = false;
										this.getList();
									}, 2000)
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000
									});
								}
							})
					} else {
						return false;
					}
				});
			},
			cancel(formName) {
				this.dialogFormVisible = false;
				this.$refs[formName].resetFields();
			},
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
								this.dialogFormVisible = false;
								this.form.password = undefined;
								putObj(this.form.id, this.form).then(() => {
									this.dialogFormVisible = false;
									this.getList();
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
								});
							} else {
								return false;
							}
						});
					}).catch(() => {

					})
			},
			resetTemp() {
				this.form = {
					username: undefined,
					name: undefined,
					sex: '男',
					password: undefined,
					description: undefined,
					departmentName: '',
					departmentId: '',
				};
			}
		}
	}
</script>
