<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getDataList()">
					<el-form-item>
						<el-input clearable placeholder="请输入责任清单主题" v-model="listQuery.inspectionTheme" maxlength="20">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="page-info" ref="pageInfo">
			<div style="display: flex;">
				<table>
					<thead>
						<tr height="50">
							<th v-for="(item, index) in theadData" :key="index" :width="item.width">
								<div>{{ item.label }}</div>
								<!-- <div v-show="item.isFraction">({{ countFraction }}分)</div>
								<div v-show="item.isSelfScore">({{ countSelfScore }}分)</div>
								<div v-show="item.isAuditScore">({{ countAuditScore }}分)</div> -->
							</th>
						</tr>
					</thead>
					<tbody v-if="typeTemplate.length === 0" style="height: 100px;">
						<tr align="center">
							<td :colspan="theadData.length" class="table-no-data">暂无数据</td>
						</tr>
					</tbody>
					<tbody v-for="(item,index) in typeTemplate" v-else :key="item.typeTemplateId">
						<template v-for="list in item.project">
							<tr height="80" v-for="(content,contentIndex) in list.contents" :key="content.contentTemplateId">
								<!-- <td class="td-center" v-if="content.isKey" :rowspan="childLen(item)">{{ index + 1 }}</td> -->
								<td class="td-center btn-box" v-if="content.isKey" :rowspan="childLen(item)">
									<el-date-picker v-if="status != 'detail'" class="filter-item" v-model="item.typeName" format="yyyy"
				 						value-format="yyyy" type="year" placeholder="选择年份" :clearable="false">
									</el-date-picker>
									<div v-else>{{ content.standard }}</div>
								</td>
								<td class="td-center btn-box" v-if="content.isKey" :rowspan="childLen(item)">
									<div>
										<el-input v-if="status != 'detail'" class="input-item" type="textarea"
											v-model="item.typeName" maxlength="50" resize="none" :rows="childLen(item) * 2"
											show-word-limit placeholder="请输入考核类型"></el-input>
										<div v-else>{{ item.typeName }}</div>
										<!-- 计算考核类型分 -->
										<!-- <div>（{{ countTypeScores(item) }}分）</div> -->
									</div>
									<!-- <div v-if="status != 'detail'" class="btn-row">
										<el-button class="btn" type="text" @click="addTypeHandle(index, list.projectTemplateId)"><i
												class="el-icon-circle-plus"></i></el-button>
										<el-button class="btn" type="text" @click="delTypeHandle(index, list.projectTemplateId)"><i
												class="el-icon-remove"></i></el-button>
									</div> -->
								</td>
								<td class="td-center btn-box" v-if="contentIndex === 0" :rowspan="list.contents.length">
									<div>
										<el-input v-if="status != 'detail'" class="input-item" type="textarea"
											v-model="list.projectName" maxlength="50" resize="none"
											:rows="list.contents.length * 2" show-word-limit placeholder="请输入考核项目">
										</el-input>
										<div v-else>{{ list.projectName }}</div>
										<!-- 计算考核项目分 -->
										<!-- <div>（{{ countProjectScores(list) }}分）</div> -->
									</div>
									<div v-if="status != 'detail'" class="btn-row">
										<el-button class="btn" type="text"
											@click="addProjectHandle(index, list.projectTemplateId)">
											<i class="el-icon-circle-plus"></i>
										</el-button>
										<el-button class="btn" type="text"
											@click="delProjectHandle(index, list.projectTemplateId)">
											<i class="el-icon-remove"></i>
										</el-button>
									</div>
								</td>
								<td class="btn-box">
									<div class="content-row">
										<el-input v-if="status != 'detail'" type="textarea"
											v-model="content.content" maxlength="50" resize="none"
											:autosize="{ minRows: 2, maxRows: 8 }" show-word-limit placeholder="请输入考核内容">
										</el-input>
										<div v-else>{{ content.content }}</div>
									</div>
									<div v-if="status != 'detail'" class="btn-row">
										<el-button class="btn" type="text"
											@click="addContentHandle(index,list.projectTemplateId,contentIndex)"><i
												class="el-icon-circle-plus"></i></el-button>
										<el-button class="btn" type="text"
											@click="delContentHandle(index,list.projectTemplateId,contentIndex)"><i
												class="el-icon-remove"></i></el-button>
									</div>
								</td>
								<!-- <td>
									<el-input v-if="status != 'detail'" type="textarea"
										v-model="content.standard" maxlength="500" resize="none"
										:autosize="{ minRows: 3, maxRows: 8 }" show-word-limit placeholder="请输入考核标准">
									</el-input>
									<div v-else>{{ content.standard }}</div>
								</td> -->
								<!-- <td>
									<el-input v-if="status != 'detail'" type="textarea"
										v-model="content.scoreWay" maxlength="500" resize="none"
										:autosize="{ minRows: 3, maxRows: 8 }" show-word-limit placeholder="请输入评分办法">
									</el-input>
									<div v-else>{{ content.scoreWay }}</div>
								</td>
								<td class="td-center">
									<el-input-number v-if="status != 'detail'" style="width: 60px;"
										v-model="content.fraction" :controls="false" controls-position="right" :min="0"
										:max="999">
									</el-input-number>
									<div v-else>{{ content.fraction }}</div>
								</td>
								<td v-if="['2','3','4','5'].includes(type)">
									<el-input
										v-if="status != 'detail' && ['2','3'].includes(type) && !(content.auditScore || parseInt(content.auditScore) >= 0) &&!(jwAudit.zjwScore || parseInt(jwAudit.zjwScore) >= 0)"
										type="textarea" v-model="content.situation" maxlength="500" resize="none"
										:autosize="{ minRows: 3, maxRows: 8 }" show-word-limit placeholder="请输入自述实际情况">
									</el-input>
									<div v-else>{{ content.situation }}</div>
								</td>
								<td class="btn-box" v-if="['2','3','4','5'].includes(type)">
									<div class="content-row td-center">
										<div v-if="content.files && content.files.length > 0">
											<div class="file-row" v-for="(item, index) in content.files">
												<span @click="downloadHandle(item)">{{ item.name }}</span>
											</div>
										</div>
										<el-button
											v-else-if="status != 'detail' && ['2','3'].includes(type) && !(content.auditScore || parseInt(content.auditScore) >= 0) &&!(jwAudit.zjwScore || parseInt(jwAudit.zjwScore) >= 0)"
											type="text" @click="uploadHanlde(index,list.projectTemplateId,contentIndex)">上传佐证材料
										</el-button>
									</div>
									<div v-if="['2','3'].includes(type) && status != 'detail' && content.files && content.files.length > 0  && !(content.auditScore || parseInt(content.auditScore) >= 0) &&!(jwAudit.zjwScore || parseInt(jwAudit.zjwScore) >= 0)"
										class="btn-row">
										<el-button class="btn" type="text"
											@click="editMaterialsHandle(index,list.projectTemplateId,contentIndex,content.files)">
											<i class="el-icon-edit"></i>
										</el-button>
									</div>
								</td>
								<td v-if="['2','4'].includes(type)" class="td-center">
									<el-input-number
										v-if="status != 'detail' && type == '2' && !(content.auditScore || parseInt(content.auditScore) >= 0) &&!(jwAudit.zjwScore || parseInt(jwAudit.zjwScore) >= 0)"
										style="width: 60px;" v-model="content.selfScore" :controls="false"
										controls-position="right" :min="0" :max="parseInt(content.fraction)">
									</el-input-number>
									<div v-else>{{ content.selfScore }}</div>
								</td>
								<td v-if="['4','5'].includes(type)">
									<el-input v-if="status != 'detail'" type="textarea" v-model="content.auditDescription"
										maxlength="500" resize="none" :autosize="{ minRows: 3, maxRows: 8 }" show-word-limit
										placeholder="请输入审核说明">
									</el-input>
									<div v-else>{{ content.auditDescription }}</div>
								</td>
								<td v-if="['4','5'].includes(type)" class="td-center">
									<el-input-number v-if="status != 'detail'" style="width: 60px;" v-model="content.auditScore"
										:controls="false" controls-position="right" :min="0" :max="parseInt(content.fraction)">
									</el-input-number>
									<div v-else>{{ content.auditScore }}</div>
								</td> -->
							</tr>
						</template>
					</tbody>
					<!-- 新增/编辑模板时展示 -->
					<!-- <tbody v-if="vetoPowerVisible">
						<tr align="center">
							<td class="td-center">{{ typeTemplate.length + 1 }}</td>
							<td class="td-center">
								<span>一票否决项（纪检监察室、党务工作部评分）</span>
							</td>
							<td :colspan="theadData.length - 2"></td>
						</tr>
					</tbody> -->
					<!-- 纪检监察室、党务工作部评分时展示 -->
					<!-- <tbody>
						<tr align="center">
							<td class="td-center">{{ typeTemplate.length + 1 }}</td>
							<td class="td-center">
								<span>一票否决项（纪检监察室、党务工作部评分）</span>
							</td>
							<td :colspan="theadData.length - 3">
								<el-input v-if="status != 'detail'" type="textarea" v-model="jwAudit.zjwExplain"
									maxlength="1000" resize="none" :autosize="{ minRows: 3, maxRows: 8 }" show-word-limit
									placeholder="请输入">
								</el-input>
								<div v-else>{{ jwAudit.zjwExplain }}</div>
							</td>
							<td class="td-center">
								<el-input-number v-if="status != 'detail'" style="width: 60px;" v-model="jwAudit.zjwScore"
									:controls="false" controls-position="right" :min="0" :max="countFraction">
								</el-input-number>
								<div v-else>{{ jwAudit.zjwScore }}</div>
							</td>
						</tr>
					</tbody> -->
				</table>
				<!-- <div @click="addBasis()" class="add-basis">+</div> -->
			</div>
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
				},

				status: 'add',
				typeTemplate: [{
					typeTemplateId: this.createRandomId(),
					typeName: "",
					project: [{
						projectTemplateId: this.createRandomId(),
						projectName: "",
						contents: [{
							isKey: true,
							contentTemplateId: this.createRandomId(),
							content: "",
							standard: "",
							scoreWay: "",
							fraction: undefined
						}]
					}]
				}],
				jwAudit: {
					zjwExplain: "",
					zjwScore: undefined
				},
				delIds: {
					typeTemplates: [],
					projectTemplate: [],
					contentTemplate: []
				},
				// 基础模板字段
				templateTheadData1: [
				// 	{
				// 	label: "序号",
				// 	width: 80
				// },
				 {
					label: "年度",
					width: 250
				}, {
					label: "部门",
					width: 260
				}, {
					label: "责任类别",
					width: 300
				}, {
					label: "责任内容",
					width: 500,
				}
				// , {
				// 	label: "评分办法",
				// 	width: 380
				// }, {
				// 	label: "标准分值",
				// 	width: 120,
				// 	isFraction: true
				// }
				],
				// 自查自评模板字段
				templateTheadData2: [{
					label: "自述实际情况",
					width: 300
				}, {
					label: "佐证材料",
					width: 350
				}, {
					label: "自评分",
					width: 100,
					isSelfScore: true
				}],
				// 数据上报模板字段
				templateTheadData3: [{
					label: "自述实际情况",
					width: 300
				}, {
					label: "佐证材料",
					width: 350
				}],
				// 考核模板字段
				templateTheadData4: [{
					label: "审核说明",
					width: 300
				}, {
					label: "审核分",
					width: 100,
					isAuditScore: true
				}],
				// fuhsiUploadDialogVisible: false,
				uploadMaterialsVisible: false
			}
		},

		props: {
			// 1：模板管理；2：考核任务-自查自评；3：考核任务-数据上报；4：考核-自查自评；5：考核-数据上报
			type: {
				type: [String, Number],
				default: 1
			},
			vetoPowerVisible: {
				type: Boolean,
				default: false
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
			},

			// 初始化表头
			theadData() {
				let list = [];
				switch (parseInt(this.type)) {
					case 1:
						list = [...this.templateTheadData1];
						break;
					case 2:
						list = [...this.templateTheadData1,
							...this.templateTheadData2
						];
						break;
					case 3:
						list = [...this.templateTheadData1,
							...this.templateTheadData3
						];
						break;
					case 4:
						list = [...this.templateTheadData1,
							...this.templateTheadData2,
							...this.templateTheadData4
						];
						break;
					// case 5:
					// 	list = [...this.templateTheadData1,
					// 		...this.templateTheadData3,
					// 		...this.templateTheadData4
					// 	];
					// 	break;
					default:
						break;
				}
				return list
			},

			// 计算需要合并的行数
			childLen() {
				return (list => {
					var len = 0;
					list.project.forEach(item => {
						len += item.contents.length;
					})
					return len
				})
			},

			// 计算标准分值总分
			countFraction() {
				let score = 0;
				this.typeTemplate.forEach(typeTemplate => {
					typeTemplate.project.forEach(project => {
						project.contents.forEach(content => {
							score += content.fraction ? parseInt(content.fraction) : 0;
						})
					})
				})
				return score
			},

			// 计算考核项目分
			countProjectScores() {
				return (project => {
					let score = 0;
					project.contents.forEach(content => {
						score += content.fraction ? parseInt(content.fraction) : 0;
					})
					return score
				})
			},

			// 计算考核类型分
			countTypeScores() {
				return (list => {
					let score = 0;
					list.project.forEach(project => {
						project.contents.forEach(content => {
							score += content.fraction ? parseInt(content.fraction) : 0;
						})
					})
					return score
				})
			},

			// 计算自评总分
			countSelfScore() {
				let score = 0;
				this.typeTemplate.forEach(typeTemplate => {
					typeTemplate.project.forEach(project => {
						project.contents.forEach(content => {
							score += content.selfScore ? parseInt(content.selfScore) : 0;
						})
					})
				})
				return score
			},

			// 计算审核总分
			countAuditScore() {
				let score = 0;
				this.typeTemplate.forEach(typeTemplate => {
					typeTemplate.project.forEach(project => {
						project.contents.forEach(content => {
							score += content.auditScore ? parseInt(content.auditScore) : 0;
						})
					})
				})
				return score
			}
		},
		created() {
			// this.getDataList();
			this.getTreeInfo();
			this.$nextTick(() => {
				this.getList();
			})
		},
		methods: {
			// 获取部门树
			getTreeInfo() {
				getTree(
						{
							departmentAttribute: '1'
						}
					).then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							this.popoverLoading = false;
							// if(this.deptTreeData.length === 1 && this.deptTreeData[0].children.length === 0) {
								
							// }
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

			closeIt_(index) {
				this.$refs['selectIt_' + index].blur();
			},
			// 选择单位
			handleCheckChange(data,node,item,index) {
				this.ruleForm.form[index].deptId = data.id;
				this.ruleForm.form[index].deptName = data.departmentFullName;
				this.$refs['popoverRef_' + index].doClose() // 关闭
				// this.form[index].popoverVisibel = false;
			},

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

			init(data) {
				if (data) {
					this.typeTemplate = data;
					this.faultTolerant();
				}
			},

			// 重置数据
			resetData() {
				this.typeTemplate = [{
					typeTemplateId: this.createRandomId(),
					typeName: "",
					project: [{
						projectTemplateId: this.createRandomId(),
						projectName: "",
						contents: [{
							isKey: true,
							contentTemplateId: this.createRandomId(),
							content: "",
							standard: "",
							scoreWay: "",
							fraction: undefined
						}]
					}]
				}];
				this.delIds = {
					typeTemplates: [],
					projectTemplate: [],
					contentTemplate: []
				};
			},

			// 生成随机id
			createRandomId() {
				var time = new Date().getTime();
				return (parseInt(time.toString().substring(4, time.length)) + Math.floor(Math.random() * 100000)) * -1
			},

			// 保持第一条数据唯一性，避免错位
			faultTolerant() {
				this.typeTemplate.forEach((item, index) => {
					if (!this.typeTemplate[index].project[0].contents[0].isKey) this.typeTemplate[index].project[0]
						.contents[0].isKey =
						true;
				})
			},

			// 新增考核类型
			addTypeHandle(index, projectTemplateId) {
				// let type = {
				// 	typeTemplateId: this.createRandomId(),
				// 	typeName: "",
				// 	project: [{
				// 		projectTemplateId: this.createRandomId(),
				// 		projectName: "",
				// 		contents: [{
				// 			isKey: true,
				// 			contentTemplateId: this.createRandomId(),
				// 			content: "",
				// 			standard: "",
				// 			scoreWay: "",
				// 			fraction: undefined
				// 		}]
				// 	}]
				// }
				// this.typeTemplate.splice(index + 1, 0, type);
				let project = {
					projectTemplateId: this.createRandomId(),
					projectName: "",
					contents: [{
						contentTemplateId: this.createRandomId(),
						content: "",
						standard: "",
						scoreWay: "",
						fraction: undefined
					}]
				}
				this.typeTemplate[index].project.splice(this.getProjectIndex(index, projectTemplateId) + 1, 0, project);
			},

			// 删除考核类型
			delTypeHandle(index) {
				if (this.typeTemplate.length === 1) return this.$message.error("无法删除最后一条考核类型数据")
				this.$confirm(`确定删除当前考核类型吗?`, "提示", {
					confirmButtonText: this.$t('confirm'),
					cancelButtonText: this.$t('cancel'),
					type: 'warning'
				}).then(() => {
					// 获取删除的ID
					let typeTemplateId = this.typeTemplate[index].typeTemplateId;
					this.typeTemplate.splice(index, 1);
					// 保持第一条数据唯一性，避免错位
					this.faultTolerant();
					// 存放需要删除的后台生成的ID
					if (typeTemplateId >= 0) this.delIds.typeTemplates.push(typeTemplateId);
				}).catch(() => {})
			},

			// 获取考核项目下标
			getProjectIndex(index, projectTemplateId) {
				let projectIndex = -1;
				this.typeTemplate[index].project.forEach((item, index) => {
					if (parseInt(item.projectTemplateId) === parseInt(projectTemplateId)) return projectIndex =
						index
				})
				return projectIndex
			},

			// 新增考核项目
			addProjectHandle(index, projectTemplateId) {
				let project = {
					projectTemplateId: this.createRandomId(),
					projectName: "",
					contents: [{
						contentTemplateId: this.createRandomId(),
						content: "",
						standard: "",
						scoreWay: "",
						fraction: undefined
					}]
				}
				this.typeTemplate[index].project.splice(this.getProjectIndex(index, projectTemplateId) + 1, 0, project);
			},

			// 删除考核项目
			delProjectHandle(index, projectTemplateId) {
				if (this.typeTemplate[index].project.length === 1) return this.$message.error("无法删除最后一条考核项目数据")

				this.$confirm(`确定删除当前考核项目吗?`, "提示", {
					confirmButtonText: this.$t('confirm'),
					cancelButtonText: this.$t('cancel'),
					type: 'warning'
				}).then(() => {
					// 获取删除的ID
					let typeTemplateId = this.typeTemplate[index].typeTemplateId;
					this.typeTemplate[index].project.splice(this.getProjectIndex(index, projectTemplateId), 1);
					// 保持第一条数据唯一性，避免错位
					this.faultTolerant();
					// 存放需要删除的后台生成的ID
					if (projectTemplateId >= 0) this.delIds.projectTemplate.push(projectTemplateId);
				}).catch(() => {})
			},

			// 新增考核内容
			addContentHandle(index, projectTemplateId, contentIndex) {
				let projectIndex = this.getProjectIndex(index, projectTemplateId);
				let content = {
					contentTemplateId: this.createRandomId(),
					content: "",
					standard: "",
					scoreWay: "",
					fraction: undefined
				}
				this.typeTemplate[index].project[projectIndex].contents.splice(contentIndex + 1, 0, content);
			},

			// 删除考核内容
			delContentHandle(index, projectTemplateId, contentIndex) {
				let projectIndex = this.getProjectIndex(index, projectTemplateId);
				let contents = this.typeTemplate[index].project[projectIndex].contents;
				if (contents.length === 1) return this.$message.error(
					"无法删除最后一条考核内容数据")
				this.$confirm(`确定删除当前考核内容吗?`, "提示", {
					confirmButtonText: this.$t('confirm'),
					cancelButtonText: this.$t('cancel'),
					type: 'warning'
				}).then(() => {
					// 获取删除的ID
					let contentTemplateId = this.typeTemplate[index].project[projectIndex].contents[contentIndex]
						.contentTemplateId;
					this.typeTemplate[index].project[projectIndex].contents.splice(contentIndex, 1);
					// 保持第一条数据唯一性，避免错位
					this.faultTolerant();
					// 存放需要删除的后台生成的ID
					if (contentTemplateId >= 0) this.delIds.contentTemplate.push(contentTemplateId);
				}).catch(() => {})
			},

			// 校验
			validateData() {
				let num = 0;
				let res = false;

				function validate(val) {
					return val == null || val == undefined || !val.trim()
				}
				try {
					this.typeTemplate.forEach(typeTemplate => {
						num++;
						if (validate(typeTemplate.typeName)) throw new Error('考核类型不能为空！');
						try {
							typeTemplate.project.forEach(project => {
								num++;
								if (validate(project.projectName)) throw new Error('考核项目不能为空！');
								try {
									project.contents.forEach(content => {
										if (validate(content.content)) throw new Error(
											'考核内容不能为空！');
										if (validate(content.standard)) throw new Error(
											'考核标准不能为空！');
										if (validate(content.scoreWay)) throw new Error(
											'评分办法不能为空！');
										if (!(content.fraction == 0 || content.fraction > 0))
											throw new Error('标准分值不能为空！');
										num++;
									})
								} catch (e) {
									//TODO handle the exception
									res = true;
									this.$message.warning(e.message)
								}
							})
						} catch (e) {
							//TODO handle the exception
							res = true;
							this.$message.warning(e.message)
						}
					})
				} catch (e) {
					//TODO handle the exception
					res = true;
					this.$message.warning(e.message)
				}
				return res
			},

			// 上传佐证材料
			uploadHanlde(index, projectTemplateId, contentIndex) {
				// this.fuhsiUploadDialogVisible = true;
				// this.$nextTick(() => {
				// 	this.$refs.fuhsiUploadDialog.init([], {
				// 		index: index,
				// 		projectIndex: this.getProjectIndex(index, projectTemplateId),
				// 		contentIndex: contentIndex
				// 	});
				// })
				this.uploadMaterialsVisible = true;
				this.$nextTick(() => {
					this.$refs.uploadMaterials.init([], {
						index: index,
						projectIndex: this.getProjectIndex(index, projectTemplateId),
						contentIndex: contentIndex
					});
				})
			},

			// 编辑佐证材料
			editMaterialsHandle(index, projectTemplateId, contentIndex, files) {
				this.uploadMaterialsVisible = true;
				this.$nextTick(() => {
					this.$refs.uploadMaterials.init(JSON.parse(JSON.stringify(files)), {
						index: index,
						projectIndex: this.getProjectIndex(index, projectTemplateId),
						contentIndex: contentIndex
					});
				})
				// let fileList = [];
				// for (let i = 0; i < files.length; i++) {
				// 	var obj = {
				// 		name: formatFile(files[i]),
				// 		url: files[i],
				// 		response: {
				// 			data: files[i]
				// 		}
				// 	}
				// 	fileList.push(obj);
				// }
				// this.$refs.fuhsiUploadDialog.init(fileList, {
				// 	index: index,
				// 	projectIndex: this.getProjectIndex(index, projectTemplateId),
				// 	contentIndex: contentIndex
				// });
			},

			// 获取批量上传文件
			getFiles(data) {
				try {
					this.typeTemplate[data.key.index].project[data.key.projectIndex].contents[data.key.contentIndex]
						.files = data.files;
					let deleteIds = this.typeTemplate[data.key.index].project[data.key.projectIndex].contents[data.key
							.contentIndex]
						.deleteIds;
					this.typeTemplate[data.key.index].project[data.key.projectIndex].contents[data.key.contentIndex]
						.deleteIds = deleteIds ? [
							...deleteIds,
							...data.deleteIds
						] : data.deleteIds;
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},
			// getFiles(data) {
			// 	try {
			// 		let files = data.files.map(item => {
			// 			return item.response ? item.response.data : item.url;
			// 		});
			// 		this.typeTemplate[data.key.index].project[data.key.projectIndex].contents[data.key.contentIndex]
			// 			.files = files;
			// 	} catch (e) {
			// 		//TODO handle the exception
			// 		this.$message.error("获取文件失败，请重新上传");
			// 		return
			// 	}
			// },

			// 下载文件
			downloadHandle(file) {
				if (file.id < 0) {
					this.$message.warning("当前文件未保存提交，不能下载！");
					return
				}
				var params = qs.stringify({
					'id': file.id,
					'token': Cookies.get('token')
				});
				window.location.href = `${window.SITE_CONFIG['apiURL']}/examine/party/downloads?${params}`;
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

		.page-info-form {
			width: calc(100% - 50px) !important;
		}
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

	table {
		border-collapse: collapse;
		border-spacing: 0;
		border-left: 1px solid #EBEEF5;
		border-top: 1px solid #EBEEF5;
		font-size: 16px;

		th,
		td {
			border-right: 1px solid #EBEEF5;
			border-bottom: 1px solid #EBEEF5;
			padding: 10px;
		}

		th {
			font-weight: bold;
			background: #F5F7FA;
		}
	}

	// table thead {
	//     display: table;
	//     width: 100%;
	//     table-layout: fixed;/*重要  表格固定算法*/
	// }

	// table thead {/*留出滚动条的位置*/
	//     width: calc(100% - 1em)
	// }


	.btn-box {
		position: relative;

		.content-row {
			padding-bottom: 20px;
		}

		.input-item {
			margin-bottom: 5px;
		}

		.btn-row {
			position: absolute;
			right: 10px;
			bottom: 0;
			height: 25px;
			line-height: 25px;

			.btn {
				margin-top: -10px;
				font-size: 17px;
			}
		}
	}

	.td-center {
		text-align: center;
	}

	.file-row {
		margin-bottom: 5px;
		text-align: left;

		span {
			text-decoration: underline;
		}

		span:hover {
			color: red;
			cursor: pointer;
		}
	}
</style>