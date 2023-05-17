<template>
	<div class="page-content-tabel">
		<!-- <loading v-if="hide"></loading> -->
		<!-- <div class="page-title">{{$route.path.indexOf('add') != -1 ? '新增' : '修改'}}</div> -->
		<!-- <el-divider></el-divider> -->
		<div class="box-content">
			<div class="box-left tree-info">
				<FormType ref="formType" @refreshData="getTypes"></FormType>
			</div>
			<div class="box-right page-info" ref="wrap">
				<div style="display: flex;width: 100%;">
					<div class="search-left">
						<!-- <el-tabs class="el-tabs-card" v-model="activeName" type="card" @tab-click="handleClick">
							<el-tab-pane label="" name="first" class="tab-content">
								
							</el-tab-pane>
						</el-tabs> -->
						<el-radio-group v-if="!addInspectionVisible" class="radio-group-button" v-model="tabPosition" style="margin-bottom: 30px;" @input="radioChange">
							<el-radio-button v-for="(item,index) in hiarchiList" :key="index" :label="index">{{item.actualTime}}</el-radio-button>
						</el-radio-group>
					</div>
					<div class="bu-right">
						<el-button v-if="operation == 'detail' && !$route.query.status && integrityArchives_btn_addFile && formType == '2'" class="filter-item" style="margin-left: 10px;" @click="addFileHandle"
							type="primary" icon="edit">新增档案</el-button>
						<!-- <el-button v-if="operation == 'detail' && (tabPosition == '我的审核' || (!$route.query.status && formType == '0'))" type="primary" style="margin-left: 10px;" @click="getPdf()">导出</el-button> -->
						<el-button v-if="(formType == '0' || formType == '3' || formType == '4' || tabPosition == '我的查看') && tabPosition !== '我的提报'" type="primary" style="margin-left: 10px;" @click="getPdf()">导出</el-button>
						<!-- <el-button v-if="operation == 'add'" class="btn-submit" type="primary" @click="create('form')"
							:loading="subLoding">保存本次表单</el-button> -->
					</div>
				</div>
				<div v-if="(operation == 'detail' && !$route.query.status) || tabPosition !== '我的提报' || this.$route.query.pageId" class="roll-containers">
					<!-- <div v-if="tabPosition == '我的审核'" class="isSelected" id="pdfDom">
						<k-form-build :key="new Date().getTime()" ref="kfb" :value="formVariables" />
					</div> -->
					<div v-if="(!addInspectionVisible && (formType == '0' || formType == '3' || formType == '4' || tabPosition == '我的查看'))" class="isSelected" id="pdfDom">
						<!-- <component ref="tableForm" class="table-info" :typeInfo="typeInfo" :dataObj="dataObj"
							:is="NextTickName"></component> -->
						<k-form-build :key="new Date().getTime()" ref="kfb" :value="formVariables" />
					</div>
					<div v-if="!addInspectionVisible && formType == '2'" id="pdfDom">
						<!-- <k-form-build :key="new Date().getTime()" :disabled="true" ref="kfb" :value="formVariables" /> -->
						<div v-for="(item,index) in previewFileUrls" :key="index" class="content-show">
							<div class="file-info">
								<iframe :id="`bi_iframe${index}`" @load="adjustIframe(index)" scrolling="auto" :src="item.url" frameborder="0" height="300px" style=""
									></iframe>
							</div>
						</div>
					</div>
					<div v-if="addInspectionVisible" id="pdfDom">
						<k-form-build :key="new Date().getTime()" ref="kfb" :value="formVariables" />
					</div>
				</div>
				<div v-else class="roll-containers">
					<div v-if="operation == 'detail' && formType == '2'">
						<div v-for="(item,index) in previewFileUrls" :key="index" class="content-show">
							<div class="file-info">
								<iframe :id="`bi_iframe${index}`" @load="adjustIframe(index)" scrolling="auto" :src="item.url" frameborder="0" height="300px" style=""
									></iframe>
							</div>
						</div>
					</div>
					<div v-else :class=" disabled ? 'isSelected' : '' ">
						<k-form-build :key="new Date().getTime()" ref="kfb" :disabled="disabled" :value="formVariables" />
					</div>
				</div>
			</div>
		</div>
		<div v-if="operation == 'add'" class="footer-btn" align="right">
			<!-- <el-button type="primary" @click="getPdf()">PDF</el-button> -->
			<!-- <el-button @click="goBack()">返 回</el-button> -->
			<!-- <el-button class="btn-submit" type="primary" @click="create('form')"
				:loading="subLoding">存草稿</el-button> -->
			<el-button v-if="operation == 'add'" class="btn-submit" type="primary" @click="create('form')"
				:loading="subLoding">保存本次表单</el-button>
			<el-button v-if="status == '2' || status == '3'" class="btn-submit" type="primary" @click="createPut('form')" :disabled="reportingOverallVisible"
				:loading="subAllLoding">整体提报</el-button>
			<!-- <el-button class="btn-submit" v-else type="primary" @click="update('form')" :loading="loading">确 定
			</el-button> -->
			<el-button v-if="approveVisible" class="btn-submit" type="primary" @click="handleComments()">查看审批意见</el-button>
		</div>
		<div v-if="operation == 'oneself'" class="footer-btn" align="right">
			<el-button class="btn-submit" type="primary" @click="createPutBeforeOrAfter()"
				:loading="subLoding">提报</el-button>
		</div>
		<el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close='closeDialog'>
			<el-form v-if="status !== '0' && status !== '3' && tabPosition == '我的审核'" :model="approveForm" :rules="approveRules" ref="approveForm" label-width="100px">
				<el-form-item label="意见选择：" prop="auditStatus">
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
						placeholder="请输入" v-model="approveForm.auditAdvice" maxlength="500" clearable>
					</el-input>
				</el-form-item>
			</el-form>
			<div v-if="status !== '0' && status !== '3' && tabPosition == '我的审核'" slot="footer" class="dialog-footer">
				<el-button type="primary" @click="approveHandle('approveForm')" :loading="approveLoading">确定</el-button>
			</div>
			<el-table v-if="status == '0' || status == '3' || (approveVisible && !examine)" :data="approveList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<el-table-column align="center" type="index" label="序号" width="65"></el-table-column>
				<el-table-column width="100" align="center" label="审核人员"> <template slot-scope="scope">
						{{scope.row.name}}
					</template> </el-table-column>
				<el-table-column width="100" align="center" label="意见选择"> <template slot-scope="scope">
						<span v-if="scope.row.auditStatus == '1'">同意</span>
						<span v-if="scope.row.auditStatus == '0'">不同意</span>
					</template> </el-table-column>
				<el-table-column align="center" label="批示意见"> <template slot-scope="scope">
						<span style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.auditAdvice}}</span>
					</template> </el-table-column>
			</el-table>
			<!-- <div v-show="!listLoading" class="pagination-container" align="right">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
					:page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div> -->
		</el-dialog>
		<div v-if="operation == 'detail'" class="footer-btn" align="right">
			<!-- <el-button type="primary" @click="getPdf()">PDF</el-button> -->
			<el-button v-if="addInspectionVisible" class="btn-submit" type="primary" @click="handleInspectionCancle('form')">取消</el-button>
			<el-button v-if="addInspectionVisible" class="btn-submit" type="primary" @click="handleInspectionConfirm('form')" :loading="subLoding">确认</el-button>
			<el-button v-if="(status == '0' || status == '3') && (approveVisible && !examine)" class="btn-submit" type="primary" @click="handleComments()">查看审批意见</el-button>
			<el-button v-if="tabPosition == '我的审核' && status == '1' && examine == 'examine'" class="btn-submit" type="primary" @click="handleComments()">添加审批意见</el-button>
			<!-- <el-button v-if="tabPosition == '我的审核'" type="primary" @click="getPdf()">导出</el-button> -->
		</div>
		<!-- 弹窗, 新增档案 -->
		<AddFile v-if="addFileVisible" ref="addFile" @refreshDataList="getFormId"></AddFile>
	</div>
