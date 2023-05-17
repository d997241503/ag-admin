<template>
	<div>
        <span class="content-title">实施过程：</span>
        <div class="content-form" style="width: 70%;margin:10px auto;min-width: 925px;">
            <el-form :model="baseDataForm" ref="baseDataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
                label-width="150px" :rules="rules">
                <el-form-item>
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="margin-left: 85%;">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>
                    <el-input class="form-item input-info" v-model="baseDataForm.otherInfoRecord" clearable placeholder="请输入其他" :readonly="readonly"
				 ></el-input>
                </el-form-item>
                <el-form-item label="实施过程文件：" prop="processFiles">
                    <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
                        :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
                        @refreshData="getFiles"></UploadFiles>
                </el-form-item>
            </el-form>
        </div>
        <el-divider></el-divider>
        <div>
            <span class="content-title">巡查周例会：</span>
            <div style="width: 70%;margin:10px auto;min-width: 925px;">
                <el-table :data="dataList" border v-loading="dataListLoading" fit highlight-current-row>
                    <el-table-column header-align="center" align="center" type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="meetingTime" header-align="center" align="center" min-width="150" label="周例会时间">
                        <template slot-scope="scope">
							<el-date-picker v-model="dataList[scope.$index].meetingTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期"></el-date-picker>
                            <!-- <el-form-item  
								>
								<el-input v-model="dataList[0].meetingTime"  maxlength="20" readonly></el-input>
							</el-form-item> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="weeklyMeetingFiles" header-align="center" align="center" min-width="250" label="文件">
                        <template slot-scope="scope">
                            <UploadFiles :ref="`uploadFiles${scope.$index+1}`" :btnText="uploadFile1.textFirst" :url="uploadFile1.url" :index="scope.$index+2"
								:accepts="uploadFile1.accepts" :limit="uploadFile1.limit" :size="uploadFile1.size"
								@refreshData="getFiles"></UploadFiles>
                        </template>
                    </el-table-column>
                    <el-table-column prop="note" header-align="center" align="center" width="100" label="备注">
                        <template slot-scope="scope">
							<el-input v-model="dataList[scope.$index].note"></el-input>
                            <!-- <el-form-item  
								>
								<el-input v-model="dataList[0].note"  maxlength="20" readonly></el-input>
							</el-form-item> -->
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <span class="content-title-format">*支持doc、docx、xls、xlsx、pdf、jpg、png格式</span> -->
				<div @click="addBasis()" class="add-basis">+</div>
            </div>
        </div>
		<div style="width:100%;margin: 50px auto;text-align: center;">
			<el-button type="primary" style="width:180px;" @click="baseDataFormSubmit()" :loading="subLoading">确定</el-button>
			<el-button v-if="operation == 'add'" type="primary" style="width:180px;" @click="reportAdd()" :loading="subLoading">添加整改报告</el-button>
		</div>
	</div>
