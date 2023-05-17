<template>
	<div class="app-container calendar-list-container nav-content">
		<div ref="searchSection" class="page-info" style="padding-bottom:0;margin-bottom: 20px;">
			<!-- <div v-if="!integrityArchives_btn_inspection || skipVisible" style="display: inline-block; float: right;">
                <el-button class="filter-item" type="primary" v-waves icon="search" @click="skipToHandle()">返回</el-button>
            </div> -->
			<div class="search-info" style="margin-bottom: 0px;">
				<div class="search-left">
					<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
						<el-form-item>
							<el-input style="width: 200px;" clearable class="filter-item" placeholder="请输入姓名查询"
							v-model="listQuery.name">
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-select v-model="listQuery.delFlag" class="filter-item" placeholder="请选择"
							style="width: 200px;" clearable>
								<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item v-if="tabPosition !== '我的提报' && (!integrityArchives_btn_inspection || skipVisible)">
							<el-input style="width: 200px;" clearable class="filter-item" placeholder="请输入公司/姓名查询"
							v-model="listQuery.value">
							</el-input>
						</el-form-item>
						<el-form-item v-if="tabPosition !== '我的提报' && (!integrityArchives_btn_inspection || skipVisible)">
							<el-input style="width: 200px;" clearable class="filter-item" placeholder="请输入任务表格查询"
							v-model="listQuery.formName">
							</el-input>
						</el-form-item> -->
						<!-- <el-form-item v-if="!integrityArchives_btn_inspection || skipVisible">
							<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
								unlink-panels range-separator="-" start-placeholder="应提报开始时间" end-placeholder="应提报结束时间" :picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item>
						<el-form-item v-if="tabPosition == '我的提报' && (!integrityArchives_btn_inspection || skipVisible)">
							<el-select v-model="listQuery.status" class="filter-item" placeholder="请选择状态"
							style="width: 150px;">
								<el-option v-for="item in examineOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-if="tabPosition == '我的审核' && (!integrityArchives_btn_inspection || skipVisible)">
							<el-select v-model="listQuery.status" class="filter-item" placeholder="请选择状态"
							style="width: 150px;">
								<el-option v-for="item in verifyOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item> -->
						<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
						<el-button v-waves type="primary" @click="handleReset">重置</el-button>
						<!-- <el-button v-if="tabPosition == '我的提报' && (!integrityArchives_btn_inspection || skipVisible)" class="filter-item" style="margin-left: 10px;" @click="solidificationPutHandle('add', 'oneself')"
							type="primary" icon="edit">+自行提报</el-button>
						<el-button v-if="tabPosition == '我的审核' && (!integrityArchives_btn_inspection || skipVisible)" class="filter-item" style="margin-left: 10px;" @click="handleComments"
							type="primary" icon="edit" :disabled="!multipleSelection.length">批量审核</el-button> -->
					</el-form>
				</div>
				<div class="bu-right">
					<el-button v-if="integrityArchives_btn_inspection && integrityArchives_btn_solidification" class="filter-item" style="margin-left: 10px;" @click="solidificationHandle"
						type="primary" icon="edit">固化任务设置</el-button>
					<el-button v-if="integrityArchives_btn_inspection && integrityArchives_btn_temporary" class="filter-item" style="margin-left: 10px;" @click="temporaryHandle"
						type="primary" icon="edit">新增临时人员</el-button>
					<el-button v-if="integrityArchives_btn_inspection && integrityArchives_btn_personnelpool" class="filter-item" type="primary" v-waves icon="search" @click="personnelHandle()">人员库管理</el-button>
					<el-button v-if="integrityArchives_btn_inspection || integrityArchives_btn_first" class="filter-item" type="primary" v-waves icon="search" @click="skipHandle()">我的任务</el-button>
					<el-button v-if="integrityArchives_btn_inspection && integrityArchives_btn_history" class="filter-item" type="text" v-waves icon="search" @click="historyHandle()">历史任务</el-button>
				</div>
			</div>
		</div>
		<!-- 纪检 -->
		<div class="tree-info tree-roll-containers" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div>
		<!-- 非纪检 -->
		<!-- <div v-if="!integrityArchives_btn_inspection || skipVisible" class="page-info" ref="pageInfo" :style="integrityArchives_btn_inspection && !skipVisible?'margin-left:310px' : 'margin-left:0px'">
			<el-table :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column v-if="tabPosition == '我的审核'" type="selection" width="55" :selectable="selected">
    			</el-table-column>
				<el-table-column v-if="tabPosition !== '我的提报'" min-width="360" align="center" label="公司名称" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.orgName}}</div>
					</template>
				</el-table-column>
				<el-table-column v-if="tabPosition !== '我的提报'" min-width="130" align="center" label="姓名">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column min-width="350" align="center" label="任务表格" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" class="page-info-taskTitle">
							<el-popover
								placement="right"
								width="500"
								trigger="click">
							<el-table :data="scope.row.formInfo" border>
								<el-table-column width="50" align="center" type="index" label="序号"></el-table-column>
								<el-table-column width="250" align="center" property="formName" label="表单名称" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column width="80" align="center" property="status" label="有无更新">
									<template slot-scope="scope">
										<span v-if="scope.row.status == '1'">有</span>
										<span v-if="scope.row.status == '0'">无</span>
									</template>
								</el-table-column>
								<el-table-column fixed="right" align="center" label="操作" min-width="90"> 
									<template slot-scope="scopes">
										<el-button v-if="integrityArchives_btn_detail" type="text" size="small" @click="solidificationPutHandle('detail', 'detail',scope.row,'',scopes.row)">查看
										</el-button>
									</template>
							</el-table-column>
							</el-table>
							<el-button type="text" slot="reference">
								<span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item,index) in scope.row.formInfo" :key="index">
								<span>{{item.formName}}</span>
								<span v-if="index !== scope.row.formInfo.length-1">、</span>
							</span></el-button>
							</el-popover>
						</div>
					</template>
				</el-table-column>
				<el-table-column v-if="tabPosition !== '我的查看'" min-width="120" align="center" label="应提报时间">
					<template slot-scope="scope">
						<span v-if="scope.row.commitTime">{{scope.row.commitTime}}</span>
						<span v-else>-</span>
					</template>
				</el-table-column>
				<el-table-column min-width="120" align="center" label="实际提报时间">
					<template slot-scope="scope">
						<span>{{scope.row.actualCommitTime}}</span>
					</template>
				</el-table-column>
				<el-table-column min-width="130" align="center" label="所属分类">
					<template slot-scope="scope">
						<span v-if="scope.row.type == '0'">固化任务</span>
						<span v-if="scope.row.type == '1'">固化任务</span>
						<span v-if="scope.row.type == '2'">自行提报</span>
					</template>
				</el-table-column>
				<el-table-column min-width="120" align="center" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.status == '-2'">无需审核</span>
						<span v-if="scope.row.status == '0'">已通过</span>
						<span v-if="scope.row.status == '1'">待审核</span>
						<span v-if="scope.row.status == '2'">待提报</span>
						<span v-if="scope.row.status == '3'">未通过</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" min-width="200"> 
					<template slot-scope="scope">
						<el-button v-if="scope.row.status !== '2' && integrityArchives_btn_detail" type="text" size="small" @click="solidificationPutHandle('detail',scope.row)">查看
						</el-button>
						<el-button v-if="tabPosition == '我的提报' && (scope.row.status == '1' || scope.row.status == '3') && integrityArchives_btn_edit" size="small" type="text" @click="solidificationPutHandle('edit', 'add',scope.row)">编辑
						</el-button>
						<el-button v-if="tabPosition == '我的提报' && scope.row.status == '1' && scope.row.type == '2' && integrityArchives_btn_delete" size="small" type="text" @click="handleDelete(scope.row)">删除
						</el-button>
						<el-button v-if="tabPosition == '我的提报' && scope.row.status == '2'&& integrityArchives_btn_putforward" size="small" type="text" @click="solidificationPutHandle('add', 'add',scope.row)">去提报
						</el-button>
						<el-button v-if="tabPosition == '我的审核' && scope.row.status == '1' && integrityArchives_btn_examine" size="small" type="text" @click="solidificationPutHandle('check', 'detail',scope.row,'','','examine')">去审核
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div v-if="!integrityArchives_btn_inspection || skipVisible" class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				:page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div> -->
		<!-- 纪检/主要负责人 -->
		<div class="page-info" ref="pageInfo" style="margin-left:310px">
			<el-table :height="tableHeight" :key='tableKey' ref="table" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column min-width="130" align="center" label="姓名">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column min-width="360" align="center" label="子公司" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.orgName}}</div>
					</template>
				</el-table-column>
				<el-table-column min-width="120" align="center" label="人员类别">
					<template slot-scope="scope">
						<span v-if="scope.row.userType == '1'">M8及以上</span>
						<span v-if="scope.row.userType == '2'">关键岗位</span>
					</template>
				</el-table-column>
				<el-table-column min-width="120" align="center" label="状态">
					<template slot-scope="scope">
						<span v-if="scope.row.delFlag == '0'">在库</span>
						<span v-if="scope.row.delFlag == '-1'">不在库</span>
					</template>
				</el-table-column>
				<el-table-column min-width="120" align="center" label="总表数量">
					<template slot-scope="scope">
						<span>{{scope.row.total}}</span>
					</template>
				</el-table-column>
				<el-table-column min-width="120" align="center" label="本年度应提报表数">
					<template slot-scope="scope">
						<span>{{scope.row.nowYearShouldSubmitNum}}</span>
					</template>
				</el-table-column>
				<el-table-column min-width="120" align="center" label="本年度实际提报表数">
					<template slot-scope="scope">
						<span>{{scope.row.nowYearSubmittedNum}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" min-width="100">
					<template slot-scope="scope">
						<el-button v-if="integrityArchives_btn_detail" type="text" size="small" @click="solidificationPutHandle('detail', 'detail',scope.row,'isYear')">查看
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<!-- <el-pagination @size-change="headLeaderHandleSizeChange" @current-change="headLeaderHandleCurrentChange" :current-page.sync="page"
					:page-sizes="[10,20,30,50]" :page-size="limit" align="right" layout="total, sizes, prev, pager, next, jumper"
					:total="headLeaderTotal">
				</el-pagination> -->
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
					:page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
					:total="total">
				</el-pagination>
			</div>
		</div>
		<!-- 弹窗, 固化任务设置 -->
		<SolidificationAddOrUpdate v-if="solidificationAddOrUpdateVisible" ref="solidificationAddOrUpdate" @refreshDataList="getList"></SolidificationAddOrUpdate>
		<!-- 弹窗, 新增临时任务 -->
		<TemporaryAddOrUpdate v-if="temporaryAddOrUpdateVisible" ref="temporaryAddOrUpdate" @refreshDataList="getList"></TemporaryAddOrUpdate>
		<!-- 弹窗, 人员库管理 -->
		<PersonnelAddOrUpdate v-if="personnelAddOrUpdateVisible" ref="personnelAddOrUpdate" @refreshDataList="getList"></PersonnelAddOrUpdate>

		<el-dialog :visible.sync="dialogFormVisible">
			<el-form :model="approveForm" :rules="approveRules" ref="approveForm" label-width="100px">
				<el-form-item label="意见选择：" prop="auditStatus">
					<el-select v-model="approveForm.auditStatus" placeholder="请选择" style="width: 100%;">
						<el-option
						v-for="item in approveOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="批示意见：" prop="auditAdvice">
					<el-input type="textarea" :rows="4"
						placeholder="请输入" v-model="approveForm.auditAdvice" maxlength="500" clearable>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="approveHandle('approveForm')" :loading="loading">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import SolidificationAddOrUpdate from './components/solidificationAddOrUpdate';
	import TemporaryAddOrUpdate from './components/temporaryAddOrUpdate';
	import PersonnelAddOrUpdate from './components/personnelAddOrUpdate';
	import {
		headLeaderPage,
		individualTaskPage,
		jwPage,
		delIndividualtaskObj,
		mytaskPage,
		myauditPage,
		myviewPage,
		archivesAuditAll
	} from 'api/archives/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import tree from "./components/tree";
	import treeFirst from "./components/treeFirst";
	export default {
		name: "index",
		components: {
			tree,
			treeFirst,
			PersonnelAddOrUpdate,
			SolidificationAddOrUpdate,
			TemporaryAddOrUpdate
		},
		data() {
			return {
				loading: false,
				personnelAddOrUpdateVisible: false,
				solidificationAddOrUpdateVisible: false,
				temporaryAddOrUpdateVisible: false,
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					// endDate: '',
					// startDate: '',
					// formName: '',
					deptId: undefined,
					userId: undefined,
					// status: '',
					// taskTitle: '',
					delFlag: '',
					// value: '',
					name: ''
				},
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
				integrityArchives_btn_first: false,
				integrityArchives_btn_m6high: false,
				integrityArchives_btn_inspection: false,
				integrityArchives_btn_detail: false,
				integrityArchives_btn_edit: false,
				integrityArchives_btn_delete: false,
				integrityArchives_btn_putforward: false,
				integrityArchives_btn_examine: false,
				integrityArchives_btn_solidification: false,
				integrityArchives_btn_temporary: false,
				integrityArchives_btn_personnelpool: false,
				integrityArchives_btn_history: false,
				tableKey: 0,
				classificationTask: [], // 分类
				headLeaderList: null,
				headLeaderTotal: null,
				page: 1,
				limit: 10,
				options: [{
					value: '',
					label: '全选'
				}, {
					value: '0',
					label: '在库'
				}, {
					value: '-1',
					label: '不在库'
				}],
				assignment: '0',
				putVisible: false,
				examineOptions: [{
					value: '-2',
					label: '无需审批'
				}, {
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
				verifyOptions: [{
					value: '0',
					label: '已通过'
				}, {
					value: '1',
					label: '待审核'
				}, {
					value: '2',
					label: '未通过'
				}],
				outsideOptions: [{
					value: '0',
					label: '固化任务表单'
				}, {
					value: '1',
					label: '个人有关事项报告表'
				}, {
					value: '2',
					label: '党和国家工作人员操办婚礼事情报告表'
				}, {
					value: '3',
					label: '党和国家工作人员操办婚丧事宜事后报告表'
				}],
				tabPosition: '我的提报',
				multipleSelection: [],
				dialogFormVisible: false,
				approveOptions: [{
					value: '1',
					label: '同意'
				}, {
					value: '0',
					label: '不同意'
				}],
				approveForm: {
					individualTaskIds: [],
					auditAdvice: '',
					auditStatus: ''
				},
				approveRules: {
					auditStatus: [{
						required: true,
						message: '请选择意见',
						trigger: 'change'
					}],
					auditAdvice: [{
						required: true,
						message: '请输入批示意见',
						trigger: 'blur'
					}]
				},
				skipVisible: false,
				tableHeight: undefined
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			classificationTaskType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.classificationTask.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			}
		},
		created() {
			// 获取个人档案分类
			this.getDataDicts("classificationTask").then((res) => {
				this.classificationTask = res;
			});

			// 获取权限
			this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];	
			this.integrityArchives_btn_m6high = this.elements['integrityArchives:btn_m6high'];
			this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection'];
			// this.integrityArchives_btn_first = false;	
			// this.integrityArchives_btn_m6high = false;
			// this.integrityArchives_btn_inspection = false;
			this.integrityArchives_btn_detail = this.elements['integrityArchives:btn_detail'];	
			// this.integrityArchives_btn_edit = this.elements['integrityArchives:btn_edit'];
			this.integrityArchives_btn_delete = this.elements['integrityArchives:btn_delete'];
			this.integrityArchives_btn_putforward = this.elements['integrityArchives:btn_putforward'];	
			// this.integrityArchives_btn_examine = this.elements['integrityArchives:btn_examine'];
			this.integrityArchives_btn_solidification = this.elements['integrityArchives:btn_solidification'];
			this.integrityArchives_btn_temporary = this.elements['integrityArchives:btn_temporary'];	
			this.integrityArchives_btn_personnelpool = this.elements['integrityArchives:btn_personnelpool'];
			this.integrityArchives_btn_history = this.elements['integrityArchives:btn_history'];
			this.$nextTick(() => {
				// 获取列表
				this.getList();
			})
		},
		methods: {
			skipToHandle() {
				this.$store.state.user.isBack = false;
				this.listQuery =  {
					page: 1,
					limit: 10,
					endDate: '',
					startDate: '',
					formName: '',
					deptId: undefined,
					userId: undefined,
					status: '',
					taskTitle: '',
					type: '',
					value: '',
					name: ''
				};
				this.skipVisible = false;
				this.getList();
			},
			skipHandle() {
				// this.$store.state.user.isBack = true;
				// this.listQuery =  {
				// 	page: 1,
				// 	limit: 10,
				// 	endDate: '',
				// 	startDate: '',
				// 	formName: '',
				// 	deptId: undefined,
				// 	userId: undefined,
				// 	status: '',
				// 	taskTitle: '',
				// 	type: '',
				// 	value: '',
				// 	name: ''
				// };
				// this.skipVisible = true;
				// this.tabPosition = '我的提报';
				// this.getList();
                this.$router.push({
					path: `${this.$route.path}/taskMy`,
					query: {
						// id: row ? row.id : undefined,
						// operation: path,
						// status: row.status ? row.status : undefined,
						// first: first,
						// formId: rows ? rows.id : undefined,
					}
				})
			},
			// 添加审批
			handleComments() {
                this.approveForm =  {
					// individualTaskIds: [],
					auditAdvice: '',
					auditStatus: ''
				},
				this.dialogFormVisible = true;
			},
			selected(row, index) {
				if (row.status == '1') {
					return true //可勾选
				} else {
					return false; //不可勾选
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this.individualTaskIds = this.multipleSelection.map( item => { return item.id } )
			},
			radioChange() {
				this.listQuery =  {
					page: 1,
					limit: 10,
					endDate: '',
					startDate: '',
					formName: '',
					deptId: undefined,
					userId: undefined,
					status: '',
					taskTitle: '',
					type: '',
					value: '',
					name: ''
				};
				this.times = [];
				this.getList();
			},
			assignmentChange(e) {
				if(e == '1') {
					this.individualTaskPageList();
					this.putVisible = true;
				} else {
					this.getList();
					this.putVisible = false;
				}
			},
			// 固化任务设置
			solidificationHandle() {
				this.solidificationAddOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.solidificationAddOrUpdate.init();
				})
			},
			// 新增临时任务
			temporaryHandle() {
				this.temporaryAddOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.temporaryAddOrUpdate.init();
				})
			},
			// 人员库管理
			personnelHandle() {
				this.personnelAddOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.personnelAddOrUpdate.init();
				})
			},
			// 固化任务历史记录
			historyHandle() {
				// debugger
				this.$router.push({
					path: `${this.$route.path}/history`,
					query: {
						// id: row ? row.id : undefined,
						// operation: path,
						// status: row.status ? row.status : undefined,
						// first: first,
						// formId: rows ? rows.id : undefined,
					}
				})
			},
			// 固化任务提报
			solidificationPutHandle(opt, path, row, first, rows, examine) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/solidificationPut/add',
				// 		query: {
				// 			id: row.id ? row.id : undefined,
				// 			userId: row.userId ? row.userId : undefined,
				// 			// templateId: row ? row.templateId : undefined
				// 			operation: path,
				// 			status: row && row.status ? row.status : undefined,
				// 			first: first,
				// 			formId: rows ? rows.id : undefined,
				// 			tabPosition: this.tabPosition,
				// 			examine: examine
				// 		}
				// 	})
				// } else {
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
							examine: examine

						}
					})
				// }
			},
			// // 临时任务提报
			// temporaryPutHandle() {
			// 	this.$router.push({
			// 		path: '/temporaryPut'
			// 	});
			// },
			// 监听个人档案分类
			classificationTaskHandle(val) {
				if (val) {
					let ary = this.classificationTask.filter((item) => {
						return (item.code.indexOf(val) >= 0);
					});
					this.listQuery.violationType = ary.length ? ary[0].description : '';
					this.listQuery.violationCategory = val;
				} else {
					this.listQuery.violationType = undefined;
					this.listQuery.violationCategory = undefined;
				}
			},

			// 点击部门刷新列表数据
			treeHandle(val) {
				this.listQuery.deptId = val.id;
				// if(!val.isPersonnel) this.listQuery.deptId = val.id;
				// if(val.isPersonnel) {
				// 	this.listQuery.deptId = undefined;
				// 	 this.listQuery.userId = val.id;
				// }
				this.getList(val.isPersonnel);
			},

			individualTaskPageList() {
				this.listLoading = true;
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				individualTaskPage(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			// 获取数据列表
			getList(type) {
				this.listLoading = true;
				// this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				// this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				// if(this.integrityArchives_btn_inspection && !this.skipVisible) {
					jwPage(this.listQuery)
						.then(response => {
							if (response && response.status === 200) {
								this.list = response.data.rows;
								this.total = parseInt(response.data.total);
							} else {
								this.total = 0;
							}
							// this.$nextTick(() => {
								this.tableLayout()
							// })
							this.listLoading = false;
						}).catch(() => {
							this.listLoading = false;
						})
				// } 
				// else if(this.tabPosition == '我的提报') {
				// 	mytaskPage(this.listQuery)
				// 		.then(response => {
				// 			if (response && response.status === 200) {
				// 				this.list = response.data.rows;
				// 				this.total = parseInt(response.data.total);
				// 			} else {
				// 				this.total = 0;
				// 			}
				// 			this.listLoading = false;
				// 		}).catch(() => {
				// 			this.listLoading = false;
				// 		})
				// } else if(this.tabPosition == '我的审核') {
				// 	myauditPage(this.listQuery)
				// 		.then(response => {
				// 			if (response && response.status === 200) {
				// 				this.list = response.data.rows;
				// 				this.total = parseInt(response.data.total);
				// 			} else {
				// 				this.total = 0;
				// 			}
				// 			this.listLoading = false;
				// 		}).catch(() => {
				// 			this.listLoading = false;
				// 		})
					
				// } else if(this.tabPosition == '我的查看') {
				// 	myviewPage(this.listQuery)
				// 		.then(response => {
				// 			if (response && response.status === 200) {
				// 				this.list = response.data.rows;
				// 				this.total = parseInt(response.data.total);
				// 			} else {
				// 				this.total = 0;
				// 			}
				// 			this.listLoading = false;
				// 		}).catch(() => {
				// 			this.listLoading = false;
				// 		})
				// }
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
				this.listQuery =  {
					page: 1,
					limit: 10,
					endDate: '',
					startDate: '',
					formName: '',
					deptId: undefined,
					userId: undefined,
					status: '',
					taskTitle: '',
					type: '',
					value: '',
					name: ''
				};
				this.getList()
			},

			// 获取字典
			getDataDicts(type) {
				if (!type) return;
				let val = null;
				val = getByType({
						type: type
					})
					.then(res => {
						if (res && res.code === 0) {
							return res.data;
						} else {
							this.$notify({
								title: '失败',
								message: '获取数据字典失败',
								type: 'success',
								duration: 2000
							});
						}
					});
				return Promise.resolve(val);
			},

			handleFilter() {
				if(this.putVisible) this.individualTaskPageList();
				else this.getList();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
			headLeaderHandleSizeChange(val) {
				this.limit = val;
				this.getList();
			},
			headLeaderHandleCurrentChange(val) {
				this.page = val;
				this.getList();
			},

			// // 新增
			// handleCreate() {
			// 	this.$router.push({
			// 		path: '/newlyHonestReport'
			// 	});
			// },

			// 修改
			handleUpdate(row) {
				this.$router.push({
					path: '/editHonestReport',
					query: {
						id: row.reportInfoId
					}
				});
			},

			// // 详情
			// handleDetail(row) {
			// 	this.$router.push({
			// 		path: '/solidificationPut/detail',
			// 		query: {
			// 			id: row.id,
			// 			templateId: row.templateId
			// 		}
			// 	})
			// },

			// 删除
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delIndividualtaskObj(row.id)
							.then(res => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '删除成功',
										type: 'success',
										duration: 2000
									});
									this.getList();
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
					}).catch(() => {

					});
			},

			approveHandle(formName) {
				// this.approveForm.individualTaskId = this.$route.query.id;
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						archivesAuditAll(this.approveForm)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 1000
									});
									this.loading = false;
									this.dialogFormVisible = false;
									this.$nextTick(() => {
										this.getList();
									})
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 1000
									});
									this.loading = false;
									this.dialogFormVisible = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '操作失败',
									type: 'error',
									duration: 1000
								});
								this.loading = false;
								this.dialogFormVisible = false;
							})
					} else {
						return false;
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.radio-group {
		display: inline-block;
	}
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.active {
		margin-bottom: 0px;
	}

	.otherActiveClass {
		border-bottom: solid 1px #DCDFE6;
	}
	
	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
		height: calc(100vh - 265px);
	}

	.tree-info-first {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 10px;
		background-color: #FFFFFF;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;

		// 表格高度不一致，将高度撑开
		>>> .el-table__fixed-right {
			height: 100% !important;
		}

		>>> .el-table__row {
			height: 65px !important;
		}
	}

	.page-info-taskTitle {

		>>> .el-button--text{
			color: #606266;
			text-decoration:underline
		}

		>>> .el-table__row {
			height: 57px !important;
		}
	}

	.pagination-container {
		margin-top: 15px;
	}

	.tree-roll-containers-first {
		max-height: 480px;
    	overflow: auto;
	}

	.query {
		// margin-left: 10px;
	}

	.bu-right {
		>>> .el-button--text{
			color: #000000;
			text-decoration:underline
		}
		>>> .el-button--text:hover{
			color: #bc0000;
		}
	}
</style>
