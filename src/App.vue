<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'APP'
	}
</script>

<style lang="scss">
	// @import './styles/index.scss'; // 全局自定义的css样式
	
	div:focus {
		outline: none;
	}
	.el-dialog__wrapper{
		z-index: 1031 !important;
	}
	.v-modal {
		z-index: 1030 !important;
	}
	/* design表单设计器 预览窗口 */
	.ant-modal-wrap {
		z-index: 1050 !important;
	}

	/* 树结构icon加大 */
	.el-tree-node__expand-icon {
		font-size: 18px;
	}

	.disable-select {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.el-dialog__title {
		font-weight: 600;
	}

	/* 滚动容器 */
	.roll-containers {
		max-height: 200px;
		overflow: auto;
	}

	.file-roll-containers {
		max-height: 350px;
		overflow: auto;
		// border: 0.0625rem solid #BFBFBF;
		// padding: 10px;
		// border-radius: 5px;
	}

	.tree-roll-containers {
		// height: 660px;
		// height: calc(100vh - 265px);
		height: 100%;
		overflow: auto;
	}

	/* 清除组织信息按钮 */
	.organization-clear {
		width: 20%;
		height: 29px;
		line-height: 29px;
		padding-left: 5px;
		text-align: left;
		font-size: 12px;
		color: #b9b9b9;
	}

	.organization-clear:hover {
		cursor: pointer;
	}

	/*修改滚动条样式*/
	div::-webkit-scrollbar {
		width: 8px;
		height: 10px;
	}

	div::-webkit-scrollbar-track {
		background: rgb(239, 239, 239);
		// border-radius: 2px;
	}

	div::-webkit-scrollbar-thumb {
		background: #bfbfbf;
		border-radius: 5px;
	}

	div::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}

	div::-webkit-scrollbar-corner {
		background: #bfbfbf;
	}


	.goback-info {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
