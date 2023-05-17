<template>
	<div class="app-container calendar-list-container nav-content">
        <div class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
					<el-select v-model="listQuery.talkType" clearable placeholder="请选择线索类型">
						<el-option v-for="item in talkType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<el-form :model="ruleForm" :rules="dataRule" ref="ruleForm">
				<el-table :key='tableKey' :data="ruleForm.form" v-loading="listLoading" :span-method="objectSpanMethod" border fit highlight-current-row style="width: 100%" :height="`calc(100vh - 375px`">
					<el-table-column label="序号" width="50px" type="index" />
                    <el-table-column width="200" align="center" label="线索类型">
                        <el-table-column min-width="120" header-align="center" align="center" label="信访举报">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" header-align="center" align="center" label="监督检查发现">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" header-align="center" align="center" label="外部移交">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="信访线索">
                        <el-table-column min-width="120" header-align="center" align="center" label="任务派发">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" header-align="center" align="center" label="调查情况">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" header-align="center" align="center" label="状态">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="问题线索">
                        <el-table-column min-width="120" header-align="center" align="center" label="承办主体">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" header-align="center" align="center" label="处置方式">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="120" header-align="center" align="center" label="处置结果">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="初步核实">
                        <el-table-column min-width="120" header-align="center" align="center" label="核实情况">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="立案流程">
                        <el-table-column min-width="120" header-align="center" align="center" label="立案情况">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="审理流程">
                        <el-table-column min-width="120" header-align="center" align="center" label="处审理况">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column width="200" align="center" label="处分执行">
                        <el-table-column min-width="120" header-align="center" align="center" label="执行情况">
                            <template slot-scope="scope">
                                <el-form-item  
                                        :prop="'form.' + scope.$index + '.matterType' "
                                        :rules="dataRule.matterType">
                                    <el-select v-model="ruleForm.form[scope.$index].matterType" clearable placeholder="请选择" style="width: 100%;">
                                        <el-option v-for="item in matterType" :key="item.value" :label="item.label" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>
				</el-table>
			</el-form>
			<div @click="addBasis()" class="add-basis">+</div>
			<div class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
			<div class="add-button">
				<el-button type="primary" @click="determine('ruleForm')" :loading="loading">确定并保存</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		pageAccount
	} from 'api/talkInc/index';
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
	export default {
		name: "index",
		data() {
			return {
				popoverVisibel: false,
				loading: false,
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					talkType: undefined,
					deptId: undefined,
					startDate: '',
					endtDate: ''
				},
				deptName: '',
				talkType: [
					{label: '例行廉政谈话', value: '1'},
					{label: '任前廉政谈话', value: '2'},
					{label: '提醒谈话', value: '3'},
					{label: '约谈', value: '4'},
					{label: '批评教育', value: '5'},
					{label: '谈话提醒', value: '6'}
				],
				treeVisible: false,
				treeData: [],
				index: 0,
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
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
				ruleForm: {
					form: []
				},
				dataRule: {
					recordTime: [{
						required: true,
						message: '请选择时间',
						trigger: 'change'
					}],
					deptName: [{
						required: true,
						message: '请选择单位',
						trigger: 'change'
					}],
					// matterType: [{
					// 	required: true,
					// 	message: '请选择事项类别',
					// 	trigger: 'change'
					// }],
				}
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),
			
			fomatState() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					switch (val) {
						case '1':
							return "例行廉政谈话"
							break;
						case '2':
							return "任前廉政谈话"
							break;
						case '3':
							return "提醒谈话"
							break;
						case '4':
							return "约谈"
							break;
						case '5':
							return "批评教育"
							break;
						case '6':
							return "谈话提醒"
							break;
						default:
							break;
					}
				}
			}
		},
		created() {
			// this.getDataList();
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {

			// // objectSpanMethod方法
			// // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }
			// objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			// 	if (columnIndex !== 1 && columnIndex !== 4) {
			// 		if (rowIndex % 2 === 0) {
			// 			return {
			// 			rowspan: 2,
			// 			colspan: 1
			// 			};
			// 		} else {
			// 			return {
			// 			rowspan: 0,
			// 			colspan: 0
			// 			};
			// 		}
			// 	}
			// },
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endtDate = this.times && this.times.length ? this.times[1] : '';
				// pageAccount(this.listQuery)
				// 	.then(response => {
				// 		if (response && response.status === 200) {
				// 			this.list = response.data.rows;
				// 			this.total = parseInt(response.data.total);
				// 		} else {
				// 			this.total = 0;
				// 		}
						this.listLoading = false;
				// 	}).catch(() => {
				// 		this.listLoading = false;
				// 	})
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

			addBasis() {
				let dateKey = new Date()
				this.ruleForm.form.push({
					id: dateKey,
					name1: undefined,
					name1: undefined,
					name1: undefined,
					name1: undefined,
					name1: undefined,
					name1: undefined,
					matterType: undefined,
					picker1: 'picker1'
				})
			},

			determine(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						// updateObj(this.ruleForm.form)
						// 	.then((res) => {
						// 		if (res && res.status === 200) {
						// 			this.$notify({
						// 				title: '成功',
						// 				message: '创建成功',
						// 				type: 'success',
						// 				duration: 2000
						// 			});
						// 			setTimeout(() => {
						// 				this.getList();
						// 				this.loading = false;
						// 			}, 1000)
						// 		} else {
						// 			this.$notify({
						// 				title: '失败',
						// 				message: res.msg,
						// 				type: 'error',
						// 				duration: 2000
						// 			});
						// 			this.loading = false;
						// 		}
						// 	}).catch(() => {
						// 		this.$notify({
						// 			title: '失败',
						// 			message: '创建选人用人情况失败',
						// 			type: 'error',
						// 			duration: 2000
						// 		});
						// 		this.loading = false;
						// 	});
						} else {
							return false;
						}
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
		width: 350px;
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

	.add-basis {
		/* display: inline-block; */
		margin: 0 auto;
		width: 20px;
		height: 20px;
		background-color: gray;
		color: #fff;
		border-radius: 50%;
		line-height: 20px;
		text-align: center;
		/* float: right; */
    	margin-top: 15px;
		/* margin-right: 15px; */
		font-size: 20px;
	}

	.add-basis:hover {
		cursor: pointer;
	}

	.add-button {
		text-align: right;
    	margin-top: 20px;
	}
</style>
xv