<template>
	<div class="custom-tree-container">
		<!-- <el-button type="primary" size="mini" @click="onOffHandle(true)">全部展开</el-button>
		<el-button type="primary" size="mini" @click="onOffHandle(false)">全部收起</el-button> -->
		<div>
			<el-input placeholder="请输入关键字" prefix-icon="el-icon-search" size="small" v-model="filterText" clearable>
			</el-input>
		</div>
		<div>
			<el-tree class="mar-top" v-if="showVisible" ref="tree" style="tree-info" :data="treeData" :props="defaultProps" node-key="id" :filter-node-method="filterNode"
			 :default-expand-all="allNodeVisible" :default-expanded-keys="expandedKeysDept" :expand-on-click-node="false" v-loading="treeLoading" @node-click="handlePartyBranch">
				<div class="show-one-line" slot-scope="{ node, data }">
					<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;<span
						 style="font-family: 'font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;">{{ node.label }}</span>&nbsp;&nbsp;</span>
				</div>
			</el-tree>
		</div>
	</div>
</template>

<script>
	import {
		getTree,
	} from 'api/incorrupt/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				allNodeVisible: false,
				showVisible: true,
				treeLoading: true,
				treeData: [],
				expandedKeysDept: null,
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				filterText: ''
			}
		},

		computed: {
			...mapGetters([
				'deptFields'
			])
		},
		created() {
			this.defaultProps.label = this.deptFields;
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

			// 同步数据到父页面
			handlePartyBranch(data) {
				this.$emit('refreshData', data);
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
						}
					});
			},
		}
	};
</script>

<style scoped>
	.custom-tree-container {
		width: 250px;
		height: 98%;
		/* max-height: 500px; */
		/* overflow: auto; */
		
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		/* font-family: "楷体" !important; */
		/* Helvetica Neue, Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif */
	}

	.mar-top {
		margin-top: 10px;
		height: calc(100vh - 347px);
		overflow: auto;
	}

	.mar-top-lar {
		margin-top: 20px;
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
</style>
