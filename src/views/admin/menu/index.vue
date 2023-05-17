<template>
	<div class="app-container calendar-list-container">
		<div class="page-content">
			<div class="filter-container">
				<el-button-group>
					<el-button type="primary" v-if="menuManager_btn_add" icon="plus" @click="handlerAdd">添加</el-button>
					<el-button type="primary" v-if="menuManager_btn_edit" icon="edit" @click="handlerEdit">编辑</el-button>
					<el-button type="primary" v-if="menuManager_btn_del" icon="delete" @click="handleDelete">删除</el-button>
				</el-button-group>
			</div>

			<el-row :gutter="10">
				<el-col :span="5" style='margin-top:10px;'>
					<el-card class="box-card">
						<el-input placeholder="输入关键字进行过滤" v-model="filterText">
						</el-input>
						<el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps"
						 :filter-node-method="filterNode" ref="menuTree" @node-click="getNodeData" default-expand-all>
						</el-tree>
					</el-card>
				</el-col>
				<el-col :span="19" style='margin-top:10px;'>
					<el-card class="box-card">
						<el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
							<el-form-item label="路径编码" prop="code">
								<el-input v-model="form.code" :disabled="formEdit" placeholder="请输入路径编码"></el-input>
							</el-form-item>
							<el-form-item label="标题" prop="title">
								<el-input v-model="form.title" :disabled="formEdit" placeholder="请输入标题"></el-input>
							</el-form-item>
							<el-form-item label="父级节点" prop="parentId">
								<el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
							</el-form-item>
							<el-form-item label="Icon" prop="icon">
								<el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入Icon"></el-input>
							</el-form-item>
							<el-form-item label="图标" prop="pictureUrl">
								<el-input v-model="form.pictureUrl" placeholder="请上传图标" :disabled="formEdit">
									<el-button slot="append" icon="el-icon-upload" @click="uploadHandle()" :disabled="formEdit"></el-button>
								</el-input>
							</el-form-item>
							<el-form-item label="资源路径" prop="href">
								<el-input v-model="form.href" :disabled="formEdit" placeholder="请输入资源路径"></el-input>
							</el-form-item>
							<el-form-item label="类型" prop="type">
								<el-select class="filter-item" style="width: 100%;" v-model="form.type" :disabled="formEdit" placeholder="请输入资源请求类型">
									<el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="排序" prop="orderNum">
								<el-input v-model="form.orderNum" :disabled="formEdit" placeholder="请输入排序"></el-input>
							</el-form-item>
							<el-form-item label="描述" prop="description">
								<el-input v-model="form.description" :disabled="formEdit" placeholder="请输入描述"></el-input>
							</el-form-item>
							<el-form-item label="前端组件" prop="attr1">
								<el-input v-model="form.attr1" :disabled="formEdit" placeholder="请输入描述"></el-input>
							</el-form-item>
							<el-form-item v-if="formStatus == 'update'">
								<el-button type="primary" @click="update">更新</el-button>
								<el-button @click="onCancel">取消</el-button>
							</el-form-item>
							<el-form-item v-if="formStatus == 'create'">
								<el-button type="primary" @click="create">保存</el-button>
								<el-button @click="onCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</el-card>
						<el-card class="box-card" style="margin-top: 10px;">
							<span>按钮或资源</span>
							<ElementTable :menuId='currentId' ref="menuElement"></ElementTable>
						</el-card>
				</el-col>
				<!-- <el-col :span="14">
				</el-col> -->
			</el-row>
			<Upload v-if="uploadVisible" ref="upload" @refreshData="getFile"></Upload>
		</div>
	</div>
</template>

<script>
	import {
		fetchTree,
		getObj,
		addObj,
		delObj,
		putObj
	} from 'api/admin/menu/index';
	import Upload from './components/UploadFile'
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: 'menu-sys',
		components: {
			'ElementTable': () => import('./components/element'),
			Upload
			// 'Upload': () => import('./components/UploadFile')
		},
		data() {
			return {
				filterText: '',
				list: null,
				total: null,
				formEdit: true,
				formAdd: true,
				formStatus: '',
				showElement: false,
				uploadVisible: false,
				typeOptions: ['menu', 'dirt'],
				listQuery: {
					name: undefined
				},
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'title'
				},
				labelPosition: 'right',
				form: {
					code: undefined,
					title: undefined,
					parentId: undefined,
					href: undefined,
					icon: undefined,
					pictureUrl: undefined,
					orderNum: undefined,
					description: undefined,
					path: undefined,
					enabled: undefined,
					type: undefined,
					attr1: undefined
				},
				currentId: -1,
				menuManager_btn_add: false,
				menuManager_btn_edit: false,
				menuManager_btn_del: false
			}
		},
		watch: {
			filterText(val) {
				this.$refs.menuTree.filter(val);
			}
		},
		created() {
			this.getList();
			this.menuManager_btn_add = this.elements['menuManager:btn_add'];
			this.menuManager_btn_del = this.elements['menuManager:btn_del'];
			this.menuManager_btn_edit = this.elements['menuManager:btn_edit'];
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		methods: {
			// 上传文件
			uploadHandle() {
				this.uploadVisible = true
				this.$nextTick(() => {
					this.$refs.upload.init()
				})
			},

			// 获取上传文件
			getFile(data) {
				try {
					// this.form.pictureUrl = data.files[0].name;
					this.form.pictureUrl = data.files[0].response.data;
				} catch (e) {
					//TODO handle the exception
					this.$message.error("上传文件失败，请重新上传");
				}
			},
			getList() {
				fetchTree(this.listQuery).then(data => {
					this.treeData = data;
				});
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			getNodeData(data) {
				if (!this.formEdit) {
					this.formStatus = 'update';
				}
				getObj(data.id).then(response => {
					this.form = response.data;
				});
				this.currentId = data.id;
				this.showElement = true;
				this.$refs.menuElement.listQuery.page = 1;
				this.$refs.menuElement.menuId = data.id;
				this.$refs.menuElement.getList();
			},
			handlerEdit() {
				if (this.form.id) {
					this.formEdit = false;
					this.formStatus = 'update';
				}
			},
			handlerAdd() {
				this.resetForm();
				this.formEdit = false;
				this.formStatus = 'create';
			},
			handleDelete() {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delObj(this.currentId).then(() => {
						this.getList();
						this.resetForm();
						this.onCancel();
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success',
							duration: 2000
						});
					});
				});
			},
			update() {
				putObj(this.form.id, this.form).then(() => {
					this.getList();
					this.$notify({
						title: '成功',
						message: '操作成功',
						type: 'success',
						duration: 2000
					});
				});
			},
			create() {
				addObj(this.form).then(() => {
					this.getList();
					this.$notify({
						title: '成功',
						message: '操作成功',
						type: 'success',
						duration: 2000
					});
				});
			},
			onCancel() {
				this.formEdit = true;
				this.formStatus = '';
			},
			resetForm() {
				this.form = {
					code: undefined,
					title: undefined,
					parentId: this.currentId,
					href: undefined,
					icon: undefined,
					orderNum: undefined,
					description: undefined,
					path: undefined,
					enabled: undefined,
					pictureUrl: undefined,
				};
			}
		}
	}
</script>
