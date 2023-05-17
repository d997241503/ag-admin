<template>
	<div class="app-container calendar-list-container nav-content">
		<!-- <div class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				
			</div>
			<div>
			</div>
		</div> -->
		<!-- <div class="tree-info tree-roll-containers" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div> -->
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column min-width="300" align="center" label="下发单位">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.deptName}}</div>
					</template>
				</el-table-column>
				<el-table-column min-width="300" align="center" label="责任清单主题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.issueTheme}}</div>
					</template>
				</el-table-column>
				<el-table-column min-width="150" header-align="center" align="center" label="下发时间">
					<template slot-scope="scope">
						{{scope.row.issueTime}}
					</template>
				</el-table-column>
				<el-table-column min-width="150" header-align="center" align="center" label="填报时间">
					<template slot-scope="scope">
						{{scope.row.commitTime}}
					</template>
				</el-table-column>
				<el-table-column min-width="150" header-align="center" align="center" label="填报人">
					<template slot-scope="scope">
						{{scope.row.commitUserName}}
					</template>
				</el-table-column>
				<el-table-column min-width="150" header-align="center" align="center" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.approverStatus == '0'">未提交</span>
						<span v-if="scope.row.approverStatus == '1'">未通过</span>
						<span v-if="scope.row.approverStatus == '2'">进行中</span>
						<span v-if="scope.row.approverStatus == '3'">已通过</span>
					</template>
				</el-table-column>
                <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
					<template slot-scope="scope">
						<el-button v-if="responsibility_btn_detail" type="text" size="small" @click="handleDetail(scope.row.id, scope.row.step)">查看
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
		issueListDelPage
	} from 'api/responsibility/index';
	import {
		getTree
	} from 'api/admin/department/index';
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
		data() {
			return {
				addOrUpdateVisible: false,
				list: null,
				total: null,
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 10,
					approverStatus: '',
					deptId: ''
				},
				teamList: [],
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				times: [],
				tableKey: 0,
				examTypes: [],
				name: '',
				query: '',
                responsibility_btn_detail: false,
				id: undefined,
				tableHeight: undefined
			}
		},
		components: {
			tree,
		},

		computed: {
			...mapGetters([
				'elements','userId'
			]),
		},
		created() {
			if (this.$route.query.id) {
				this.id = this.$route.query.id;
			} else {
				const responsibilityDelId = localStorage.getItem(
					'responsibilityDelId',
				);
				this.id = JSON.parse(responsibilityDelId).id;
			}
            // 获取权限
            this.responsibility_btn_detail = this.elements['responsibility:btn_detail'];
			// this.getDataList();
			// this.getTreeInfo();
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
			
			// 获取数据列表
			getList() {
				this.listLoading = true;
				// this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				// this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
                issueListDelPage(this.listQuery,this.id)
                    .then(response => {
                        if (response && response.status === 200) {
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

			// 表格有合并单元格和fixed的时候会错位，需要获取完数据重新布局
			tableLayout(option) {
				const {searchRefName = 'searchSection', tableRefName = 'table', subtractVal = 270} = option || {}
				const minHeight = 500
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal - 50
				this.tableHeight = computedHeight > minHeight ? computedHeight : minHeight
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},

            // 详情
			handleDetail(id,step) {
				this.$nextTick(() => {
					// if(this.$store.state.user.isBackstage) {
					// 	this.$router.push({
					// 		path: '/backstage/putRes',
					// 		query: {
					// 			operation: 'see',
					// 			id: id,
					// 			name: this.name
					// 		}
					// 	});
					// } else {
						this.$router.push({
							path: '/putRes',
							query: {
								operation: 'see',
								id: id,
								name: this.name,
								pageId: this.id
							}
						});
					// }
				})
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

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.tree-info {
		position: absolute;
	}
</style>
