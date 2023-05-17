<template>
	<div class="tier-page-content">
        <div class="page-content-title">
            <!-- <div slot="header" class="content-title clearfix">
				<span class="title-label title-label-top">临时任务详情：</span>
			</div>
			<div class="content-text">
                <div slot="header" class="content-title clearfix">
                    <span class="title-label">任务标题：</span>
                    <span>{{information.title}}</span>
                </div>
                <div slot="header" class="content-title clearfix">
                    <span class="title-label">提报时间：</span>
                    <span>{{information.title}}</span>
                </div>
                <div slot="header" class="content-title clearfix">
                    <span class="title-label">文件：</span>
                    <div v-if="information.planFiles && information.planFiles.length" class="file-roll-containers">
						<div class="file-info" v-for="(item, index) in information.planFiles" :key="index">
							<div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item | formatFile}}</div>
							<div class="file-download" @click="downloadHadle(item)">下载</div>
						</div>
					</div>
                </div>
                <div slot="header" class="clearfix">
                    <span class="title-label">备注：</span>
                    <span>{{information.deptName}}</span>
                </div>
            </div> -->
			<el-table :height="tableHeight" ref="table" :data="dataList" :span-method="objectSpanMethod" border v-loading="dataListLoading" fit highlight-current-row>
				<!-- <el-table-column header-align="center" align="center" type="selection" width="50"></el-table-column> -->
				<!-- <el-table-column label="序号" header-align="center" align="center" prop="Nosort" width="50px" /> -->
				<el-table-column prop="issueYear" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="年度">
				</el-table-column>
				<el-table-column prop="deptName" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="部门">
				</el-table-column>
                <el-table-column prop="liabilityCategory" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="责任类别">
				</el-table-column>
				<el-table-column prop="content" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="责任内容">
				</el-table-column>
				<el-table-column prop="specificObjectivesMeasures" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="具体目标及措施">
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="相关文件">
					<template slot-scope="scope">
						<div v-for="(item, index) in scope.row.relevantDocument" :key="index" @click="downloadHadle(item)" class="file-download" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item | formatFile}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="completionTimeLimit" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="完成时限">
				</el-table-column>
				<el-table-column prop="name" header-align="center" align="center" min-width="100" :show-overflow-tooltip="true" label="责任人">
				</el-table-column>
				<el-table-column v-if="operation == 'edit'" fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id,scope.$index)">填写提报数据</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page-content-form">
				<div v-if="operation == 'edit'" slot="header" class="content-title clearfix">
					<span class="title-label title-label-top" style="padding-top: 0px;">审核节点：</span>
					<span v-if="defaultVisible" class="title-label-top title-label-border">我</span>
					<span v-if="defaultVisible" class="title-label-top" style="padding-top: 10px;padding-left: 10px;padding-right: 5px;"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
					<span v-if="defaultVisible" class="title-label-top title-label-border">主要负责人</span>
					<span v-if="defaultVisible" style="margin-top: 9px;"><span v-for="(item,index) in opinionForm" :key="index">
						<span class="title-label-top" style="padding-top: 10px;padding-left: 10px;padding-right: 5px;"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
						<span class="title-label-top title-label-border">{{item.name}}</span>
						<span class="btn-info" @click="delBasis(index)"><i
								class="el-icon-remove-outline"></i></span>
					</span></span>
					<span v-if="defaultVisible" class="btn-info" @click="addBasis()" style="padding-top: 10px;padding-left: 10px;padding-right: 5px;"><i
								class="el-icon-circle-plus-outline"></i></span>
					<span v-else>
						<!-- <span class="title-label title-label-top">审核节点：</span> -->
						<div style="display: inline-block;">
						<div v-for="(item,index) in nodeDataPart" :key="index" class="content-title-loop">
							<span class="title-label-top" style="width: 60px;display: inline-block;"><span v-if="index == 0">当前：</span></span>
							<span class="title-label-top title-label-border">{{nodeData[0][0].name}}</span>
							<span class="title-label-top"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
							<span class="title-label-top title-label-border">主要负责人</span>
							<span><span v-for="(items,indexs) in nodeDataPart[index]" :key="indexs">
								<span class="title-label-top"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
								<span class="title-label-top title-label-border">{{items.name}}</span>
								</span></span>
								<span v-if="index == 0">
								<span v-for="(itemss,indexss) in opinionForm" :key="indexss">
									<span class="title-label-top"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
									<span class="title-label-top title-label-border">{{itemss.name}}</span>
									<span class="btn-info" @click="delBasis(indexss)"><i
											class="el-icon-remove-outline"></i></span>
									
								</span>
								</span>
								<span v-if="index == 0" class="btn-info" @click="addBasis()"><i
											class="el-icon-circle-plus-outline"></i></span>
						</div>
						</div>
						<!-- <span v-for="(item,index) in opinionForm" :key="index">
						<span v-if="index !== 0" class="title-label-top"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
						<span class="title-label-top title-label-border">{{item.name}}</span>
						<span class="btn-info" @click="delBasis(index)"><i
								class="el-icon-remove-outline"></i></span>
						<span class="btn-info" @click="addBasis()"><i
								class="el-icon-circle-plus-outline"></i></span> -->
					<!-- </span> -->
					</span>
					<!-- <span class="btn-info" @click="addBasis()"><i
								class="el-icon-circle-plus-outline"></i></span> -->
				</div>
				<div v-if="operation == 'detail' || operation == 'see'" slot="header" class="content-title clearfix">
					<span class="title-label title-label-top">审核节点：</span>
					<div style="display: inline-block;">
					<div v-for="(item,index) in nodeDataPart" :key="index" class="content-title-loop">
						<span class="title-label-top" style="width: 60px;display: inline-block;"><span v-if="index == 0">当前：</span></span>
						<span class="title-label-top title-label-border">{{nodeData[0][0].name}}</span>
						<span class="title-label-top"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
						<span class="title-label-top title-label-border">主要负责人</span>
						<span><span v-for="(items,indexs) in nodeDataPart[index]" :key="indexs">
							<span class="title-label-top"><i class="el-icon-right" style="color: gray; margin-right: 5px;"></i></span>
							<span class="title-label-top title-label-border">{{items.name}}</span>
						</span></span>
					</div>
					</div>
				</div>
			</div>
			<el-divider v-if="operation == 'detail'"></el-divider>
			<div v-if="operation == 'detail'" class="page-form">
				<el-form :model="approveForm" :rules="approveRules" ref="approveForm" class="form" style="font-size: 16px;" label-width="120px" :label-position="labelPosition">
					<el-form-item label="审核：" prop="auditStatus">
						<el-select v-model="approveForm.auditStatus" placeholder="请选择" style="width: 100%;">
							<el-option
							v-for="item in options"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="批示意见：" prop="auditAdvice">
						<el-input type="textarea" :rows="4"
							placeholder="请输入批示意见" v-model="approveForm.auditAdvice" clearable>
						</el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer" align="right">
				<el-button v-if="operation == 'detail' || operation == 'edit'" @click="goBack">取消</el-button>
				<el-button v-if="operation == 'detail'" type="primary" @click="approveHandle('approveForm')" :loading="loading">确定</el-button>
				<el-button v-else-if="operation == 'edit'" type="primary" @click="determineHandle()" :loading="loading">确定并提报</el-button>
				<el-button v-if="approveList && approveList.length" class="btn-submit" type="primary" @click="handleComments()">查看审核意见</el-button>
			</div>
		</div>
        <!-- <div class="page-content-form">
            <div slot="header" class="content-title clearfix">
				<span class="title-label title-label-top">临时任务提报：</span>
			</div>
		</div> -->
		
		<el-dialog title="新增" :visible.sync="visible" width="700px"  :append-to-body="true">
			<el-form label-width="120px">
			<el-form-item label="部门：" prop="deptName">
				<el-input v-model="opinionObj.deptName" placeholder="点击右侧按钮选择部门" readonly style="width: 86%">
					<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
						<el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
							</span>
						</el-tree>
						<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
					</el-popover>
				</el-input>
			</el-form-item>
			<el-form-item label="审批人：">
                <el-select style="width: 86%" v-model="opinionObj.item" filterable placeholder="请选择审批人" @change="change($event,0)">
                    <el-option
                    v-for="item in useroptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                    </el-option>
                </el-select>
			</el-form-item>
			<!-- <el-form-item label="审批人：" class="box-form">
				<el-button @click="personnelFistHandle('审批人')" type="text"
					class="but-css">
					批量选择人员
				</el-button>
				<el-select class="input-item elinput" v-model="opinionFormName" clearable multiple @focus="closeIt" ref="selectIt" style="width:100%;"
				 @remove-tag="removeTag" placeholder="" @clear="clear">
				</el-select>
			</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer" align="center">
				<el-button type="primary" @click="getAddData()" :loading="subLoading">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false">
			<el-table :data="approveList" border fit highlight-current-row style="width: 100%">
				<el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
				<el-table-column width="100" align="center" label="审核人"> <template slot-scope="scope">
					{{scope.row.name}}
				</template> </el-table-column>
				<el-table-column width="100" align="center" label="审核"> <template slot-scope="scope">
						<span v-if="scope.row.auditStatus == '1'">同意</span>
						<span v-if="scope.row.auditStatus == '0'">不同意</span>
					</template> </el-table-column>
				<el-table-column align="center" label="批示意见"> <template slot-scope="scope">
						<span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.auditAdvice}}</span>
					</template> </el-table-column>
			</el-table>
		</el-dialog>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="addData"></add-or-update>
		<!-- 弹窗 选择人员 -->
		<fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
	</div>
