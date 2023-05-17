<template>
	<div>
		<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-width="100px">
			<div class="cut-line">
				账号信息
			</div>
			<el-divider></el-divider>
			<el-row>
				<el-col :span="11">
					<el-form-item label="账户" prop="username">
						<el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
						<div v-else style="padding-left: 15px;color: #606266;">{{form.username}}</div>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="dialogStatus == 'create'">
				<el-col :span="11">
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="dialogStatus == 'create'">
				<el-col :span="11">
					<el-form-item label="确认密码" prop="confirmPassword">
						<el-input type="password" v-model="form.confirmPassword" placeholder="再次输入密码"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<div class="cut-line">
				用户信息
			</div>
			<el-divider></el-divider>
			<el-row>
				<el-form-item label="所属部门" prop="departmentId">
					<!-- <el-input v-if="dialogStatus == 'create'" v-model="form.departmentName" placeholder="点击右侧按钮选择部门" readonly> -->
					<el-input v-model="form.departmentName" placeholder="点击右侧按钮选择部门" readonly>
						<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
							<el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
								<span class="custom-tree-node" slot-scope="{ node, data }">
									<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
								</span>
							</el-tree>
							<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
						</el-popover>
					</el-input>
					<!-- <el-input v-else v-model="form.departmentName" readonly></el-input> -->
				</el-form-item>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="姓名" prop="name">
						<el-input v-model="form.name" placeholder="请输入姓名" maxlength="10" show-word-limit></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="身份证" prop="idCard">
						<el-input v-model="form.idCard" clearable placeholder="请输入身份证"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="性别">
						<el-radio-group v-model="form.sex">
							<el-radio label="1">男</el-radio>
							<el-radio label="0">女</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="出生日期">
						<el-date-picker style="width: 100%;" v-model="form.birthday" type="date" placeholder="请选择出生日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="民族">
						<el-input v-model="form.nation" clearable placeholder="请输入民族" maxlength="10" show-word-limit></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="籍贯">
						<el-input v-model="form.nativePlace" clearable placeholder="请输入籍贯" maxlength="10" show-word-limit></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="学历">
						<el-select v-model="form.education" clearable placeholder="请选择学历" style="width: 100%;">
							<el-option v-for="item in educations" :key="item.code" :label="item.value" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="政治面貌">
						<el-select v-model="form.politicalOutlook" clearable placeholder="请选择政治面貌" style="width: 100%;">
							<el-option v-for="item in politicalOutlooks" :key="item.code" :label="item.value" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="手机号码" prop="mobilePhone">
						<el-input v-model="form.mobilePhone" clearable placeholder="请输入手机号码"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="固定电话" prop="telPhone">
						<el-input v-model="form.telPhone" clearable placeholder="请输入固定电话"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="邮箱" prop="email">
						<el-input v-model="form.email" clearable placeholder="请输入邮箱"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="家庭住址">
						<el-input v-model="form.address" clearable placeholder="请输入家庭住址" maxlength="30" show-word-limit></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="工作单位">
						<el-input v-model="form.workUnit" clearable placeholder="请输入工作单位" maxlength="20" show-word-limit></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="参加工作日期">
						<el-date-picker type="date" v-model="form.dateOfWork" style="width: 100%;" clearable placeholder="请选择参加工作日期"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="职级">
						<el-select v-model="form.rank" clearable placeholder="请选择职级" style="width: 100%;">
							<el-option v-for="item in ranks" :key="item.code" :label="item.value" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="职务">
						<el-input v-model="form.post" clearable placeholder="请输入职务" maxlength="20" show-word-limit></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			
			<el-row>
				<el-col :span="11">
					<el-form-item label="备注说明">
						<el-input v-model="form.description" type="textarea" maxlength="100" resize="none"  placeholder="请输入备注说明"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="序号">
						<el-input v-model="form.sort"  maxlength="100" resize="none" show-word-limit placeholder="请输入序号"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer" align="right">
			<el-button @click="cancel('form')">取 消</el-button>
			<el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" :loading="loading">提 交</el-button>
			<el-button v-else type="primary" @click="update('form')" :loading="loading">修 改</el-button>
		</div>
	</div>
</template>

