<template>
	<div class="app-container calendar-list-container nav-content">
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<!-- <el-form :inline="true">
					<el-form-item>
						<el-button type="primary" @click="addOrUpdateHandle()">会议类型管理</el-button>
					</el-form-item>
				</el-form> -->
			</div>
			<div style="margin-bottom: 22px;">
				<el-button v-if="typeLarge_btn_add" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :data="dataList" border v-loading="dataListLoading" fit highlight-current-row>
				<!-- <el-table-column header-align="center" align="center" type="selection" width="50"></el-table-column> -->
				<el-table-column label="序号" header-align="center" align="center" type="index" width="50px" />
				<el-table-column prop="type" header-align="center" align="center" min-width="300" :show-overflow-tooltip="true" label="会议类型">
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button v-if="typeLarge_btn_edit" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
						<el-button v-if="typeLarge_btn_delete" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="pageIndex"
				 :page-sizes="[10,20,30,50]" :page-size="pageSize" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="totalPage">
				</el-pagination>
			</div>
		</div>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import AddOrUpdate from './components/typeEdit';
	import {
		conferencetypePage,
		delConferencetypeObj
	} from 'api/large/index';
	// import {
	// 	getSubjects,
	// 	subjectDelete
	// } from 'api/exam/manage/index';
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
	export default {
		data() {
			return {
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				addOrUpdateVisible: false,
				typeLarge_btn_add: false,
				typeLarge_btn_edit: false,
				typeLarge_btn_delete: false,
				tableHeight: undefined
			}
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		
		components: {
			AddOrUpdate
		},
		created() {
			// 获取权限
			this.typeLarge_btn_add = this.elements['typeLarge:btn_add'];
			this.typeLarge_btn_edit = this.elements['typeLarge:btn_edit'];
			this.typeLarge_btn_delete = this.elements['typeLarge:btn_delete'];
			this.getDataList();
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			// 获取数据列表
			getDataList() {
				this.dataList = [];
				this.dataListLoading = true;
				conferencetypePage({
					'page': this.pageIndex,
					'limit': this.pageSize
				}).then(data => {
					if (data && data.status === 200) {
						this.dataList = data.data.rows
						this.totalPage = parseInt(data.data.total)
						this.tableLayout();
						this.dataListLoading = false
					} else {
						this.dataList = []
						this.totalPage = 0
						this.$notify.error(data.msg)
						this.dataListLoading = false
					}
				}).catch(() => {
					this.dataList = []
					this.totalPage = 0
					this.dataListLoading = false
					this.$notify.error("获取数据列表失败")
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
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
			// // 多选
			// selectionChangeHandle(val) {
			// 	this.dataListSelections = val
			// },
			// 新增 / 修改
			addOrUpdateHandle(row) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(row);
				})
			},
			// 删除
			deleteHandle(id) {
				// var ids = id ? [id] : this.dataListSelections.map(item => {
				// 	return item.subjectId
				// })
				this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delConferencetypeObj(id)
						.then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 2000
								});
								this.getDataList();
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
				}).catch(() => {});
			},
		}
	}
</script>

<style scoped>
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

	.template {
		color: #FF4C52;
		text-decoration: underline;
	}

	.template:hover {
		cursor: pointer;
	}
</style>
