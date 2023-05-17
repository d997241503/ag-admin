<template>
	<el-dialog title="添加临时议题" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<div class="page-form">
			<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="150px"
			label-position="right">
				<!-- <el-form-item label="是否添加临时议题：" prop="place">
					<el-radio v-model="form.radio" label="1">是</el-radio>
  					<el-radio v-model="form.radio" label="2">否</el-radio>
				</el-form-item> -->
				 <!-- v-if="form.radio == '1'" -->
				<div class="form-multiple">
					<div class="form-sign" v-for="(item, index) in form.temporaryRecords" :key="index">
							<el-form-item label="研究议题：" :prop="'temporaryRecords.' + index + '.conferenceEvent'" style="margin-top: 22px;"
								:rules="{ required: true, message: '研究议题不能为空', trigger: 'blur' }">
								<div class="form-member">
									<el-input style="width: 86%;" v-model="form.temporaryRecords[index].conferenceEvent" placeholder="请输入研究议题" clearable
									></el-input>
									<div class="item-btn">
										<span class="btn-info" v-show="index == form.temporaryRecords.length - 1"
											@click="itemAdd('temporaryRecords')"><i
												class="el-icon-circle-plus-outline"></i></span>
										<span class="btn-info" v-show="form.temporaryRecords.length > 1"
											@click="itemDel('temporaryRecords',index)"><i
												class="el-icon-remove-outline"></i></span>
									</div>
								</div>
							</el-form-item>
						<el-form-item label="汇报人员：" :prop="'temporaryRecords.' + index + '.reportingPersonName'" class="box-form"
							:rules="{ required: true, message: '请选择汇报人员', trigger: 'change' }">
							<el-button @click="personnelFistHandle('汇报人员',index)" type="text"
								class="but-css">
								批量选择人员
								<span>(已选{{form.temporaryRecords[index].reportingPerson.length ? form.temporaryRecords[index].reportingPerson.length : 0}}人)</span>
							</el-button>
							<el-select v-if="personnelFistVisible" style="width: 86%;height: 40px;" class="input-item elinput input-select" v-model="form.temporaryRecords[index].reportingPersonName" multiple @focus="closeIt(index)" :ref="`selectIt${index}`"
								placeholder="">
							</el-select>
						</el-form-item>
						<!-- :rules="{ required: true, message: '决策情况不能为空', trigger: 'change' }" -->
						<el-form-item label="决策情况：" :prop="'temporaryRecords.' + index + '.decisionSituation'"
							>
							<el-select style="width: 86%;" v-model="form.temporaryRecords[index].decisionSituation" placeholder="请选择" clearable>
								<el-option
								v-for="item in largeTripleSituation"
								:key="item.code"
								:label="item.value"
								:value="item.code">
								</el-option>
							</el-select>
						</el-form-item>
						<!-- :rules="{ required: true, message: '决策情况说明不能为空', trigger: 'blur' }" -->
						<el-form-item v-if="form.temporaryRecords[index].decisionSituation" label="决策情况说明：" :prop="'temporaryRecords.' + index + '.decisionSituationNote'"
							>
							<el-input style="width: 86%;" v-model="form.temporaryRecords[index].decisionSituationNote" type="textarea" rows="4" maxlength="500" placeholder="请输入决策情况说明" clearable
							></el-input>
						</el-form-item>
						<el-form-item label="相关文件：">
							<UploadFiles :ref="`uploadFiles`+index" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="index"
								:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
								@refreshData="getFiles"></UploadFiles>
						</el-form-item>
					</div>
				</div>
				<!-- <el-form-item label="意见选择：" prop="disciplineInspectionOpinion" style="margin-top: 22px;">
					<el-select style="width: 86%;" v-model="form.disciplineInspectionOpinion" placeholder="请选择" clearable @change="disciplineInspectionOpinionChange">
						<el-option
						v-for="item in largeTripleOpinion"
						:key="item.code"
						:label="item.value"
						:value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="意见说明：" prop="note">
					<el-input style="width: 86%;" v-model="form.disciplineInspectionOpinionNote" type="textarea" rows="4" maxlength="500" resize="none"
					placeholder="请输入意见说明"></el-input>
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
		addTemporary
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
					radio: '2',
					temporaryRecords: [
						{
							conferenceEvent: '',
							reportingPersonName: [],
							reportingPerson: [],
							decisionSituation: '',
							decisionSituationNote: '',
							relevantDocument: [],
							id: undefined,
						}
					],
					disciplineInspectionOpinion: '',
					disciplineInspectionOpinionNote: '',
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
					// disciplineInspectionOpinion: {
					// 	required: true,
					// 	message: '请选择意见',
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
				fileArray1: [],
				fileArray2: [],
				method: '',
				personnelFistVisible:false,
				checkedData:{},
				id: undefined
			}
		},
		components: {
			fuhsiSelectPersonnel,
			// UserDialog
			UploadFiles
		},
		watch : {
			// 'form.radio': {
			// 	handler(newV, oldV) {
			// 		if(newV) this.form.temporaryRecords = [
			// 			{
			// 				conferenceEvent: '',
			// 				reportingPersonName: [],
			// 				reportingPerson: [],
			// 				decisionSituation: '',
			// 				decisionSituationNote: '',
			// 				relevantDocument: [],
			// 				id: undefined,
			// 			}
			// 		]
			// 	},
			// 	immediate: true
			// },

			checkedData: {
				handler(newVal, oldVal) {
					if(newVal.label == '汇报人员') this.form.temporaryRecords[newVal.personIndex].reportingPersonName = [];
					if(newVal && newVal.resultList && newVal.resultList.length) {
						for(let i=0;i<newVal.resultList.length;i++){
							if(newVal.label == '汇报人员') this.form.temporaryRecords[newVal.personIndex].reportingPersonName.push(newVal.resultList[i].name)
						}
					}
					if(newVal.label == '汇报人员') this.form.temporaryRecords[newVal.personIndex].reportingPerson = newVal.resultList;
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
				this.id = id;
				// 获取三重一大决策情况
				this.getDataDicts("largeTripleSituation").then((res) => {
					this.largeTripleSituation = res;
				});
				// 获取三重一大纪检意见
				this.getDataDicts("largeTripleOpinion").then((res) => {
					this.largeTripleOpinion = res;
				});
				this.$nextTick(() => {
					this.resetTemp();
					this.$refs.uploadFiles0[0].init([]);
				})
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
							id: undefined,
						});
			},

			// 删除元素
			itemDel(field, index) {
				this.form[field].splice(index, 1);
			},

			// 隐藏下拉框
			closeIt(index) {
				this.$refs[`selectIt${index}`][0].blur();
			},

			// 批量选择人员
   			personnelFistHandle(label,index) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					this.$refs.personnelFist.personIndex = index;
					if(label == '汇报人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.temporaryRecords[index].reportingPerson));
   	  				this.$refs.personnelFist.init();
    			})
   			},

			// // 隐藏下拉框
			// closeIt() {
			// 	this.$refs.selectIt.blur();
			// },

			// closeIt1() {
			// 	this.$refs.selectIt1.blur();
			// },

			// closeIt2() {
			// 	this.$refs.selectIt2.blur();
			// },

			// 获取批量上传文件
			getFiles(data) {
				try {
					this.form.temporaryRecords[data.index].relevantDocument = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},

			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addTemporary(this.form.temporaryRecords, this.id )
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
					radio: '2',
					temporaryRecords: [
						{
							conferenceEvent: '',
							reportingPersonName: [],
							reportingPerson: [],
							decisionSituation: '',
							decisionSituationNote: '',
							relevantDocument: [],
							id: undefined,
						}
					],
					disciplineInspectionOpinion: '',
					disciplineInspectionOpinionNote: '',
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

		.item-gird {
			width: 38%;
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

	.form-multiple {
		// .form-sign {
		// 	border-top: 1px dashed #bc0000;
		// 	border-bottom: 1px dashed #bc0000;
		// }

		.form-sign:not(:first-child) {
			border-top: 1px dashed #bc0000;
			border-bottom: 1px dashed #bc0000;
		}
	}

	.input-select {
		>>> .el-select__tags {
			display: none !important;
		}

		>>> .el-input__suffix {
			display: none;
		}
	}
</style>
