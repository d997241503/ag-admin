<template>
	<div class="app-container">
		<div class="page-content">
            <!-- 搜索工作栏 -->
            <el-form :model="listQuery" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                label-width="68px">
                <el-form-item label="流程名" prop="name">
                    <el-input v-model="listQuery.name" placeholder="请输入流程名" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker v-model="listQuery.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" type="primary" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 列表 -->
            <el-table v-loading="loading" :data="list">
                <el-table-column label="任务编号" align="center" prop="id" width="320" />
                <el-table-column label="任务名称" align="center" prop="name" />
                <el-table-column label="所属流程" align="center" prop="processInstance.name" />
                <el-table-column label="流程发起人" align="center" prop="processInstance.startUserNickname" />
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" prop="version" width="80">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.suspensionState === 1">激活</el-tag>
                        <el-tag type="warning" v-if="scope.row.suspensionState === 2">挂起</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleAudit(scope.row)"
                            v-if="!elements['bpm:task:update']">审批</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/> -->
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                    align="right" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
	</div>
</template>

<script>
	import {
		getTodoTaskPage
	} from '@/api/bpm/task'
	// import {
	// 	listSimpleUsers
	// } from "@/api/system/user";
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: "Todo",
		components: {},
		data() {
			return {
				// 遮罩层
				loading: true,
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 待办任务列表
				list: [],
				// 查询参数
				listQuery: {
					page: 1,
					limit: 10,
					name: null,
					createTime: []
				},
			};
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		created() {
			// if(sessionStorage.getItem('todooperate') && sessionStorage.getItem('todooperatename')) {
			// 	this.$router.push({
			// 		path: "/backstage/processInstance/detail",
			// 		query: {
			// 			id: sessionStorage.getItem('todooperate'),
			// 			name: sessionStorage.getItem('todooperatename')
			// 		}
			// 	});
			// }
			this.getList();
		},
		methods: {
			/** 查询列表 */
			getList() {
				this.loading = true;
				// 处理查询参数
				getTodoTaskPage(this.listQuery).then(response => {
					this.list = response.data.list;
					this.total = response.data.totalCount;
					this.loading = false;
				});
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.listQuery.page = 1;
				this.getList();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 处理审批按钮 */
			handleAudit(row) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/processInstance/detail",
				// 		query: {
				// 			id: row.processInstance.id,
				// 			name: row.processInstance.name
				// 		}
				// 	});
				// } else {
					this.$router.push({
						path: "/processInstance/detail",
						query: {
							id: row.processInstance.id,
							name: row.processInstance.name
						}
					});
				// }
			},
		}
	};
</script>
