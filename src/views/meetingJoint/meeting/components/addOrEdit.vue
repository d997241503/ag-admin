<template>
	<el-dialog :title="!form.id ? '新增' : '修改'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
	<!-- <div class="tier-page"> -->
		<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="150px"
		 label-position="right">
			<el-form-item label="议题详情：" prop="meetingName">
				<el-input style="width: 86%;" v-model="form.meetingName" placeholder="请输入议题详情" clearable
				></el-input>
			</el-form-item>
			<el-form-item label="事项类型：" prop="eventType">
				<el-select style="width: 86%;" multiple v-model="form.eventType" placeholder="请选择">
					<el-option
					v-for="item in superviseJointMeetingEventType"
					:key="item.code"
					:label="item.value"
					:value="item.code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="会议时间：" prop="meetingTime">
				<el-date-picker style="width: 86%;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" v-model="form.meetingTime"
					type="datetime" placeholder="请选择">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="任务/监督：" prop="implementationDetails">
				<el-select style="width: 86%;" v-model="form.meetingType" clearable placeholder="请选择" @change="valueChange" @clear="valueClear">
					<el-option v-for="item in valueType" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="taskVisible" label="具体开展：">
				<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
			</el-form-item>
			<el-form-item v-if="superviseVisible" label="具体开展：" prop="implementationDetails">
				<el-input style="width: 86%;" v-model="form.implementationDetails" placeholder="请输入监督项" clearable
				></el-input>
			</el-form-item>
			<el-form-item label="整改过程：" prop="rectificationProcess">
				<el-select style="width: 86%;" multiple v-model="form.rectificationProcess" placeholder="请选择">
					<el-option
					v-for="item in JointMeetingRec"
					:key="item.code"
					:label="item.value"
					:value="item.code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="整改复查：" prop="rectificationReview">
				<el-input style="width: 86%;" v-model="form.rectificationReview" placeholder="请输入整改复查" clearable
				></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="create('form')">确定</el-button>
		</span>
		<!-- <div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">返 回</el-button>
			<el-button v-if="operation == 'edit'" type="primary" @click="update('form')" :loading="loading">修 改</el-button>
			<el-button v-else type="primary" @click="create('form')" :loading="loading">提
				交</el-button>
		</div> -->
	</el-dialog>
		<!-- <UserDialog v-if="userVisible" ref="userDialog" @refreshData="getUserInfo"></UserDialog> -->
	</div>
</template>

<script>
	// import UserDialog from './components/userDialog';
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		addMeetingdetails,
		getMeetingdetailsObj
	} from 'api/meeting/index';
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
				visible: false,
				flag: false,
				fileOrNotNoteVisible: false,
				form: {
					id: undefined,
					meetingTime: undefined,
					eventType: [],
					meetingName: undefined,
					meetingType: undefined,
					implementationFile: [],
					implementationDetails: undefined,
					rectificationProcess: [],
					rectificationReview: undefined
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
					meetingName: {
						required: true,
						message: '议题详情不能为空',
						trigger: 'blur'
					},
					eventType: {
						required: true,
						message: '请选择事项类型',
						trigger: 'change'
					}
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
				superviseJointMeetingEventType: [],
				JointMeetingRec: [],
				uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=meetingjoint`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray: [],
				method: '',
			}
		},
		components: {
			// UserDialog
			UploadFiles
		},
		created() {
			// 获取联席会成员职务分类
			this.getDataDicts("superviseJointMeetingEventType").then((res) => {
				this.superviseJointMeetingEventType = res;
			});
			// 获取监督联席会整改过程
			this.getDataDicts("JointMeetingRec").then((res) => {
				this.JointMeetingRec = res;
			});
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
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
				this.visible = true;
				// this.$nextTick(() => {
				// 	this.resetTemp();
				// })
				if (id) {
					getMeetingdetailsObj(id)
						.then(response => {
							this.form = response.data;
							if(response.data.meetingType == '0') this.taskVisible = true;
							if(response.data.meetingType == '1') this.superviseVisible = true;
							if (this.form.implementationFile && this.form.implementationFile.length) {
								this.fileArray = this.form.implementationFile.map(item => { return {name: this.formatFile(item),
									response: {fileUrl: item}}})
								this.$nextTick(() => {
									this.$refs.uploadFiles.init(this.fileArray);
								})
							}
							this.$nextTick(() => {
								this.$refs.form.clearValidate();
							});
						});
				} else {
					this.$nextTick(() => {
						this.resetTemp();
					})
				}
			},

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
					this.form.implementationFile = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
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
						addMeetingdetails(this.form, this.method)
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
					meetingTime: undefined,
					eventType: undefined,
					meetingName: undefined,
					implementationFile: [],
					implementationDetails: undefined,
					rectificationProcess: undefined,
					rectificationReview: undefined
				};
			}
		}
	}
</script>

<style scoped>
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
</style>
