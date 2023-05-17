<template>
	<el-dialog title="修改" :visible.sync="visible" top="10vh" :before-close="handleClose">
		<div style="width: 70%;margin: 0 auto;">
			<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-position="left"
			 label-width="150px">
				<el-form-item :label="obj.name" prop="name">
					<el-input class="form-item" v-model="form.name" maxlength="10" show-word-limit placeholder="请输入新名称" clearable></el-input>
				</el-form-item>
				<el-form-item v-if="form.children.length" v-for="(item,index) in form.children" :key="index" :label="obj.children[index].name"
				 :prop="'children.' + index + '.name'" :rules="[{ required: true,message: '请输入新名称', trigger: 'blur'},{pattern: /^\S+/, message: '请输入有效信息',trigger: 'blur'}]">
					<el-input v-model="item.name" class="form-item" maxlength="10" show-word-limit placeholder="请输入新名称" clearable>
						<el-button v-if="educationManager_btn_delete_category" slot="append" icon="el-icon-delete" @click="deletItem(obj.children[index], index)"></el-button>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" align="center">
				<el-button @click="visible=false">取 消</el-button>
				<el-button type="primary" @click="update('form')" :loading="loading">确 定</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		updateCategory,
		deleteCategory
	} from 'api/incorrupt/education/index';
	export default {
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			return {
				visible: false,
				loading: false,
				obj: {},
				form: {
					categoryId: undefined,
					name: undefined,
					children: [],
				},
				deleteOperation: false, //是否进行了移除操作
				rules: {
					name: [{
							required: true,
							message: '请输入新名称',
							trigger: 'blur'
						},
						{
							validator: validateEmpty,
							trigger: 'blur'
						}
					],
				},
				educationManager_btn_delete_category: false,
			}
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		created() {
			this.educationManager_btn_delete_category = this.elements['educationManager:btn_delete_category'];
		},
		methods: {
			// 初始化页面
			init(data) {
				this.visible = true;
				this.$nextTick(() => {
					this.resetTemp();
					this.initData(data);
				})
			},

			// 初始化数据
			initData(data) {
				this.obj = data;
				this.form.categoryId = this.obj.categoryId;
				this.form.name = this.obj.name;
				this.obj.children.forEach(item => {
					this.form.children.push({
						categoryId: item.categoryId,
						name: item.name,
					});
				});
			},

			handleClose(done) {
				// 如果执行了删除操作，则关闭弹窗前刷新列表
				if (this.deleteOperation) this.$emit('refreshData');
				done();
			},

			// 移除分类
			deletItem(row, index) {
				var hintStr = "此操作将永久移除, 是否继续?";
				if (row.count) hintStr = row.name + "下存在" + row.count + "条数据, 删除后将无法恢复, 是否继续删除操作?"
				this.$confirm(hintStr, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						deleteCategory({
								categoryId: row.categoryId
							})
							.then(res => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '移除成功',
										type: 'success',
										duration: 2000
									});
									this.form.children.splice(index, 1);
									this.obj.children.splice(index, 1);
									this.deleteOperation = true;
								} else {
									this.$notify({
										title: '失败',
										message: '移除失败',
										type: 'error',
										duration: 2000
									});
								}
							}).catch(() => {});;
					}).catch(() => {

					});
			},

			// 修改类别
			update(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						updateCategory(this.form)
							.then((res) => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										this.visible = false;
										this.loading = false;
										this.$emit('refreshData');
									}, 2000)
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000
									});
									this.loading = false;
								}
							}).catch(() => {
								this.loading = false;
							})
					} else {
						return false;
					}
				});
			},
			resetTemp() {
				this.form = {
					categoryId: undefined,
					name: undefined,
					children: [],
				};
				this.deleteOperation = false;
				this.$refs.form.resetFields();
			}
		}
	}
</script>

<style scoped>
	.form-item {
		margin-bottom: 10px;
	}
</style>
