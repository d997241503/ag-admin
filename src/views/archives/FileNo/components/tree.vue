<template>
	<div class="custom-tree-container">
		<!-- <el-button type="primary" size="mini" @click="onOffHandle(true)">全部展开</el-button>
		<el-button type="primary" size="mini" @click="onOffHandle(false)">全部收起</el-button> -->
		<div class="tree-select">
		<!-- <el-form-item> -->
			<el-select v-model="type" class="filter-item" placeholder="请选择" @change="typeChange"
			style="width: 250px;">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		<!-- </el-form-item> -->
		</div>
		<div>
			<el-tree v-if="showVisible" style="tree-info" class="mar-top tree-roll-containers" :data="treeData" :props="defaultProps" node-key="id"
			 :default-expand-all="allNodeVisible" :expand-on-click-node="false" @node-click="handlePartyBranch" ref="tree" :highlight-current="true">
				<div class="custom-tree-node" slot-scope="{ node, data }">
					<!-- <el-tooltip :content="node.label" effect="light" placement="top"> -->
						<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;<span
							 style="font-family: 'font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;">{{ node.label }}</span>&nbsp;&nbsp;</span>
					<!-- </el-tooltip> -->
				</div>
				<!-- <div class="show-one-line" slot-scope="{ node, data }">
					<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;<span
						 style="font-family: 'font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;">{{ node.label }}
						 </span>&nbsp;&nbsp;
						 </span>
				</div> -->
			</el-tree>
		</div>
	</div>
</template>

<script>
	import {
		getTree,
		getUser
	} from 'api/admin/department/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				allNodeVisible: true,
				showVisible: true,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				deptId: undefined,
				checkedId: [],
				type: '1',
				options: [{
					value: '1',
					label: '单位信息档案'
				}, {
					value: '2',
					label: '单位风险点排查'
				}],
				treeObj: {}
			}
		},
		computed: {
			...mapGetters([
				'deptFields','elements'
			])
		},

		created() {
			this.defaultProps.label = this.deptFields;
			this.getTreeInfo();
		},

		methods: {
			// onOffHandle(val) {
			// 	this.allNodeVisible = val;
			// 	this.showVisible = false;
			// 	setTimeout(() => {
			// 		this.showVisible = true;
			// 	}, 1);
			// },

			typeChange(e) {
				this.type = e;
				this.$emit('refreshData', this.treeObj, this.type);
			},

			// 同步数据到父页面
			handlePartyBranch(data) {
				this.deptId = data.id;
				this.treeObj = data;
				this.$emit('refreshData', data, this.type);
			},

			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							this.$nextTick(() => {
								this.$refs.tree.setCurrentKey(res.data[0].id ? res.data[0].id : null);
								if(res.data[0]) {
									this.treeObj =  res.data[0];
									this.$emit('refreshData', res.data[0], this.type);
								}
							})
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

<style lang="scss" scoped>

	.custom-tree-container {
		width: 250px;
		overflow: auto;
	}

	.tree-select {
		margin-bottom: 15px;
	}

	.tree-roll-containers {
		// height: 500px;
		/* max-height: 500px; */
		// overflow: auto;
		// width: fit-content;
		height: calc(100vh - 300px);
	}

	.tree-roll-containers-first {
		height: 447px;
		overflow: auto;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		// white-space: nowrap;
		// overflow: hidden;
		// text-overflow: ellipsis;
		/* font-family: "楷体" !important; */
		/* Helvetica Neue, Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif */

		span {
			// overflow: hidden;
			// white-space: nowrap;
			// text-overflow: ellipsis;
		}
	}

	.mar-top {
		margin-top: 10px;

		/deep/ .el-tree-node__content {
			display: -webkit-box !important;
		}
	}

	.mar-top-lar {
		margin-top: 20px;
	}

	.el-icon-s-custom {
		font-size: 15px;
		letter-spacing: 1px;
		// color: #555;
		margin: 5px 0;
	}

	.el-icon-user {
		letter-spacing: 1px;
		// color: #666;
		margin: 5px 0;
	}
</style>
