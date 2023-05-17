<template>
	<div class="app-container">
		<div class="page-content">
            <!-- 搜索工作栏 -->
            <el-form :model="listQuery" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item label="流程名" prop="name">
                    <el-input v-model="listQuery.name" placeholder="请输入流程名" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="所属流程" prop="processDefinitionId">
                    <el-input v-model="listQuery.processDefinitionId" placeholder="请输入流程定义的编号" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="流程分类" prop="category">
                    <el-select v-model="listQuery.category" placeholder="请选择流程分类" clearable>
                        <el-option v-for="dict in categoryDictDatas" :key="dict.code" :label="dict.value"
                            :value="dict.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="提交时间" prop="createTime">
                    <el-date-picker v-model="createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="listQuery.status" placeholder="请选择状态" clearable>
                        <el-option v-for="dict in status" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="结果" prop="result">
                    <el-select v-model="listQuery.result" placeholder="请选择流结果" clearable>
                        <el-option v-for="dict in results" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" type="primary" @click="resetQuery">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-if="!elements['bpm:process-instance:query']">发起流程</el-button>
                </el-form-item>
            </el-form>

            <!-- 操作工具栏 -->
            <!-- <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-if="!elements['bpm:process-instance:query']">发起流程</el-button>
                </el-col>
            </el-row> -->

            <!-- 列表 -->
            <el-table v-loading="loading" :data="list">
                <el-table-column label="编号" align="center" prop="id" width="320" />
                <el-table-column label="流程名" align="center" prop="name" />
                <el-table-column label="流程分类" align="center" prop="category">
                    <template slot-scope="scope">
                        <span>
                            <!-- <el-tag v-for="(item, index) in categoryDictDatas" :key="index"
                                v-show="scope.row.category + '' === item.value" :type="item.colorType">{{item.label}}
                            </el-tag> -->
                            <el-tag>{{fomatState(scope.row.category)}}
                            </el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="当前审批任务" align="center" prop="tasks">
                    <template slot-scope="scope">
                        <el-button v-for="task in scope.row.tasks" :key="task.id" type="text"
                            @click="handleFormDetail(task.id)">
                            <span>{{ task.name }}</span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" prop="status">
                    <template slot-scope="scope">
                        <span>
                            <el-tag v-for="(item, index) in status" :key="index"
                                v-show="scope.row.status + '' === item.value" :type="item.colorType">{{item.label}}
                            </el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="结果" align="center" prop="result">
                    <template slot-scope="scope">
                        <span>
                            <el-tag v-for="(item, index) in results" :key="index"
                                v-show="scope.row.result + '' === item.value" :type="item.colorType">{{item.label}}
                            </el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="提交时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.endTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" icon="el-icon-delete"
                            v-if="scope.row.result === 1 && !elements['bpm:process-instance:cancel']"
                            @click="handleCancel(scope.row)">取消</el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)"
                            v-if="!elements['bpm:process-instance:query']">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <!-- 		<pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" /> -->

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
		getMyProcessInstancePage,
		cancelProcessInstance
	} from "@/api/bpm/processInstance";
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: "ProcessInstance",
		components: {},
		data() {
			return {
				// 遮罩层
				loading: true,
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 工作流的流程实例的拓展列表
				list: [],
				// 查询参数
				listQuery: {
					page: 1,
					limit: 10,
					name: null,
					processDefinitionId: null,
					category: null,
					status: null,
					result: null,
				},
				createTime: [],
				categoryDictDatas: [],
				status: [{
					"value": "1",
					"label": "进行中",
					"colorType": "primary",
					"cssClass": ""
				}, {
					"value": "2",
					"label": "已完成",
					"colorType": "success",
					"cssClass": ""
				}],
				results: [{
					"value": "1",
					"label": "处理中",
					"colorType": "primary",
					"cssClass": ""
				}, {
					"value": "2",
					"label": "通过",
					"colorType": "success",
					"cssClass": ""
				}, {
					"value": "3",
					"label": "不通过",
					"colorType": "danger",
					"cssClass": ""
				}, {
					"value": "4",
					"label": "已取消",
					"colorType": "info",
					"cssClass": ""
				}],
				baseDict: {
					type: 'categoryDictData'
				},
			};
		},
		computed: {
			...mapGetters([
				'elements'
			]),
			
			fomatState() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					switch (val) {
						case '1':
							return "默认"
							break;
						case '2':
							return "OA"
							break;
						case '3':
							return "廉政宣教流程"
							break;
						default:
							break;
					}
				}
			},
		},
		created() {
			this.getList();
		},
		mounted() {
			this.getDataDict();
		},
		methods: {
			// 获取流程分类
			getDataDict() {
				getByType(this.baseDict)
					.then(response => {
						if (response && response.code === 0) {
							this.categoryDictDatas = response.data ? response.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: '获取流程分类失败',
								type: 'success',
								duration: 2000
							});
						}
					});
			},
			/** 查询列表 */
			getList() {
				this.loading = true;
                const [start, end] = this.createTime || []
                this.listQuery['createTime[0]'] = start
                this.listQuery['createTime[1]'] = end
				// 执行查询
				getMyProcessInstancePage(this.listQuery).then(response => {
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
			/** 新增按钮操作 **/
			handleAdd() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/processInstance/create"
				// 	})
				// } else {
					this.$router.push({
						path: "/processInstance/create"
					})
				// }
			},
			/** 取消按钮操作 */
			handleCancel(row) {
				const id = row.id;
				this.$prompt('请输入取消原因？', "取消流程", {
					type: 'warning',
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/, // 判断非空，且非空格
					inputErrorMessage: "取消原因不能为空",
				}).then(({
					value
				}) => {
					return cancelProcessInstance(id, value);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("取消成功");
				})
			},
			/** 处理详情按钮 */
			handleDetail(row) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/processInstance/detail",
				// 		query: {
				// 			id: row.id,
				// 			name: row.name
				// 		}
				// 	});
				// } else {
					this.$router.push({
						path: "/processInstance/detail",
						query: {
							id: row.id,
							name: row.name
						}
					});
				// }
			},
		}
	};
</script>
