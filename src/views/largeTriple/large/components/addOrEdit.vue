<template>
	<el-dialog :title="!form.id ? '新增' : '编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<div class="page-form">
			<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="150px"
			label-position="right">
				<el-form-item label="单位：" prop="inspectionObjectName">
					<el-input style="width: 86%;" v-model="form.orgName" placeholder="点击右侧按钮选择单位" readonly>
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
				<el-form-item label="会议类型：" prop="conferenceType">
					<el-select style="width: 86%;" multiple v-model="form.conferenceType" placeholder="请选择" clearable>
						<el-option
							v-for="item in largeTripleEventList"
							:key="item.id"
							:label="item.type"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会议名称：" required>
					<div class="personnel-row">
						<div style="width:25px;text-align:center;">第</div>
						<div class="item-gird-number">
							<el-form-item prop="conferenceNum">
								<el-input v-model="form.conferenceNum" type="number" min="0" placeholder="请输入" clearable
								></el-input>
							</el-form-item>
						</div>
						<div style="width:25px;text-align:center;">次</div>
						<div class="item-gird">
							<el-form-item prop="conferenceName">
								<el-input v-model="form.conferenceName" placeholder="请输入" clearable
								></el-input>
							</el-form-item>
						</div>
						<div style="width:50px;text-align:center;">会议</div>
					</div>
				</el-form-item>
				<el-form-item label="会议时间：" prop="conferenceTime">
					<el-date-picker style="width: 86%;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" v-model="form.conferenceTime"
						align="right" type="datetime" placeholder="请选择">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="会议地点：" prop="place">
					<el-input style="width: 86%;" v-model="form.place" placeholder="请输入会议地点" clearable
					></el-input>
				</el-form-item>
				<el-form-item label="主持人：" prop="compere" class="box-form">
					<el-button @click="personnelFistHandle('主持人')" type="text"
						class="but-css">
						批量选择人员
						<span>(已选{{form.compere.length ? form.compere.length : 0}}人)</span>
					</el-button>
					<el-select v-if="personnelFistVisible" style="width: 86%;height: 40px;" class="input-item elinput input-select" v-model="form.compere" multiple @focus="closeIt" ref="selectIt"
					placeholder="">
					</el-select>
				</el-form-item>
				<el-form-item label="参会人员：" prop="conferee" class="box-form">
					<el-button @click="personnelFistHandle('参会人员')" type="text"
						class="but-css">
						批量选择人员
						<span>(已选{{form.conferee.length ? form.conferee.length : 0}}人)</span>
					</el-button>
					<el-select v-if="personnelFistVisible" style="width: 86%;height: 40px;" class="input-item elinput input-select" v-model="form.conferee" multiple @focus="closeIt1" ref="selectIt1"
					placeholder="">
					</el-select>
				</el-form-item>
				<el-form-item label="列席人员：" prop="attendeeName" class="box-form">
					<div class="attendee-select">
					<div>
						<el-button @click="personnelFistHandle('列席人员')" type="text"
							class="but-css">
							批量选择人员
							<span>(已选{{form.attendee.length ? form.attendee.length : 0}}人)</span>
						</el-button>
						<el-select v-if="personnelFistVisible" style="width: 180px;height: 40px;" class="input-item elinput input-select" v-model="form.attendeeName" multiple @focus="closeIt2" ref="selectIt2"
						placeholder="">
						</el-select>
					</div>
					<!-- <el-button @click="personnelFistHandle('列席人员')" type="text"
						class="but-css">
						批量选择人员
						<span>(已选{{form.attendee.length ? form.attendee.length : 0}}人)</span>
					</el-button>
					<el-select v-if="personnelFistVisible" style="width: 180px;height: 40px;" class="input-item elinput input-select" v-model="form.attendeeName" multiple @focus="closeIt2" ref="selectIt2"
					@remove-tag="attendeeRemoveTag" placeholder="" @clear="attendeeClear">
					</el-select> -->
					<div class="attendee-input" style="flex: 1;">
						<el-input v-model="form.attendeeTxt" placeholder="请输入其他人员" clearable
						></el-input>
					</div>
					</div>
				</el-form-item>
				<!-- <el-form-item label="列席人员：" prop="attendeeTxt">
					<el-input style="width: 86%;" v-model="form.attendeeTxt" placeholder="请输入" clearable
					></el-input>
				</el-form-item> -->
				<el-form-item label="备注：" prop="remark">
					<el-input style="width: 86%;" v-model="form.remark" type="textarea" rows="4" maxlength="500" resize="none"
					placeholder="请输入备注"></el-input>
				</el-form-item>
				<div class="form-sign" v-for="(item, index) in form.events" :key="index">
						<el-form-item label="研究议题：" :prop="'events.' + index + '.conferenceEvent'" style="margin-top: 22px;"
							:rules="{ required: true, message: '研究议题不能为空', trigger: 'blur' }">
							<div class="form-member">
								<el-input style="width: 86%;" v-model="form.events[index].conferenceEvent" placeholder="请输入研究议题" clearable
								></el-input>
								<div v-if="isSameDayBefore(form.conferenceTime) || !form.conferenceTime" class="item-btn">
									<span class="btn-info" v-show="index == form.events.length - 1"
										@click="itemAdd('events')"><i
											class="el-icon-circle-plus-outline"></i></span>
									<span class="btn-info" v-show="form.events.length > 1"
										@click="itemDel('events',index)"><i
											class="el-icon-remove-outline"></i></span>
								</div>
							</div>
						</el-form-item>
					<!-- <el-form-item label="事项类别：" prop="eventType">
						<el-select style="width: 86%;" v-model="form.events[index].eventType" placeholder="请选择" clearable>
							<el-option
							v-for="item in conferenceTypeList"
							:key="item.id"
							:label="item.conferenceTypeEvent"
							:value="item.id">
							</el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item label="汇报人员：" :prop="'events.' + index + '.reportingPersonName'" class="box-form"
						:rules="{ required: true, message: '请选择汇报人员', trigger: 'change' }">
						<el-button @click="personnelFistHandle('汇报人员',index)" type="text"
							class="but-css">
							批量选择人员
							<span>(已选{{form.events[index].reportingPerson.length ? form.events[index].reportingPerson.length : 0}}人)</span>
						</el-button>
						<el-select v-if="personnelFistVisible" style="width: 86%;height: 40px;" class="input-item elinput input-select" v-model="form.events[index].reportingPersonName" multiple @focus="closeIt3(index)" :ref="`selectIt3${index}`"
							placeholder="">
						</el-select>
					</el-form-item>
					<!-- :rules="{ required: true, message: '决策情况不能为空', trigger: 'change' }" -->
					<el-form-item label="决策情况：" :prop="'events.' + index + '.decisionSituation'"
						>
						<el-select style="width: 86%;" v-model="form.events[index].decisionSituation" placeholder="请选择" clearable>
							<el-option
							v-for="item in largeTripleSituation"
							:key="item.code"
							:label="item.value"
							:value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<!-- :rules="{ required: true, message: '决策情况说明不能为空', trigger: 'blur' }" -->
					<el-form-item v-if="form.events[index].decisionSituation" label="决策情况说明：" :prop="'events.' + index + '.decisionSituationNote'"
						>
						<el-input style="width: 86%;" v-model="form.events[index].decisionSituationNote" type="textarea" rows="4" maxlength="500" placeholder="请输入决策情况说明" clearable
						></el-input>
					</el-form-item>
					<el-form-item label="相关文件：">
						<UploadFiles :ref="`uploadFiles`+index" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="index"
							:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
							@refreshData="getFiles"></UploadFiles>
					</el-form-item>
					<!-- <el-form-item label="纪检意见：" prop="disciplineInspectionOpinion">
						<el-select style="width: 86%;" v-model="form.events[index].disciplineInspectionOpinion" placeholder="请选择" clearable @change="disciplineInspectionOpinionChange">
							<el-option
							v-for="item in largeTripleOpinion"
							:key="item.code"
							:label="item.value"
							:value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="form.events[index].disciplineInspectionOpinion == '2' || form.events[index].disciplineInspectionOpinion == '3'" label="纪检意见说明：" prop="disciplineInspectionOpinionNote">
						<el-input style="width: 86%;" v-model="form.events[index].disciplineInspectionOpinionNote" placeholder="请输入" clearable
						></el-input>
					</el-form-item> -->
				</div>
				<!-- <el-form-item label="会议纪要：" style="margin-top: 22px;">
					<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="-1"
						:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size" :disabled="disabled"
						@refreshData="getFiles"></UploadFiles>
				</el-form-item> -->
				<!-- <el-form-item label="相关文件：">
					<UploadFiles ref="uploadFiles2" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="2"
						:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
						@refreshData="getFiles"></UploadFiles>
				</el-form-item> -->
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</span>
		<!-- <div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">返 回</el-button>
			<el-button v-if="operation == 'edit'" type="primary" @click="update('form')" :loading="loading">修 改</el-button>
			<el-button v-else type="primary" @click="create('form')" :loading="loading">提
				交</el-button>
		</div> -->
		<!-- 弹窗 选择人员 -->
		<fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
	</el-dialog>
		<!-- <UserDialog v-if="userVisible" ref="userDialog" @refreshData="getUserInfo"></UserDialog> -->
	<!-- </div> -->
