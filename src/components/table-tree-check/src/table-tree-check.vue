<template>
	<el-dialog :visible.sync="visible" width="500px" :top="top" :title="title" append-to-body
		:close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose">
		<el-form size="mini">
			<el-form-item label="关键字：">
				<el-input v-model="filterText" suffix-icon="el-icon-search" clearable @input="getDeptList" style="width: 80%;"></el-input>
			</el-form-item>
			<!-- <el-form-item label="">
				<el-button type="default">查询</el-button>
			</el-form-item> -->
		</el-form>
		<el-tree class="filter-tree roll-containers" :data="deptList" show-checkbox @check="handleCheckChange"
			:default-expanded-keys="expandedKeys" :props="{ label: 'name', children: 'children' }"
			:check-strictly="false" :filter-node-method="filterNode" :highlight-current="true" node-key="id" ref="tree">
			<div class="show-one-line" slot-scope="{ node, data }">{{ node.label }}</div>
		</el-tree>
		<div class="dialog-footer" align="center">
			<el-button @click="handleClose()" size="small">取消</el-button>
			<el-button type="primary" @click="commitHandle()" size="small">确定</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import {
		formtypeTree
	} from 'api/bpm/categoryMan';
	export default {
		data() {
			return {
				title: "选择表",
				type: '0',
				filterText: '',
				visible: false,
				// id: undefined,
				deptList: [],
				expandedKeys: null,
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				checkeds: []
			}
		},
		props: {
			top: {
				type: String,
				default: "15vh"
			}
		},
		watch: {
			// filterText(val) {
			// 	this.$refs.tree.filter(val);
			// }
		},
		methods: {
			init(checkeds) {
				// this.id = id;
				if(!checkeds) checkeds = [];
				this.expandedKeys = null;
				if (this.$refs.tree) {
					this.$refs.tree.setCurrentKey(null);
				}
				this.visible = true
				if(checkeds && checkeds.length) {
					this.checkeds = checkeds;
				} else {
					this.checkeds = [];
				}
				this.getDeptList(checkeds)
			},
			filterNode(value, data) {
				if (!value) return true
				// return data.name.indexOf(value) !== -1
				return data.departmentFullName.indexOf(value) !== -1
			},
			getDeptList(checkeds) {
				formtypeTree({ name: this.filterText, type: '0',secondType: '0' })
				.then(res => {
					if (res && res.status === 200) {
						this.deptList = res.data ? res.data : [];
							this.$nextTick(() => {
								// this.expandedKeys = checkeds.length ? checkeds : [];
								// this.$refs.tree.setCheckedKeys(checkeds);
								if(this.checkeds && this.checkeds.length) {
									this.checkeds.forEach(item => {
										var node = this.$refs.tree.getNode(item);
										if(node.isLeaf){
											this.$refs.tree.setChecked(node, true);
										}
									});
									this.expandedKeys = this.checkeds.length ? this.checkeds : [];
								}
							})
					} else {
						this.$notify({
							title: '失败',
							message: "获取树结构失败",
							type: 'error',
							duration: 2000
						});
					}
				});
				// return this.$http.get(`/sys/dept/treeList/${this.type}`).then(({
				// 	data: res
				// }) => {
				// 	if (res.code !== 0) {
				// 		return this.$message.error(res.msg)
				// 	}
				// 	var id = res.data && res.data.length ? res.data[0].id : '';
				// 	this.deptList = res.data;
				// 	this.$nextTick(() => {
				// 		this.expandedKeys = checkeds.length ? checkeds : [id];
				// 		this.$refs.tree.setCheckedKeys(checkeds);
				// 	})
				// }).catch(() => {})
			},
			handleCheckChange(data, checked, indeterminate) {
			},
			commitHandle() {
				const nodes = this.$refs.tree.getCheckedKeys();
				const checkedNodes = this.$refs.tree.getCheckedNodes();
				// if (!nodes.length) {
				// 	this.$message.error("请选择数据")
				// 	return
				// }
				this.$emit('refreshData', {
					// id: this.id,
					// type: this.type,
					checkedNodes: checkedNodes,
					nodes: nodes
				});
				this.handleClose();
			},
			handleClose(done) {
				// this.id = undefined;
				this.filterText = '';
				if (done) done();
				this.visible = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.roll-containers {
		max-height: 350px;
		padding: 10px;
	}
	// /deep/ .el-form-item.el-form-item--mini {
	// 	margin-bottom: 0 !important;
	// }
</style>
