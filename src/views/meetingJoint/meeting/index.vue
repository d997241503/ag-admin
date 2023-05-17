<template>
	<div class="app-container calendar-list-container nav-content">
		<Department v-if="tabType === 'joint'" :tabType.sync="tabType"/>
		<Unit v-else :tabType.sync="tabType"/>
    </div>
</template>

<script>
    import Department from './department'
    import Unit from './unit'
	import {
		mapGetters
	} from 'vuex';
    import {
		getTree
	} from 'api/admin/department/index';
	export default {
		name: "index",
		components: {
            Department, Unit
		},
		data() {
			return {
                tabType: 'joint'
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),
		}
	}
</script>

<style lang="scss" scoped>
	.radio-group {
		display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;

        .text {
            margin-right: 20px;
            text-decoration:underline;
            font-size: 14px;
            cursor: pointer;
        }
        
        .text:hover {
            color: #bc0000;
        }
	}
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.active {
		margin-bottom: 0px;
	}

	.otherActiveClass {
		border-bottom: solid 1px #DCDFE6;
	}
	
	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.tree-info-first {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 10px;
		background-color: #FFFFFF;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;

		// 表格高度不一致，将高度撑开
		>>> .el-table__fixed-right {
			height: 100% !important;
		}

		>>> .el-table__row {
			height: 65px !important;
		}
	}

	.page-info-taskTitle {

		>>> .el-button--text{
			color: #606266;
			text-decoration:underline
		}

		>>> .el-table__row {
			height: 57px !important;
		}
	}

	.pagination-container {
		margin-top: 15px;
	}

	.tree-roll-containers-first {
		max-height: 480px;
    	overflow: auto;
	}

	.query {
		// margin-left: 10px;
	}

	.bu-right {
		>>> .el-button--text{
			color: #000000;
			text-decoration:underline
		}
	}
</style>