</template>

<script>
	import AddFile from './components/addFile';
	import {
		taskarchives,
		taskarchivesLeader,
		taskarchivesInspection,
		archivesAudit,
		archivesAuditInfo,
		individualtaskPut,
		initiativeSubmission,
		hiarchivesList,
		individualList
	} from 'api/archives/index';
	import {
		getObj
	} from 'api/admin/user/index';
	import {
		getForm
	} from 'api/bpm/form';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import FormType from './components/FormType';
	export default {
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			return {
				subAllLoding: false,
				approveLoading: false,
				htmlTitle: 'pdf文件名',
				hide: true,
				loading: false,
				subLoding: false,
				typeInfo: {
					code: '1',
					title: ''
				},
				dataObj: {},
				form: {
					selfAnalysisId: undefined,
					userId: undefined,
					deptId: undefined,
					deptName: undefined,
					selfAnalysis: undefined,
					file: []
				},
				formVariables: {},
				disabled: false,
				taskarchivesId: undefined,
				taskarchivesIdOld: undefined,
				operation: '',
				dialogFormVisible: false,
				options: [{
					value: '1',
					label: '同意'
				}, {
					value: '0',
					label: '不同意'
				}],
				approveForm: {
					individualTaskId: undefined,
					auditAdvice: '',
					auditStatus: ''
				},
				approveRules: {
					auditStatus: [{
						required: true,
						message: '请选择意见',
						trigger: 'change'
					}],
					// auditAdvice: [{
					// 	required: true,
					// 	message: '请输入批示意见',
					// 	trigger: 'blur'
					// }]
				},
				integrityArchives_btn_first: false,
				status: '',
				listLoading: true,
				approveList: [],
				first: '',
				index: undefined,
				affType: '',
				affData: {},
				commitType: '',
				tabPosition: '',
				examine: '',
				year: '',
				addFileVisible: false,
				hiarchiList: [],
				tabPosition: 0,
				integrityArchives_btn_addFile: false,
				formsData: [],
				formId: undefined,
				addInspectionVisible: false,
				formTypeType: undefined,
				formType: undefined,
				reportingOverallVisible: true,
				formNum: undefined,
				leftData: {},
				approveVisible: false,
				integrityArchives_btn_inspection: false,
				previewFileUrls: [] // 预览文件
			}
		},

		components: {
			FormType,
			AddFile
		},

		beforeRouteLeave(to, from, next) {
			const tranferParams = {
				id: this.$route.query.pageId,
			};
		
			localStorage.setItem(
				'statisticsAnalyzeParams',
				JSON.stringify(tranferParams),
			);
			
			next();
		},

		created() {
			if (this.$route.path.indexOf('add') != -1) this.hide = false;
			this.operation = this.$route.query.operation;
			this.status = this.$route.query.status;
			this.first = this.$route.query.first;
			this.tabPosition = this.$route.query.tabPosition;
			this.examine = this.$route.query.examine;
			// 获取权限
			this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];
			this.integrityArchives_btn_addFile = this.elements['integrityArchives:btn_addFile'];
			this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection']; // 纪检
			// if (this.$route.path.indexOf('add') != -1) this.getUserInfo();
			// else this.getDetail();
			if(this.operation == 'add') this.getTreeInfo();
			if(this.$route.query.id) this.getInfo(this.$route.query.id);
		},

		computed: {
			...mapGetters([
				'userId','elements'
			]),

			// NextTickName() {
			// 	if (this.typeInfo.code) {
			// 		let c = () => import(`@/components/OATables/Table_${this.typeInfo.code}.vue`); // 动态组件
			// 		return c
			// 	}
			// }
		},

		watch: {
			taskarchivesId(newVal, oldVal) {
				this.taskarchivesIdOld = oldVal;
				this.taskarchivesId = newVal;
				// this.tabPosition = newVal;
			},

			formNum(newVal, oldVal) {
				// this.taskarchivesIdOld = oldVal;
				// this.taskarchivesId = newVal;
				// this.tabPosition = newVal;
				if(newVal == this.formsData.length) this.reportingOverallVisible = false;
				else this.reportingOverallVisible = true;
			},
		},

		methods: {
			adjustIframe(index) {
				var ifm = document.getElementById("bi_iframe"+index);
				ifm.height = document.documentElement.clientHeight;
				ifm.width = document.documentElement.clientWidth - 650;
			},
			// 获取树结构
			getTreeInfo() {
				individualList(this.$route.query.id).then(res => {
					if (res && res.status === 200) {
						if(res.data && res.data.length == 1 && res.data[0].children && res.data[0].children.length) {
							for(let i = 0; i < res.data[0].children.length; i++) {
								if(res.data[0].children[i].formVariables) {
									this.formsData.push({ formVariables: res.data[0].children[i].formVariables, id: res.data[0].children[i].id })
								}
								if('个人有关事项报告表' == res.data[0].children[i].formTypeName && res.data[0].children[i].children.length) {
									for(let j = 0; j < res.data[0].children[i].children.length; j++) {
										if(res.data[0].children[i].children[j].formVariables) {
											this.formsData.push({ formVariables: res.data[0].children[i].children[j].formVariables, id: res.data[0].children[i].children[j].id })
										}
									}
								}
							}
						} else if(res.data && res.data.length) {
							for(let i = 0; i < res.data.length; i++) {
								if(res.data[i].formVariables) {
									this.formsData.push({ formVariables: res.data[i].formVariables, id: res.data[i].id })
								}
								if(res.data[i].children && res.data[i].children.length) {
									for(let j = 0; j < res.data[i].children.length; j++) {
										if(res.data[i].children[j].formVariables) {
											this.formsData.push({ formVariables: res.data[i].children[j].formVariables, id: res.data[i].children[j].id })
										}
									}
								}
							}
						}
					} else {
						this.$notify({
							title: '失败',
							message: "获取树结构失败",
							type: 'error',
							duration: 1000
						});
					}
				});
			},
			// 新增档案
			addFileHandle() {
				// this.addFileVisible = true
				// this.$nextTick(() => {
				// 	this.$refs.addFile.init();
				// })
				this.getFormId();
			},
			getFormId() {
				getForm(this.formId).then(response => {
					if (response && response.status === 200) {
						const data = {
							...response.data,
							formConf: response.data.conf,
							formFields: response.data.fields,
							formName: response.data.name,
						}
						this.getType('',data);
						this.addInspectionVisible = true;
						this.disabled = false;
					}
					// if(this.operation == 'oneself') {
					// 	this.getType(this.year,this.data,index,this.data.typ)
					// 	// this.$emit('refreshData', this.year,this.data,index,this.data.type);
					// } else {
					// 	this.formTypes.push(this.data)
					// 	this.activeIndex = this.formTypes.length-1;
					// 	this.getType(this.year,this.data,this.formTypes.length-1,this.data.type)
					// 	// this.$emit('refreshData', this.year,this.data,this.formTypes.length-1,this.data.type);
					// }
				});
			},

			goBack() {
				this.$router.go(-1);
			},

			closeLoading() {
				this.hide = false;
			},

			getTypes(year,data,formTypeType,formNum) {
				this.addInspectionVisible = false;
				if(formNum) this.formNum = formNum;
				else this.formNum = undefined;
				this.taskarchivesId = data.id;
				this.formId = data.formId;
				this.formType = data.formType;
				this.leftData = data;
				if(formTypeType) {
					this.formTypeType = formTypeType;
				} else {
					this.formTypeType = '';
				}
				if(data.name) {
					this.htmlTitle = data.name;
				} else {
					this.htmlTitle = 'pdf文件名';
				}
				if((this.operation == 'detail' && !this.$route.query.status)) {
					this.year = year;
					// if(this.formsData && this.formsData.length) {
					// 	for(let i = 0; i < this.formsData.length; i++) {
					// 		if(!this.unique(data.id)) {
					// 			this.formsData.push({ formVariables: {}, id: data.id})
					// 		}
					// 	}
					// } else {
					// 	this.formsData.push({ formVariables: {}, id: data.id })
					// }
					this.$nextTick(() => {
						this.getHiarchivesInfo(data.id)
					})
				} else {
					// if(this.$refs.kfb && this.operation == 'add') {
					// 	this.$refs.kfb.getData().then(values => {
					// 		if(this.formsData && this.formsData.length) {
					// 			if(this.unique(this.taskarchivesIdOld)) {
					// 				for(let i = 0; i < this.formsData.length; i++) {
					// 					if(this.formsData[i].id == this.taskarchivesIdOld) {
					// 						this.formsData[i].formVariables = values;
					// 					}
					// 				}
					// 			} else {
					// 				this.formsData.push({ formVariables: values, id: this.taskarchivesIdOld })
					// 			}
					// 		} else {
					// 			this.formsData.push({ formVariables: values, id: this.taskarchivesIdOld })
					// 		}
					// 	}).catch(() => {
					// 	})
					// }
					this.$nextTick(() => {
						this.getType(year,data);
					})
				}
				// this.year = year;
				// if(this.$refs.kfb && this.operation == 'add') {
				// 	this.$refs.kfb.getData().then(values => {
				// 		if(this.formsData && this.formsData.length) {
				// 			for(let i = 0; i < this.formsData.length; i++) {
				// 				if(this.formsData[i].id == this.taskarchivesId) {
				// 					this.formsData[i].formVariables = values;
				// 				}
				// 			}
				// 		} else {
				// 			this.formsData.push({ formVariables: values, id: data.id })
				// 		}
				// 	}).catch(() => {
				// 	})
				// }
				// // if(this.formsData && this.formsData.length) {
				// // 	for(let i = 0; i < this.formsData.length; i++) {
				// // 		if(!this.unique(data.id)) {
				// // 			this.formsData.push({ formVariables: {}, id: data.id})
				// // 		}
				// // 	}
				// // } else {
				// // 	this.formsData.push({ formVariables: {}, id: data.id })
				// // }
				// this.$nextTick(() => {
				// 	this.getHiarchivesInfo(data.id)
				// })
			},

			// 查重
			unique(id) {
				let ary = [];
				ary = this.formsData.filter(item => {
					return item.id == id
				})
				return ary.length ? true : false
			},

			// getFormsData() {
			// 	this.$refs.kfb.getData().then(values => {
			// 		if(this.formsData && this.formsData.length) {
			// 			for(let i = 0; i < this.formsData.length; i++) {
			// 				if(this.formsData[i].id == this.taskarchivesId) {
			// 					this.formsData[i].formVariables = values;
			// 				}
			// 			}
			// 		}
			// 	}).catch(() => {
			// 	})
			// },

			getHiarchivesInfo(id,year) {
				hiarchivesList({formId: id,year: year ? year : this.year},this.$route.query.userId).then(res => {
						if (res && res.status === 200) {
							if(res.data && res.data.length) {
								this.hiarchiList = res.data;
								this.getType(this.year,res.data[0]);
								this.tabPosition = 0;
							} else {
								this.hiarchiList = [];
								this.previewFileUrls = [];
								this.getType(this.year,{});
							}
							// this.formTypes = res.data ? res.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: "操作失败",
								type: 'error',
								duration: 1000
							});
						}
					});
			},

			radioChange(e) {
				this.getType(this.year,this.hiarchiList[e]);
				// this.tabPosition = index;
			},

			// 获取所选表类型
			getType(year,data,index,affType) {
				// this.year = year;
				this.$refs.wrap.scrollTo(0, 0);
				this.hide = true;
				if(affType) this.affType = affType;
				this.affData = data;
				// this.typeInfo = data;
				// this.formVariables = data;
				this.index = index;
				// this.taskarchivesId = data.id;
				if(this.$route.query.operation == 'detail' && !this.affType) {
					 this.disabled = true;
				} else {
					this.disabled = false;
				}
				this.formVariables = {
					config: undefined,
					list: []
				}
				this.formVariables.config = JSON.parse(data.formConf);
				// for(let i = 0; i < data.formFields.length; i++) {
				// 	this.formVariables.list[i] = JSON.parse(data.formFields[i]);
				// }
				Promise.all([
					data.formFields.forEach(item => {
						this.formVariables.list.push(JSON.parse(item));
					})
				]).then(() => {
					this.$nextTick(() => {
						setTimeout(() => {
							// if(this.formsData && this.formsData.length && this.unique(data.id)) {
							// 	for(let i = 0; i < this.formsData.length; i++) {
							// 		if(this.formsData[i].id == data.id) {
							// 			this.$refs.kfb.setData(this.formsData[i]
							// 				.formVariables);
							// 		}
							// 	}
							// } else 
							this.previewFileUrls = [];
							if(this.formType == '2' && data.formVariables && this.operation == 'detail') {
								this.previewFileUrls = Object.values(data.formVariables)[0];
							} else if(this.formType == '2' && data.lastTimeFormVariables && this.operation == 'detail') {
								this.previewFileUrls = Object.values(data.lastTimeFormVariables)[0];
							} else if(data.formVariables) {
								this.previewFileUrls = [];
								this.$refs.kfb.setData(data
									.formVariables);
							} else {
								this.previewFileUrls = [];
								this.$refs.kfb.setData(data
									.lastTimeFormVariables);
							}
						}, 300)
					})
				})
				setTimeout(() => {
					this.hide = false;
				}, 400);
			},

			// 创建表单 - 存草稿
			create(formName) {
				// if (!this.$refs.tableForm) return;
				// var data = this.$refs.tableForm.form;
				// this.$set(data, 'templateId', this.typeInfo.code);
				// this.$set(data, 'createId', this.userId);
				// this.loading = true;
				// 使用getData函数获取数据
				this.$refs.kfb.getData().then(values => {
					if(this.formType == '2' && this.uniqueFile(values)) {
						this.$message.error('请上传.pdf格式文件');
					} else {
						this.subLoding = true;
						taskarchives({
							id: this.taskarchivesId,
							formVariables: values
						}).then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000
								});
								// setTimeout(() => {
									// this.goBack();
									this.$refs.formType.getTreeInfo(this.taskarchivesId);
									// this.$refs.formType.handleType(this.index);
									if(this.formsData && this.formsData.length) {
										if(this.unique(this.taskarchivesId)) {
											for(let i = 0; i < this.formsData.length; i++) {
												if(this.formsData[i].id == this.taskarchivesId) {
													this.formsData[i].formVariables = values;
												}
											}
										} else {
											this.formsData.push({ formVariables: values, id: this.taskarchivesId })
										}
									} else {
										this.formsData.push({ formVariables: values, id: this.taskarchivesId })
									}
									this.$nextTick(() => {
										if(this.formNum == this.formsData.length) this.reportingOverallVisible = false;
										else this.reportingOverallVisible = true;
									},1000)
									this.subLoding = false;
								// }, 1000)
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
								this.subLoding = false;
							}
						}).catch(() => {
							// this.disabled = false; // 表单开启
							// this.formBtns = true; // 按钮展示
							this.$notify({
								title: '失败',
								message: '操作失败',
								type: 'error',
								duration: 2000
							});
							this.subLoding = false;
						})
					}
				}).catch(() => {
					// this.disabled = false; // 表单开启
					// this.formBtns = true; // 按钮展示
					this.subLoding = false;
				})
			},
			
			// 批量存草稿
			createAll(formName) {
				// this.loading = true;
				// 使用getData函数获取数据
				this.$refs.kfb.getData().then(values => {
					this.subLoding = true;
						taskarchives({
							id: this.taskarchivesId,
							formVariables: values
						}).then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000
								});
								// setTimeout(() => {
									// this.goBack();
									this.$refs.formType.getTreeInfo(this.index);
									// this.$refs.formType.handleType(this.index);
									this.subLoding = false;
								// }, 1000)
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
								this.subLoding = false;
							}
						}).catch(() => {
							// this.disabled = false; // 表单开启
							// this.formBtns = true; // 按钮展示
							this.$notify({
								title: '失败',
								message: '操作失败',
								type: 'error',
								duration: 2000
							});
							this.subLoding = false;
						})
					// }
				}).catch(() => {
					// this.disabled = false; // 表单开启
					// this.formBtns = true; // 按钮展示
					this.subLoding = false;
				})
			},
			// 去提报
			createPut() {
				this.$confirm('提报后不允许修改，是否确定提报?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$nextTick(() => {
						this.subAllLoding = true;
						individualtaskPut(
								this.$route.query.id
							).then(res => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									// setTimeout(() => {
										// this.goBack();
										this.$refs.formType.getTreeInfo(this.index);
										this.subAllLoding = false;
										this.$router.go(-1);
									// }, 1000)
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000
									});
									this.subAllLoding = false;
								}
							}).catch(() => {
								// this.disabled = false; // 表单开启
								// this.formBtns = true; // 按钮展示
								this.$notify({
									title: '失败',
									message: '提报失败',
									type: 'error',
									duration: 2000
								});
								this.subAllLoding = false;
							})
						})
					})
					
				
			},

			// 事前事后提报
			createPutBeforeOrAfter() {
				this.$confirm('提报后不允许修改，是否确定提报?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 使用getData函数获取数据
					this.$refs.kfb.getData().then(values => {
						let formTypeBeforeOrAfter = this.affData.type;
						if(this.affData.type == '3') {
							formTypeBeforeOrAfter = '1'
						} else if(this.affData.type == '4') {
							formTypeBeforeOrAfter = '2'
						}
						this.subLoding = true;
						initiativeSubmission({
							formId: this.taskarchivesId,
							formVariables: values,
							formConf: this.affData.formConf,
							formFields: this.affData.formFields,
							formName: this.affData.formName,
							formType: this.affData.type,
							formTypeId: this.leftData.formTypeId,
							formTypeName: this.leftData.formTypeName,
							formTypeType: this.formTypeType ? this.formTypeType : null
						},formTypeBeforeOrAfter).then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000
								});
									// this.$refs.formType.getIndex(this.index);
									this.subLoding = false;
									this.$router.go(-1);
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
								this.subLoding = false;
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '操作失败',
								type: 'error',
								duration: 2000
							});
							this.subLoding = false;
						})
						
					}).catch(() => {
						this.subLoding = false;
					})
				})
				
			},

			// 文件校验
			uniqueFile(values) {
				let num = 0;
				for(let i = 0; i < Object.values(values)[0].length; i++) {
					if(!(/^[\s\S]*\.(pdf)$/.test(Object.values(values)[0][i].url))) {
						num = num + 1;
					}
				}
				return num > 0 ? true : false
				
			},

			handleInspectionConfirm() {
				this.loading = true;
				// 使用getData函数获取数据
				this.$refs.kfb.getData().then(values => {
					if(this.uniqueFile(values)) {
						this.$message.error('请上传.pdf格式文件');
					} else {
						this.subLoding = true;
						taskarchivesInspection({
							formType: this.affData.type,
							// userId: this.$route.query.userId,
							// year: this.year,
							formId: this.leftData.formId,
							formVariables: values,
							formConf: this.affData.formConf,
							formFields: this.affData.formFields,
							formName: this.affData.formName,
							formTypeId: this.leftData.id,
							formTypeName: this.leftData.name,
							formTypeType: this.leftData.type
						},this.$route.query.id ? this.$route.query.id : this.$route.query.userId).then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000
								});
									// this.$refs.formType.getIndex(this.index);
									this.disabled = true;
									this.addInspectionVisible = false;
									this.$refs.formType.getTreeInfo(this.taskarchivesId);
									this.getHiarchivesInfo(this.taskarchivesId)
									this.subLoding = false;
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
								this.subLoding = false;
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '操作失败',
								type: 'error',
								duration: 2000
							});
							this.subLoding = false;
						})
					}
					
					
				}).catch(() => {
					this.subLoding = false;
				})
			},

			handleInspectionCancle() {
				this.disabled = true;
				this.addInspectionVisible = false;
				// this.formType = '';
				this.getHiarchivesInfo(this.taskarchivesId)
			},

			// 修改表单
			update(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						// putObj(this.form)
						// 	.then((res) => {
						// 		if (res && res.code === 0) {
						// 			this.$notify({
						// 				title: '成功',
						// 				message: '修改成功',
						// 				type: 'success',
						// 				duration: 2000
						// 			});
						// 			setTimeout(() => {
						// 				this.goBack();
						// 				this.loading = false;
						// 			}, 2000)
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
						// 		this.loading = false;
						// 	})
					} else {
						return false;
					}
				});
			},

			// 获取详情
			getDetail() {
				// detail({
				// 		id: this.$route.query.id
				// 	})
				// 	.then(res => {
				// 		if (res && res.code === 0) {
				// 			this.dataObj = res.data;
				// 			setTimeout(() => {
				// 				this.loading = false;
				// 			}, 300)
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: res.msg,
				// 				type: 'error',
				// 				duration: 2000
				// 			});
				// 			setTimeout(() => {
				// 				this.loading = false;
				// 			}, 300)
				// 		}
				// 	}).catch(() => {
				// 		setTimeout(() => {
				// 			this.loading = false;
				// 		}, 500)
				// 	})
			},

			// 添加审批
			handleComments() {
				// this.approveForm = {
				// 	individualTaskId: undefined,
				// 	auditAdvice: '',
				// 	auditStatus: ''
				// };
				this.$nextTick(() => {
					setTimeout(() => {
						if(this.affData.formVariables) {
							this.$refs.kfb.setData(this.affData
								.formVariables);
						} else {
							this.$refs.kfb.setData(this.affData
								.lastTimeFormVariables);
						}
					}, 500)
				})
				this.dialogFormVisible = true;
				this.getInfo(this.$route.query.id);
			},

			closeDialog() {
				this.$nextTick(() => {
					setTimeout(() => {
						if(this.affData.formVariables) {
							this.$refs.kfb.setData(this.affData
								.formVariables);
						} else {
							this.$refs.kfb.setData(this.affData
								.lastTimeFormVariables);
						}
					}, 100)
				})
			},

			// 获取详情
			getInfo(id) {
				this.listLoading = true;
				archivesAuditInfo(id)
					.then(response => {
						if (response && response.status === 200) {
							this.approveList = response.data;
							// this.total = response.data.total;
							if(response.data && response.data.length) this.approveVisible = true;
							else this.approveVisible = false;
						} else {
							// this.total = 0;
						}
						this.listLoading = false;
					}).catch(Error => {
						this.listLoading = false;
					})
			},

			approveHandle(formName) {
				this.approveForm.individualTaskId = this.$route.query.id;
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.approveLoading = true;
						archivesAudit(this.approveForm)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 1000
									});
									this.approveLoading = false;
									this.dialogFormVisible = false;
									this.$router.go(-1);
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 1000
									});
									this.approveLoading = false;
									this.dialogFormVisible = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '操作失败',
									type: 'error',
									duration: 1000
								});
								this.approveLoading = false;
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
	.isSelected{
		pointer-events: none;
	}
	.page-content-tabel {
		min-height: calc(100vh - 160px);
		// padding: 20px;
		// background-color: #FFFFFF;

		.box-content {
			display: flex;
			margin: 0 auto;
			border: 0.0625rem solid #EAEAEA;
			// border-radius: 10px;
			padding: 20px;
			background: #FFFFFF;
			min-height: calc(100vh - 160px);

			.tree-info {
				// position: absolute;
				border: 0.0625rem solid #EAEAEA;
				border-radius: 10px;
				padding: 20px;
				height: calc(100vh - 240px);
			}

			.box-right {
				flex: 1;
				margin-left: 20px;
				margin-bottom: 10px;
				// max-height: calc(100vh - 330px);
				max-height: calc(100vh - 240px);
				width: 75%;

				.table-info {
					float: left;
				}

				.roll-containers {
					margin-top: 20px;
					max-height: calc(100vh - 360px);
					// max-width: calc(100vw - 620px);
					overflow: auto;
				}

				.search-left {
					flex: 1;
					width: calc(100% - 90px);
				}

				.bu-right {
					width: 120px;
					text-align: right;
				}
			}

			.page-info {
				border: 0.0625rem solid #EAEAEA;
				border-radius: 10px;
				padding: 20px;
			}
		}

		.footer-btn {
			border-top: 1px solid #DCDFE6;
			z-index: 999;
			position: fixed;
			width: 100%;
			height: 66px;
			background-color: #FFFFFF;
			right: 0;
			bottom: 30px;
			padding-right: 50px;
			padding-top: 13px;

			button {
				width: 120px;
			}

			.btn-submit {
				// background-color: #005598;
				margin-left: 20px;
			}
		}
	}

	.radio-group-button {
		overflow-x: auto;
		white-space: nowrap;
		// max-width: calc(100vw - 730px);
		width: 100%;

		&::-webkit-scrollbar {
			width: 4px;
			height: 4px;
			display: block;
		}
		&::-webkit-scrollbar-track {
			background: rgb(239, 239, 239);
		}
		&::-webkit-scrollbar-thumb {
			background: #dadada;
			border-radius: 2px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #c3c3c3;
		}

		&.expend {
			height: calc(100% - 70px);
		}
	}

	@media screen and (min-width : 1600px) {

		.box-left {
			width: 300px;
		}
	}

	@media screen and (max-width : 1599px) {

		.box-left {
			width: 300px;
		}
	}

	@media screen and (max-width : 1359px) {

		.box-left {
			width: 300px;
            // position: relative;
		}
	}
</style>
