<template>
	<div class="app-container calendar-list-container nav-content">
		<div ref="searchSection" class="page-info" style="padding-bottom:0;margin-bottom: 20px;">
			<div class="search-info" style="margin-bottom: 0px;">
				<div class="search-left">
					<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
						<el-form-item prop="year">
							<el-select v-model="listQuery.type" placeholder="请选择" @change="handleFilter">
								<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
                        </el-form-item>
						<!-- <el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button> -->
						<!-- <el-button type="primary" v-waves @click="addOrUpdateHandle()">新增</el-button> -->
					</el-form>
				</div>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :data="dataList" border v-loading="dataListLoading" fit highlight-current-row>
				<el-table-column label="序号" type="index" header-align="center" align="center" width="60px"/>
				<el-table-column prop="value" header-align="center" align="center" min-width="300" :show-overflow-tooltip="true" label="目录">
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button v-if="directoryArchive_btn_edit" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <div class="pagination-container">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="pageIndex"
				 :page-sizes="[10,20,30,50]" :page-size="pageSize" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="totalPage">
				</el-pagination>
			</div> -->
		</div>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import AddOrUpdate from './components/addOrEdit';
	import {
        unitarchivestemplateList
	} from 'api/archives/index';
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
                listQuery: {
                    // limit: 10,
                    // page: 1,
					type: '1'
                },
				options: [{
					value: '1',
					label: '单位信息档案'
				}, {
					value: '2',
					label: '单位风险点排查'
				}],
				dataList: [],
				totalPage: 0,
				dataListLoading: false,
				addOrUpdateVisible: false,
				directoryArchive_btn_edit: false,
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
			// // 获取权限
			this.directoryArchive_btn_edit = this.elements['directoryArchive:btn_edit'];
			this.getDataList();
		},
		methods: {
			goBack() {
				this.$router.go(-1);
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getDataList()
            },
			// 获取数据列表
			getDataList() {
				this.dataListLoading = true;
                unitarchivestemplateList(this.listQuery.type).then(res => {
                    if (res?.status === 200) {
                        this.dataList = res.data
						this.tableLayout();
                        this.dataListLoading = false
                        // this.totalPage = parseInt(res.data.total)
                    } else {
                        return Promise.reject()
                    }
                }).catch(() => {
                    this.dataList = []
					this.dataListLoading = false
					this.$notify.error("获取数据列表失败")
                })
			},
			// // 每页数
			// sizeChangeHandle(val) {
			// 	this.listQuery.limit = val
			// 	this.listQuery.page = 1
			// 	this.getDataList()
			// },
			// // 当前页
			// currentChangeHandle(val) {
			// 	this.listQuery.page = val
			// 	this.getDataList()
			// },
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
			addOrUpdateHandle(data) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init(data);
				})
			}
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
