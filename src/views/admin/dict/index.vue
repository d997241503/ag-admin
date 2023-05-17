<template>
	<div class="app-container calendar-list-container">
		<div class="page-content">
			<div class="filter-container">
				<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="字典名称" v-model="listQuery.name"
				 clearable>
				</el-input>
				<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
				<el-button class="filter-item" v-waves type="primary" @click="handleReset">重置</el-button>
				<el-button class="filter-item" v-if="dataDictionaryManager_btn_add" style="margin-left: 10px;" @click="handleCreate"
				 type="primary" icon="edit">添加</el-button>
			</div>
			<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column align="center" label="id" width="65">
					<template slot-scope="scope">
						<span>{{scope.row.id}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="字典名称">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="字典类型">
					<template slot-scope="scope">
						<span>{{scope.row.type}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="字典码">
					<template slot-scope="scope">
						<span>{{scope.row.code}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="字典值">
					<template slot-scope="scope">
						<span>{{scope.row.value}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column width="200px" align="center" label="排序号">
				<template scope="scope">
					<span>{{scope.row.orderNum}}</span>
				</template>
			</el-table-column> -->
				<el-table-column width="200px" align="center" label="创建者">
					<template slot-scope="scope">
						<span>{{scope.row.crtName}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="创建时间">
					<template slot-scope="scope">
						<span>{{scope.row.crtTime}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="更新者">
					<template slot-scope="scope">
						<span>{{scope.row.updName}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="更新时间">
					<template slot-scope="scope">
						<span>{{scope.row.updTime}}</span>
					</template>
				</el-table-column>
				<el-table-column width="200px" align="center" label="备注信息">
					<template slot-scope="scope">
						<span>{{scope.row.description}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
						<el-button v-if="dataDictionaryManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
						</el-button>
						<el-button v-if="dataDictionaryManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
						</el-button>
					</template> </el-table-column>
			</el-table>
			<div v-show="!listLoading" class="pagination-container" align="right">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
			<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
				<el-form :model="form" :rules="rules" ref="form" label-width="100px">
					<el-form-item label="字典名称" prop="name">
						<el-input v-model="form.name" placeholder="请输入字典名称"></el-input>
					</el-form-item>
					<el-form-item label="字典类型" prop="type">
						<el-input v-model="form.type" placeholder="请输入字典类型"></el-input>
					</el-form-item>
					<el-form-item label="字典码" prop="code">
						<el-input v-model="form.code" placeholder="请输入字典码"></el-input>
					</el-form-item>
					<el-form-item label="字典值" prop="value">
						<el-input v-model="form.value" placeholder="请输入字典值"></el-input>
					</el-form-item>
					<el-form-item label="备注信息">
						<el-input v-model="form.description" placeholder="请输入备注信息"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="cancel('form')">取 消</el-button>
					<el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
					<el-button v-else type="primary" @click="update('form')">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import {
		page,
		addObj,
		getObj,
		delObj,
		putObj
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: 'dict',
		data() {
			return {
				form: {
					name: undefined,
					type: undefined,
					code: undefined,
					value: undefined,
					orderNum: undefined,
					createBy: undefined,
					createTime: undefined,
					upadteBy: undefined,
					updateTime: undefined,
					description: undefined
				},
				rules: {
					name: [{
							required: true,
							message: '请输入字典名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '长度在 1 到 20 个字符',
							trigger: 'blur'
						}
					],
					type: [{
							required: true,
							message: '请输入字典类型',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					code: [{
							required: true,
							message: '请输入字典码',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 3,
							message: '长度在 1 到 3 个字符',
							trigger: 'blur'
						}
					],
					value: [{
							required: true,
							message: '请输入字典值',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '长度在 1 到 20 个字符',
							trigger: 'blur'
						}
					],
					orderNum: [{
						required: true,
						message: '请输入排序号',
						trigger: 'blur'
					}],
					createBy: [{
							required: true,
							message: '请输入创建者',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					createTime: [{
							required: true,
							message: '请输入创建时间',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					upadteBy: [{
							required: true,
							message: '请输入更新者',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					updateTime: [{
							required: true,
							message: '请输入更新时间',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					description: [{
							required: true,
							message: '请输入备注信息',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					]
				},
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					name: undefined
				},
				dialogFormVisible: false,
				dialogStatus: '',
				dataDictionaryManager_btn_edit: false,
				dataDictionaryManager_btn_del: false,
				dataDictionaryManager_btn_add: false,
				textMap: {
					update: '编辑',
					create: '创建'
				},
				tableKey: 0
			}
		},
		created() {
			this.getList();
			this.dataDictionaryManager_btn_edit = this.elements['dataDictionaryManager:btn_edit'];
			this.dataDictionaryManager_btn_del = this.elements['dataDictionaryManager:btn_del'];
			this.dataDictionaryManager_btn_add = this.elements['dataDictionaryManager:btn_add'];
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		methods: {
			getList() {
				this.listLoading = true;
				page(this.listQuery)
					.then(response => {
						this.list = response.data.rows;
						this.total = parseInt(response.data.total);
						this.listLoading = false;
					})
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
					name: undefined
				};
				this.getList();
			},
			handleCreate() {
				this.resetTemp();
				this.dialogStatus = 'create';
				this.dialogFormVisible = true;
			},
			handleUpdate(row) {
				getObj(row.id)
					.then(response => {
						this.form = response.data;
						this.dialogFormVisible = true;
						this.dialogStatus = 'update';
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
							.then(() => {
								this.dialogFormVisible = false;
								this.getList();
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000
								});
							})
					} else {
						return false;
					}
				});
			},
			cancel(formName) {
				this.dialogFormVisible = false;
				const set = this.$refs;
				set[formName].resetFields();
			},
			update(formName) {
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
			},
			resetTemp() {
				this.form = {
					username: undefined,
					name: undefined,
					sex: '男',
					password: undefined,
					description: undefined
				};
			}
		}
	}
</script>
