<template>
	<div>
		<!-- 列表弹窗 -->
		<el-dialog title="任务分配规则" :visible.sync="visible" width="800px" append-to-body>
			<el-table v-loading="loading" :data="list">
				<el-table-column label="任务名" align="center" prop="taskDefinitionName" width="120" fixed />
				<el-table-column label="任务标识" align="center" prop="taskDefinitionKey" width="120"
					show-tooltip-when-overflow />
				<el-table-column label="审批表单" align="center" prop="formId" width="120">
					<template slot-scope="scope">
						<span>
							<el-tag v-for="(item, index) in forms" :key="index"
								v-show="scope.row.formId + '' === item.id + ''">{{item.name}}
							</el-tag>
						</span>
					</template>
				</el-table-column>
				<el-table-column label="规则类型" align="center" prop="type" width="120">
					<template slot-scope="scope">
						<span>
							<el-tag v-for="(item, index) in taskAssignRuleTypeDictDatas" :key="index"
								v-show="scope.row.type + '' === item.value">{{item.label}}
							</el-tag>
						</span>
					</template>
				</el-table-column>
				<el-table-column label="规则范围" align="center" prop="auditorInfo" width="440px">
					<template slot-scope="scope">
						<el-tag size="medium" v-if="scope.row.auditorInfo"
							v-for="(option, index) in scope.row.auditorInfo" :key="index">
							<!-- {{ getAssignRuleOptionName(scope.row.type, option) }} -->
							{{ option.name }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column v-if="modelId" label="操作" align="center" width="80" fixed="right">
					<template slot-scope="scope">
						<el-button v-if="!elements['bpm:task-assign-rule:update']" size="mini" type="text"
							icon="el-icon-edit" @click="handleUpdateTaskAssignRule(scope.row)">
							修改</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<!-- 添加/修改弹窗 -->
		<el-dialog title="修改任务规则" :visible.sync="open" width="500px" append-to-body>
			<el-form ref="taskAssignRuleForm" :model="form" :rules="rules" label-width="110px">
				<el-form-item label="任务名称" prop="taskDefinitionName">
					<el-input v-model="form.taskDefinitionName" disabled />
				</el-form-item>
				<el-form-item label="任务标识" prop="taskDefinitionKey">
					<el-input v-model="form.taskDefinitionKey" disabled />
				</el-form-item>
				<el-form-item label="规则类型" prop="type">
					<el-select v-model="form.type" clearable style="width: 100%">
						<el-option v-for="dict in taskAssignRuleTypeDictDatas" :key="parseInt(dict.value)"
							:label="dict.label" :value="parseInt(dict.value)" />
					</el-select>
				</el-form-item>
				<el-form-item class="item-text--info" v-if="form.type === 10" label="指定角色" prop="roleIds">
					<treeselect v-model="form.roleIds" :options="roleOptions" :multiple="true" :flat="true"
						:normalizer="rollNormalizer" :default-expand-level="1" placeholder="选择角色" />
				</el-form-item>
				<el-form-item class="item-text--info" v-if="form.type === 20 || form.type === 21" label="指定部门"
					prop="deptIds">
					<treeselect v-model="form.deptIds" :options="deptTreeOptions" multiple flat
						:default-expand-level="1" placeholder="请选择指定部门" :normalizer="normalizer" />
				</el-form-item>
				<el-form-item v-if="form.type === 22" label="指定岗位" prop="postIds">
					<el-select v-model="form.postIds" multiple clearable style="width: 100%">
						<el-option v-for="item in postOptions" :key="parseInt(item.id)" :label="item.name"
							:value="parseInt(item.id)" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="form.type === 30 || form.type === 31 || form.type === 32" label="指定用户"
					prop="userIds">
					<el-select v-model="form.userIds" multiple filterable remote placeholder="请输入关键词"
						:remote-method="remoteLeaderMethod" :loading="userLoading">
						<el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="form.type === 40" label="指定用户组" prop="userGroupIds">
					<el-select v-model="form.userGroupIds" multiple clearable style="width: 100%">
						<el-option v-for="item in userGroupOptions" :key="parseInt(item.id)" :label="item.name"
							:value="parseInt(item.id)" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="form.type === 50" label="指定脚本" prop="scripts">
					<el-select v-model="form.scripts" multiple clearable style="width: 100%">
						<el-option v-for="dict in taskAssignScriptDictDatas" :key="parseInt(dict.value)"
							:label="dict.label" :value="parseInt(dict.value)" />
					</el-select>
				</el-form-item>
				<el-form-item label="流程表单" prop="formId">
					<el-select v-model="form.formId" clearable style="width: 100%">
						<el-option v-for="form in forms" :key="form.id" :label="form.name" :value="form.id" />
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitAssignRuleForm">确 定</el-button>
				<el-button @click="cancelAssignRuleForm">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		DICT_TYPE,
		getDictDatas
	} from "@/utils/dict";
	import {
		createTaskAssignRule,
		getTaskAssignRuleList,
		updateTaskAssignRule
	} from "@/api/bpm/taskAssignRule";
	import {
		getForm,
		getSimpleForms
	} from "@/api/bpm/form";
	import {
		listSimpleRoles
	} from "@/api/admin/group"; //获取角色组
	import {
		listSimpleDepts
	} from "@/api/admin/department"; //获取部门组
	import {
		page
	} from '@/api/admin/user'; //获取用户
	import Treeselect from "@riophae/vue-treeselect";
	import "@riophae/vue-treeselect/dist/vue-treeselect.css";
	// import {listSimplePosts} from "@/api/system/post";
	// import {listSimpleUsers} from "@/api/system/user";
	// import {
	// 	listSimpleUserGroups
	// } from "@/api/bpm/userGroup";
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: "taskAssignRuleDialog",
		components: {
			Treeselect
		},
		data() {
			return {
				// 如下参数，可传递
				modelId: undefined, // 流程模型的编号。如果 modelId 非空，则用于流程模型的查看与配置
				processDefinitionId: undefined, // 流程定义的编号。如果 processDefinitionId 非空，则用于流程定义的查看，不支持配置
				visible: false,
				userLoading: false,
				// 任务分配规则表单
				row: undefined, // 选中的流程模型
				list: [], // 选中流程模型的任务分配规则们
				loading: false, // 加载中
				open: false, // 是否打开
				form: {}, // 表单
				rules: { // 表单校验规则
					type: [{
						required: true,
						message: "规则类型不能为空",
						trigger: "change"
					}],
					roleIds: [{
						required: true,
						message: "指定角色不能为空",
						trigger: "change"
					}],
					deptIds: [{
						required: true,
						message: "指定部门不能为空",
						trigger: "change"
					}],
					postIds: [{
						required: true,
						message: "指定岗位不能为空",
						trigger: "change"
					}],
					userIds: [{
						required: true,
						message: "指定用户不能为空",
						trigger: "change"
					}],
					userGroupIds: [{
						required: true,
						message: "指定用户组不能为空",
						trigger: "change"
					}],
					scripts: [{
						required: true,
						message: "指定脚本不能为空",
						trigger: "change"
					}],
				},
				// 流程表单的下拉框的数据
				forms: [],
				// 各种下拉框
				roleOptions: [],
				deptOptions: [],
				deptTreeOptions: [],
				postOptions: [],
				userOptions: [],
				userGroupOptions: [],
				// // 数据字典
				taskAssignRuleTypeDictDatas: [{
					"value": "10",
					"label": "角色",
					"colorType": "info",
					"cssClass": ""
				}, {
					"value": "20",
					"label": "部门的成员",
					"colorType": "primary",
					"cssClass": ""
				}, {
					"value": "30",
					"label": "用户",
					"colorType": "info",
					"cssClass": ""
				}],
				taskAssignScriptDictDatas: [{
					"value": "10",
					"label": "流程发起人",
					"colorType": "",
					"cssClass": ""
				}, {
					"value": "20",
					"label": "流程发起人的一级领导",
					"colorType": "",
					"cssClass": ""
				}, {
					"value": "21",
					"label": "流程发起人的二级领导",
					"colorType": "",
					"cssClass": ""
				}],
			};
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		methods: {
			initModel(modelId) {
				this.modelId = modelId;
				this.processDefinitionId = undefined;
				// 初始化所有下拉框
				this.init0();
			},
			initProcessDefinition(processDefinitionId) {
				this.modelId = undefined;
				this.processDefinitionId = processDefinitionId;

				// 初始化所有下拉框
				this.init0();
			},
			/** 初始化 */
			init0() {
				// 设置可见
				this.visible = true;
				// 获得列表
				this.getList();

				// 获得角色列表
				this.roleOptions = [];
				listSimpleRoles().then(response => {
					let ary = response.data;
					for (let i = 0; i < ary.length; i++) {
						ary[i] = {
							...ary[i],
							isDisabled: true,
							id: 998899 + i,
						}
					}
					this.roleOptions.push(...ary);
				});
				// 获得流程表单的下拉框的数据
				getSimpleForms().then(response => {
					this.forms = response.data
				})
				// 获得部门列表
				this.deptOptions = [];
				this.deptTreeOptions = [];
				listSimpleDepts().then(response => {
					this.deptOptions.push(...response.data);
					this.deptTreeOptions.push(...this.handleTree(response.data, "id"));
				});
				// 获得岗位列表
				this.postOptions = [];
				// listSimplePosts().then(response => {
				// 	this.postOptions.push(...response.data);
				// });
				// // 获得用户列表
				// this.userOptions = [];
				// listSimpleUsers().then(response => {
				// 	this.userOptions.push(...response.data);
				// });
				// 获得用户组列表
				this.userGroupOptions = [];
				// listSimpleUserGroups().then(response => {
				// 	this.userGroupOptions.push(...response.data);
				// });
			},
			// 获取用户
			remoteLeaderMethod(query) {
				if (query !== '') {
					this.userLoading = true;
					this.userLoading = false;
					page({
						name: query
					}).then(response => {
						this.userOptions = response.data.rows;
						this.userLoading = false;
					});
				} else {
					this.userOptions = [];
				}
			},
			/** 转换角色数据结构 */
			rollNormalizer(node) {
				if (node.children && !node.children.length) {
					delete node.children;
				}
				return {
					id: node.id,
					label: node.name,
					children: node.children
				};
			},
			/** 获得任务分配规则列表 */
			getList() {
				this.loading = true;
				getTaskAssignRuleList({
					modelId: this.modelId,
					processDefinitionId: this.processDefinitionId,
				}).then(response => {
					this.loading = false;
					this.list = response.data;
				})
			},
			/** 处理修改任务分配规则的按钮操作 */
			handleUpdateTaskAssignRule(row) {
				// 先重置标识
				this.resetAssignRuleForm();
				// 设置表单
				this.form = {
					...row,
					options: [],
					roleIds: [],
					deptIds: [],
					postIds: [],
					userIds: [],
					userGroupIds: [],
					scripts: [],
				};
				// 将 options 赋值到对应的 roleIds 等选项
				if (row.type === 10) {
					this.form.roleIds.push(...row.options);
				} else if (row.type === 20 || row.type === 21) {
					this.form.deptIds.push(...row.options);
				} else if (row.type === 22) {
					this.form.postIds.push(...row.options);
				} else if (row.type === 30 || row.type === 31 || row.type === 32) {
					// 初始化用户列表
					this.userOptions = row.auditorInfo;
					this.form.userIds.push(...row.options);
					this.form.userIds = this.form.userIds.map(Number);
				} else if (row.type === 40) {
					this.form.userGroupIds.push(...row.options);
				} else if (row.type === 50) {
					this.form.scripts.push(...row.options);
				}
				this.open = true;
			},
			/** 提交任务分配规则的表单 */
			submitAssignRuleForm() {
				this.$refs["taskAssignRuleForm"].validate(valid => {
					if (valid) {
						// 构建表单
						let form = {
							...this.form,
							taskDefinitionName: undefined,
						};
						// 将 roleIds 等选项赋值到 options 中
						if (form.type === 10) {
							form.options = form.roleIds;
						} else if (form.type === 20 || form.type === 21) {
							form.options = form.deptIds;
						} else if (form.type === 22) {
							form.options = form.postIds;
						} else if (form.type === 30 || form.type === 31 || form.type === 32) {
							form.options = form.userIds;
						} else if (form.type === 40) {
							form.options = form.userGroupIds;
						} else if (form.type === 50) {
							form.options = form.scripts;
						}
						form.roleIds = undefined;
						form.deptIds = undefined;
						form.postIds = undefined;
						form.userIds = undefined;
						form.userGroupIds = undefined;
						form.scripts = undefined;
						// 新增
						if (!form.id) {
							form.modelId = this.modelId; // 模型编号
							createTaskAssignRule(form).then(response => {
								this.$notify({
									title: '提示',
									message: '新增成功',
									type: 'success',
									duration: 2000
								});
								this.open = false;
								this.getList();
							});
							// 修改
						} else {
							form.taskDefinitionKey = undefined; // 无法修改
							updateTaskAssignRule(form).then(response => {
								this.$notify({
									title: '提示',
									message: '修改成功',
									type: 'success',
									duration: 2000
								});
								this.open = false;
								this.getList();
							});
						}
					}
				});
			},
			/** 取消任务分配规则的表单 */
			cancelAssignRuleForm() {
				this.open = false;
				this.resetAssignRuleForm();
			},
			/** 表单重置 */
			resetAssignRuleForm() {
				this.form = {};
				this.resetForm("taskAssignRuleForm");
			},
			getAssignRuleOptionName(type, option) {
				if (type === 10) {
					for (const roleOption of this.roleOptions) {
						if (roleOption.id === option) {
							return roleOption.name;
						}
					}
				} else if (type === 20 || type === 21) {
					for (const deptOption of this.deptOptions) {
						if (deptOption.id === option) {
							return deptOption.name;
						}
					}
				} else if (type === 22) {
					for (const postOption of this.postOptions) {
						if (postOption.id === option) {
							return postOption.name;
						}
					}
				} else if (type === 30 || type === 31 || type === 32) {
					for (const userOption of this.userOptions) {
						if (userOption.id === option) {
							return userOption.nickname;
						}
					}
				} else if (type === 40) {
					for (const userGroupOption of this.userGroupOptions) {
						if (userGroupOption.id === option) {
							return userGroupOption.name;
						}
					}
				} else if (type === 50) {
					option = option + ''; // 转换成 string
					for (const dictData of this.taskAssignScriptDictDatas) {
						if (dictData.value === option) {
							return dictData.label;
						}
					}
				}
				return '未知(' + option + ')';
			},
			// 格式化部门的下拉框
			normalizer(node) {
				if (node.children && !node.children.length) {
					delete node.children;
				}
				return {
					id: node.id,
					label: node.departmentFullName,
					children: node.children
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.item-text--info>>>.el-form-item__content {
		line-height: 15px;
	}
</style>
