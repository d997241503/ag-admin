<template>
	<el-dialog title="二级分类" :visible.sync="visible" top="10vh">
		<div style="width: 70%;margin: 0 auto;">
			<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-position="left"
			 label-width="150px">
				<el-form-item label="一级类别：" prop="parentId">
					<el-select class="form-item" v-model="form.parentId" style="width: 100%;">
						<el-option v-for="(item,index) in categories" :key="item.categoryId" :label="item.name" :value="item.categoryId"
						 clearable></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="二级分类：" prop="name">
					<el-input class="form-item" v-model="form.name" maxlength="10" show-word-limit placeholder="请输入二级分类名称" clearable></el-input>
				</el-form-item>
				<el-form-item label="是否关联子公司：" prop="flag">
					<el-radio-group v-model="form.flag">
						<el-radio :label="item.value" :key="item.value" v-for="(item,index) in flags">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" align="center">
				<el-button @click="visible = false">取 消</el-button>
				<el-button type="primary" @click="create('form')" :loading="loading">确 定</el-button>
			</div>
		</div>
	</el-dialog>
</template>

<script>
	import {
		saveCategory
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
				form: {
					parentId: undefined,
					name: undefined,
					flag: '1',
					sort: 0,
					type: undefined
				},
				rules: {
					name: [{
							required: true,
							message: '请输入二级分类名称',
							trigger: 'blur'
						},
						{
							validator: validateEmpty,
							trigger: 'blur'
						}
					],
					parentId: {
						required: true,
						message: '请选择一级类别',
						trigger: 'change'
					},
					flag: {
						required: true,
						message: '请选择标识',
						trigger: 'change'
					}
				},
				categories: [],
				flags: [{
					label: '是',
					value: '0'
				}, {
					label: '否',
					value: '1'
				}]
			}
		},
		methods: {
			// 初始化
			init(list) {
				this.categories = [];
				this.filterCategory(list);
				this.visible = true;
				this.$nextTick(() => {
					this.resetTemp();
				})
			},

			// 筛选一级分类
			filterCategory(list) {
				list.forEach(item => {
					if (item.type == '0') this.categories.push(item);
				});
			},

			// 创建二级分类
			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						var ary = this.categories.filter(item => {
							return item.parentId = this.form.parentId;
						})
						this.form.type = ary.length ? ary[0].type : '0';
						this.loading = true;
						saveCategory(this.form)
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
								this.$notify({
									title: '失败',
									message: '操作失败',
									type: 'error',
									duration: 2000
								});
								this.loading = false;
							})
					} else {
						return false;
					}
				});
			},

			// 重置数据
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					parentId: undefined,
					name: undefined,
					flag: '1',
					sort: 0,
					type: undefined
				};
			},

		}
	}
</script>

<style scoped>
	.form-item {
		margin-bottom: 10px;
	}
</style>
