<template>
	<div class="custom-tree-container">
		<!-- <el-button type="primary" size="mini" @click="onOffHandle(true)">全部展开</el-button>
		<el-button type="primary" size="mini" @click="onOffHandle(false)">全部收起</el-button> -->
		<div>
			<!-- <el-form :inline="true" :model="listQuery"> -->
				<!-- <el-form-item> -->
					<el-input placeholder="请输入关键字" prefix-icon="el-icon-search" size="small" v-model="filterText" clearable>
					</el-input>
				<!-- </el-form-item> -->
			<!-- </el-form> -->
		</div>
		<div>
			<el-tree v-if="showVisible" style="tree-info" class="mar-top tree-roll-containers" :data="treeData" :props="defaultProps" node-key="id" :filter-node-method="filterNode"
			 :default-expand-all="allNodeVisible" :expand-on-click-node="false" @node-click="handlePartyBranch" ref="tree" :highlight-current="true" :style="{'height':($route.query.look?'calc(100vh - 270px)':'calc(100vh - 350px)')}">
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
				userDataList: [],
				userDataListName: [],
				integrityArchives_btn_first: false,
				checkedId: [],
				filterText: '',
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
			// 获取权限
			this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];
			// this.integrityArchives_btn_first = false;
		},

		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
		},

		methods: {
			// 树节点进行筛选时执行的方法
			filterNode(value, data) {
				if (!value) return true
				return data[this.defaultProps.label].indexOf(value) !== -1
			},

			// onOffHandle(val) {
			// 	this.allNodeVisible = val;
			// 	this.showVisible = false;
			// 	setTimeout(() => {
			// 		this.showVisible = true;
			// 	}, 1);
			// },

			// 同步数据到父页面
			handlePartyBranch(data) {
				this.deptId = data.id;
				// if(this.integrityArchives_btn_first || this.$route.query.look) this.getUserDataList(data);
				this.$emit('refreshData', data);
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
								this.$refs.tree.setCurrentKey(this.$route.query.deptId ? this.$route.query.deptId : undefined);
								if(!this.$route.query.deptId && this.$route.query.look) {
									this.$emit('refreshData', res.data[0]);
									this.$refs.tree.setCurrentKey(res.data[0]);
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

			getHeight() {
				const heightCss = window.getComputedStyle(this.$refs.ele).height; // ？px
			}

			// // 获取部门人员
			// getUserDataList(data) {
			// 	getUser(this.deptId,{ name: undefined })
			// 		.then(res => {
			// 			if (res && res.status === 200) {
			// 				this.userDataList = res.data;
			// 				if(res.data && res.data.length) {
			// 					let newChild = [];
			// 					for (let i = 0; i < res.data.length; i++) {
			// 						newChild.push(
			// 							{ departmentAttribute: "1",departmentFullName: res.data[i].name,isPersonnel: true,
			// 							departmentName: "",id: res.data[i].userId,orderNum: null,parentId: undefined }
			// 						);  //给tree树结构添加节点数据
			// 					}
			// 					this.$nextTick(() => {   //划重点了  $nextTick 不懂得上网查一下
			// 						this.$refs["tree"].updateKeyChildren(data.id, newChild);
			// 						//id 是对应要添加到那个节点的id
			// 						//res.data 是添加的新数据
			// 					});
			// 				}
			// 			}
			// 		});
			// }
		}
	};
</script>

<style lang="scss" scoped>

	.custom-tree-container {
		width: 250px;
	}

	.tree-roll-containers {
		// height: 575px;
		/* max-height: 500px; */
		// height: calc(100vh - 270px);
		overflow: auto;
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
