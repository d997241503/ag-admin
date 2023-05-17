<template>
	<div class="custom-tree-container">
		<!-- <el-button type="primary" size="mini" @click="onOffHandle(true)">全部展开</el-button>
		<el-button type="primary" size="mini" @click="onOffHandle(false)">全部收起</el-button> -->
		<div>
			<el-input placeholder="请输入关键字" prefix-icon="el-icon-search" size="small" v-model="filterText" clearable>
			</el-input>
		</div>
		<div>
			<el-tree v-if="showVisible" ref="tree" class="mar-top tree-roll-containers" :default-expanded-keys="expandedKeysDept"
				:data="treeData" :props="defaultProps" node-key="id" :default-expand-all="allNodeVisible" :filter-node-method="filterNode"
				:expand-on-click-node="false" v-loading="treeLoading">
				<div class="show-one-line" style="font-size: 14px;" slot-scope="{ node, data }">
					<span
						:class="{'el-icon-s-custom': node.level == 1, 'el-icon-user': node.level == 2, 'el-icon-user-solid': node.level > 2}"
						@click="handleCheckChange(data)">&nbsp;
						<span v-show="!node.label">{{ node.label }}</span>
						<span v-show="node.label">{{ node.label }}</span>
						<!-- <span v-show="node.label && node.label.length <= 7">{{ node.label }}</span>
						<span v-show="node.label && node.label.length > 7" :title="node.label">{{ node.label | fragmentText }}</span> -->
					</span>
					<!-- <span>
						<el-button type="text" size="mini" @click="() => append(data)">
							<i class="el-icon-document-add"></i>
						</el-button>
						<el-button type="text" size="mini" @click="() => edit(data)">
							<i class="el-icon-edit"></i>
						</el-button>
						<el-button type="text" size="mini" @click="() => remove(node, data)">
							<i class="el-icon-delete"></i>
						</el-button>
					</span> -->
				</div>
			</el-tree>
		</div>
	</div>
</template>

<script>
	import {
		getTree,
		delObj
	} from 'api/admin/department/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				allNodeVisible: false,
				showVisible: true,
				treeLoading: true,
				expandedKeysDept: null,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				statusObj: {
					status: 'add',
					id: undefined,
					departmentFullName: undefined,
					formTree: true
				},
				filterText: ''
			}
		},

		filters: {
			fragmentText(val) {
				return val.length > 7 ? val.substr(0, 6) + '...' : val
			}
		},

		computed: {
			...mapGetters([
				'deptFields'
			])
		},
		
		created() {
			this.defaultProps.label = this.deptFields
			this.getTreeInfo();
		},

		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
		},

		methods: {
			// onOffHandle(val) {
			// 	this.allNodeVisible = val;
			// 	this.showVisible = false;
			// 	setTimeout(() => {
			// 		this.showVisible = true;
			// 	}, 1);
			// },

			// 树节点进行筛选时执行的方法
			filterNode(value, data) {
				if (!value) return true
				return data[this.defaultProps.label].indexOf(value) !== -1
			},

			handleCheckChange(data) {
				this.statusObj.status = "detail";
				this.statusObj.id = data.id;
				this.$emit('refreshData', this.statusObj);
			},

			append(data) {
				this.statusObj.status = "add";
				this.statusObj.id = data.id;
				this.statusObj.departmentFullName = data.departmentFullName;
				this.$emit('refreshData', this.statusObj);
			},

			edit(data) {
				this.statusObj.status = "edit";
				this.statusObj.id = data.id;
				this.statusObj.departmentFullName = "";
				this.$emit('refreshData', this.statusObj);
			},

			remove(node, data) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delObj(data.id)
							.then(res => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '删除成功',
										type: 'success',
										duration: 2000
									});
									const parent = node.parent;
									const children = parent.data.children || parent.data;
									const index = children.findIndex(d => d.id === data.id);
									children.splice(index, 1);
									this.statusObj.status = "delete";
									this.$emit('refreshData', this.statusObj);
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000
									});
								}
							});
					}).catch(() => {});
			},

			// 获取部门树
			getTreeInfo() {
				this.treeLoading = true;
				this.expandedKeysDept = null;
				if (this.$refs.deptListTree) {
					this.$refs.deptListTree.setCurrentKey(null);
				}
				getTree()
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							this.expandedKeysDept = res.data && res.data.length ? [res.data[0].id] : null;
							this.treeLoading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
							this.treeLoading = false;
						}
					});
			},
		}
	};
</script>

<style scoped>
	.custom-tree-container {
		width: 250px;
		overflow: auto;
	}

	.tree-roll-containers {
		height: calc(100vh - 250px);
		/* max-height: 500px; */
		/* overflow: auto; */
		/* width: fit-content; */
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		/* padding-right: 8px; */
	}

	.el-icon-s-custom {
		font-size: 15px;
		letter-spacing: 1px;
		/* color: #555; */
		margin: 5px 0;
	}

	.el-icon-user {
		letter-spacing: 1px;
		/* color: #666; */
		margin: 5px 0;
	}

	.mar-top {
		margin-top: 10px;
	}

	.mar-top-lar {
		margin-top: 20px;
	}
</style>
