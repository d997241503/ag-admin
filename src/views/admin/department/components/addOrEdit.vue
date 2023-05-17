<template>
	<div>
		<el-form :model="form" :rules="rules" ref="form" label-width="100px">
			<div class="cut-line">
				基本信息
			</div>
			<el-divider></el-divider>
			<el-row>
				<el-form-item label="上级部门">
					<el-input v-model="form.parentName" placeholder="点击右侧按钮选择上级部门" readonly>
						<el-popover slot="append" v-model="treeVisible" placement="left-start" trigger="click">
							<!-- <el-tree :data="treeData" :props="defaultProps" @node-click="handlePartyBranch" class="roll-containers"></el-tree> -->
							<el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
								<span class="custom-tree-node" slot-scope="{ node, data }">
									<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
								</span>
							</el-tree>
							<el-button slot="reference" icon="el-icon-thumb" :disabled="formTree">选择</el-button>
						</el-popover>
					</el-input>
				</el-form-item>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="部门名称" prop="departmentName">
						<el-input v-model="form.departmentName" maxlength="20" show-word-limit clearable placeholder="请输入部门名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="部门编码" prop="departmentCode">
						<el-input v-model="form.departmentCode" maxlength="20" show-word-limit clearable placeholder="请输入部门编码"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="部门全称" prop="departmentFullName">
						<el-input v-model="form.departmentFullName" maxlength="20" show-word-limit clearable placeholder="请输入部门全称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="部门属性" prop="departmentAttribute">
						<el-select v-model="form.departmentAttribute" clearable placeholder="请选择" style="width: 100%;">
							<el-option v-for="item in departments" :key="item.code" :label="item.value" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-row>
				<el-col :span="11">
					<el-form-item label="排序" prop="sort">
						<el-input-number v-model="form.sort" :min="1" :max="99" style="width: 100%;" placeholder="请输序号"></el-input-number>
					</el-form-item>
				</el-col>
			</el-row> -->
			<div class="cut-line">
				联系信息
			</div>
			<el-divider></el-divider>
			<el-row>
				<el-col :span="11">
					<el-form-item label="部门电话" prop="departmentPhone">
						<el-input v-model="form.departmentPhone" clearable placeholder="请输入部门电话"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="邮政编码" prop="postalCode">
						<el-input v-model="form.postalCode" clearable placeholder="请输入邮政编码"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="传真" prop="fax">
						<el-input v-model="form.fax" placeholder="请输入传真" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="联系人姓名">
						<el-input v-model="form.contactsName" show-word-limit placeholder="请输入联系人姓名" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="手机号码" prop="contactsPhone">
						<el-input v-model="form.contactsPhone" placeholder="请输入联系人手机号码" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item label="备注说明">
					<el-input v-model="form.remarks" type="textarea" maxlength="100" resize="none" show-word-limit placeholder="请输入备注说明"></el-input>
				</el-form-item>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer" align="right">
			<el-button @click="cancel('form')">取 消</el-button>
			<el-button v-if="dialogStatus=='add'" type="primary" @click="create('form')" :loading="loading">提 交</el-button>
			<el-button v-else type="primary" @click="update('form')" :loading="loading">修 改</el-button>
		</div>
	</div>
</template>

