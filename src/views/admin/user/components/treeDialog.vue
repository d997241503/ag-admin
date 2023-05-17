<template>
	<div class="app">
		<el-dialog title="请选择部门" :visible.sync="dialogVisible" width="350px"  :before-close="handleClose">
			<div class="tree">
				<tree @refreshData="treeHandle"></tree>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="sure">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import tree from './tree'
	export default {
		props: [],
		components: {
			tree
		},
		data() {
			return {
				dialogVisible: false,
				data:undefined
			}
		},
		methods: {
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			init(){
				this.dialogVisible=true
			},
			treeHandle(e){
				this.data=e
			},
			sure(){
				this.$emit('refreshData',this.data)
				this.dialogVisible=false
			}
		}
	}
</script>

<style scoped="scoped">
	.tree{
		height: 350px;
	}
</style>
