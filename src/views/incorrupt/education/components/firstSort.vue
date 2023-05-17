<template>
	<el-dialog title="一级类别" :visible.sync="visible" top="10vh">
		<div style="width: 70%;margin: 0 auto;">
			<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-position="left"
			 label-width="150px">
				<el-form-item label="名称：" prop="name">
					<el-input v-model="form.name" maxlength="10" show-word-limit placeholder="请输入名称" clearable></el-input>
				</el-form-item>
				<el-form-item label="属性：" prop="type">
					<el-radio-group v-model="form.type">
						<el-radio :label="item.value" :key="item.value" v-for="(item,index) in types">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否关联子公司：" prop="flag">
					<el-radio-group v-model="form.flag">
						<el-radio :label="item.value" :key="item.value" v-for="(item,index) in flags">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="展示顺序：" prop="sort">
					<el-input-number v-model="form.sort" @change="sortChange" :min="0" style="width: 100%;"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" align="center">
				<el-button @click="visible=false">取 消</el-button>
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
					parentId: 0,
					name: undefined,
					type: '0',
					sort: 0,
					flag: '1'
				},
				rules: {
					name: [{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						},
						{
							validator: validateEmpty,
							trigger: 'blur'
						}
					],
					type: {
						required: true,
						message: '请选择属性',
						trigger: 'change'
					},
					flag: {
						required: true,
						message: '请选择标识',
						trigger: 'change'
					},
					sort: {
						required: true,
						message: '请选择属性',
						trigger: 'change'
					}
				},
				types: [{
					label: '编辑类',
					value: '0'
				}, {
					label: '链接类',
					value: '1'
				}],
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
			init(val) {
				this.visible = true;
				this.$nextTick(() => {
					this.resetTemp();
				})
			},

			// 排序监听
			sortChange(currentValue, oldValue) {
				if (currentValue === undefined) {
					this.$nextTick(() => {
						this.form.sort = oldValue;
					})
				}
			},

			// 创建一级类别
			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
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
					parentId: 0,
					name: undefined,
					type: '0',
					sort: 0,
					flag: '1'
				};
			},

		}
	}
</script>

<style>
</style>
