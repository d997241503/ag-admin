<template>
	<div class="custom-tree-container">
		<div>
			<el-tree :data="data" draggable node-key="id" :expand-on-click-node="false" @node-click="handlePartyBranch" :props="defaultProps" highlight-current :default-expand-all="true">
				<span class="custom-tree-node show-hide" slot-scope="{ node, data }" tabindex="1">
					<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
					<EllipsisText style="flex: 1" :content="node.label"/>
					<span class="tree-item-opt">
						<i class="el-icon-plus" v-if="categoryMan_btn_add" @click="append(data,node)" />
						<i class="el-icon-edit" v-if="data.parentId !== '0' && categoryMan_btn_edit" @click="rename(data,node)" style="margin-left: 6px;" />
						<i class="el-icon-delete" v-if="data.parentId !== '0' && categoryMan_btn_delete" @click="remove(data,node)" style="margin-left: 6px;" />
					</span>
				</span>
			</el-tree>
		</div>
	</div>
</template>

<script>
    import EllipsisText from 'components/Popover/EllipsisTooltip.vue'
	import {
		formtypeTree,
		delFormtype
	} from 'api/bpm/categoryMan';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				loading: true,
				deptName: '',
				dialogVisinle: false,
				optionCardX: '', // 文件夹节点撰作卡位置
				optionCardY: '',
				optionCardShow: false, // 文件夹方点模作卡是否显示
				optionData: [], // 石键选中的节点的data
				node: null, // 当前右莲选中的节点信息
				tree: null,
				data:[
				],
				id: 10,
				value: '',
				form: {
					archivesNum: '',
					parentId: 0,
					sort: undefined,
					value: '',
					orgId: undefined,
					orgName: ''
				},
				updateForm: {
					archivesNum: '',
					id: undefined,
					sort: undefined,
					value: ''
				},
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				categoryMan_btn_add: false,
				categoryMan_btn_edit: false,
				categoryMan_btn_delete: false,
				dataCompany: [],
				year: new Date().getFullYear().toString()
			}
		},

		computed: {
			...mapGetters([
				'deptFields','elements'
			])
		},
		
		components: {
            EllipsisText
		},

		created() {
			// 获取权限
			this.categoryMan_btn_add = this.elements['categoryMan:btn_add'];	
			this.categoryMan_btn_edit = this.elements['categoryMan:btn_edit'];
			this.categoryMan_btn_delete = this.elements['categoryMan:btn_delete'];
			this.getTreeInfo();
		},

		methods: {
			getDataList() {
				this.getTreeInfo();
			},

			// 新建一个子文件夹
			append(data, n) {
				this.$emit('refreshDataTree', data, 'add');
			},

			// 删除文件夹
			remove(data, n) {
				this.optionData = data;
				this.node = n; // 将当前节点保存
				this.optionCardShow = false
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delFormtype(this.optionData.id)
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
								this.$message.error(res.msg)
								// this.$notify({
								// 	title: '失败',
								// 	message: '删除失败',
								// 	type: 'error',
								// 	duration: 1000
								// });
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '删除失败',
								type: 'error',
								duration: 1000
							});
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			// 修改文件夹名字
			rename(data, n){
				this.$emit('refreshDataTree', data, 'edit');
			},

			// 同步数据到父页面
			handlePartyBranch(data) {
				this.$emit('refreshDataTree', data, '');
			},

			// 获取树结构
			getTreeInfo() {
				formtypeTree({ name: '', type: '',secondType: '' })
					.then(res => {
						if (res && res.status === 200) {
							this.data = res.data ? res.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: "获取树结构失败",
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
		width: 410px;
		height: 100%;
		overflow: auto;
	}

	.custom-nweRoot {
		margin-bottom: 10px;
		text-align: right;
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

	.tree-item-opt {
        display: none;
    }
    .el-tree {
        /deep/ .el-tree-node.is-current{
            .tree-item-opt {
                display: inline-block;
            }
        }
    }

</style>
