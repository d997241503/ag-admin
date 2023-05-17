<template>
	<div class="app-container calendar-list-container nav-content">
        <!-- <div class="search-info page-info" style="padding-bottom:0;">
            <div class="page-title">
				{{$route.name}}
			</div>
        </div> -->
		<!-- <div class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true">
					<el-form-item>
						<el-select v-model="listQuery.conferenceType" clearable placeholder="请选择会议类型">
							<el-option
								v-for="item in largeTripleEventList"
								:key="item.id"
								:label="item.type"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
						 unlink-panels range-separator="-" start-placeholder="会议开始时间" end-placeholder="会议结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-select v-model="listQuery.eventType" clearable placeholder="请选择纪检意见">
							<el-option
								v-for="item in largeTripleOpinion"
								:key="item.code"
								:label="item.value"
								:value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div> -->
		<div class="page-info" ref="pageInfo">
			<el-table :data="dataList" v-loading="listLoading" :span-method="objectSpanMethod" border fit highlight-current-row style="width: 100%">
				<!-- <el-table-column label="序号" header-align="center" align="center" type="index" width="50px" /> -->
				<!-- <el-table-column v-if="meetingJoint_btn_department" prop="orgName" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="单位">
				</el-table-column> -->
				<el-table-column header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="会议类型">
					<template slot-scope="scope">
						<div v-for="(item, index) in scope.row.conferenceType" :key="index">{{formatterConferenceType(item)}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="基本情况">
                    <template slot-scope="scope">
                        <div class="table-wrap" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: left;">
							<div>第{{ scope.row.conferenceNum }}次{{ scope.row.conferenceName }}会议</div>
						</div>
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: left;">
							<div v-if="scope.row.conferenceTime" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">时间：{{ scope.row.conferenceTime }}</div>
							<div v-if="scope.row.place" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">地点：{{ scope.row.place }}</div>
							<div v-if="scope.row.compere && scope.row.compere.length" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">主持人：<span v-for="(item,index) in scope.row.compere" :key="item.userId">{{ item.name }}
								<span v-if="scope.row.compere.length - 1 !== index">、</span></span></div>
							<div v-if="scope.row.conferee && scope.row.conferee.length" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">参会人员：<span v-for="(item,index) in scope.row.conferee" :key="item.userId">{{ item.name }}
								<span v-if="scope.row.conferee.length - 1 !== index">、</span></span></div>
							<div v-if="scope.row.attendee && scope.row.attendee.length" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">列席人员：<span v-for="(item,index) in scope.row.attendee" :key="item.userId">{{ item.name }}
								<span v-if="scope.row.attendee.length - 1 !== index">、</span></span></div>
							<!-- <span v-if="scope.row.place">{{ scope.row.place }}</span>
							<span v-if="scope.row.compere.length" v-for="(item,index) in scope.row.compere" :key="item.userId">,( {{ item.name }}
								<span v-if="scope.row.compere.length - 1 !== index">,</span>
							)</span>
							<span v-if="scope.row.conferee.length" v-for="(item,index) in scope.row.conferee" :key="item.userId">,( {{ item.name }}
								<span v-if="scope.row.conferee.length - 1 !== index">,</span>
							)</span>
							<span v-if="scope.row.attendee.length" v-for="(item,index) in scope.row.attendee" :key="item.userId">,( {{ item.name }}
								<span v-if="scope.row.attendee.length - 1 !== index">,</span>
							)</span> -->
						</div>
                    </template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" label="事项">
					<template slot-scope="scope">
						{{ scope.row.conferenceEvent }}
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="130" :show-overflow-tooltip="true" label="事项类别">
                    <template slot-scope="scope">
						{{ formatterEventType(scope.row.eventType) }}
					</template>
				</el-table-column>
				<el-table-column prop="meetingType" header-align="center" align="center" min-width="200" label="决策情况">
					<template slot-scope="scope">
							<div class="table-wrap" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
								{{ scope.row.decisionSituation }}
							</div>
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
								{{ scope.row.decisionSituationNote }}
							</div>
					</template>
				</el-table-column>
                <el-table-column prop="meetingType" header-align="center" align="center" min-width="200" label="纪检意见">
					<template slot-scope="scope">
							<div v-if="scope.row.disciplineInspectionOpinionNote">
								<div class="table-wrap" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
									{{ scope.row.disciplineInspectionOpinion }}
								</div>
								<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
									{{ scope.row.disciplineInspectionOpinionNote }}
								</div>
							</div>
							<div v-else>
								{{ scope.row.disciplineInspectionOpinion }}
							</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="纪要文件">
					<template slot-scope="scope">
						<div v-for="(item,index) in scope.row.summaryDocument" :key="index" @click="downloadHadle(item)" class="file-download" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item | formatFile}}</div>
					</template>
				</el-table-column>
                <el-table-column header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="相关文件">
					<template slot-scope="scope">
						<div v-for="(item,index) in scope.row.relatedDocument" :key="index" @click="downloadHadle(item)" class="file-download" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item | formatFile}}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button v-if="meetingJoint_btn_situationEdit" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
						<el-button v-if="meetingJoint_btn_situationDelete" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!-- <div @click="addBasis()" class="add-basis">+</div> -->
			<div class="pagination-container" style="margin-top: 10px;">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
			<!-- <div class="add-button">
				<el-button type="primary" @click="determine('ruleForm')" :loading="loading">确定并保存</el-button>
			</div> -->
		</div>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
		<!-- 弹窗, 添加临时议题 -->
		<issues-tem v-if="issuesTemVisible" ref="issuesTem" @refreshDataList="getList"></issues-tem>
	</div>