</template>

<script>
	import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	import AddOrUpdate from './components/putadd';
    import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	// import {
	// 	getCause,
	// 	notJoinStorage
	// } from 'api/questionList/intelligentSup/index';
	import {
		issueListPage,
		addIssueaudit,
		auditstep,
		addNode,
		addCommitlist
	} from 'api/responsibility/index';
	import {
        getToken
    } from 'utils/auth';
    import {
		formatFile
	} from 'utils';
	import {
		mapGetters
	} from 'vuex';
	import {
		getTree,
		getUser
	} from 'api/admin/department/index';
	export default {
		name: 'temporaryPut',
		data() {
			return {
				subLoading: false,
				defaultVisible: false,
				addOrUpdateVisible: false,
				dataList: [],
				dataListLoading: false,
				information: {},
				id: undefined,
				labelPosition: 'left',
				approveForm: {
					id: undefined,
					auditAdvice: '',
					auditStatus: '',
				},
				approveRules: {
					jianApprovalOpinion: [{
						required: true,
						message: '请选择提报时间',
						trigger: 'change'
					}],
					jianApprovalContents: [{
						required: true,
						message: '请输入批示意见',
						trigger: 'blur'
					}]
				},
				cause: '',
				dialogStatus: false,
				loading: false,
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				educations: [],
				politicalOutlooks: [],
                ranks: [],
                options: [{
					value: '1',
					label: '同意'
				}, {
					value: '0',
					label: '不同意'
				}],
                value: '',
                uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				responsibility_btn_inspection: false,
				responsibility_btn_user: false,
				responsibility_btn_chiefsecretary: false,
				issueLiabilityOrgId: undefined,
				visible: false,
				opinionObj:	{
					deptId: undefined,
					deptName: '',
					name: '',
					userId: undefined,
					item: {}
				},
				opinionForm: [
					// {
					// 	deptId: undefined,
					// 	deptName: '',
					// 	name: '',
					// 	userId: undefined,
					// 	item: {}
					// }
				],
				opinionFormName: [],
				useroptions: [],
				personnelFistVisible:false,
				checkedData:[],
				Form: [],
				NosortNum: undefined,
				operation: '',
				nodeData: [],
				nodeDataPart: [],
				tableHeight: undefined,
				dialogFormVisible: false,
				approveList: []
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
			UploadFiles,
			fuhsiSelectPersonnel
		},
		watch : {
			checkedData: {
				handler(newVal, oldVal) {
					// if(newVal && newVal.resultList && newVal.resultList.length) {
					// 	for(let i=0;i<newVal.resultList.length;i++){
					// 		this.opinionFormName.push(newVal.resultList[i].name);
					// 	}
					// }
					// this.opinionForm = newVal.resultList;
				},
				immediate: true
			},
		},
		beforeRouteLeave(to, from, next) {
			const tranferParamsId = {
				id: this.$route.query.pageId,
			};
		
			localStorage.setItem(
				'responsibilityDelId',
				JSON.stringify(tranferParamsId),
			);

			next();
		},
		created() {
			// 获取权限
			this.responsibility_btn_inspection = this.elements['responsibility:btn_inspection'];
			this.responsibility_btn_user = this.elements['responsibility:btn_user'];
			this.responsibility_btn_chiefsecretary = this.elements['responsibility:btn_chiefsecretary'];
			// this.responsibility_btn_inspection = false;
			// this.responsibility_btn_chiefsecretary = false;
			// this.responsibility_btn_user = false;
			// this.information = this.$route.query.information;
			this.id = this.$route.query.id;
			this.operation = this.$route.query.operation;
			this.init();
			this.getDataList();
			this.getauditstep();
			this.getTreeInfo();
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			clear() {
				this.opinionForm = [];
			},
			removeTag(val){
				for(let i = 0; i < this.opinionForm.length; i++) {
					if(this.opinionForm[i].name == val) {
						this.opinionForm.splice(i,1)
					}
				}
			},
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			// 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.opinionForm));
   	  				this.$refs.personnelFist.init();
    			})
   			},
            // 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=responsibility`;
			},
			goBack() {
				this.$router.go(-1);
			},
			approveHandle(formName) {
				// this.approveForm.userId = getToken();
				// this.approveForm.id = this.id;
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addIssueaudit(this.approveForm)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										this.loading = false;
										this.goBack();
									}, 2000)
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000
									});
									this.loading = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '操作失败',
									type: 'error',
									duration: 2000
								});
								this.loading = false;
							})
					} else {
						return false;
					}
				});
			},
			init() {
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
					if (data[index].liabilityCategory === data[index - 1].liabilityCategory) {
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
				this.NosortNum = Nosort
			},
			getSpanArr1(data) {
				var vm = this;
				vm.spanArr1 = [];
				vm.pos1 = 0;
				data.forEach(function (item, index) {
					//判断是否是第一项
					if (index === 0) {
					vm.spanArr1.push(1);
					vm.pos1 = 0;
					} else {
					//不是第一项时，就根据标识去存储
					if (data[index].issueYear === data[index - 1].issueYear && data[index].deptId === data[index - 1].deptId) {
						// 查找到符合条件的数据时每次要把之前存储的数据+1
						vm.spanArr1[vm.pos] += 1;
						vm.spanArr1.push(0);
					} else {
						// 没有符合的数据时，要记住当前的index
						vm.spanArr1.push(1);
						vm.pos1 = index;
					}
					}
				});
				// 表格序号
				let Nosort = 0
				for(let n in vm.spanArr1){
					if(vm.spanArr1[n]>0){
						Nosort += 1
						this.$set(data[n],'Nosort',Nosort)
					}
				}
			},
			objectSpanMethod(obj) {
				if (obj.columnIndex === 2) {
					// 二维数组存储的数据 取出
					var _row = this.spanArr[obj.rowIndex];
					var _col = _row > 0 ? 1 : 0;
					return {
					rowspan: _row,
					colspan: _col,
					};
				} else if (obj.columnIndex === 0 || obj.columnIndex === 1 || obj.columnIndex === 2) {
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
			// 获取数据列表
			getDataList() {
				this.dataList = [];
				this.dataListLoading = true;
				issueListPage(this.$route.query.id).then(data => {
					if (data && data.status === 200) {
                        // this.dataList = data.data.rows
						for(let i = 0; i < data.data.issueListData.length; i++) {
                            if(!data.data.issueListData[i].liabilityContent.length) {
                                this.dataList.push(data.data.issueListData[i])
                            } else {
                                for(let j = 0; j < data.data.issueListData[i].liabilityContent.length; j++) {
                                    this.dataList.push(
                                        { ...data.data,
											"deptName": data.data.deptName,
											"issueTheme": data.data.issueTheme,
											"issueTime": data.data.issueTime,
											"issueYear": data.data.issueYear,
											"liabilityCategory": data.data.issueListData[i].liabilityCategory,
                                            "rowspan": data.data.issueListData[i].liabilityContent.length,
											"id": data.data.issueListData[i].liabilityContent[j].id,
                                            "content": data.data.issueListData[i].liabilityContent[j].content,
                                            "liabilityContentId": data.data.issueListData[i].liabilityContent[j].id,
											"completionTimeLimit":  data.data.issueListData[i].liabilityContent[j].commitInfo ? data.data.issueListData[i].liabilityContent[j].commitInfo.completionTimeLimit : "",
											"relevantDocument": data.data.issueListData[i].liabilityContent[j].commitInfo ? data.data.issueListData[i].liabilityContent[j].commitInfo.relevantDocument : [],
											"specificObjectivesMeasures": data.data.issueListData[i].liabilityContent[j].commitInfo ? data.data.issueListData[i].liabilityContent[j].commitInfo.specificObjectivesMeasures : "",
											"name": data.data.issueListData[i].liabilityContent[j].commitInfo ? data.data.issueListData[i].liabilityContent[j].commitInfo.name : "",
                                        }
                                    )
                                }
                            }
                        }
                        this.getSpanArr(this.dataList);
						this.getSpanArr1(this.dataList);
						this.$nextTick(() => {
							for(let i = 0; i < this.dataList.length; i++) {
								this.Form.push({
									completionTimeLimit: '',
									name: '',
									issueLiabilityOrgId: this.id,
									orgName: '',
									depId: undefined,
									issueLiabilityContentId: this.dataList[i].id,
									relevantDocument: [],
									specificObjectivesMeasures: '',
									userId: undefined,
								})
							}
						})
						this.tableLayout();
						this.dataListLoading = false
					} else {
						this.dataList = []
						this.$notify.error(data.msg)
						this.dataListLoading = false
					}
				}).catch(() => {
					this.dataList = []
					this.dataListLoading = false
					this.$notify.error("获取数据列表失败")
				})
			},
			// 表格有合并单元格和fixed的时候会错位，需要获取完数据重新布局
			tableLayout(option) {
				const {searchRefName = 'searchSection', tableRefName = 'table', subtractVal = 270} = option || {}
				const minHeight = 500
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal - 120
				this.tableHeight = computedHeight > minHeight ? computedHeight : minHeight
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},
			// 获取申请节点
			getauditstep() {
				auditstep(this.$route.query.id).then(data => {
					if (data && data.status === 200) {
						if(!data.data.length) {
							this.defaultVisible = true;
						} else {
							if(!data.data.auditStatus) this.approveForm.id = data.data.id;
							this.nodeData = data.data 
							// this.opinionForm = data.data 
							for(let j = 1; j < data.data[0].length; j++) {
								if(!data.data[0][j].auditStatus) {
									this.approveForm.id = data.data[0][j].id;
									break;
								}
							}
							if(data.data.length) {
								for(let i = 0; i < data.data.length; i++) {
									this.nodeDataPart.push([])
									if(data.data[i].length > 2) {
										for(let j = 2; j < data.data[i].length; j++) {
											this.nodeDataPart[i].push(data.data[i][j])
										}
									}
								}
								for(let m = 0; m < data.data.length; m++) {
									for(let n = 0; n < data.data[m].length; n++) {
										if(data.data[m][n].auditAdvice || data.data[m][n].auditStatus) {
											this.approveList.push({ auditAdvice: data.data[m][n].auditAdvice, auditStatus: data.data[m][n].auditStatus, name: data.data[m][n].name })
										}
									}
								}
							}
							
						}
					} else {
						this.approveForm.id = undefined
						this.$notify.error(data.msg)
					}
				}).catch(() => {
					this.approveForm.id = undefined
					this.$notify.error("获取数据列表失败")
				})
			},
			// 查看审核
			handleComments() {
				this.dialogFormVisible = true;
			},
			// 新增 / 修改
			addOrUpdateHandle(id,index) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(this.$route.query.id,id,index,this.Form[index]);
				})
			},
            // 获取批量上传文件
			getFiles(data) {
				try {
					this.baseDataForm.planFiles = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},
			addBasis() {
				this.opinionObj = {
					deptId: undefined,
					deptName: '',
					name: '',
					userId: undefined,
					item: {}
				},
				this.visible = true;
			},
			delBasis(index) {
				this.opinionForm.splice(index, 1);
			},
			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
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
			// 选择单位
			handlePartyBranch(data) {
				this.opinionObj.deptId = data.id;
				this.opinionObj.deptName = data.departmentFullName;
				this.getUserDataList();
				this.treeVisible = false;
			},
			// 获取单位人员
			getUserDataList(orgId) {
				getUser(orgId ? orgId : this.opinionObj.deptId,{ name: '' })
					.then(res => {
						if (res && res.status === 200) {
							this.useroptions = res.data.map(item => { return {value: item.userId, label: item.position ? item.name +  '-' + item.position : item.name, name: item.name} });
						} else {
							this.$notify({
								title: '失败',
								message: "获取人员失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			},
			// 选择单位人员
			change(e) {
				this.opinionObj.userId = e.value;
				this.opinionObj.name = e.name;
			},
			getAddData() {
				this.subLoading = true;
				this.opinionForm.push(this.opinionObj)
				this.subLoading = false;
				this.visible = false;
			},
			addData(val,index) {
				if(this.Form[index]) this.Form[index] = val;
				this.dataList[index].specificObjectivesMeasures = val.specificObjectivesMeasures;
				this.dataList[index].relevantDocument = val.relevantDocument;
				this.dataList[index].completionTimeLimit = val.completionTimeLimit;
				this.dataList[index].name = val.name;
				// addNode(this.opinionForm, this.id)
				// 	.then((res) => {
				// 		if (res && res.status === 200) {
				// 			this.$notify({
				// 				title: '成功',
				// 				message: '创建成功',
				// 				type: 'success',
				// 				duration: 2000
				// 			});
				// 			setTimeout(() => {
				// 				// this.visible = false;
				// 				this.getDataList();
				// 				this.$nextTick(() => {
				// 					// this.$router.go(-1);
				// 				})
				// 			}, 2000)
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: res.msg,
				// 				type: 'error',
				// 				duration: 2000
				// 			});
				// 		}
				// 	}).catch(() => {
				// 		this.$notify({
				// 			title: '失败',
				// 			message: '创建失败',
				// 			type: 'error',
				// 			duration: 2000
				// 		});
				// 	})
			},
			addNodeData() {
				addNode(this.opinionForm, this.id)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000
							});
							setTimeout(() => {
								// this.visible = false;
								// this.getDataList();
								this.$nextTick(() => {
									this.$router.go(-1);
								})
							}, 2000)
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 2000
							});
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 2000
						});
					})
			},
			determineHandle() {
				this.loading = true;
				addCommitlist(this.Form,this.$route.query.id).then(data=> {
						if (data && data.status === 200) {
							this.$notify({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.loading = false;
									this.addNodeData();
									// this.$nextTick(() => {
									//     this.$router.go(-1);
									// })
								}
							})
						} else {
							this.loading = false;
							this.$notify.error(data.msg)
						}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tier-page-content {
		padding: 20px;
	}
    ::v-deep .app-main {
        // background-color: #fff !important;
    }
	.page-content-title {
		padding: 18px 20px;
    	// border-bottom: 1px solid #EBEEF5;
		font-size: 16px;
		// font-weight: 700;
		background-color: #fff !important;
	}
    .content-text {
        // margin-left: 150px;
        width: 60%;
        margin: 0 auto;
        padding: 0px 20px;
    }
	.content-title {
		display: flex;
		margin-bottom: 25px;
	}
	.content-title-spc {
		margin-bottom: 25px;
	}
	.content-title-loop {
		margin-top: 25px;
		// margin-left: 100px;
	}
	.title-label {
		width: 90px;
		display: inline-block;
		padding-top: 25px;
	}
    .title-label-top {
        // text-decoration:underline;
    }
	.title-label-border {
		border: solid 1px black;
		padding: 10px;
		border-radius: 5px;
		text-align: center;
	}
    .page-content-form {
        padding: 18px 20px 0px 18px;
		font-size: 16px;
        // font-weight: 700;
    }
    .page-form {
        width: 80%;
        margin: 0 auto;
    }
	.form {
		padding: 18px 20px;
        font-size: 16px;
	}
    .formLabel {
        font-size: 16px;
        font-weight: 400;
    }
    .dialog-footer {
        // text-align: right;
    }
	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}
	.file-download {
		text-decoration: underline;
	}

	.file-download:hover {
		cursor: pointer;
		color: #bc0000;
	}

	.add-basis {
		display: inline-block;
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
		margin-left: 10px;
		/* margin-right: 15px; */
		font-size: 20px;
	}

	.add-basis:hover {
		cursor: pointer;
	}

	.box-form{
		/deep/ .el-select__tags span:first-child{
			margin-left: 105px;
			margin-top: 4px;
		}
		/deep/ .el-select__tags span span .el-select__tags-text{
			margin-left: 0px;
			margin-top: 0px;
		}

		.but-css{
			border: 1px dashed rgb(188,0,0);
			color:rgb(188,0,0);
			position:fixed;
			z-index:9999;
			text-align: center;
			padding-bottom: 5px;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: 6px;
			margin-left: 6px;
		}
	}

	.btn-info {
		display: inline-block;
		width: 25px;
		height: 25px;
		font-size: 17px;
		// margin-right: 10px;
	}

	.btn-info:hover {
		font-weight: bold;
		color: #000;
		cursor: pointer;
	}
</style>
