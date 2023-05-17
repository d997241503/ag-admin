<template>
	<div class="calendar-list-container nav-content">
		<div ref="searchSection" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true">
					<!-- <el-form-item>
						<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
							<el-tree style="min-width: 350px;" ref="treeData" :data="treeData" :props="defaultProps" node-key="id"
							:expand-on-click-node="false" @node-click="handleCheckChange" class="roll-containers">
								<span class="custom-tree-node" slot-scope="{ node, data }">
									<span
										v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 2}">&nbsp;{{ node.label }}
									</span>
								</span>
							</el-tree>
							<el-select v-model="deptName" placeholder="请选择单位" class="input-item" slot="reference" clearable @clear="deptClear"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item> -->
					<el-form-item>
						<el-input style="width: 220px;" clearable placeholder="请输入研究议题关键字查询" v-model="listQuery.conferenceEvent">
						</el-input>
					</el-form-item>
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
						<el-select v-model="listQuery.disciplineInspectionOpinion" clearable placeholder="请选择纪检意见">
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
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :height="tableHeight" ref="filterTable" class="table-fixed" :data="dataList" v-loading="listLoading" :span-method="objectSpanMethod" border fit :highlight-current-row="false" style="width: 100%">
				<el-table-column label="序号" header-align="center" align="center" prop="Nosort" width="50px" />
				<el-table-column prop="orgName" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="单位">
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="会议类型">
					<template slot-scope="scope">
						<div v-for="(item, index) in scope.row.conferenceType" :key="index">{{formatterConferenceType(item)}}</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="250" :show-overflow-tooltip="true" label="基本情况">
                    <template slot-scope="scope">
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: left;">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">会议名称：第（{{ scope.row.conferenceNum }}）次（{{ scope.row.conferenceName }}）会议</div>
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">会议时间：{{ scope.row.conferenceTime }}</div>
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">地点：{{ scope.row.place }}</div>
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">主持人：<span v-for="(item,index) in scope.row.compere" :key="item.userId">{{ item.name }}
								<span v-if="scope.row.compere.length - 1 !== index">、</span></span></div>
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">参会人员：
								<el-popover placement="right" width="500" trigger="click">
									<div class="m-table-wrap">
										<table>
											<thead>
												<tr>
													<th width="70">序号</th>
													<th width="100">用户</th>
													<th width="150">部门</th>
													<th width="150">公司</th>
												</tr>
											</thead>
											<tbody class="m-body">
												<tr v-for="(data, index) in scope.row.conferee" :key="index">
													<td>{{index+1}}</td>
													<td>{{data.name}}</td>
													<el-tooltip :content="data.deptName" placement="top">
														<td>{{data.deptName}}</td>
													</el-tooltip>
													<el-tooltip :content="data.orgName" placement="top">
														<td>{{data.orgName}}</td>
													</el-tooltip>
												</tr>
											</tbody>
										</table>
									</div>
									<span class="page-info-personnel" slot="reference">{{ scope.row.conferee.length ? scope.row.conferee.length : 0 }}人
									</span>
								</el-popover>
							</div>
							<!-- <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">列席人员：{{ scope.row.attendee.length ? scope.row.attendee.length : 0 }}人
							</div> -->
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">列席人员：<span v-for="(item,index) in scope.row.attendee" :key="item.userId">{{ item.name }}
								<span v-if="scope.row.attendee.length - 1 !== index">、</span></span>
								<span v-if="scope.row.attendeeTxt">
									<span v-if="scope.row.attendee && scope.row.attendee.length">、</span>{{scope.row.attendeeTxt}}</span>
							</div>
						</div>
                    </template>
				</el-table-column>
				<el-table-column header-align="center" align="left" min-width="150" :show-overflow-tooltip="true" label="研究议题">
					<template slot-scope="scope">
						<span v-if="scope.row.events && scope.row.events.length">{{ scope.row.orderNumber+1 + '、' + scope.row.conferenceEvent }}</span>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="汇报人员">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							<span v-for="(item,index) in scope.row.reportingPerson" :key="item.userId">{{ item.name }}
								<span v-if="scope.row.reportingPerson.length - 1 !== index">、</span></span>
						</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="left" min-width="150" :show-overflow-tooltip="true" label="相关文件">
					<template slot-scope="scope">
						<div v-for="(item,index) in scope.row.relevantDocument" :key="index" @click="downloadHadle(item)" class="file-download" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{index+1}}、{{item | formatFile}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="meetingType" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="决策情况">
					<template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
								<span>{{largeTripleSituationType(scope.row.decisionSituation)}}</span>
								<span v-if="scope.row.decisionSituationNote">，{{scope.row.decisionSituationNote}}</span>
							</div>
					</template>
				</el-table-column>
				<el-table-column header-align="center" align="left" min-width="150" :show-overflow-tooltip="true" label="会议纪要">
					<template slot-scope="scope">
						<div v-for="(item,index) in scope.row.summaryDocument" :key="index" @click="downloadHadle(item)" class="file-download" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{index+1}}、{{item | formatFile}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="meetingType" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="备注">
					<template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
								{{ scope.row.remark }}
							</div>
					</template>
				</el-table-column>
                <el-table-column prop="meetingType" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="纪检意见">
					<template slot-scope="scope">
							<div>
								<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
									<span>{{largeTripleOpinionType(scope.row.disciplineInspectionOpinion)}}</span>
									<span v-if="scope.row.disciplineInspectionOpinionNote">，{{scope.row.disciplineInspectionOpinionNote}}</span>
								</div>
								
							</div>
					</template>
				</el-table-column>
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
		<!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update> -->
		<!-- 弹窗, 添加纪检意见 -->
		<!-- <issues-tem v-if="issuesTemVisible" ref="issuesTem" @refreshDataList="getList"></issues-tem> -->
	</div>
</template>

<script>
	// import AddOrUpdate from './components/addOrEdit';
	// import IssuesTem from './components/issuesTem';
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
	// import tableMixin from '@/mixins/table/table.mixin'
	export default {
		name: "index",
		// mixins: [tableMixin],
		data() {
			return {
				dataListVisible: true,
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
					disciplineInspectionOpinion: undefined,
					orgId: undefined,
					startDate: '',
					endDate: '',
					conferenceEvent: '',
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
				
				ruleForm: {
					form: []
				},
				dataList: [],
				operation: '',
				largeTripleEventList: [],
				// conferenceTypeList: [],
				// conferenceTypeListAll: [],
				largeTripleSituation: [],
				largeTripleOpinion: [],
				// large_btn_addTriplelarge: false,
				// large_btn_addInspectionOpinions: false,
				// large_btn_edit: false,
				// large_btn_delete: false,
				tableHeight: 420
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			largeTripleSituationType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.largeTripleSituation.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},

			// 筛选符合条件的参数
			largeTripleOpinionType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.largeTripleOpinion.filter((item) => {
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
			// AddOrUpdate,
			// IssuesTem
		},

		// props: {
		// 	orgId: {
		// 		type: String
		// 	}
		// },
        
        // watch: {
		// 	orgId(newVal, oldVal) {
		// 		// this.tabPosition = newVal;
		// 	},
		// },

		created() {
			this.operation = this.$route.query.operation
			this.getDataList();
			// this.getTreeInfo();
			// 获取三重一大决策情况
			this.getDataDicts("largeTripleSituation").then((res) => {
				this.largeTripleSituation = res;
			});
			// 获取三重一大纪检意见
			this.getDataDicts("largeTripleOpinion").then((res) => {
				this.largeTripleOpinion = res;
			});
			// 获取权限
			// this.large_btn_addTriplelarge = this.elements['large:btn_addTriplelarge'];
			// this.large_btn_addInspectionOpinions = this.elements['large:btn_addInspectionOpinions'];
			// this.large_btn_edit = this.elements['large:btn_edit'];
			// this.large_btn_delete = this.elements['large:btn_delete'];
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
			// this.getList();
		},
		methods: {
			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=largetriple`;
			},
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
				// 表格序号
				let Nosort = 0
				for(let n in vm.spanArr){
					if(vm.spanArr[n]>0){
						Nosort += 1
						this.$set(data[n],'Nosort',Nosort)
					}
				}
			},
			objectSpanMethod(obj) {
				if (obj.columnIndex !== 4 && obj.columnIndex !== 5 && obj.columnIndex !== 6 && obj.columnIndex !== 7) {
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
			// // 获取部门树
			// getTreeInfo() {
			// 	getTree(
			// 			{
			// 				departmentAttribute: '1'
			// 			}
			// 		).then(res => {
			// 			if (res && res.code === 0) {
			// 				this.treeData = res.data ? res.data : [];
			// 				this.loading = false;
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取部门树失败",
			// 					type: 'error',
			// 					duration: 2000
			// 				});
			// 			}
			// 		});
			// },
			// // 隐藏下拉框
			// closeIt() {
			// 	this.$refs.selectIt.blur();
			// },
			
			// deptClear(e) {
			// 	this.listQuery.orgId = undefined;
			// },
			// // 选择部门
			// handleCheckChange(data) {
			// 	this.listQuery.orgId = data.id;
			// 	this.deptName = data.departmentFullName;
			// 	this.popoverVisibel = false;
			// },
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
			// 获取数据列表
			getList() {
				this.listLoading = true;
				// this.dataListVisible = false;
				this.dataList = [];
				this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				conferenceRecordList(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							// this.dataList = response.data.rows;
							for(let i = 0; i < response.data.rows.length; i++) {
								if(!response.data.rows[i].events) {
									this.dataList.push({ ...response.data.rows[i],
										  "rowspan": i
										})
								} else {
									for(let j = 0; j < response.data.rows[i].events.length; j++) {
										this.dataList.push(
											{ ...response.data.rows[i],
											//   "rowspan": response.data.rows[i].events.length,
											  "rowspan": i,
											  "conferenceEvent": response.data.rows[i].events[j].conferenceEvent,
											  "reportingPerson": response.data.rows[i].events[j].reportingPerson,
											  "relevantDocument": response.data.rows[i].events[j].relevantDocument,
											  "eventType": response.data.rows[i].events[j].eventType,
											  "decisionSituation": response.data.rows[i].events[j].decisionSituation,
											  "decisionSituationNote": response.data.rows[i].events[j].decisionSituationNote,
											  'orderNumber': j
											}
										)
									}
								}
							}
							this.getSpanArr(this.dataList);
							// this.dataListVisible = true;
							this.$nextTick(() => {
								// this.$refs.filterTable.doLayout();
								this.tableLayout();
								this.listLoading = false;
							});
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
					}).catch(() => {
						this.listLoading = false;
					})
			},

			// 表格有合并单元格和fixed的时候会错位，需要获取完数据重新布局
			tableLayout(option) {
				const {searchRefName = 'searchSection', tableRefName = 'filterTable', subtractVal = 270} = option || {}
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal - 202
				this.tableHeight = computedHeight > 420 ? computedHeight : 420
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
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
		// border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		// padding: 20px;
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

	.table-fixed {
		>>> .el-table__fixed-right {
			height: 100% !important; //设置高优先，以覆盖内联样式
		}
		
		>>> .el-table__fixed {
			height: 100% !important; //设置高优先，以覆盖内联样式
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

	.page-info-personnel {
		text-decoration:underline;
		cursor: pointer;
	}

	.page-info-personnel:hover {
		color: #bc0000;
	}

	.page-info-personnel:focus {
		color: #bc0000;
	}
	.m-table-wrap {
		color: rgba(0, 0, 0, 0.65);
		font-size: 14px;
		line-height: 1.5;
		table {
			table-layout: fixed;
			width: 100%;
			text-align: center;
			border-radius: 4px 4px 0 0;
			border-collapse: separate;
			border-spacing: 0;
			thead tr th {
				padding: 16px;
				color: rgba(0, 0, 0, 0.85);
				font-weight: 500;
				text-align: center;
				background: #fafafa;
				border-bottom: 1px solid #e8e8e8;
				transition: background .3s ease;
				&:first-child {
					border-top-left-radius: 4px;
				}
				&:last-child {
					border-top-right-radius: 4px;
				}
			}
			.m-body {
				position: relative;
				.m-loading {
					position: absolute;
					width: 100%;
					height: 100%;
				}
				.m-empty {
					padding: 48px 16px;
					color: rgba(0, 0, 0, 0.25);
					font-size: 14px;
					text-align: center;
					background: #fff;
					border-bottom: 1px solid #e8e8e8;
					border-radius: 0 0 2px 2px;
					.u-empty-icon {
					width: 64px;
					height: 41px;
					margin-bottom: 8px;
					}
					.u-empty-desc {
					color: rgba(0, 0, 0, 0.25);
					font-size: 14px;
					}
				}
			}
			tbody tr {
				transition: background .3s;
				td {
					padding: 16px;
					border-bottom: 1px solid #e8e8e8;
					transition: background .3s;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				// &:hover {
				// 	background: #e6f7ff;
				// }
			}
		}
}
</style>