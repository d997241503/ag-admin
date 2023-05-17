<template>
	<div class="app-container calendar-list-container nav-content">
        <!-- <div class="search-info page-info" style="padding-bottom:0;">
            <div class="page-title">
				{{$route.name}}
			</div>
        </div> -->
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
					<el-form-item>
						<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
							<el-tree style="min-width: 350px;" ref="treeData" :props="defaultProps" :data="treeData"
								:default-expanded-keys="[index]" node-key="id" :expand-on-click-node="false" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
										<span
											v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
										</span>
									</span>
								</el-tree>
							<el-select v-model="deptName" placeholder="请选择子公司" class="input-item" slot="reference" clearable @clear="deptClear"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item>
                    <el-form-item>
						<el-date-picker v-model="times" type="daterange" align="left" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-waves type="primary" @click="handleReset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
            <div>
				<el-button v-if="large_btn_rule" class="filter-item" type="primary" v-waves icon="search" @click="ruleHandle()">规则设置</el-button>
				<el-button v-if="large_btn_largeaccount" class="filter-item" type="primary" v-waves icon="search" @click="situationHandle()">三重一大情况</el-button>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="table" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column label="排序" width="50px" align="center" type="index" />
				<el-table-column min-width="200" align="center" label="部门" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.orgName}}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column header-align="center" align="center" label="支部会">
					<template slot-scope="scope">
						{{scope.row.matterType}}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center">
                    <template slot="header">
                        <div>董事会</div>
                        <div>(执行董事)</div>
                    </template>
					<template slot-scope="scope">
						{{scope.row.name}}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="总经理办公会">
					<template slot-scope="scope">
						<div>{{scope.row.originalPosition}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="专题会">
					<template slot-scope="scope">
						<div>{{scope.row.promotionPosition}}</div>
					</template>
				</el-table-column> -->
				<el-table-column header-align="center" align="center" :label="item.name" v-for="(item,indexs) in headerList" :key="indexs">
					<template slot-scope="scope">
						{{ scope.row.statisticData[indexs].statisticNum }}
					</template>
				</el-table-column>
				<!-- <el-table-column header-align="center" align="center" label="会议总数">
					<template slot-scope="scope">
						<div>{{scope.row.place}}</div>
					</template>
				</el-table-column> -->
				<el-table-column v-if="headerList.length" header-align="center" align="center" label="会议总数">
					<template slot-scope="scope">
						{{ toStringHandle(scope.row.num) }}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="添加临时议题数量">
					<template slot-scope="scope">
						<div>{{scope.row.temporaryNum}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" label="未按时报备">
					<template slot-scope="scope">
						<div>{{scope.row.notSubmitOnTimeNum}}</div>
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
		statisticList
	} from 'api/large/index';
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
	import tableMixin from '@/mixins/table/table.mixin'
	export default {
		name: "index",
		mixins: [tableMixin],
		data() {
			return {
				popoverVisibel: false,
				list: null,
				total: null,
				loading: true,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					orgId: undefined,
					startDate: '',
					endDate: '',
				},
				deptName: '',
				times: [],
				tableKey: 0,
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
				query: '',
				treeVisible: false,
				treeData: [],
				index: 0,
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				large_btn_inspection: false,
				large_btn_subsidiary: false,
				large_btn_rule: false,
				large_btn_largeaccount: false,
				// large_btn_subsidiaryaccount: false,
				large_btn_conferencetype: false,
				headerList: [],
				// tableHeight: undefined
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
			this.getTreeInfo();
			// 获取权限
			this.large_btn_inspection = this.elements['large:btn_inspection'];
			this.large_btn_subsidiary = this.elements['large:btn_subsidiary'];
			this.large_btn_rule = this.elements['large:btn_rule'];
			this.large_btn_largeaccount = this.elements['large:btn_largeaccount'];
			// this.large_btn_subsidiaryaccount = this.elements['large:btn_subsidiaryaccount'];
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							this.loading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
							this.loading = false;
						}
					});
			},
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			
			deptClear(e) {
				this.listQuery.orgId = undefined;
			},
			// 选择部门
			handleCheckChange(data) {
				this.listQuery.orgId = data.id;
				this.deptName = data.departmentFullName;
				this.popoverVisibel = false;
			},
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				statisticList(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							if(response.data.rows.length) this.headerList = response.data.rows[0].statisticData.map(item => 
								{ return { name: item.name } });
							this.list = response.data.rows;
							for(let i = 0; i < this.list.length; i++) {
								this.list[i].num = 0;
								for(let j = 0; j < this.list[i].statisticData.length; j++) {
									this.list[i].num = this.list[i].num + parseInt(this.list[i].statisticData[j].statisticNum)
								}
							}
							this.total = parseInt(response.data.total);
							this.listLoading = false;
						} else {
							this.total = 0;
							this.listLoading = false;
						}
						// this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			toStringHandle(val) {
				return String(val);
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

			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					orgId: undefined,
					startDate: '',
					endDate: '',
				};
				this.deptName = '';
				this.times = [];
				this.getList();
			},
            
            // 规则设置
			ruleHandle() {
                this.$router.push({
                    path: '/ruleLarge',
                })
            },
            
            // 三重一大情况
			situationHandle() {
                this.$router.push({
                    path: '/situationLarge'
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
		background-color: #409EFF;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}
</style>
xv