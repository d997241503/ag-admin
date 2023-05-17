<template>
	<div class="app-container calendar-list-container nav-content">
		<div  ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
					<!-- <el-form-item>
						<el-input v-model="dataForm.key" placeholder="查询题目" clearable maxlength="20" show-word-limit></el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="dataForm.subjectType" clearable placeholder="请选择题目类型">
							<el-option v-for="(item,index) in subjectTypes" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item> -->
					<!-- <el-form-item>
						<el-button type="primary" @click="addOrUpdateHandle()">添加巡查信息</el-button>
					</el-form-item> -->
				</el-form>
			</div>
			<div style="margin-bottom: 22px;">
				<el-button type="primary" @click="addOrUpdateHandle()">添加</el-button>
			</div>
			<!-- <div style="width: 150px;text-align: right;line-height: 50px;">
				<span class="template" type="primary" @click="downloadTemplateHandle()">下载模板</span>
			</div> -->
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table  :height="tableHeight" ref="table" :data="dataList" border v-loading="dataListLoading" fit highlight-current-row @selection-change="selectionChangeHandle">
				<!-- <el-table-column header-align="center" align="center" type="selection" width="50"></el-table-column> -->
				<el-table-column prop="teamName" header-align="center" align="center" width="300" :show-overflow-tooltip="true" label="巡查小组">
				</el-table-column>
				<el-table-column prop="groupLeader" header-align="center" align="center" label="组长">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.groupLeader" :key="index">{{item.name}}
							<span v-if="index+1 !== scope.row.groupLeader.length">、</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="deputyGroupLeader" header-align="center" align="center" :show-overflow-tooltip="true" label="副组长">
					<template slot-scope="scope">
						<!-- <span v-for="(item,index) in scope.row.deputyGroupLeader" :key="index">{{item.name}}</span> -->
						<span v-for="(item,index) in scope.row.deputyGroupLeader" :key="index">{{item.name}}
							<span v-if="index+1 !== scope.row.deputyGroupLeader.length">、</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="groupMember" header-align="center" align="center" width="300" :show-overflow-tooltip="true" label="组员">
					<template slot-scope="scope">
						<span v-for="(item,index) in scope.row.groupMember" :key="index">{{item.name}}
							<span v-if="index+1 !== scope.row.groupMember.length">、</span>
						</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
						<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
	import AddOrUpdate from './components/personnelEdit';
	import {
		pageTeam,
		delTeamObj
	} from 'api/patrol/index';
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
				dataForm: {
					key: '',
					subjectType: undefined
				},
				examVisible: false,
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				examListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false,
				examList: [],
				subjectId: '',
				numberTopicsVisible: false,
				subjectTypes: [{
					label: '单选',
					value: '1'
				}, {
					label: '多选',
					value: '2'
				}, {
					label: '填空',
					value: '4'
				}],
				tableHeight: undefined
			}
		},
		components: {
			AddOrUpdate
		},
		created() {
			this.getDataList()
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			// 获取数据列表
			getDataList() {
				this.dataList = [];
				this.dataListLoading = true;
				pageTeam({
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
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
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
			// // 下载模板
			// downloadTemplateHandle() {
			// 	window.location.href = `/api/examination/test/dateinfo/downTemplate?state=1&token=${getToken()}`;
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
				var ids = id ? [id] : this.dataListSelections.map(item => {
					return item.subjectId
				})
				this.$confirm(`确定进行【${id ? '删除' : '批量删除'}】操作?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delTeamObj(ids)
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