<script>
	import {
		getTree,
		addObj,
		getObj,
		putObj
	} from 'api/admin/department/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		isMobile,
		isPhone,
		isZip,
		isFax
	} from '@/utils/validate';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			var validateZip = (rule, value, callback) => {
				if (value ? !isZip(value) : false) {
					callback(new Error('邮政编码格式错误'))
				} else {
					callback()
				}
			};
			var validateFax = (rule, value, callback) => {
				if (value ? !isFax(value) : false) {
					callback(new Error('传真格式错误'))
				} else {
					callback()
				}
			};
			var validateMobilePhone = (rule, value, callback) => {
				if (value ? !isMobile(value) : false) {
					callback(new Error('手机格式错误'))
				} else {
					callback()
				}
			};
			var validateTelPhone = (rule, value, callback) => {
				if (value ? !isPhone(value) : false) {
					callback(new Error('固定号码格式错误'))
				} else {
					callback()
				}
			};
			return {
				form: {
					parentId: -1,
					parentName: undefined,
					departmentName: undefined,
					departmentCode: undefined,
					departmentFullName: undefined,
					departmentAttribute: undefined,
					departmentPhone: undefined,
					postalCode: undefined,
					fax: undefined,
					contactsName: undefined,
					contactsPhone: undefined,
					remarks: undefined
				},
				rules: {
					departmentName: [{
							required: true,
							message: '请输入部门名称',
							trigger: 'blur'
						},
						{
							// min: 3,
							// max: 20,
							validator: validateEmpty,
							// message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					departmentCode: [{
							required: true,
							message: '请输入部门编码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					departmentFullName: [{
						required: false,
						trigger: 'blur'
					}],
					departmentAttribute: [{
						required: true,
						message: '请输入部门属性',
						trigger: 'blur'
					}, ],
					sort: [{
						required: true,
						message: '请输入序号',
						trigger: 'blur'
					}],
					departmentPhone: [{
						required: false,
						trigger: 'blur'
					}, {
						validator: validateTelPhone,
						trigger: 'blur'
					}],
					postalCode: [{
						required: false,
						trigger: 'blur'
					}, {
						validator: validateZip,
						trigger: 'blur'
					}],
					fax: [{
						required: false,
						trigger: 'blur'
					}, {
						validator: validateFax,
						trigger: 'blur'
					}],
					contactsName: [{
						required: true,
						message: '请输入联系人姓名',
						trigger: 'blur'
					}],
					contactsPhone: [{
						required: false,
						trigger: 'blur'
					}, {
						validator: validateMobilePhone,
						trigger: 'blur'
					}],
					remarks: [{
						required: true,
						message: '请输入备注说明',
						trigger: 'blur'
					}]
				},
				dialogStatus: false,
				loading: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentName'
				},
				baseDict: {
					type: 'department'
				},
				departments: [{}],
				formTree: false,
				treeVisible: false
			}
		},
		computed: {
			...mapGetters([
				'deptFields'
			])
		},
		created() {
			this.defaultProps.label = this.deptFields
		},
		mounted() {
			this.getTreeInfo();
			this.getDataDict();
		},
		methods: {
			init(val) {
				this.$refs.form.resetFields();
				switch (val.status) {
					case 'add':
						this.form.parentId = val.id ? val.id : -1;
						this.form.parentName = val.departmentName;
						this.dialogStatus = val.status;
						this.formTree = val.formTree;
						break;
					case 'edit':
						this.form.id = val.id;
						this.formTree = val.formTree;
						this.getDataDetail();
						break;
					default:
						break;
				}
			},
			handlePartyBranch(data) {
				this.form.parentId = data.id;
				this.form.parentName = data.departmentName;
				this.treeVisible = false;
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

			// 获取部门属性
			getDataDict() {
				getByType(this.baseDict)
					.then(response => {
						if (response && response.code === 0) {
							this.departments = response.data ? response.data : [];
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

			// 获取部门详情
			getDataDetail() {
				if (this.form.id) {
					getObj(this.form.id)
						.then(response => {
							if (response && response.code === 0) {
								this.form = response.data ? response.data : {};
							} else {
								this.$notify({
									title: '失败',
									message: '获取部门属性失败',
									type: 'success',
									duration: 2000
								});
							}
						});
				}
			},

			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addObj(this.form)
							.then(() => {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 1000
								});
								setTimeout(() => {
									this.loading = false;
									this.$emit('refreshData', true);
								}, 1000)
							})
					} else {
						return false;
					}
				});
			},
			cancel(formName) {
				const set = this.$refs;
				set[formName].resetFields();
				this.$emit('refreshData', false)
			},
			update(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						putObj(this.form).then((res) => {
							if (res.code === 0) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000
								});
								setTimeout(() => {
									this.loading = false;
									this.$emit('refreshData', true);
								}, 2000)
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
								setTimeout(() => {
									this.loading = false;
								}, 2000)
							}
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

<style scoped>
	.cut-line {
		font-size: 18px;
		font-weight: 600;
		border-left: 5px solid #bc0000;
		padding-left: 20px;
	}
</style>
