<template>
	<div class="custom-tree-container">
		<!-- <el-button type="primary" size="mini" @click="onOffHandle(true)">全部展开</el-button>
		<el-button type="primary" size="mini" @click="onOffHandle(false)">全部收起</el-button> -->
		<div>
			<!-- <el-tree v-if="showVisible" style="tree-info" class="mar-top tree-roll-containers" :data="treeData" :props="defaultProps" node-key="id"
			 :default-expand-all="allNodeVisible" :expand-on-click-node="false" @node-click="handlePartyBranch">
				<span class="custom-tree-node" slot-scope="{ node, data }">
					<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;<span
						 style="font-family: 'font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;">{{ node.label }}</span>&nbsp;&nbsp;</span>
				</span>
			</el-tree> -->
			<div class="custom-nweRoot">
				<el-button v-if="integrityArchives_btn_riskpointsnameadd" type="primary" size="mini" @click="nweRoot()">新建档案</el-button>
			</div>
			<el-tree :data="data" draggable node-key="id" :expand-on-click-node="false" @node-click="handlePartyBranch" :props="defaultProps" highlight-current>
				<span class="custom-tree-node show-hide" slot-scope="{ node, data }" tabindex="1">
					<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
					<!-- <i class="el-icon-document" style="color: #DFBA49; margin-right: 5px;"></i> -->
					<span style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 15px;">{{ node.label }}</span>
					<span style="display:none">
						<i class="el-icon-plus" v-if="integrityArchives_btn_riskpointsnameadd" @click="append(data,node)" />
						<i class="el-icon-edit" v-if="integrityArchives_btn_riskpointsedit" @click="rename(data,node)" style="margin-left: 6px;" />
						<i class="el-icon-delete" v-if="integrityArchives_btn_riskpointsdelete" @click="remove(data,node)" style="margin-left: 6px;" />
					</span>
				</span>
			</el-tree>
			<!-- <div :style="{'z-index': 9999, position: 'fixed',left: optionCardX + 'px', 
				top: optionCardY + 'px', width: '100px', background: 'white',
				 'box-shadow': '0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)'}" 
				 v-show="optionCardShow" id="option-button-group">
				<el-button @click="append" class="option-card-button">新建文件夹
				</el-button>
				<el-button @click="remove" class="option-card-button">删除文件夹
				</el-button>
				<el-button @click="rename" class="option-card-button">重命名
				</el-button>
			</div> -->

		</div>
	</div>
</template>