</template>

<script>
	import AddOrUpdate from './components/addOrEdit';
	import IssuesTem from './components/issuesTem';
	import {
		simpleList,
		typeList,
		conferenceRecordList,
		delConferenceRecordObj,
		// getMeetingdetailsObj
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
	import {
		formatFile
	} from 'utils';
	export default {
		name: "index",
		data() {
			return {
				addOrUpdateVisible: false,
				issuesTemVisible: false,
				popoverLoading: true,
				popoverVisibel: false,
				list: null,
				total: null,
				loading: true,
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 10,
					conferenceType: '',
					eventType: undefined,
					orgId: undefined,
					startDate: '',
					endDate: '',
					conferenceName: '',
					disciplineInspectionOpinion: '',
				},
				deptName: '',
				// treeVisible: false,
				// treeData: [],
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentFullName'
				// },
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
				meetingJoint_btn_department: false,
				meetingJoint_btn_part: false,
				meetingJoint_btn_situationAdd: false,
				meetingJoint_btn_situationEdit: false,
				meetingJoint_btn_situationDelete: false,
				ruleForm: {
					form: []
				},
				superviseJointMeetingEventType: [],
				JointMeetingRec: [],
				dataList: [],
				operation: '',
				largeTripleEventList: [],
				largeTripleOpinion: [],
				// conferenceTypeListAll: []
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			jointMeetingPostType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.superviseJointMeetingEventType.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},

			// 筛选符合条件的参数
			JointMeetingRecType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.JointMeetingRec.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			}
		},

		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			}
        },
		
		components: {
			AddOrUpdate,
			IssuesTem
		},

		watch : {
			'listQuery.conferenceType': {
				handler(newV, oldV) {
					if(newV) this.typeListData();
				},
				immediate: true
			}
		},

		created() {
			this.operation = this.$route.query.operation
			this.getDataList();
			this.getTreeInfo();
			// 获取三重一大纪检意见
			this.getDataDicts("largeTripleOpinion").then((res) => {
				this.largeTripleOpinion = res;
			});
			// 获取权限
			this.meetingJoint_btn_department = this.elements['meetingJoint:btn_department'];
			this.meetingJoint_btn_part = this.elements['meetingJoint:btn_part'];
			this.meetingJoint_btn_situationAdd = this.elements['meetingJoint:btn_situationAdd'];
			this.meetingJoint_btn_situationEdit = this.elements['meetingJoint:btn_situationEdit'];
			this.meetingJoint_btn_situationDelete = this.elements['meetingJoint:btn_situationDelete'];
			this.meetingJoint_btn_department = true;
			// this.$nextTick(() => {
			// 	if (this.$route.query.id) {
			// 		// getMeetingdetailsObj(this.$route.query.id)
			// 		// 	.then(response => {
			// 		// 		this.dataList.push(response.data);
			// 		// 		this.listLoading = false;
			// 		// 	});
			// 	} else this.getList();
			// })
			// this.typeListDataAll();
			this.getList();
		},
		methods: {
			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=largetriple`;
			},
			// // // objectSpanMethod方法
			// // // 默认接受四个值 { 当前行的值, 当前列的值, 行的下标, 列的下标 }
			// objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			// 	if (columnIndex !== 3 && columnIndex !== 4 && columnIndex !== 5 && columnIndex !== 6) {
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
			getSpanArr(data) {
				var vm = this;
				vm.spanArr = [];
				vm.pos = 0;
				data.forEach(function (item, index) {
					//判断是否是第一项
					if (index === 0) {
					vm.spanArr.push(1);
					vm.pos = 0;
					} else {
					//不是第一项时，就根据标识去存储
					if (data[index].orgId === data[index - 1].orgId && data[index].rowspan === data[index - 1].rowspan) {
						// 查找到符合条件的数据时每次要把之前存储的数据+1
						vm.spanArr[vm.pos] += 1;
						vm.spanArr.push(0);
					} else {
						// 没有符合的数据时，要记住当前的index
						vm.spanArr.push(1);
						vm.pos = index;
					}
					}
				});
				// // 表格序号
				// let Nosort = 0
				// for(let n in vm.spanArr){
				// 	if(vm.spanArr[n]>0){
				// 		Nosort += 1
				// 		this.$set(data[n],'Nosort',Nosort)
				// 	}
				// }
			},
			objectSpanMethod(obj) {
				if (obj.columnIndex === 0 || obj.columnIndex === 1|| obj.columnIndex === 2|| obj.columnIndex === 7|| obj.columnIndex === 8|| obj.columnIndex === 9) {
					// 二维数组存储的数据 取出
					var _row = this.spanArr[obj.rowIndex];
					var _col = _row > 0 ? 1 : 0;
					return {
					rowspan: _row,
					colspan: _col,
					};
				} else {
					return false;
				}
			},
			// 格式化类型
			formatterConferenceType(val) {
				for(let i = 0; i < this.largeTripleEventList.length; i++) {
					if(val == this.largeTripleEventList[i].id) {
						return this.largeTripleEventList[i].type;
					}
				}
			},
			formatterEventType(val) {
				for(let i = 0; i < this.largeTripleOpinion.length; i++) {
					if(val == this.largeTripleOpinion[i].id) {
						return this.largeTripleOpinion[i].conferenceTypeEvent;
					}
				}
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
			// 获取部门树
			getTreeInfo() {
				getTree(
						{
							departmentAttribute: '1'
						}
					).then(res => {
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
						}
					});
			},
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			closeIt_(index) {
				this.$refs['selectIt_' + index].blur();
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
			// 获取会议类型精简列表
			getDataList() {
				this.largeTripleEventList = [];
				simpleList().then(data => {
					if (data && data.status === 200) {
						this.largeTripleEventList = data.data
					} else {
						this.largeTripleEventList = []
						this.$notify.error(data.msg)
					}
				}).catch(() => {
					this.largeTripleEventList = []
					this.$notify.error("获取数据列表失败")
				})
			},
			// // 获取会议题列表-全部
			// typeListDataAll() {
			// 	typeList({
			// 		conferenceTypeIds: ''
			// 	}).then(response => {
			// 		if (response.data && response.data.length) {
			// 			this.conferenceTypeListAll = response.data;
			// 		} else {
			// 			this.conferenceTypeListAll = [];
			// 		}
			// 	});
			// },
			// // 获取会议题列表
			// typeListData() {
			// 	typeList({
			// 		conferenceTypeIds: this.listQuery.conferenceType
			// 	}).then(response => {
			// 		if (response.data && response.data.length) {
			// 			this.conferenceTypeList = response.data;
			// 		} else {
			// 			this.conferenceTypeList = [];
			// 		}
			// 	});
			// },
			// 获取数据列表
			getList() {
				this.listLoading = true;
				this.dataList = [];
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				conferenceRecordList(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							// this.dataList = response.data.rows;
							for(let i = 0; i < response.data.rows.length; i++) {
								if(!response.data.rows[i].events.length) {
									this.dataList.push(response.data.rows[i])
								} else {
									for(let j = 0; j < response.data.rows[i].events.length; j++) {
										this.dataList.push(
											{ ...response.data.rows[i],
											  "rowspan": response.data.rows[i].events.length,
											  "conferenceEvent": response.data.rows[i].events[j].conferenceEvent,
											  "eventType": response.data.rows[i].events[j].eventType,
											  "decisionSituation": response.data.rows[i].events[j].decisionSituation,
											  "decisionSituationNote": response.data.rows[i].events[j].decisionSituationNote,
											  "disciplineInspectionOpinion": response.data.rows[i].events[j].disciplineInspectionOpinion,
											  "disciplineInspectionOpinionNote": response.data.rows[i].events[j].disciplineInspectionOpinionNote
											}
										)
									}
								}
							}
							this.getSpanArr(this.dataList);
							this.listLoading = false;
							// this.dataList[0].events.push(
							// 	{
							// 		conferenceEvent: "事件一",
							// 		decisionSituation: "2",
							// 		decisionSituationNote: "222",
							// 		disciplineInspectionOpinion: "2",
							// 		disciplineInspectionOpinionNote: "",
							// 		eventType: "2222222222222",
							// 		id: "222222222",
							// 		temporaryItem: false
							// 	},
							// 	{
							// 		conferenceEvent: "事件三",
							// 		decisionSituation: "3",
							// 		decisionSituationNote: "333",
							// 		disciplineInspectionOpinion: "3",
							// 		disciplineInspectionOpinionNote: "",
							// 		eventType: "33333333333",
							// 		id: "3333333333",
							// 		temporaryItem: false
							// 	}
							// )
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
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

			// 新增 / 修改
			addOrUpdateHandle(id) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(id);
				})
			},

			// 添加临时议题
			issuesTemHandle(id) {
				this.issuesTemVisible = true
				this.$nextTick(() => {
					this.$refs.issuesTem.init(id);
				})
			},

			// // 新增/修改
			// addOrUpdateHandle(row,operation) {
			// 	this.$nextTick(() => {
			// 		this.$router.push({
			// 			path: '/newlyemploy',
			// 			query: {
			// 				operation: operation,
			// 				row: row
			// 			}
			// 		})
			// 	})
			// },

			// 删除
			deleteHandle(id) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delConferenceRecordObj(
								id
							)
							.then(res => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '删除成功',
										type: 'success',
										duration: 2000
									});
									this.$nextTick(() => {
										this.getList();
									})
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

        .table-wrap {
            margin-left: -10px;
            margin-right: -10px;
            margin-bottom: 12px;
            padding: 0px 10px 12px 10px;
            border-bottom: 1px solid #EBEEF5;
        }

		.table-loop {

			div:first-child {
				margin-left: -10px;
				margin-right: -10px;
				margin-bottom: 12px;
				padding: 0px 10px 12px 10px;
				border-bottom: 1px solid #EBEEF5;
			}

			div:not(:first-child):not(:last-child) {
				margin-left: -10px;
				margin-right: -10px;
				margin-bottom: 12px;
				padding: 0px 10px 12px 10px;
				border-bottom: 1px solid #EBEEF5;
			}

			// div:last-child {
			// 	margin-left: -10px;
			// 	margin-right: -10px;
			// 	margin-bottom: 12px;
			// 	padding: 0px 10px 12px 10px;
			// 	// border-bottom: 1px solid #EBEEF5;
			// }
        }

        .table-img {
            width: 30px;
            height: 30px;
            float: right;
            right: 0px;
            top: 0px;
            position: absolute;
            display: flex;
        }
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

	.query {
		// margin-left: 10px;
	}

	.file-download {
		text-decoration: underline;
	}

	.file-download:hover {
		cursor: pointer;
		color: #bc0000;
	}
</style>