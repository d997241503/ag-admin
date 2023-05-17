<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="page-info">
			<el-row>
				<el-col :span="20">
					<div class="date-item">
						<el-date-picker class="filter-item" v-model="times" type="monthrange" align="right" unlink-panels range-separator="-"
						 start-placeholder="开始月份" end-placeholder="结束月份" :picker-options="pickerOptions">
						</el-date-picker>
						<el-button class="filter-item query" v-waves style="margin-left: 10px;" icon="el-icon-search" type="primary" @click="queryHandle()">查询</el-button>
					</div>
				</el-col>
				<el-col :span="4" align="right">
					<el-button class="filter-item" v-waves @click="goBack()">返回</el-button>
				</el-col>
			</el-row>
			<div style="width: 100%;margin: 20px auto;">
				<div id="J_chartBarBox" class="chart-box"></div>
			</div>
			<div>
				<el-table :key='tableKey' :data="dataList" v-loading="listLoading" show-summary size="mini" border fit
				 highlight-current-row style="width: 100%;font-size: 15px;">
					<el-table-column align="center" width="300" label="学院">
						<template slot-scope="scope">
							<div>{{scope.row.name}}</div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="txtAmount" label="文字条例" sortable>
					</el-table-column>
					<el-table-column align="center" prop="imageAmount" label="图片图解" sortable>
					</el-table-column>
					<el-table-column align="center" prop="videoAmount" label="音视频" sortable>
					</el-table-column>
					<el-table-column align="center" prop="urlAmount" label="外部链接" sortable>
					</el-table-column>
					<el-table-column align="center" prop="allAmount" label="总计" sortable>
					</el-table-column>
				</el-table>
				<div class="pagination-container">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
					 :page-sizes="[10,20,30,50,100]" :page-size="listQuery.limit" align="right" layout="total, prev,sizes, pager, next, jumper"
					 :total="total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import echarts from 'echarts';
	import {
		statisticsList,
		statisticsData
	} from 'api/incorrupt/education/index';
	export default {
		data() {
			return {
				chartBar: null,
				listQuery: {
					page: 1,
					limit: 10,
					startDate: undefined,
					endDate: undefined
				},
				times: undefined,
				statistics: [],
				total: 0,
				tableKey: 0,
				dataList: [],
				listLoading: false,
				dataShadow: [],
				pickerOptions: {
					shortcuts: [{
						text: '本月',
						onClick(picker) {
							picker.$emit('pick', [new Date(), new Date()]);
						}
					}, {
						text: '今年至今',
						onClick(picker) {
							const end = new Date();
							const start = new Date(new Date().getFullYear(), 0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近六个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setMonth(start.getMonth() - 6);
							picker.$emit('pick', [start, end]);
						}
					}]
				}
			}
		},
		computed: {
			doTotal() {
				return (row) => {
					return row.value1 + row.value2 + row.value3 + row.value4;
				}
			}
		},
		created() {
			this.getData();
			this.getDataList();
		},
		mounted() {
			this.$nextTick(() => {
				if (this.chartBar) {
					this.chartBar.resize()
				}
			})
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			toTime(t) {
				if ((t + '').length > 20) {
					return t.getFullYear() + '-' + (t.getMonth() + 1)
				} else {
					return t
				}
			},
			// 查询
			queryHandle() {
				this.listQuery.startDate = this.times ? this.toTime(this.times[0]) : undefined;
				this.listQuery.endDate = this.times ? this.toTime(this.times[1]) : undefined;
				this.getData();
				this.getDataList();
			},

			// 获取数据列表
			getDataList() {
				this.listLoading = true;
				statisticsList(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.dataList = response.data.rows;
							this.total = response.data.total;
						} else {
							this.total = 0;
						}
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getDataList();
			},

			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getDataList();
			},

			// 获取统计数据
			getData() {
				statisticsData(this.listQuery)
					.then(response => {
						if (response && response.code === 0) {
							this.statistics = response.data;
						} else {}
					}).then(() => {
						if (this.statistics.length) this.initChartBar();
					}).catch(() => {})

			},
			// 柱状图
			initChartBar() {
				var nameList = [];
				var dataList = [];
				nameList = this.statistics.map(item => {
					return item.name;
				});

				dataList = this.statistics.map(item => {
					return item.amount;
				});
				var option = {
					// title: {
					// 	// text: '廉政教育统计',
					// 	// subtext: '纯属虚构',
					// 	left: 'center'
					// },
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow',
							label: {
								show: true
							}
						}
					},
					color: ['#65B2FF'],
					// toolbox: {
					// 	show: true,
					// 	feature: {
					// 		mark: {
					// 			show: true
					// 		},
					// 		saveAsImage: {
					// 			show: true
					// 		}
					// 	}
					// },
					calculable: true,
					// legend: {
					// 	data: explainList,
					// 	left: 'right',
					// },
					grid: {
						top: '12%',
						left: '1%',
						right: '10%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						data: nameList
					}],
					yAxis: [{
						type: 'value',
						name: '廉政教育统计',
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisLabel: {
							formatter: function(a) {
								a = +a;
								return isFinite(a) ?
									echarts.format.addCommas(+a) :
									'';
							}
						}
					}],
					dataZoom: [{
							show: true,
							start: 0,
							end: 50
						},
						{
							type: 'inside',
							start: 0,
							end: 50
						},
						{
							show: true,
							yAxisIndex: 0,
							filterMode: 'empty',
							width: 30,
							height: '80%',
							showDataShadow: false,
							left: '93%'
						}
					],
					// series: dataList,
					series: [{
						name: '合计',
						type: 'bar',
						barWidth: 50,
						data: dataList
					}]
				};

				this.chartBar = echarts
					.init(document.getElementById('J_chartBarBox'))
				this.chartBar.setOption(option)
				window.addEventListener('resize', () => {
					this.chartBar.resize()
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;

		.date-item>>>.el-range-separator {
			margin-left: -5px;
			font-size: 22px;
			background-color: #004444;
		}

		.chart-box {
			padding-left: 2%;
			height: 370px;
		}
	}

	.query {
		margin-left: 10px;
	}
</style>