<script>
	import {
		addUnitriskpointsObj,
		updateUnitriskpointsObj,
		getUnitriskpointsTree,
		delUnitriskpointsObj
	} from 'api/archives/index';
	// import {
	// 	getTree,
	// } from 'api/incorrupt/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				// allNodeVisible: true,
				// showVisible: true,
				// treeData: [],
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentName'
				// }
				optionCardX: '', // 文件夹节点撰作卡位置
				optionCardY: '',
				optionCardShow: false, // 文件夹方点模作卡是否显示
				optionData: [], // 石键选中的节点的data
				node: null, // 当前右莲选中的节点信息
				tree: null,
				data:[
				// 	{ //文件夹信息
				// 	id: 1,
				// 	label: '默认文件夹',
				// 	image: require('../../../assets/img/logo.png'),
				// 	children: [{
				// 		id: 4,
				// 		label: '二级',
				// 		image: require('../../../assets/img/university.png'),
				// 		children:[{
				// 			id: 9,
				// 			label:'三级',
				// 			image: require('../../../assets/img/party-logo.png'),
				// 		}]
				// 	}]
				// }
				],
				id: 10,
				value: '',
				form: {
					archivesNum: '',
					parentId: 0,
					sort: undefined,
					value: '',
					orgId: undefined,
					orgName: undefined
				},
				updateForm: {
					archivesNum: '',
					id: undefined,
					sort: undefined,
					value: ''
				},
				defaultProps: {
					children: 'children',
					label: 'value'
				},
				integrityArchives_btn_riskpointsnameadd: false,
				integrityArchives_btn_riskpointsedit: false,
				integrityArchives_btn_riskpointsdelete: false
			}
		},

		computed: {
			...mapGetters([
				'deptFields','elements'
			])
		},

		created() {
			// 获取权限
			this.integrityArchives_btn_riskpointsnameadd = this.elements['integrityArchives:btn_riskpointsnameadd'];	
			this.integrityArchives_btn_riskpointsedit = this.elements['integrityArchives:btn_riskpointsedit'];
			this.integrityArchives_btn_riskpointsdelete = this.elements['integrityArchives:btn_riskpointsdelete'];
			// this.defaultProps.label = this.deptFields;
			if(this.$route.query.operation) this.getTreeInfo();
			// this.$emit('refreshDataTree', this.data[0]);
		},

		methods: {
			// // 文件夹右键时触发的事件
			// floderOption(e, data, n, t) {
			// 	this.optionCardShow = false 
			// 	this.optionCardX = e.x   // 让右键菜单出现在鼠标右键的位置
			// 	this.optionCardY = e.y - 110
			// 	this.optionData = data
			// 	this.node = n // 将当前节点保存
			// 	this.tree = t
			// 	this.optionCardShow = true  // 展示右键菜单
			// },

			// floderOption1(data, n) {
			// 	this.optionData = data;
			// 	this.node = n; // 将当前节点保存
			// 	this.rename();
			// },

			// // 新建一个根目录
			// nweRoot(){
			// 	this.$prompt('请输入文件名', '提示', {
			// 		confirmButtonText: '确定',
			// 		cancelButtonText: '取消',
			// 		// inputPattern: /^\S{1,10}$/,
			// 		// inputErrorMessage: '文件名长度在1到10之间'
			// 	}).then(({
			// 		value
			// 	}) => {
			// 		createFolder(this.qlId, 0, value).then(res=>{
			// 			if(res.code == 200) {
			// 				this.showFolderList()
			// 				this.$message({
			// 					type: 'success',
			// 					message: '文件夹新建成功！'
			// 				});
			// 			}
			// 		})
			// 	}).catch(() => {
			// 		this.$message({
			// 			type: 'info',
			// 			message: '取消输入'
			// 		});
			// 	});
			// },

			// 新建一个根目录
			nweRoot(data, n) {
				if(data) this.optionData = data;
				if(n) this.node = n; // 将当前节点保存
				this.optionCardShow = false
				this.$prompt('请输入文件名', '新增', {   // 弹出框用于输入文件名
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					// inputPattern: /^\S{1,10}$/,
					// inputErrorMessage: '文件名长度在1到10之间'
				}).then(({
					value
				}) => {
					this.form.parentId = 0;
					this.form.value = value;
					addUnitriskpointsObj(this.form)
						.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '文件夹新建成功！',
									type: 'success',
									duration: 1000
								});
								this.getTreeInfo();
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 1000
								});
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '文件夹新建失败',
								type: 'error',
								duration: 1000
							});
						})
					// this.$message({
					// 	type: 'success',
					// 	message: '文件夹新建成功！'
					// });
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},

			// 新建一个子文件夹
			append(data, n) {
				if(data) this.optionData = data;
				if(n) this.node = n; // 将当前节点保存
				this.optionCardShow = false
				this.$prompt('请输入文件名', '新增', {   // 弹出框用于输入文件名
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					// inputPattern: /^\S{1,10}$/,
					// inputErrorMessage: '文件名长度在1到10之间'
				}).then(({
					value
				}) => {
					// if (this.node.level >= 3) {
					// 	this.$message.error("最多只支持三级！")
					// 	return false;
					// }
					// const newChild = {   // 新建一个子节点
					// 	id: this.id++,
					// 	label: value,
					// 	children: []
					// };
					// if (!this.optionData.children) {   // 如果当前节点没有子节点，那就新建一个空的子节点数组，用来存放新建子文件夹
					// 	this.$set(this.optionData, 'children', []);
					// }
					// this.optionData.children.push(newChild);  // 插入
					//同时展开节点
					// if (!this.node.expanded) {
					// 	this.node.expanded = true
					// }
					if(this.optionData.id) this.form.parentId = this.optionData.id;
					this.form.value = value;
					addUnitriskpointsObj(this.form)
						.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '文件夹新建成功！',
									type: 'success',
									duration: 1000
								});
								this.getTreeInfo();
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 1000
								});
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '文件夹新建失败',
								type: 'error',
								duration: 1000
							});
						})
					// this.$message({
					// 	type: 'success',
					// 	message: '文件夹新建成功！'
					// });
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},

			// 删除文件夹
			remove(data, n) {
				this.optionData = data;
				this.node = n; // 将当前节点保存
				this.optionCardShow = false
				this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delUnitriskpointsObj(this.optionData.id)
						.then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 1000
								});
								this.getTreeInfo();
							} else {
								this.$notify({
									title: '失败',
									message: '删除失败',
									type: 'error',
									duration: 1000
								});
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '删除失败',
								type: 'error',
								duration: 1000
							});
						});;
					// const parent = this.node.parent;
					// const children = parent.data.children || parent.data;
					// const index = children.findIndex(d => d.id === this.data.id);
					// children.splice(index, 1);
					// this.$message({
					// 	type: 'success',
					// 	message: '删除成功!'
					// });
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			// 修改文件夹名字
			rename(data, n){
				this.optionData = data;
				this.node = n; // 将当前节点保存
				this.optionCardShow = false
				this.$prompt('请输入文件名', '修改', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPlaceholder: this.node.data.value,
					// inputPattern: /^\S{1,10}$/,
					// inputErrorMessage: '文件名长度在1到10之间'
				}).then(({
					value
				}) => {
					this.updateForm.archivesNum = this.optionData.archivesNum;
					this.updateForm.id = this.optionData.id;
					this.updateForm.sort = this.optionData.sort;
					this.updateForm.value = value;
					updateUnitriskpointsObj(this.updateForm)
						.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '文件夹修改成功！',
									type: 'success',
									duration: 1000
								});
								this.getTreeInfo();
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 1000
								});
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '文件夹修改失败',
								type: 'error',
								duration: 1000
							});
						})
					// this.node.data.label = value
					// this.$message({
					// 	type: 'success',
					// 	message: '文件夹已重命名！'
					// });
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
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
				this.$emit('refreshDataTree', data);
			},

			// 获取单位档案树结构
			getTreeInfo() {
				getUnitriskpointsTree({ value: this.value, orgId: this.form.orgId })
					.then(res => {
						if (res && res.status === 200) {
							this.data = res.data ? res.data : [];
							if(this.data[0]) this.$emit('refreshDataTree', this.data[0]);
						} else {
							this.$notify({
								title: '失败',
								message: "获取单位档案树失败",
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
	}

	.custom-nweRoot {
		margin-bottom: 10px;
	}

	.tree-roll-containers {
		height: 500px;
		/* max-height: 500px; */
		overflow: auto;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		font-size: 14px;
		padding-right: 8px;
		/* font-family: "楷体" !important; */
		/* Helvetica Neue, Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mar-top {
		margin-top: 10px;
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

	/* 文件夹卡片 */
	.folder-box {
		height: 100%;
	}

	/* 右键菜单按钮 */
	.option-card-button {
		width: 100%;
		margin-left: 0;
		font-size: 10px;
		border-radius: 0;
	}

	.show-hide:focus :nth-child(3) {
		display: inline-block !important;
	}

	/* .show-hide:hover :nth-child(3) {
		display: inline-block !important;
	} */

</style>