<script>
	import {
		addObj,
		getObj,
		putObj
	} from 'api/admin/user/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		isIdCard,
		isMobile,
		isEmail,
		isPhone
	} from '@/utils/validate';
	import {
		toDate
	} from '@/utils'
	export default {
		name: 'user',
		data() {
			var validateConfirmPassword = (rule, value, callback) => {
				if (this.form.password !== value) {
					callback(new Error('两次密码不一致'))
				} else {
					callback()
				}
			};
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			var validateIdCard = (rule, value, callback) => {
				if (!isIdCard(value)) {
					callback(new Error('身份证格式错误'))
				} else {
					callback()
				}
			};
			var validateEmail = (rule, value, callback) => {
				if (value ? !isEmail(value) : false) {
					callback(new Error('邮箱格式错误'))
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
					id: undefined,
					username: undefined,
					name: undefined,
					sex: '1',
					password: undefined,
					confirmPassword: undefined,
					description: undefined,
					departmentName: undefined,
					departmentId: undefined,
					birthday: undefined,
					address: undefined,
					mobilePhone: undefined,
					telPhone: undefined,
					email: undefined,
					idCard: undefined,
					nation: undefined,
					nativePlace: undefined,
					education: undefined,
					politicalOutlook: undefined,
					workUnit: undefined,
					dateOfWork: undefined,
					rank: undefined,
					post: undefined,
					sort:undefined
				},
				rules: {
					name: [{
							required: true,
							message: '请输入用户',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					username: [{
							required: true,
							message: '请输入账户',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20,
							message: '长度在 3 到 20 个字符',
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 20,
							message: '密码长度不能低于6位',
							trigger: 'blur'
						}
					],
					confirmPassword: [{
							required: true,
							message: '确认密码不能为空',
							trigger: 'blur'
						},
						{
							validator: validateConfirmPassword,
							trigger: 'blur'
						}
					],
					departmentId: [{
						required: true,
						message: '请选择部门',
						trigger: 'change'
					}],
					idCard: [{
							required: true,
							message: '身份证不能为空',
							trigger: 'blur'
						},
						{
							validator: validateIdCard,
							trigger: 'blur'
						}
					],
					email: [{
							required: false,
							trigger: 'blur'
						},
						{
							validator: validateEmail,
							trigger: 'blur'
						}
					],
					mobilePhone: [{
							required: false,
							trigger: 'blur'
						},
						{
							validator: validateMobilePhone,
							trigger: 'blur'
						}
					],
					telPhone: [{
							required: false,
							trigger: 'blur'
						},
						{
							validator: validateTelPhone,
							trigger: 'blur'
						}
					]
				},
				dialogStatus: false,
				loading: false,
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentName'
				},
				educations: [],
				politicalOutlooks: [],
				ranks: [],
			}
		},
		created() {
			this.defaultProps.label = this.deptFields;
			// 获取学历
			this.getDataDicts("education").then((res) => {
				this.educations = res
			});
			// 获取政治面貌
			this.getDataDicts("politicalOutlook").then((res) => {
				this.politicalOutlooks = res
			});
			// 获取职级
			this.getDataDicts("rank").then((res) => {
				this.ranks = res
			});
			this.getTreeInfo();
			this.$nextTick(() => {
				this.resetTemp();
			})
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			init(id) {
				if (id) {
					getObj(id)
						.then(response => {
							this.form = response.data;
							this.dialogStatus = 'update';
						});
				} else {
					this.$nextTick(() => {
						this.dialogStatus = "create";
					})
				}
			},
			handlePartyBranch(data) {
				this.form.departmentId = data.id;
				this.form.departmentName = data.departmentName;
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

			// 获取字典
			getDataDicts(type) {
				if (!type) return
				let val = null
				val = getByType({
						type: type
					})
					.then(res => {
						if (res && res.code === 0) {
							return res.data;
						} else {
							this.$notify({
								title: '失败',
								message: '获取数据字典失败',
								type: 'success',
								duration: 2000
							});
						}
					});
				return Promise.resolve(val)
			},
			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						this.form.birthday = toDate(this.form.birthday);
						this.form.dateOfWork = toDate(this.form.dateOfWork);
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
										this.loading = false;
										this.$emit("refreshData");
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
							})
					} else {
						return false;
					}
				});
			},
			cancel(formName) {
				this.$emit("refreshData");
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
								this.form.birthday = toDate(this.form.birthday);
								this.form.dateOfWork = toDate(this.form.dateOfWork);
								putObj(this.form.id, this.form).then(res => {
									if (res && res.code === 0) {
										this.$notify({
											title: '成功',
											message: '操作成功',
											type: 'success',
											duration: 2000
										});
										setTimeout(() => {
											this.loading = false;
											this.$emit("refreshData");
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
					}).catch(() => {

					});
			},
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					id: undefined,
					username: undefined,
					name: undefined,
					sex: '1',
					password: undefined,
					confirmPassword: undefined,
					description: undefined,
					departmentName: undefined,
					departmentId: undefined,
					birthday: undefined,
					address: undefined,
					mobilePhone: undefined,
					telPhone: undefined,
					email: undefined,
					idCard: undefined,
					nation: undefined,
					nativePlace: undefined,
					education: undefined,
					politicalOutlook: undefined,
					workUnit: undefined,
					dateOfWork: undefined,
					rank: undefined,
					post: undefined
				};
			}
		}
	}
</script>

<style scoped>
	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}

	.cut-line {
		font-size: 18px;
		font-weight: 600;
		border-left: 5px solid #bc0000;
		padding-left: 20px;
	}
</style>