</template>

<script>
	import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	// import UserDialog from './components/userDialog';
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		simpleList,
		typeList,
		addConferenceRecord,
		getConferenceRecordObj
	} from 'api/large/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	import {
		toDate
	} from '@/utils'
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		formatFile
	} from 'utils';
	export default {
		name: 'honestReport',
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			return {
				personnelFistVisible: true,
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				visible: false,
				flag: false,
				fileOrNotNoteVisible: false,
				form: {
					id: undefined,
					attendee: [],
					attendeeName: [],
					attendeeTxt: '',
					compere: [],
					compereName: [],
					conferee: [],
					confereeName: [],
					orgId: undefined,
					orgName: '',
					conferenceType: [],
					conferenceName: '',
					conferenceNum: '',
					conferenceTime: '',
					place: '',
					remark: '',
					events: [
						{
							conferenceEvent: '',
							reportingPersonName: [],
							reportingPerson: [],
							decisionSituation: '',
							decisionSituationNote: '',
							relevantDocument: [],
							id: undefined
						}
					],
					relatedDocument: [],
					summaryDocument: []
				},
				value: '',
				taskVisible: false,
				superviseVisible: false,
				supervisionUser: '',
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				rules: {
					conferenceType: {
						required: true,
						message: '请选择会议类型',
						trigger: 'change'
					},
					conferenceNum: {
						required: true,
						message: '会议次数不能为空',
						trigger: 'blur'
					},
					conferenceName: {
						required: true,
						message: '会议名称不能为空',
						trigger: 'blur'
					},
					conferenceTime: {
						required: true,
						message: '请选择会议时间',
						trigger: 'change'
					},
					place: {
						required: true,
						message: '会议地点不能为空',
						trigger: 'blur'
					},
					compere: {
						required: true,
						message: '请选择主持人',
						trigger: 'change'
					},
					conferee: {
						required: true,
						message: '请选择参会人员',
						trigger: 'change'
					},
					// attendeeName: {
					// 	required: true,
					// 	message: '请选择列席人员',
					// 	trigger: 'change'
					// }
				},
				loading: false,
				// treeVisible: false,
				userVisible: false,
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentName'
				// },
				informationSources: [],
				categorys: [],
				subclassCh: [],
				informerWaies: [],
				// 文件上传
				url: '',
				num: 0,
				successNum: 0,
				fileList: [],
				valueType: [
					{label: '任务', value: '0'},
					{label: '监督', value: '1'}
				],
				operation: '',
				conferenceTypeList: [],
				largeTripleEventList: [],
				largeTripleSituation: [],
				largeTripleOpinion: [],
				uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=largetriple`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray: [],
				fileArray2: [],
				method: '',
				personnelFistVisible:false,
				checkedData:[],
				disabled: true
			}
		},
		components: {
			fuhsiSelectPersonnel,
			// UserDialog
			UploadFiles
		},
		watch : {
			'form.conferenceType': {
				handler(newV, oldV) {
					if(newV) this.typeListData();
				},
				immediate: true
			},

			'form.compereName': {
				handler(newV, oldV) {
					if(newV) this.form.compereName = newV;
				},
				immediate: true
			},

			checkedData: {
				handler(newVal, oldVal) {
					if(newVal.label == '主持人') this.form.compereName = [];
					if(newVal.label == '参会人员') this.form.confereeName = [];
					if(newVal.label == '列席人员') this.form.attendeeName = [];
					if(newVal.label == '汇报人员') this.form.events[newVal.personIndex].reportingPersonName = [];
					if(newVal && newVal.resultList && newVal.resultList.length) {
						for(let i=0;i<newVal.resultList.length;i++){
							if(newVal.label == '主持人') this.form.compereName.push(newVal.resultList[i].name);
							if(newVal.label == '参会人员') this.form.confereeName.push(newVal.resultList[i].name);
							if(newVal.label == '列席人员') this.form.attendeeName.push(newVal.resultList[i].name);
							if(newVal.label == '汇报人员') this.form.events[newVal.personIndex].reportingPersonName.push(newVal.resultList[i].name)
						}
					}
					if(newVal.label == '主持人') this.form.compere = newVal.resultList;
					if(newVal.label == '参会人员') this.form.conferee = newVal.resultList;
					if(newVal.label == '列席人员') this.form.attendee = newVal.resultList;
					if(newVal.label == '汇报人员') this.form.events[newVal.personIndex].reportingPerson = newVal.resultList;
					if(this.form.compere && this.form.compere.length) {
						this.$nextTick(() => {
							this.$refs.form.clearValidate('compere');
						})
					}
					if(this.form.conferee && this.form.conferee.length) {
						this.$nextTick(() => {
							this.$refs.form.clearValidate('conferee');
						})
					}
				},
				immediate: true
			},
		},
		created() {
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			// 会议当天0点前
			isSameDayBefore(time) {
				const nowTimeDate = new Date(new Date(time).getTime())
    			return new Date().getTime() < nowTimeDate.setHours(0, 0, 0, 0) ? true : false;
			},
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
			disciplineInspectionOpinionChange(e) {
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

			goBack() {
				this.$router.go(-1);
			},

			// 初始化当前页面
			init(id) {
				this.personnelFistVisible=true;
				this.visible = true;
				this.getTreeInfo();
				this.getDataList();
				// 获取三重一大决策情况
				this.getDataDicts("largeTripleSituation").then((res) => {
					this.largeTripleSituation = res;
				});
				// 获取三重一大纪检意见
				this.getDataDicts("largeTripleOpinion").then((res) => {
					this.largeTripleOpinion = res;
				});
				// this.$nextTick(() => {
				// 	this.resetTemp();
				// })
				if (id) {
					getConferenceRecordObj(id)
						.then(response => {
							this.form = response.data;
							if(response.data.compere && response.data.compere.length) this.form.compereName = response.data.compere.map(item => {return item.name});
							if(response.data.conferee && response.data.conferee.length) this.form.confereeName = response.data.conferee.map(item => {return item.name});
							if(response.data.attendee && response.data.attendee.length) this.form.attendeeName = response.data.attendee.map(item => {return item.name});
							if(!response.data.compere) {
								 this.form.compere = [];
								 this.form.compereName = [];
							};
							if(!response.data.conferee) {
								 this.form.conferee = [];
								 this.form.confereeName = [];
							};
							if(!response.data.attendee) {
								 this.form.attendee = [];
								 this.form.attendeeName = [];
							};
							// 相关文件
							if(this.form.events && this.form.events.length) {
								for(let i = 0; i < this.form.events.length; i++) {
									this['fileArray'+i] = []
									this['fileArray'+i] =  this.form.events[i].relevantDocument.map(item => { return {name: this.formatFile(item),
										response: {fileUrl: item}}})
									this.$nextTick(() => {
										this.$refs['uploadFiles'+i][0].init(this['fileArray'+i]);
									})
									this.form.events[i].reportingPersonName = response.data.events[i].reportingPerson.map(item => {return item.name});
								}
							}
							// // 纪要文件
							// if (this.form.summaryDocument && this.form.summaryDocument.length) {
							// 	this.fileArray = this.form.summaryDocument.map(item => { return {name: this.formatFile(item),
							// 		response: {fileUrl: item}}})
							// 	this.$nextTick(() => {
							// 		this.$refs.uploadFiles.init(this.fileArray);
							// 	})
							// }
							// if(new Date().getTime()>new Date(this.form.conferenceTime).getTime()) this.disabled = false;
							// else this.disabled = true;
							this.$nextTick(() => {
								this.$refs.form.clearValidate();
							});
						});
				} else {
					// this.disabled = true;
					this.$nextTick(() => {
						this.resetTemp();
						// this.$refs.uploadFiles.init([]);
						this.$refs.uploadFiles0[0].init([]);
					})
				}
			},

			handlePartyBranch(data) {
				this.form.orgId = data.id;
				this.form.orgName = data.departmentFullName;
				this.treeVisible = false;
			},

			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							if(this.treeData && this.treeData[0]) {
								this.form.orgId = this.treeData[0].id;
								this.form.orgName = this.treeData[0].departmentFullName;
							}
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

			// 获取会议题列表
			typeListData() {
				typeList({
					conferenceTypeIds: this.form.conferenceType.join(",")
				}).then(response => {
					if (response.data && response.data.length) {
						this.conferenceTypeList = response.data;
					} else {
						this.conferenceTypeList = [];
					}
				});
			},

			// 新增元素
			itemAdd(field) {
				// if (this.form[field].length >= 10) return this.$message.error("最多添加10条");
				this.form[field].push({
							conferenceEvent: '',
							reportingPersonName: [],
							reportingPerson: [],
							decisionSituation: '',
							decisionSituationNote: '',
							relevantDocument: [],
							id: undefined
						});
			},

			// 删除元素
			itemDel(field, index) {
				this.form[field].splice(index, 1);
			},

			// 批量选择人员
   			personnelFistHandle(label,index) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					this.$refs.personnelFist.personIndex = index;
					if(label == '主持人') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.compere));
					if(label == '参会人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.conferee));
					if(label == '列席人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.attendee));
					if(label == '汇报人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.events[index].reportingPerson));
   	  				this.$refs.personnelFist.init();
    			})
   			},

			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},

			closeIt1() {
				this.$refs.selectIt1.blur();
			},

			closeIt2() {
				this.$refs.selectIt2.blur();
			},

			// 隐藏下拉框
			closeIt3(index) {
				this.$refs[`selectIt3${index}`][0].blur();
			},

			// // 主持人
			// compereRemoveTag(val){
			// 	for(let i = 0; i < this.form.compere.length; i++) {
			// 		if(this.form.compere[i].name == val) {
			// 			this.form.compere.splice(i,1)
			// 			this.$forceUpdate()
			// 		}
			// 	}
			// },

			// compereClear() {
			// 	this.form.compere = [];
			// },

			// // 参会人员
			// confereeRemoveTag(val){
			// 	for(let i = 0; i < this.form.conferee.length; i++) {
			// 		if(this.form.conferee[i].name == val) {
			// 			this.form.conferee.splice(i,1)
			// 			this.$forceUpdate()
			// 		}
			// 	}
			// },

			// confereeClear() {
			// 	this.form.conferee = [];
			// },

			// // 列席人员	
			// attendeeRemoveTag(val){
			// 	for(let i = 0; i < this.form.attendee.length; i++) {
			// 		if(this.form.attendee[i].name == val) {
			// 			this.form.attendee.splice(i,1)
			// 			this.$forceUpdate()
			// 		}
			// 	}
			// },

			// attendeeClear() {
			// 	this.form.compere = [];
			// },

			valueChange(e) {
				if(e == '0') {
					this.superviseVisible = false;					
					this.taskVisible = true;
					this.form.implementationDetails = '';
				} else if(e == '1') {
					this.taskVisible = false;					
					this.superviseVisible = true;
					this.form.implementationFile = [];
				}
			},

			valueClear() {
				this.taskVisible = false;
				this.superviseVisible = false;
			},

			// 获取批量上传文件
			getFiles(data) {
				try {
					// if(data.index == '-1') {
					// 	this.form.summaryDocument = data.files.map(item => {
					// 		return item.response ? item.response.fileUrl : item.url;
					// 	});
					// } else {
						this.form.events[data.index].relevantDocument = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
					// }
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},

			create(formName) {
				this.form.id ? this.method = 'put' : this.method = 'post'
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addConferenceRecord(this.form, this.method)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										// this.goBack();
										this.loading = false;
										this.visible = false;
										this.$emit("refreshDataList")
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

			// // 修改
			// update(formName) {
			// 	this.$confirm('确定进行修改?', '提示', {
			// 			confirmButtonText: '确定',
			// 			cancelButtonText: '取消',
			// 			type: 'warning'
			// 		})
			// 		.then(() => {
			// 			const set = this.$refs;
			// 			set[formName].validate(valid => {
			// 				if (valid) {
			// 					this.loading = true;
			// 					updateObj(this.form).then(res => {
			// 						if (res && res.status === 200) {
			// 							this.$notify({
			// 								title: '成功',
			// 								message: '修改成功',
			// 								type: 'success',
			// 								duration: 2000
			// 							});
			// 							setTimeout(() => {
			// 								this.goBack();
			// 								this.loading = false;
			// 							}, 2000)
			// 						} else {
			// 							this.$notify({
			// 								title: '失败',
			// 								message: res.msg,
			// 								type: 'error',
			// 								duration: 2000
			// 							});
			// 							this.loading = false;
			// 						}
			// 					}).catch(() => {
			// 						this.$notify({
			// 							title: '失败',
			// 							message: '修改选人用人情况失败',
			// 							type: 'error',
			// 							duration: 2000
			// 						});
			// 						this.loading = false;
			// 					});
			// 				} else {
			// 					return false;
			// 				}
			// 			});
			// 		}).catch(() => {

			// 		});
			// },

			// 重置数据
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					id: undefined,
					attendee: [],
					attendeeName: [],
					attendeeTxt: '',
					compere: [],
					compereName: [],
					conferee: [],
					confereeName: [],
					orgId: undefined,
					orgName: '',
					conferenceType: [],
					conferenceName: '',
					conferenceNum: '',
					conferenceTime: '',
					place: '',
					remark: '',
					events: [
						{
							conferenceEvent: '',
							reportingPersonName: [],
							reportingPerson: [],
							decisionSituation: '',
							decisionSituationNote: '',
							relevantDocument: [],
							id: undefined
						}
					],
					relatedDocument: [],
					summaryDocument: []
				};
				this.conferenceTypeList = [];
				this.largeTripleEventList = [];
				this.largeTripleSituation = [];
				this.largeTripleOpinion = [];
			}
		}
	}
</script>

<style lang="scss" scoped>

	.page-form {
		max-height: 600px;
		overflow-x: auto;
	}

	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}

	.page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: -24px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}

	.select-item>>>.el-radio {
		min-width: 140px;
	}

	 .el-icon-close:before {
		content: "\E78D";
	}

	.personnel-row {
		width: 86%;
		display: flex;
		justify-content: space-between;

		.item-gird-number {
			width: 20%;
			text-align: center;
			// border: 0.0625rem solid #EFEFEF;
			border-radius: 10px;
			font-size: 15px;
		}

		.item-gird {
			width: 56%;
			text-align: center;
			// border: 0.0625rem solid #EFEFEF;
			border-radius: 10px;
			font-size: 15px;
		}
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
		/deep/ .el-select .el-input .el-select__caret {
			display: none;
		}

		.but-css{
			border: 1px dashed rgb(188,0,0);
			color:rgb(188,0,0);
			// position:fixed;
			position: absolute;
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

	.form-member {
		display: flex;
		// margin-bottom: 10px;

		.item-btn {
			// position: absolute;
			width: 5%;
    		min-width: 80px;
			// top: 11px;
			right: -25px;
			padding: 0 10px;

			.btn-info,
			.btn-info {
				font-size: 17px;
				margin-right: 10px;
			}

			.btn-info:hover {
				font-weight: bold;
				color: #000;
				cursor: pointer;
			}
		}
	}
	
	.form-sign {
		border-top: 1px dashed #bc0000;
    	border-bottom: 1px dashed #bc0000;
	}

	.input-select {
		>>> .el-select__tags {
			display: none !important;
		}
	}

	.attendee-select {
		display: flex;
		width: 86%;

		>>> .el-select .el-input__inner {
			border-right: 0;
			border-top-right-radius: 0%;
			border-bottom-right-radius: 0%;
		}

		.attendee-input {
			>>> .el-input--suffix .el-input__inner {
				// border-left: 0;
				border-top-left-radius: 0%;
				border-bottom-left-radius: 0%;
			}
		}
	}
</style>
