<template>
	<div>
		<k-form-design class="form-design-page" ref="kfd" :showHead="false" @save="handleSave" hideResetHint />
		<el-dialog title="表单信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="表单名" prop="name">
					<el-input v-model="form.name" placeholder="请输入表单名" />
				</el-form-item>
				<el-form-item label="表单类型" prop="type">
					<el-select v-model="form.type" placeholder="表单类型" clearable style="width: 100%;">
						<el-option v-for="dict in formTypes" :key="dict.code" :label="dict.value"
						:value="dict.code" />
					</el-select>
				</el-form-item>
				<el-form-item label="所属类别" prop="formTypeName">
					<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
						<el-tree :data="typeData" style="min-width: 350px;" node-key="id" :expand-on-click-node="false" 
							@node-click="handlePartyBranch" :props="defaultProps" highlight-current class="roll-containers">
							<span class="custom-tree-node show-hide" slot-scope="{ node, data }" tabindex="1">
								<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
								<span style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 15px;">{{ node.label }}
								</span>
								<div v-if="!$route.query.formId && (data.formId || data.name == '个人有关事项报告表' || data.name == '个人档案')" class="disabled" @click.stop></div>
								<div v-if="$route.query.formId && (data.name == '个人有关事项报告表' || data.name == '个人档案')" class="disabled" @click.stop></div>
							</span>
						</el-tree>
						<el-select style="width: 100%;" v-model="form.formTypeName" placeholder="请选择所属类别" class="input-item" slot="reference"
							ref="selectIt" @focus="closeIt">
						</el-select>
					</el-popover>
				</el-form-item>
				<el-form-item label="开启状态" prop="status">
					<el-radio-group v-model="form.status">
						<el-radio v-for="dict in this.status" :key="dict.value" :label="parseInt(dict.value)">
							{{dict.label}}
						</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="form.remark" placeholder="请输入备注" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		createForm,
		getForm,
		updateForm
	} from "@/api/bpm/form";
	import {
		formtypeTree
	} from 'api/bpm/categoryMan';
	import {
		getByType
	} from 'api/admin/dict/index';
	export default {
		data() {
			return {
				form: {
					id: undefined,
					name: '',
					status: 0,
					remark: '',
					type: '0',
					formTypeId: undefined,
					formTypeName: '',
				},
				status: [{
						"value": "0",
						"label": "开启",
						"colorType": "primary",
						"cssClass": ""
					},
					{
						"value": "1",
						"label": "关闭",
						"colorType": "info",
						"cssClass": ""
					}
				],
				// 表单校验
				rules: {
					name: [{
						required: true,
						message: "表单名不能为空",
						trigger: "blur"
					}],
					type: [{
						required: true,
						message: "表单类型不能为空",
						trigger: "change"
					}],
					// formTypeName: [{
					// 	required: true,
					// 	message: "所属类别不能为空",
					// 	trigger: "change"
					// }],
					status: [{
						required: true,
						message: "开启状态不能为空",
						trigger: "blur"
					}],
				},
				formData: {
					conf: undefined,
					fields: []
				},
				dialogVisible: false,
				// 数据字典
				formTypes: [],
				baseDict: {
					type: 'formTypes'
				},
				typeData: [],
				popoverVisibel: false,
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				loading: true
			}
		},
		mounted() {
			this.getDataDict();
		},
		created() {
			// 读取表单配置
			const formId = this.$route.query && this.$route.query.formId
			this.getTreeInfo();
			if (formId) {
				this.getDetail(formId);
			}
		},
		methods: {
			// 获取树结构
			getTreeInfo() {
				formtypeTree({ name: '', type: '' })
					.then(res => {
						if (res && res.status === 200) {
							this.typeData = res.data ? res.data : [];
							this.loading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取树结构失败",
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
			// 选择
			handlePartyBranch(data) {
				this.form.formTypeId = data.id;
				this.form.formTypeName = data.name;
				this.popoverVisibel = false;
			},
			// 获取表单类型
			getDataDict() {
				getByType(this.baseDict)
					.then(response => {
						if (response && response.code === 0) {
							this.formTypes = response.data ? response.data : [];
						} else {
							this.$notify({
							title: '失败',
							message: '获取表单类型失败',
							type: 'success',
							duration: 2000
							});
						}
					});
			},
			// 获取详情
			getDetail(formId) {
				getForm(formId).then(response => {
					const data = response.data
					if (data.fields && !data.fields.length) return
					this.form = {
						id: data.id,
						name: data.name,
						status: data.status,
						remark: data.remark,
						type: data.type,
						formTypeId: data.formTypeId,
						formTypeName: data.formTypeName
					}
					let jsonData = {
						config: undefined,
						list: []
					}
					jsonData.config = JSON.parse(data.conf);
					data.fields.forEach(item => {
						jsonData.list.push(JSON.parse(item));
					})
					this.$refs.kfd.handleSetData(jsonData);
				});
			},
			// 保存
			handleSave(values) {
				var formObj = JSON.parse(values);
				this.formData.conf = undefined;
				this.formData.fields = [];
				if (!values || !formObj.list.length) return this.$message.error('请设置表单');
				this.formData.conf = JSON.stringify(formObj.config);
				formObj.list.forEach(item => {
					this.formData.fields.push(JSON.stringify(item))
				})
				this.dialogVisible = true;
			},
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (!valid) {
						return;
					}
					// 修改的提交
					if (this.form.id != null) {
						updateForm({
							...this.formData,
							...this.form
						}).then(response => {
							this.$notify({
								title: '提示',
								message: '修改成功',
								type: 'success',
								duration: 2000
							});
							this.$router.go(-1);
						});
						return;
					}
					// 新增
					createForm({
						...this.formData,
						...this.form
					}).then(response => {
						this.$notify({
							title: '提示',
							message: '新增成功',
							type: 'success',
							duration: 2000
						});
						this.$router.go(-1);
					});
				})
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
						this.form = {
							id: undefined,
							name: '',
							status: '0',
							remark: ''
						}
					})
					.catch(_ => {});
			}
		}
	}
</script>

<style lang="scss">
	.form-design-page {
		// position: relative;
		// z-index: 9;
	}
	.custom-tree-node {
		position: relative;
	}
	.disabled {
		cursor: not-allowed;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		opacity: 0.7;
	}
	a {
		position: relative !important;
	}
	.notclickable {
		pointer-events:none
	}
</style>
