<template>
	<el-dialog :visible.sync="visible" width="500px" :top="top" :title="title" append-to-body
		:close-on-click-modal="false" :close-on-press-escape="false" :before-close="handleClose">
		<el-form size="mini">
			<el-form-item label="关键字：">
				<el-input v-model="filterText" suffix-icon="el-icon-search" clearable style="width: 80%;"></el-input>
			</el-form-item>
			<el-form-item label="" style="margin-left: 40px;margin-top: 10px;">
				<!-- <el-select v-model="linkage" placeholder="请选择" style="width: 150px;">
					<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value">
					</el-option>
				</el-select> -->
 				<el-radio v-model="linkage" :label="true">不联动</el-radio>
				<el-radio v-model="linkage" :label="false">联动</el-radio>
			</el-form-item>
		</el-form>
		<el-tree class="filter-tree roll-containers" :data="deptList" show-checkbox @check="handleCheckChange"
			:default-expanded-keys="expandedKeys" :props="{ label: 'departmentFullName', children: 'children' }"
			:check-strictly="linkage" @check-change ="checkChange" :filter-node-method="filterNode" :highlight-current="true" node-key="id" ref="tree">
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
		getTree
	} from 'api/admin/department/index';
	export default {
		data() {
			return {
				title: "选择部门",
				type: '0',
				filterText: '',
				visible: false,
				// id: undefined,
				deptList: [],
				expandedKeys: null,
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				linkage: true,
				options: [
					{ value: false, label: '联动'}, 
					{ value: true, label: '不联动'}
				],
			}
		},
		props: {
			top: {
				type: String,
				default: "15vh"
			},
            showDept: {
                type: Boolean,
                default: false
            },
			checkAll: {
                type: Boolean,
                default: false
            }
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
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
				this.getDeptList(checkeds)
			},
            clear() {
                this.expandedKeys = null
                this.$refs.tree.setCurrentKey(null)
                this.$refs.tree.setCheckedKeys([])
            },
			filterNode(value, data) {
				if (!value) return true
				// return data.name.indexOf(value) !== -1
				return data.departmentFullName.indexOf(value) !== -1
			},
			getDeptList(checkeds) {
				getTree({
						departmentAttribute: this.showDept ? undefined : '1'
					})
				.then(res => {
					if (res && res.code === 0) {
						this.deptList = res.data ? res.data : [];
							this.$nextTick(() => {
								this.expandedKeys = checkeds.length ? checkeds : [];
								// if(checkeds.length) {
									this.$refs.tree.setCheckedKeys(checkeds);
								// } else if(this.checkAll) { //默认全选
								// 	this.$nextTick(() => {
								// 		this.$refs.tree.setCheckedNodes(this.deptList)
								// 	})
								// } else { // 取消选中
								// 	this.$nextTick(() => {
								// 		this.$refs.tree.setCheckedKeys([])
								// 	})
								// }
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
			// 节点选中
			checkChange(a,b,c){  
				if(!this.linkage) return;
				// 如果为取消
				// if(b === false){
				// 	//如果当前节点有子集
				// 	if(a.children){
				// 	//循环子集将他们的选中取消
				// 	a.children.map(item => {
				// 		this.$refs.tree.setChecked(item.id,false);
				// 	})
				// 	}
				// }else{
				// 	//否则(为选中状态)
				// 	//判断父节点id是否为空
				// 	if(a.parentId !== 0){
				// 	//如果不为空则将其选中
				// 	this.$refs.tree.setChecked(a.parentId,true);
				// 	}
				// }
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
	>>> .el-form-item.el-form-item--mini+.el-form-item {
		margin-top: 0px;
	}
	// /deep/ .el-form-item.el-form-item--mini {
	// 	margin-bottom: 0 !important;
	// }
</style>
