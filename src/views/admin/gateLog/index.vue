<template>
	<div class="app-container calendar-list-container">
		<div class="page-content">
			<div class="filter-container">
				<el-form :inline="true">
					<el-form-item>
						<el-input style="width: 150px;" class="filter-item" placeholder="请输入操作人员" v-model="listQuery.username" clearable>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input style="width: 150px;" class="filter-item" placeholder="请输入模块标题" v-model="listQuery.title" clearable>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-select style="width: 150px;" v-model="listQuery.businessType" clearable placeholder="请选择业务类型">
							<el-option
								v-for="item in type"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
							unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-input style="width: 150px;" class="filter-item" placeholder="请输入操作内容" v-model="listQuery.operatorValue" clearable>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input style="width: 200px;" class="filter-item" placeholder="请输入操作主机ip地址" v-model="listQuery.operIp" clearable>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-input style="width: 150px;" class="filter-item" placeholder="请输入请求方式" v-model="listQuery.requestMethod" clearable>
						</el-input>
					</el-form-item>
					<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
					<el-button class="filter-item" v-waves type="primary" @click="handleReset">重置</el-button>
				</el-form>
			</div>
			<el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column align="center" type="index" label="序号" width="65">
				</el-table-column>
				<el-table-column align="center" label="	模块标题" :show-overflow-tooltip="true"><template slot-scope="scope">
						<span>
							{{scope.row.title}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="业务类型" :show-overflow-tooltip="true"><template slot-scope="scope">
						<span>{{fomatType(scope.row.businessType)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="请求方式" :show-overflow-tooltip="true"><template slot-scope="scope"><span>{{scope.row.requestMethod}}</span></template></el-table-column>
				<el-table-column align="center" label="操作内容" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{scope.row.operatorValue}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作状态" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{fomatState(scope.row.status)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="请求URL" :show-overflow-tooltip="true"><template slot-scope="scope">
						<span>
							{{scope.row.operUrl}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="请求参数" :show-overflow-tooltip="true"><template slot-scope="scope">
						<span>
							{{scope.row.operParam}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="请求主机地址" :show-overflow-tooltip="true"><template slot-scope="scope">
						<span>
							{{scope.row.operIp}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作时间" :show-overflow-tooltip="true"><template slot-scope="scope">
						<span>
							{{scope.row.operTime}}</span>
					</template>
				</el-table-column>
s				<el-table-column align="center" label="操作人员" :show-overflow-tooltip="true"><template slot-scope="scope">
						<span>
							{{scope.row.operName}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="方法名称" :show-overflow-tooltip="true"><template slot-scope="scope"><span>{{scope.row.method}}</span></template></el-table-column>
				<el-table-column align="center" label="返回参数" :show-overflow-tooltip="true"><template slot-scope="scope"><span>{{scope.row.jsonResult}}</span></template></el-table-column>
				<el-table-column align="center" label="错误消息" :show-overflow-tooltip="true"><template slot-scope="scope"><span>{{scope.row.errorMsg}}</span></template></el-table-column>
			</el-table>
			<div v-show="!listLoading" class="pagination-container" align="right">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		page
	} from 'api/admin/gateLog/index';
	export default {
		name: 'gateLog',
		data() {
			return {
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					username: undefined,
					businessType: undefined,
					endDate: undefined,
					operatorValue: undefined,
					operIp: undefined,
					requestMethod: undefined,
					startDate: undefined,
					title: undefined,
				},
				dialogFormVisible: false,
				dialogStatus: '',
				gateLogManager_btn_edit: '1',
				gateLogManager_btn_del: '1',
				gateLogManager_btn_add: '1',
				textMap: {
					update: '编辑',
					create: '创建'
				},
				tableKey: 0,
				type: [
					{ label: '其它', value: 0},
					{ label: '新增', value: 1},
					{ label: '修改', value: 2},
					{ label: '删除', value: 3},
					{ label: '导出', value: 5},
					{ label: '导入', value: 6},
					{ label: '查询', value: 10},
				],
				times: [],
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
			}
		},
		computed: {
			fomatType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					switch (val) {
						case 0:
							return "其它"
							break;
						case 1:
							return "新增"
							break;
						case 2:
							return "修改"
							break;
						case 3:
							return "删除"
							break;
						case 5:
							return "导出"
							break;
						case 6:
							return "导入"
							break;
						case 10:
							return "查询"
							break;
						default:
							break;
					}
				}
			},
			fomatState() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					switch (val) {
						case 0:
							return "正常"
							break;
						case 1:
							return "异常"
							break;
						default:
							break;
					}
				}
			},
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				page(this.listQuery).then(response => {
					this.list = response.data.rows;
					this.total = parseInt(response.data.total);
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
			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					username: undefined,
					businessType: undefined,
					endDate: undefined,
					operatorValue: undefined,
					operIp: undefined,
					requestMethod: undefined,
					startDate: undefined,
					title: undefined,
				};
				this.times = [];
				this.getList();
			},
		}
	}
</script>
