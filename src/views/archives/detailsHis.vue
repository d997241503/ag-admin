<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="page-info" ref="pageInfo">
			<div ref="searchSection">
				<div class="page-info-text">
					<el-row :gutter="20">
						<el-col :span="24">
							<div class="grid-content bg-purple">
								<span class="title">所属分类：</span>
								<span v-if="detObj.taskType == '0'">固化任务</span>
								<span v-if="detObj.taskType == '1'">临时任务</span>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="page-info-text">
					<el-row :gutter="20">
						<el-col :span="12">
							<div class="grid-content bg-purple">
								<span class="title">下发时间：</span>
								<span>{{detObj.issueTime}}</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="grid-content bg-purple">
								<span class="title">应提报时间：</span>
								<span>{{detObj.commitTime}}</span>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="page-info-text">
					<el-row :gutter="20">
						<el-col :span="12">
							<div class="grid-content bg-purple">
								<span class="title">下发单位：</span>
								<span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{detObj.issueDeptName}}</span>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="grid-content bg-purple">
								<span class="title">任务下发人：</span>
								<span>{{detObj.issueUserName}}</span>
							</div>
						</el-col>
					</el-row>
				</div>
				<div class="page-info-text">
					<el-row :gutter="20">
						<el-col :span="24">
							<div class="grid-content bg-purple">
								<span class="title">下发任务表格：</span>
								<span class="content" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
									<span v-for="(item,index) in detObj.issueForm">
										<span>{{item.formTypeName}}</span>
										<span v-if="index !== detObj.issueForm.length-1">、</span>
									</span>
								</span>
							</div>
						</el-col>
					</el-row>
				</div>
				<el-form :inline="true">
					<el-form-item>
						<el-select v-model="listQuery.commitType" class="filter-item" placeholder="请选择提报状态"
						style="width: 200px;" clearable>
							<el-option v-for="item in putOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
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
							<el-select v-model="deptName" placeholder="请选择所属公司" class="input-item" slot="reference" clearable @clear="deptClear"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item>
					<!-- <el-form-item prop="talkTime">
						<el-date-picker value-format='yyyy-MM-dd' v-model="listQuery.talkTime"
							align="right" type="date" placeholder="选择实际提报时间">
						</el-date-picker>
					</el-form-item> -->
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
							unlink-panels range-separator="-" start-placeholder="实际提报开始时间" end-placeholder="实际提报结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-select v-model="listQuery.status" class="filter-item" placeholder="请选择状态"
						style="width: 200px;" clearable>
							<el-option v-for="item in examineOptions" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input style="width: 200px;" clearable class="filter-item" placeholder="请输入姓名查询"
						v-model="listQuery.name">
						</el-input>
					</el-form-item>
					<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
					<el-button v-waves type="primary" @click="handleReset">重置</el-button>
				</el-form>
			</div>
			<el-table :height="tableHeight" ref="table" :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column label="序号" header-align="center" align="center" type="index" width="50px" />
				<el-table-column prop="name" header-align="center" align="center" min-width="100" label="姓名">
				</el-table-column>
				<el-table-column prop="orgName" header-align="center" align="center" min-width="300" :show-overflow-tooltip="true" label="所属公司">
				</el-table-column>
				<el-table-column min-width="350" align="center" label="任务表格">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" class="page-info-taskTitle">
							<el-popover
								placement="right"
								width="500"
								trigger="click">
							<el-table height="400" :data="scope.row.formInfo" border>
								<el-table-column width="50" align="center" type="index" label="序号"></el-table-column>
								<el-table-column width="250" align="center" property="formTypeName" label="表单名称" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="80" align="center" property="status" label="有无更新">
									<template slot-scope="scope">
										<span v-if="scope.row.status == '1'">有</span>
										<span v-if="scope.row.status == '0'">无</span>
										<span v-if="scope.row.status == '2'">首次提报</span>
									</template>
								</el-table-column>
								<el-table-column fixed="right" align="center" label="操作" min-width="90"> 
									<template slot-scope="scopes">
										<el-button v-if="integrityArchives_btn_detail" type="text" size="small" @click="solidificationPutHandle('detail', 'detail',scope.row,'',scopes.row)">查看
										</el-button>
									</template>
							</el-table-column>
							</el-table>
							<span slot="reference" class="tabel-reference">
								<span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item,index) in scope.row.formInfo" :key="index">
								<span>{{item.formTypeName}}</span>
								<span v-if="index !== scope.row.formInfo.length-1">、</span>
							</span></span>
							</el-popover>
						</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="120" label="状态">
					<template slot-scope="scope">
						<!-- <span v-if="scope.row.status == '-2'">无需审核</span> -->
						<span v-if="scope.row.status == '0'">已通过</span>
						<span v-if="scope.row.status == '1'">待审核</span>
						<span v-if="scope.row.status == '2'">待提报</span>
						<span v-if="scope.row.status == '3'">未通过</span>
					</template>
				</el-table-column>
				<el-table-column prop="actualCommitTime" header-align="center" align="center" min-width="150" label="实际提报时间">
                </el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="solidificationPutHandle('detail', 'detail',scope.row)">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container" style="margin-top: 10px;">
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
		getHiarchivesissuetaskDet,
		hitaskpage
	} from 'api/archives/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		MessageBox
	} from 'element-ui';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
	export default {
		name: "index",
		data() {
			return {
				popoverLoading: true,
				popoverVisibel: false,
				list: null,
				total: null,
				loading: true,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					commitType: undefined,
					status: undefined,
					orgId: undefined,
					startDate: '',
					endDate: '',
					name: ''
				},
				deptName: '',
				tableKey: 0,
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
				ruleForm: {
					form: []
				},
				superviseJointMeetingEventType: [],
				JointMeetingRec: [],
				dataList: [],
				operation: '',
				detObj: {},
				integrityArchives_btn_detail: false,
				putOptions: [{
					value: '1',
					label: '正常提报人员'
				}, {
					value: '2',
					label: '未按时提报人员'
				}],
				examineOptions: [{
					value: '0',
					label: '已通过'
				}, {
					value: '1',
					label: '待审核'
				}, {
					value: '2',
					label: '待提报'
				}, {
					value: '3',
					label: '未通过'
				}],
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
				id: undefined
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),
		},

		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			}
        },
		
		components: {
		},

		created() {
			// this.id = this.$route.query.id;
			if (this.$route.query.id) {
				this.id = this.$route.query.id;
			} else {
				const statisticsAnalyzeParams = localStorage.getItem(
					'statisticsAnalyzeParams',
				);
				this.id = JSON.parse(statisticsAnalyzeParams).id;
			}
			// 获取权限
			this.integrityArchives_btn_detail = this.elements['integrityArchives:btn_detail'];
			this.getTreeInfo();
			this.getObj();
			this.getList();
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

			// 获取详情
			getObj() {
				if(!this.id) return;
				getHiarchivesissuetaskDet(this.id)
					.then(response => {
						if (response && response.status === 200) {
							this.detObj = response.data;
						} else {
						}
					}).catch(() => {
					})
			},
			
			// 获取数据列表
			getList() {
				if(!this.id) return;
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				hitaskpage(this.listQuery,this.id)
					.then(response => {
						if (response && response.status === 200) {
							this.dataList = response.data.rows;
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
				const computedHeight = pageHeight - searchHeight - subtractVal
				this.tableHeight = computedHeight > 500 ? computedHeight : 500
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},

			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					commitType: undefined,
					status: undefined,
					orgId: undefined,
					startDate: '',
					endDate: '',
					name: ''
				};
				this.deptName = '';
				this.times = [];
				this.getList();
			},

			// 查看
			solidificationPutHandle(opt, path, row, first, rows, examine) {
				this.$router.push({
					path: `${this.$route.path}/solidificationPut/${opt}`,
					query: {
						id: row ? row.id : undefined,
						userId: row ? row.userId : undefined,
						// templateId: row ? row.templateId : undefined
						operation: path,
						status: row && row.status ? row.status : undefined,
						first: first,
						formId: rows ? rows.id : undefined,
						tabPosition: this.tabPosition,
						examine: examine,
						pageId: this.id + ''
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.page-info-text {
		font-size: 14px;
		padding-bottom: 20px;

		.grid-content {
			display: flex;

			.title {
                width: 100px;
                text-align: right;
			}

			.content {
				flex: 1;
			}
		}

		el-row {
			// margin-bottom: 20px;
		}
	}

	.tabel-reference {
		text-decoration:underline;
		cursor: pointer;
	}

	.tabel-reference:hover {
		color: #bc0000;
	}
	
</style>