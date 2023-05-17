<template>
	<div class="app-container">
		<div class="page-content">
            <!-- 搜索工作栏 -->
            <el-form :model="listQuery" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item label="表单名" prop="name">
                    <el-input v-model="listQuery.name" placeholder="请输入表单名" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" type="primary" @click="resetQuery">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-if="!elements['bpm:form:create']">新增</el-button>
                </el-form-item>
            </el-form>

            <!-- 操作工具栏 -->
            <!-- <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-if="!elements['bpm:form:create']">新增</el-button>
                </el-col>
            </el-row> -->

            <!-- 列表 -->
            <el-table v-loading="loading" :data="list">
                <el-table-column label="编号" align="center" prop="id" />
                <el-table-column label="表单名" align="center" prop="name" />
                <el-table-column align="center" label="表单类型">
                    <template slot-scope="scope">
                        <span>{{toFormTypesType(scope.row.type)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开启状态" align="center" prop="status">
                    <template slot-scope="scope">
                        <!-- <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status" /> -->
                        <div>
                            <el-tag v-show="scope.row.status == 0">开启</el-tag>
                            <el-tag v-show="scope.row.status == 1" type="info">关闭</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" />
                <el-table-column label="创建时间" align="center" prop="crtTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.crtTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDetail(scope.row)"
                            v-if="!elements['bpm:form:quer']">详情</el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                            v-if="!elements['bpm:form:update']">修改</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                            v-if="!elements['bpm:form:delete']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" /> -->
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                    align="right" layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>

		<!--表单配置详情-->
		<!-- 		<el-dialog title="表单详情" :visible.sync="detailOpen" width="50%" append-to-body>
			<div class="test-form">
				<parser :key="new Date().getTime()" :form-conf="detailForm" />
			</div>
		</el-dialog> -->
		<el-dialog title="表单详情" :visible.sync="detailOpen" width="1000px">
			<div class="test-form">
				<k-form-build ref="kfb" :value="jsonData" />
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		deleteForm,
		getForm,
		getFormPage
	} from "@/api/bpm/form";
	import Parser from '@/components/parser/Parser'
	import {
		decodeFields
	} from "@/utils/formGenerator";
	import {
		mapGetters
	} from 'vuex';
	import {
		getByType
	} from 'api/admin/dict/index';

	export default {
		name: "Form",
		components: {
			Parser
		},
		data() {
			return {
				// 遮罩层
				loading: true,
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 工作流的列表
				list: [],
				// 查询参数
				listQuery: {
					page: 1,
					limit: 10,
					name: null,
				},
				// 表单详情
				detailOpen: false,
				detailForm: {
					fields: []
				},
				jsonData: {},
				// 数据字典
				formTypes: [],
				baseDict: {
					type: 'formTypes'
				}
			};
		},
		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			toFormTypesType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.formTypes.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},
		},
		mounted() {
			this.getDataDict();
		},
		created() {
			this.getList();
		},
		methods: {
			// 获取表单类型
			getDataDict() {
				getByType(this.baseDict)
					.then(response => {
						if (response && response.code === 0) {
							this.formTypes = response.data ? response.data : [];
						} else {
							this.$notify({
							title: '失败',
							message: '获取表单类型失败',
							type: 'success',
							duration: 2000
							});
						}
					});
			},
			/** 查询列表 */
			getList() {
				this.loading = true;
				// 执行查询
				getFormPage(this.listQuery).then(response => {
					this.list = response.data.rows;
					this.total = parseInt(response.data.total);
					this.loading = false;
				});
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.listQuery.page = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 详情按钮操作 */
			handleDetail(row) {
				getForm(row.id).then(response => {
					// 设置值
					const data = response.data
					// this.detailForm = {
					// 	...JSON.parse(data.conf),
					// 	fields: decodeFields(data.fields)
					// }
					this.jsonData = {
						config: undefined,
						list: []
					}
					this.jsonData.config = JSON.parse(data.conf);
					data.fields.forEach(item => {
						this.jsonData.list.push(JSON.parse(item));
					})
					// 弹窗打开
					this.detailOpen = true
				})
			},
			/** 新增按钮操作 */
			handleAdd() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/form/formAdd"
				// 	});
				// } else {
					this.$router.push({
						path: "/form/formAdd"
					});
				// }
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/form/formEdit",
				// 		query: {
				// 			formId: row.id
				// 		}
				// 	});
				// } else {
					this.$router.push({
						path: "/form/formEdit",
						query: {
							formId: row.id
						}
					});
				// }
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
			/** 删除按钮操作 */
			handleDelete(row) {
				const id = row.id;
				this.$confirm('是否确认删除工作表单的编号为"' + id + '"的数据项?').then(function() {
					return deleteForm(id);
				}).then(() => {
					this.getList();
					this.$notify({
						title: '提示',
						message: '删除成功',
						type: 'success',
						duration: 2000
					});
				}).catch(() => {});
			}
		}
	};
</script>

<style lang="scss">
	.test-form {
		overflow-x: auto;
	}
</style>