</template>
<script>
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		mapGetters
	} from 'vuex';
	import {
		getProcessObj,
		addProcessObj,
		updateProcessObj,
		getMeetingObj,
		addMeetingObj,
		updateMeetingObj,
		delMeetingObj
	} from 'api/patrol/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		formatFile
	} from 'utils';
    const cityOptions = ['召开见面及动员会', '问卷调查', '听取工作汇报', '个别谈话','受理信访', '审阅材料', '深入了解', '其他'];
	export default {
		data() {
			this.rules = {
				processFiles: [
					{ 
						required: true, 
						validator: (rule, val, cb) => {
							if (!val.length) return cb(new Error('请上传文件'))
							cb()
						} 
					}
				],
			}
			return {
				dataListLoading: false,
                checkAll: false,
                checkedCities: [],
                cities: cityOptions,
                isIndeterminate: true,
				baseDataForm: {
					handlingLettersAndVisits: false,
					individualTalk: false,
					insight: false,
					inspectionRecordId: undefined,
					listenEnterpriseWorkReport: false,
					meetMobilizationMeeting: false,
					otherInfo: false,
					otherInfoRecord: '',
                    processFiles: [],
                    questionnaireSurvey: false,
                    reviewMaterials: false
				},
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				subLoading: false,
				dictType: "examType",
				examTypes: [],
				uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				uploadFile1: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray: [],
				fileArray1: [],
				dataList: [
					{inspectionRecordId: '',meetingTime: '',note: '',weeklyMeetingFiles: []}
				],
				isMeeting: false,
				readonly: true,
				operation: '',
				disabled: true
			}
		},
		// props: {
		// 	dateId: {
		// 		type: Number
		// 	}
		// },
		components: {
			UploadFiles
		},
		computed: {
			...mapGetters([
				'name'
            ]),
            
            multipleState() {
				// 闭包
				return (val) => {
                    // 获取到对应的类型
                    '召开见面及动员会', '问卷调查', '听取工作汇报', '个别谈话','受理信访', '审阅材料', '深入了解', '其他'
					switch (val) {
						case '召开见面及动员会':
							return this.baseDataForm.meetMobilizationMeeting = true;
							break;
						case '问卷调查':
							return this.baseDataForm.questionnaireSurvey = true;
							break;
						case '听取工作汇报':
							return this.baseDataForm.listenEnterpriseWorkReport = true;
                            break;
                        case '个别谈话':
							return this.baseDataForm.individualTalk = true;
							break;
						case '受理信访':
							return this.baseDataForm.handlingLettersAndVisits = true;
							break;
						case '审阅材料':
							return this.baseDataForm.reviewMaterials = true;
                            break;
                        case '深入了解':
							return this.baseDataForm.insight = true;
							break;
						case '其他':
							this.baseDataForm.otherInfo = true;
							this.readonly = false;
							break;
						default:
							break;
					}
				}
			},
		},
		created() {
			this.operation = this.$route.query.operation;
			this.init();
		},
		methods: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
			goBack() {
				this.$router.go(-1);
			},
            handleCheckAllChange(val) {
                this.checkedCities = val ? cityOptions : [];
                if(this.checkedCities.length) {
                    this.baseDataForm.handlingLettersAndVisits = true;
					this.baseDataForm.individualTalk = true;
					this.baseDataForm.insight = true;
					this.baseDataForm.listenEnterpriseWorkReport = true;
					this.baseDataForm.meetMobilizationMeeting = true;
					this.baseDataForm.otherInfo = true;
                    this.baseDataForm.questionnaireSurvey = true;
					this.baseDataForm.reviewMaterials = true;
					this.readonly = false;
                } else {
                    this.baseDataForm.handlingLettersAndVisits = false;
					this.baseDataForm.individualTalk = false;
					this.baseDataForm.insight = false;
					this.baseDataForm.listenEnterpriseWorkReport = false;
					this.baseDataForm.meetMobilizationMeeting = false;
					this.baseDataForm.otherInfo = false;
                    this.baseDataForm.questionnaireSurvey = false;
					this.baseDataForm.reviewMaterials = false;
					this.readonly = true;
                }
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
				this.baseDataForm.handlingLettersAndVisits = false;
				this.baseDataForm.individualTalk = false;
				this.baseDataForm.insight = false;
				this.baseDataForm.listenEnterpriseWorkReport = false;
				this.baseDataForm.meetMobilizationMeeting = false;
				this.baseDataForm.otherInfo = false;
				this.baseDataForm.questionnaireSurvey = false;
				this.baseDataForm.reviewMaterials = false;
				this.readonly = true;
				this.$nextTick(() => {
					for(let i = 0; i < value.length; i++) {
						this.multipleState(value[i])
					}
					if(!this.baseDataForm.otherInfo) this.readonly = true;
					let checkedCount = value.length;
					this.checkAll = checkedCount === this.cities.length;
					this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
				})
            },
			init() {
				this.baseDataForm.inspectionRecordId = this.$route.query.id;
				this.$nextTick(() => {
					this.$refs['baseDataForm'].resetFields();
					if (!this.$route.query.id) {
						this.baseDataForm = {
							handlingLettersAndVisits: false,
                            individualTalk: false,
                            insight: false,
                            inspectionRecordId: undefined,
                            listenEnterpriseWorkReport: false,
                            meetMobilizationMeeting: false,
                            otherInfo: false,
                            otherInfoRecord: '',
                            processFiles: [],
                            questionnaireSurvey: false,
                            reviewMaterials: false
						}
					} else {
						// this.baseDataForm.id = this.$route.query.id;
						if (this.$route.query.operation !== 'add') this.getBaseDateDetail();
					}
				})
			},

			// 获取基础信息详情
			getBaseDateDetail(val) {
				getProcessObj(this.baseDataForm.inspectionRecordId)
					.then(response => {
						this.baseDataForm = response.data;
						if(this.baseDataForm.handlingLettersAndVisits) this.checkedCities.push('受理信访');
						if(this.baseDataForm.individualTalk) this.checkedCities.push('个别谈话');
						if(this.baseDataForm.insight) this.checkedCities.push('深入了解');
						if(this.baseDataForm.listenEnterpriseWorkReport) this.checkedCities.push('听取工作汇报');
						if(this.baseDataForm.meetMobilizationMeeting) this.checkedCities.push('召开见面及动员会');
						if(this.baseDataForm.otherInfo) this.checkedCities.push('其他');
						if(this.baseDataForm.questionnaireSurvey) this.checkedCities.push('问卷调查');
						if(this.baseDataForm.reviewMaterials) this.checkedCities.push('审阅材料');
						if (this.baseDataForm.processFiles) {
							this.fileArray = this.baseDataForm.processFiles.map(item => { return {name: this.formatFile(item),
								response: {fileUrl: item}}})
							this.$nextTick(() => {
								this.$refs.uploadFiles.init(this.fileArray);
							})
						}
					});
				getMeetingObj(this.baseDataForm.inspectionRecordId)
					.then(response => {
						this.dataList = response.data;
						if(this.dataList.length) this.isMeeting = true;
						if (this.dataList) {
							for(let i = 0; i < this.dataList.length; i++) {
								this['fileArray'+i+1] = []
								this['fileArray'+i+1] = this.dataList[i].weeklyMeetingFiles.map(item => { return {name: this.formatFile(item),
									response: {fileUrl: item}}})
								this.$nextTick(() => {
									this.$refs[`uploadFiles${i+1}`].init(this['fileArray'+i+1]);
								})
							}
						}
					});
			},

			addBasis() {
				this.dataList.push({inspectionRecordId: '',meetingTime: '',note: '',weeklyMeetingFiles: []})
			},

			// 表单提交
			baseDataFormSubmit(next) {
				this.$refs['baseDataForm'].validate((valid) => {
					if (valid) {
						this.subLoading = true;
						if (this.operation !== 'edit') {
							this.addProcess(next);
							this.addMeeting(next);
						} else {
							if(this.isMeeting) {
								this.updateProcess();
								this.updateMeeting();
							} else {
								this.updateProcess();
								this.addMeeting();
							}
						}
					}
				})
			},

			// 添加整改报告
			reportAdd() {
				this.baseDataFormSubmit('next');
			},

			addProcess(next) {
				addProcessObj(this.baseDataForm)
					.then((res) => {
						if (res && res.status === 200) {
							if(this.dataList.length == 1 && !this.dataList[0].meetingTime && this.dataList[0].weeklyMeetingFiles.length == 0 && !this.dataList[0].note) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000,
									onClose: () => {
										// if (!this.baseDataForm.dateId) {
										// 	this.baseDataForm.dateId = res.data.dateId;
										// 	this.getBaseDateDetail('second');
										// } else {
										// 	this.getBaseDateDetail('second');
										// }
										if(next) {
											this.$nextTick(() => {
												this.$router.push({
													path: '/newlyPatrolInternal',
													query: {
														operation: 'add',
														id: this.$route.query.id,
														name: 'third'
													}
												})
											})
										} else {
											this.goBack();
										}
										this.subLoading = false;
									}
								});
							}
						
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 2000,
								onClose: () => {
									this.subLoading = false;
								}
							});
						}
					}).catch(() => {
						this.subLoading = false;
					})
			},

			addMeeting(next) {
				this.subLoading = true;
				for(let i = 0 ; i < this.dataList.length; i++) {
					this.dataList[i].inspectionRecordId = this.$route.query.id
					if(this.dataList[i].meetingTime || this.dataList[i].weeklyMeetingFiles.length || this.dataList[i].note) {
						addMeetingObj(this.dataList[i])
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000,
										onClose: () => {
											if(next) {
												this.$nextTick(() => {
													this.$router.push({
														path: '/newlyPatrolInternal',
														query: {
															operation: 'add',
															id: this.$route.query.id,
															name: 'third'
														}
													})
												})
											} else {
												this.goBack();
											}
											this.subLoading = false;
										}
									});
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000,
										onClose: () => {
											this.subLoading = false;
										}
									});
								}
							}).catch(() => {
								this.subLoading = false;
						})
					}
				}
			},

			updateProcess() {
				updateProcessObj(this.baseDataForm)
					.then((res) => {
						if (res && res.status === 200) {
							if(this.dataList.length == 0 || (this.dataList.length == 1 && !this.dataList[0].meetingTime && this.dataList[0].weeklyMeetingFiles.length == 0 && !this.dataList[0].note)) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000,
									onClose: () => {
										// if (!this.baseDataForm.dateId) {
										// 	this.baseDataForm.dateId = res.data.dateId;
										// 	this.getBaseDateDetail('second');
										// } else {
										// 	this.getBaseDateDetail('second');
										// }
										this.goBack();
										this.subLoading = false;
									}
								});
							}
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 2000,
								onClose: () => {
									this.subLoading = false;
								}
							});
						}
					}).catch(() => {
						this.subLoading = false;
					})
			},

			updateMeeting() {
				this.subLoading = true;
				for(let i = 0 ; i < this.dataList.length; i++) {
					this.dataList[i].inspectionRecordId = this.$route.query.id
					updateMeetingObj(this.dataList[i])
						.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功',
									type: 'success',
									duration: 2000,
									onClose: () => {
										this.goBack();
										this.subLoading = false;
									}
								});
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 2000,
									onClose: () => {
										this.subLoading = false;
									}
								});
							}
						}).catch(() => {
							this.subLoading = false;
						})
				}
			},

			// 获取批量上传文件
			getFiles(data) {
				try {
					if(data.index == 1) {
						this.baseDataForm.processFiles = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
					}
					this.$nextTick(() => {
                      this.$refs.baseDataForm.clearValidate('processFiles');
                    })
					if(data.index > 1) {
						this.dataList[data.index-2].weeklyMeetingFiles = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
					}
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},
		}

	}
</script>
<style lang="scss" scoped>
    .content-title {
        font-size: 17px;
        margin-left: 20px;
    }
    .content-title-format {
        font-size: 17px;
    }
	.goback-info {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.form-item {
		width: 100%;
	}

	/* 	.input-info>>>.el-input__count-inner {
		height: 33px;
	}

	.textarea-info>>>.el-textarea__inner {
		padding-right: 50px;
	} */

	.go-handle {
		font-weight: 700;
		cursor: pointer;
	}

	.go-handle:hover {
		color: #FF4C52;
	}

	.tab-info {
		margin-top: 20px;
	}

	.tab-content {
		padding: 10px 20px;
	}

	.download-template {
		width: 90px;
		float: right;
		margin-top: 0;
		margin-right: -90px;
		text-align: center;
		color: #666;
		text-decoration: underline;
	}

	.download-template:hover {
		color: #888;
		cursor: pointer;
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

	.content-form /deep/ .el-checkbox-group {
		display: inline-block;
		width: 70%;
		min-width: 646px;
	}

	.content-form /deep/ .el-checkbox {
		width: 35%;
	}

	.content-form /deep/ .form-item {
		width: 35%;
		margin-left: -35%;
	}
</style>
