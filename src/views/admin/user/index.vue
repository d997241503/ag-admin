<template>
	<div class="app-container calendar-list-container">
		<div class="page-content" v-if="addOrEditVisible">
			<AddOrEdit  ref="addOrEdit" @refreshData="init"></AddOrEdit>
		</div>
		<div  class="page-content" v-if="retireVisible">
			<Retire @refreshData="init" :retireData='delTable'></Retire>
		</div>
		<div  class="page-content" v-if="TransferVisible">
			<Transfer @refreshData="init" :transferData='delTable'></Transfer>
		</div>
		
		<div v-if="pageVisible">
			<div ref="searchSection" class="filter-container page-content" style="margin-bottom: 0.8%;">
				<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listQuery.name" clearable>
				</el-input>
				<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
				<el-button class="filter-item" v-waves type="primary" @click="handleReset">重置</el-button>
				<!-- <el-button class="filter-item" v-if="userManager_btn_add" style="margin-left: 10px;" @click="handleCreate()" type="primary"
				 icon="edit">添加</el-button>
				 <el-button :disabled="delTable.length==0||delTable.length>1" class="filter-item" type="primary" v-waves icon="search" @click="TransferShow">干部调用</el-button>
				 <el-button :disabled="delTable.length==0||delTable.length>1" class="filter-item" type="primary" v-waves icon="search" @click="retireVisibleShow">干部退休</el-button> -->
				<!-- <el-button class="filter-item" @click="batchAddHandle()">批量</el-button> -->
			</div>
		<div class="tree-info" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div>
		<div class="page-content" style="margin-left: 310px;">
				<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
					<el-table-column type="selection" align="center" width="50" fixed  >
					</el-table-column>
					<el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
					<el-table-column align="center" label="姓名"> <template slot-scope="scope">
							<span>{{scope.row.name}}</span>
						</template> </el-table-column>
					<el-table-column align="center" label="账户"> <template slot-scope="scope">
							<span>{{scope.row.username}}</span>
						</template> </el-table-column>
					<!-- <el-table-column width="90" align="center" label="性别"> <template slot-scope="scope">
							<span v-if="scope.row.sex == '1'">男</span>
							<span v-if="scope.row.sex == '0'">女</span>
						</template> </el-table-column> -->
					<el-table-column align="center" label="所属部门"> <template slot-scope="scope">
							<span>{{scope.row.departmentFullName}}</span>
						</template> </el-table-column>
					<!-- <el-table-column align="center" width="220" label="备注"> <template slot-scope="scope">
							<span>{{scope.row.description}}</span>
						</template> </el-table-column>
					<el-table-column width="180" align="center" label="更新时间"> <template slot-scope="scope">
							<span>{{scope.row.updTime}}</span>
						</template> </el-table-column>
					<el-table-column width="145" align="center" label="更新人"> <template slot-scope="scope">
							<span>{{scope.row.updName}}</span>
						</template> </el-table-column> -->
					<el-table-column fixed="right" align="center" label="操作" width="340"> <template slot-scope="scope">
							<!-- <el-button v-if="userManager_btn_edit" size="small" type="info" @click="exportWord(scope.row)">导出
							</el-button> -->
							<!-- <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
							</el-button> -->
							<el-button v-if="userManager_btn_authority" size="small" type="success"
								@click="handlerAuthority(scope.row)">用户权限
							</el-button>
							<!-- <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
							</el-button> -->
						</template> </el-table-column>
				</el-table>
				<div v-show="!listLoading" class="pagination-container" align="right">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
					 :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
					</el-pagination>
				</div>
			</div>
		</div>

		<el-dialog width="1000px" top="10vh" :title="dialogAuthorityName" :visible.sync="dialogAuthorityVisible">
			<el-tabs v-model="activeName" style="margin-top: -30px;">
				<el-tab-pane label="权限配置" name="first">
					<group-authority :userId="currentId" @closeAuthorityDialog="closeAuthorityDialog"
						ref="groupAuthority">
					</group-authority>
				</el-tab-pane>
				<el-tab-pane label="管辖组织范围" name="second">
					<group-dept :userId="currentId" ref="groupDept"></group-dept>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
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
	import Retire from './components/retire'
	import Transfer from'./components/transfer'
	import permissionsSettings from './components/permissions-settings';
	// import {
	// 	executeAdd
	// } from './components/addUser'
	import {
		mapGetters
	} from 'vuex';
	import tree from "./components/tree";
	import groupAuthority from "./components/groupAuthority";
	import groupDept from "./components/groupDept";
	export default {
		name: 'user',
		data() {
			return {
				delTable:[],
				list: null,
				total: null,
				listLoading: true,
				activeName: "first",
				currentId: -1,
				dialogAuthorityName: '用户权限',
				dialogAuthorityVisible: false,
				listQuery: {
					page: 1,
					limit: 10,
					name: undefined,
					depId:null,
					userId: this.$store.getters.userId
				},
				userManager_btn_edit: false,
				userManager_btn_del: false,
				userManager_btn_add: false,
				userManager_btn_authority: false,
				TransferVisible:false,
				textMap: {
					update: '编辑',
					create: '创建'
				},
				tableKey: 0,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				pageVisible: true,
				addOrEditVisible: false,
				retireVisible:false,
				tableHeight: 623
			}
		},
		components: {
			AddOrEdit,
			tree,
			Retire,
			Transfer,
			groupAuthority,
			groupDept
		},
		created() {
			this.defaultProps.label = this.deptFields;
			this.getList();
			this.userManager_btn_edit = this.elements['userManager:btn_edit'];
			this.userManager_btn_del = this.elements['userManager:btn_del'];
			this.userManager_btn_add = this.elements['userManager:btn_add'];
			this.userManager_btn_authority = this.elements['userManager:btn_authority'];
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			// 树状
			treeHandle(val) {
				this.listQuery.depId=val.id
				this.getList()
			},
			TransferShow(){
				this.addOrEditVisible = false;
				this.pageVisible = false;
				this.retireVisible=false
				this.TransferVisible=true
			},
			retireVisibleShow(){
				this.addOrEditVisible = false;
				this.pageVisible = false;
				this.retireVisible=true
				this.TransferVisible=false
			},
			exportWord(e){
				window.location.href =
					`/api/incorrupt/archives/getWord?userId=${e.id}&token=${this.$store.getters.token}`;
			},
			// 选中单个
			handleSelectionChange(e){
				this.delTable=e
			},
			batchAddHandle() {
				// executeAdd(500);
			},
			init() {
				this.delTable=[]
				this.addOrEditVisible = false;
				this.pageVisible = true;
				this.retireVisible=false
				this.TransferVisible=false
				this.$nextTick(() => {
					this.getList();
				})
			},
			getList() {
				this.listLoading = true;
				getPage(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.tableLayout();
						this.listLoading = false;
					}).catch(Error => {
						this.listLoading = false;
					})
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
					name: undefined,
					depId:null,
					userId: this.$store.getters.userId
				};
				this.getList();
			},

			handlePartyBranch(data) {
				this.form.departmentId = data.id;
				this.form.departmentFullName = data.departmentFullName;
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
				this.retireVisible=false;
				this.TransferVisible=false
				this.$nextTick(() => {
					this.$refs.addOrEdit.init();
				})
			},
			// handleUpdate(row) {
			// 	this.pageVisible = false;
			// 	this.addOrEditVisible = true;
			// 	this.retireVisible=false;
			// 	this.TransferVisible=false
			// 	this.$nextTick(() => {
			// 		this.$refs.addOrEdit.init(row.id);
			// 	});
			// },
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
			// 		});
			// },
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
					departmentFullName: '',
					departmentId: '',
				};
			},
			
			// 用户权限
			handlerAuthority(row) {
				this.activeName = "first";
				this.currentId = row.id;
				this.dialogAuthorityVisible = true;
				this.$nextTick(() => {
					this.$refs.groupAuthority.userId = this.currentId;
					this.$refs.groupAuthority.getUserElementList();
					this.$refs.groupAuthority.initAuthoritys();
					this.$refs.groupDept.userId = this.currentId;
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
	}	
	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}
</style>
