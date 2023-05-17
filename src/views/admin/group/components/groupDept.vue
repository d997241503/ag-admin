<template>
	<div class="group-dept">
		<el-form size="mini">
			<el-form-item label="关键字">
				<el-input v-model="filterDeptText" suffix-icon="el-icon-search" clearable style="width: 50%;"></el-input>
			</el-form-item>
			<el-form-item label="" style="margin-left: 30px;margin-top: 10px;">
				<el-radio v-model="linkage" :label="false">联动</el-radio>
 				<el-radio v-model="linkage" :label="true">不联动</el-radio>
			</el-form-item>
		</el-form>
		<el-tree class="filter-tree" :data="deptList" :default-expanded-keys="expandedKeysDept" show-checkbox
			:check-strictly="linkage" :props="{ label: 'departmentFullName', children: 'children' }"
			:filter-node-method="filterNodeDept" :highlight-current="true" node-key="id" ref="deptListTree">
			<div class="show-one-line" slot-scope="{ node, data }">{{ node.label }}</div>
		</el-tree>
		<el-switch v-model="ownDepartment" active-color="#13ce66" inactive-color="#E4E7ED" inactive-text="关联本部门资源" @change="change">
		</el-switch>
		<el-button style="float: right;" type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
	</div>
</template>

<script>
	import {
		getDeptResource,
		editDeptResource,
		putOwndepartmentObj
	} from 'api/admin/group/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		props: {
			groupId: {
				default: '1'
			}
		},
		data() {
			return {
				ownDepartment: false,
				parentId: undefined,
				code: undefined,
				filterDeptText: '',
				deptList: [],
				deptResources: [],
				loading: false,
				expandedKeysDept: null,
				groupManager_btn_userManager: false,
				linkage: true,
			}
		},
		watch: {
			filterDeptText(val) {
				this.$refs.deptListTree.filter(val);
			}
		},
		created() {
			this.initDept();
			this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager'];
			this.value1 = false;
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		methods: {
			change(e) {
				putOwndepartmentObj({
					id: this.groupId,
					ownDepartment: this.ownDepartment,
					parentId: this.parentId,
					code: this.code
				}).then(() => {
					// this.getList();
					this.$notify({
						title: '成功',
						message: '操作成功',
						type: 'success',
						duration: 2000
					});
				});
			},
			filterNodeDept(value, data) {
				if (!value) return true
				return data.departmentFullName ? data.departmentFullName.indexOf(value) !== -1 : false
			},
			onSubmit() {
				var vals = this.$refs.deptListTree.getCheckedKeys();
				editDeptResource(this.groupId, vals).then(() => {
				  this.$emit('closeDeptDialog');
				  this.$notify({
				    title: '成功',
				    message: '操作成功',
				    type: 'success',
				    duration: 2000
				  });
				});
			},
			initDept() {
				this.linkage = true,
				this.expandedKeysDept = null;
				if (this.$refs.deptListTree) {
					this.$refs.deptListTree.setCurrentKey(null);
				}
				Promise.all([
					this.getDeptList()
				]).then(() => {
					this.visible = true;
					this.getDetail();
				})
			},
			// 获取角色资源
			getDetail() {
				getDeptResource(this.groupId)
					.then(res => {
						if (res && res.code === 0) {
							this.$refs.deptListTree.setCheckedKeys(res.data || []);
						}
					});
			},

			// 获取部门树
			getDeptList() {
				getTree()
					.then(res => {
						if (res && res.code === 0) {
							this.deptList = res.data || [];
							this.expandedKeysDept = res.data && res.data.length ? [res.data[0].id] : null;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.group-dept {
		>>> .el-switch__label.is-active {
			color: #606266;
		}
	}
	.filter-tree {
		margin-top: 10px;
		height: 500px;
		overflow: auto;
	}
</style>
