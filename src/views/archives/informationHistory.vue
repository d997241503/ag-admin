<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column label="序号" width="50px" align="center" type="index" />
                <el-table-column align="center" label="下发组织" :show-overflow-tooltip="true">
					<template slot-scope="scope">
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" class="page-info-taskTitle">
							<el-popover
								placement="right"
								width="500"
								trigger="click">
							<el-table height="400" :data="scope.row.issueOrg" border>
								<el-table-column width="53" align="center" type="index" label="序号"></el-table-column>
								<el-table-column width="200" align="center" property="orgName" label="公司名称" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column width="120" align="center" property="submitTime" label="实际提报时间" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column width="100" align="center" property="submitUserName" label="提报人员" :show-overflow-tooltip="true"></el-table-column>
							</el-table>
							<span slot="reference" class="tabel-reference">
								<span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item,index) in scope.row.issueOrg" :key="index">
								<span>{{item.orgName}}</span>
								<span v-if="index !== scope.row.issueOrg.length-1">、</span>
							</span></span>
							</el-popover>
						</div>
					</template>
				</el-table-column>
				<el-table-column width="150" align="center" label="下发用户姓名" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						{{scope.row.issueUserName}}
					</template>
				</el-table-column>
                <el-table-column width="180" header-align="center" align="center" label="下发时间">
					<template slot-scope="scope">
						{{scope.row.issueTime}}
					</template>
				</el-table-column>
				<el-table-column width="180" header-align="center" align="center" label="应提报时间">
					<template slot-scope="scope">
						{{scope.row.commitTime}}
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
		getUnitArchivesIssue
	} from 'api/archives/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: "index",
		data() {
			return {
				tableHeight: undefined,
				list: [],
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10
				},
				tableKey: 0,
			}
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		components: {
		},
		created() {
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
			// 获取数据列表
			getList() {
				this.listLoading = true;
				getUnitArchivesIssue(this.listQuery)
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
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal - 20
				this.tableHeight = computedHeight > 500 ? computedHeight : 500
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
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

    .page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: 20px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}

    .tabel-reference {
		text-decoration:underline;
		cursor: pointer;
	}

	.tabel-reference:hover {
		color: #bc0000;
	}
</style>
