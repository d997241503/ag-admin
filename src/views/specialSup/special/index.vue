<template>
	<div class="app-container calendar-list-container nav-content">
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
                    <el-form-item>
                        <SelectDeptItem ref="selDept" v-model="listQuery.orgId"/>
                    </el-form-item>
					<el-form-item>
						<el-input clearable placeholder="请输入主题查询" v-model="listQuery.supervisionTheme" maxlength="20">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="下发开始时间" end-placeholder="下发结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
						<el-button v-waves type="primary" @click="handleReset">重置</el-button>
					</el-form-item>
					<el-form-item v-if="special_btn_add">
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="addOrUpdateHandle()">下发专项监督事项</el-button>
					</el-form-item>
				</el-form>
			</div>
			<!-- <div>
				<el-button v-if="patrolInternal_btn_personnelPatrol" class="filter-item" type="primary" v-waves icon="search" @click="personnelPatrolHandle()">巡查人员库</el-button>
			</div> -->
		</div>
		<div class="page-info">
			<el-table ref="table" :height="tableHeight" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column width="250" align="center" label="专项监督主题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.supervisionTheme}}</div>
					</template>
				</el-table-column>
				<el-table-column width="250" align="center" label="项目负责人">
					<template slot-scope="scope">
						<div>{{scope.row.responsiblePerson[0].name}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" label="监督时间">
					<template slot-scope="{row}">
						{{row.startTime}} ~ {{row.endTime}}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.status == '0'">进行中</span>
						<span v-if="scope.row.status == '1'">已结束</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
					<template slot-scope="scope">
						<el-button v-if="special_btn_add_detial" type="text" @click="handleDetail(scope.row)">查看</el-button>
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
		supervisionList,
		delOrgObj
	} from 'api/special/index';
	import {
		mapGetters
	} from 'vuex';
    import tableMixin from '@/mixins/table/table.mixin'
    import SelectDeptItem from 'components/formItem/SelectDeptItem'

	export default {
		name: "index",
        mixins: [tableMixin],
        components: {SelectDeptItem},
		data() {
			return {
				listQuery: {
					page: 1,
					limit: 10,
					orgId: undefined,
					supervisionTheme: '',
					startTime: '',
					endTime: ''
				},
				times: [],
				speciall_btn_inspection: false,
				special_btn_perteam: false,
				special_btn_add: false,
				special_btn_add_detial: false,
				pickerOptions: {
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
				},
				examTypes: [],
				name: '',
			}
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		created() {
			// 获取权限
			this.speciall_btn_inspection = this.elements['special:btn_inspection'];
			this.special_btn_perteam = this.elements['special:btn_perteam'];
			this.special_btn_add = this.elements['special:btn_add'];
			this.special_btn_add_detial = this.elements['special:btn_detial'];
			// this.speciall_btn_inspection = false;
		},
		methods: {
			// 获取数据列表
            getListApi() {
                this.listQuery.startTime = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endTime = this.times && this.times.length ? this.times[1] : '';
                return supervisionList(this.listQuery)
            },

			// 详情
			handleDetail(row) {
                this.$router.push({
                    path: '/filesImplementation/special/specialDetail',
                    query: {
                        id: row.id
                    }
                })
                return
			},

			// 新增/修改
			addOrUpdateHandle() {
				this.$nextTick(() => {
                    this.$router.push({
                        path: '/filesImplementation/special/newlySpecial',
                        query: {
                            operation: 'edit',
                            id: undefined,
                            name: 'first'
                        }
                    })
				})
			},
            handleReset() {
                this.listQuery = {
					page: 1,
					limit: 10,
					orgId: undefined,
					supervisionTheme: '',
					startTime: '',
					endTime: ''
				}
                this.times = []
                this.$refs.selDept.handleDelete()
                this.getList()
            }
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
