<template>
	<div class="app-container calendar-list-container nav-content">
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" @keyup.enter.native="handleFilter" ref="queryForm" :model="listQuery">
				<el-form-item prop="educationName">
					<el-input style="width: 200px;" clearable class="filter-item" placeholder="请输入标题"
					v-model="listQuery.educationName">
					</el-input>
				</el-form-item>
				<el-form-item prop="educationType">
					<el-select v-model="listQuery.educationType" class="filter-item" placeholder="请选择类型" clearable style="width: 150px;">
						<el-option v-for="item in educationTypes" :key="item.code" :label="item.value" :value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter" style="margin-left: 10px;">查询</el-button>
				<el-button v-waves type="primary" @click="handleReset">重置</el-button>
				<el-button class="filter-item" v-if="educationManager_btn_add" @click="handleCreate" type="primary" v-waves icon="edit">新增文章</el-button>
				<el-button class="filter-item" v-if="educationManager_view_classify" @click="handleSortManagement" type="primary"
				 v-waves icon="edit">分类管理</el-button>
				</el-form>
			</div>
			<div class="search-right">
				<!-- <el-button class="filter-item" v-if="educationManager_view_statistics" @click="handleStatistics" type="primary"
				 v-waves icon="edit">子公司统计</el-button> -->
			</div>
		</div>
		<div class="tree-info page-info tree-roll-containers" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div>
		<div class="page-info" ref="pageInfo" style="margin-left: 270px;">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column align="center" style="min-width: 400px;" label="标题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.educationName}}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" type="index" label="展示位置" width="120">
				</el-table-column> -->
				<el-table-column width="150px" align="center" label="文章类别">
					<template slot-scope="scope">
						<span>{{fomatType(scope.row.educationType)}}</span>
					</template>
				</el-table-column>
				<el-table-column width="120px" align="center" label="创建时间">
					<template slot-scope="scope">
						<span>{{scope.row.crtTime}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" width="200">
					<template slot-scope="scope">
						<el-button v-if="educationManager_btn_detail" size="small" type="text" @click="handleDetail(scope.row)">查看
						</el-button>
						<el-button v-if="educationManager_btn_delete" size="small" type="text" @click="handleDelete(scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		page,
		delObj
	} from 'api/incorrupt/education/index';
	import {
		MessageBox
	} from 'element-ui';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import tree from "./components/tree";
	export default {
		name: "index",
		components: {
			tree
		},
		data() {
			this.pickerOptions = {
                shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
                }, {
                text: '最近一个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
                }, {
                text: '最近三个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
                }]
            }
			return {
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					categoryId: undefined,
					educationName: undefined,
					educationType: undefined,
					startDate: '',
					endtDate: ''
				},
				times: [],
				category: {
					name: "全部",
					categoryId: undefined
				},
				educationManager_btn_add: false,
				educationManager_view_classify: false,
				educationManager_view_statistics: false,
				educationManager_btn_delete: false,
				educationManager_btn_detail: false,
				tableKey: 0,
				// 类型
				educationTypes: [{
					value: '文字条例',
					code: '0'
				}, {
					value: '图片图解',
					code: '1'
				}, {
					value: '音视频',
					code: '2'
				}, {
					value: '外部链接',
					code: '3'
				}],
				tableHeight: 622
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			fomatType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.educationTypes.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			}
		},
		created() {
			// 获取列表
			this.getList();
			// 获取权限
			this.educationManager_btn_add = this.elements['educationManager:btn_add'];
			this.educationManager_view_classify = this.elements['educationManager:view_classify'];
			this.educationManager_view_statistics = this.elements['educationManager:view_statistics'];
			this.educationManager_btn_delete = this.elements['educationManager:btn_delete'];
			this.educationManager_btn_detail = this.elements['educationManager:btn_delete'];
		},
		methods: {
			// 点击侧边栏刷新列表数据
			treeHandle(data) {
				this.category = data;
				this.listQuery.categoryId = this.category.categoryId;
				this.$store.commit('SET_CATEGORY', data);
				if (this.category.type === '1') {
					// if(this.$store.state.user.isBackstage) {
					// 	this.$router.push({
					// 		path: "/backstage/newlyLink"
					// 	});
					// } else {
						this.$router.push({
							path: "/newlyLink"
						});
					// }
				} else {
					this.listQuery.page = 1;
					this.getList();
				}
			},

			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endtDate = this.times && this.times.length ? this.times[1] : '';
				page(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.tableLayout();
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			handleFilter() {
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
			// 表格有合并单元格和fixed的时候会错位，需要获取完数据重新布局
			tableLayout(option) {
				const {searchRefName = 'searchSection', tableRefName = 'table', subtractVal = 270} = option || {}
				const minHeight = 500
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal
				this.tableHeight = computedHeight > minHeight ? computedHeight : minHeight
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},

			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					categoryId: undefined,
					educationName: undefined,
					educationType: undefined,
					startDate: '',
					endtDate: ''
				},
				this.times = []
				this.getList()
			},

			// 新增
			handleCreate() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/newlyArticle'
				// 	});
				// } else {
					this.$router.push({
						path: '/newlyArticle'
					});
				// }
				// if (this.category.categoryId == undefined) {
				// 	this.$alert('<strong>请选择左侧分类</strong>', '提示', {
				// 		dangerouslyUseHTMLString: true
				// 	}).catch(() => {});
				// } else {
				// 	let url = "/newlyArticle";
				// 	if (this.category.type === '1') {
				// 		url = "/newlyLink";
				// 	}
				// 	this.$router.push({
				// 		path: url
				// 	});
				// }
			},

			// 分类管理
			handleSortManagement() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/sortManagement"
				// 	})
				// } else {
					this.$router.push({
						path: "/sortManagement"
					})
				// }
			},

			// 子公司统计
			handleStatistics() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/educationStatistics"
				// 	})
				// } else {
					this.$router.push({
						path: "/educationStatistics"
					})
				// }
			},

			// 详情
			handleDetail(row) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/articleDetail',
				// 		query: {
				// 			id: row.educationInfoId
				// 		}
				// 	});
				// } else {
					this.$router.push({
						path: '/articleDetail',
						query: {
							id: row.educationInfoId
						}
					});
				// }
			},

			// 删除
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delObj({
								educationInfoId: row.educationInfoId
							})
							.then(res => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '删除成功',
										type: 'success',
										duration: 2000
									});
									this.getList();
								} else {
									this.$notify({
										title: '失败',
										message: '删除失败',
										type: 'error',
										duration: 2000
									});
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '删除失败',
									type: 'error',
									duration: 2000
								});
							});
					}).catch(() => {

					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.tree-roll-containers {
		height: calc(100vh - 285px);
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.tree-info {
		position: absolute;
	}

	.query {
		// margin-left: 10px;
	}
</style>
