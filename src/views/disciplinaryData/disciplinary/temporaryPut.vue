<template>
	<div class="tier-page">
		<!-- <div class="page-content-title">
            <div class="content-text">
                <div slot="header" class="content-title clearfix">
                    <span class="title-label">标题：</span>
                    <span>{{information.title}}</span>
                </div>
                <div slot="header" class="content-title clearfix">
                    <span class="title-label">文号：</span>
                    <span>{{information.textNum}}</span>
                </div>
                <div slot="header" class="clearfix">
                    <span class="title-label">单位及时间：</span>
                    <span>{{information.deptName}};{{information.publicationTime}}</span>
                </div>
            </div>
		</div> -->
        <div class="page-content-title">
            <div slot="header" class="content-title clearfix">
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
                    <!-- <span>{{information.textNum}}</span> -->
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
            </div>
		</div>
        <div class="page-content-form">
            <div slot="header" class="content-title clearfix">
				<span class="title-label title-label-top">临时任务提报：</span>
			</div>
		</div>
        <div class="page-form">
            <el-form :model="approveForm" :rules="approveRules" ref="approveForm" class="form" style="font-size: 16px;" label-width="120px" :label-position="labelPosition">
                <el-form-item prop="jianApprovalOpinion">
                    <span slot="label">
                        <span class="formLabel">提报时间：</span>
                    </span>
                    <el-date-picker style="width: 100%;" value-format='yyyy-MM-dd' v-model="approveForm.talkTime"
                        align="right" type="date" placeholder="请选择完成时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="jianApprovalContents">
                    <span slot="label">
                        <span class="formLabel">文件：</span>
                    </span>
                    <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
                        :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
                        @refreshData="getFiles"></UploadFiles>
                </el-form-item>
            </el-form>
        </div>
		<div slot="footer" class="dialog-footer">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" @click="approveHandle('approveForm')">确定</el-button>
        </div>
	</div>
</template>

<script>
    import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	// import {
	// 	getCause,
	// 	notJoinStorage
	// } from 'api/questionList/intelligentSup/index';
	import {
        getToken
    } from 'utils/auth';
    import {
		formatFile
	} from 'utils';
	// import {
	// 	addObj,
	// 	getObj,
	// 	putObj
	// } from 'api/admin/user/index';
	// import {
	// 	getTree
	// } from 'api/admin/department/index';
	// import {
	// 	getByType
	// } from 'api/admin/dict/index';
	// import {
	// 	mapGetters
	// } from 'vuex';
	// import {
	// 	isIdCard,
	// 	isMobile,
	// 	isEmail,
	// 	isPhone
	// } from '@/utils/validate';
	// import {
	// 	toDate
	// } from '@/utils'
	export default {
		name: 'temporaryPut',
		data() {
			return {
				information: {},
				id: undefined,
				labelPosition: 'left',
				approveForm: {
					id: undefined,
					jianApprovalOpinion: '',
					jianApprovalContents: '',
					userId: ''
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
					label: 'departmentName'
				},
				educations: [],
				politicalOutlooks: [],
                ranks: [],
                options: [{
					value: '选项1',
					label: '同意'
				}, {
					value: '选项2',
					label: '不同意'
				}],
                value: '',
                uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
			}
        },
        filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			}
        },
        components: {
			UploadFiles
		},
		created() {
			// this.information = this.$route.query.information;
			this.id = this.$route.query.id;
			this.init();
		},
		// computed: {
		// 	...mapGetters([
		// 		'elements','deptFields'
		// 	])
		// },
		methods: {
            // 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=bucket`;
			},
			goBack() {
				this.$router.go(-1);
			},
			approveHandle(formName) {
				this.approveForm.userId = getToken();
				this.approveForm.id = this.id;
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						notJoinStorage(this.approveForm)
							.then((res) => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '创建成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										this.goBack();
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
									message: '创建批示意见失败',
									type: 'error',
									duration: 2000
								});
							})
					} else {
						return false;
					}
				});
			},
			init() {
				// getCause(this.id)
				// 	.then(res => {
				// 		if (res && res.code === 0) {
				// 			this.cause = res.data;
				// 		} else {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: res.msg,
				// 				type: 'error',
				// 				duration: 2000
				// 			});
				// 		}
				// 	});
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
			// handlePartyBranch(data) {
			// 	this.form.departmentId = data.id;
			// 	this.form.departmentName = data.departmentName;
			// 	this.treeVisible = false;
			// },
			

			// create(formName) {
			// 	const set = this.$refs;
			// 	set[formName].validate(valid => {
			// 		if (valid) {
			// 			this.loading = true;
			// 			this.form.birthday = toDate(this.form.birthday);
			// 			this.form.dateOfWork = toDate(this.form.dateOfWork);
			// 			addObj(this.form)
			// 				.then((res) => {
			// 					if (res && res.code === 0) {
			// 						this.$notify({
			// 							title: '成功',
			// 							message: '创建成功',
			// 							type: 'success',
			// 							duration: 2000
			// 						});
			// 						setTimeout(() => {
			// 							this.loading = false;
			// 							this.$emit("refreshData");
			// 						}, 2000)
			// 					} else {
			// 						this.$notify({
			// 							title: '失败',
			// 							message: res.msg,
			// 							type: 'error',
			// 							duration: 2000
			// 						});
			// 						setTimeout(() => {
			// 							this.loading = false;
			// 						}, 2000)
			// 					}
			// 				})
			// 		} else {
			// 			return false;
			// 		}
			// 	});
			// },
			// cancel(formName) {
			// 	this.$emit("refreshData");
			// },
			// resetTemp() {
			// 	this.$refs.form.resetFields();
			// 	this.form = {
			// 		id: undefined,
			// 		username: undefined,
			// 		name: undefined,
			// 		sex: '1',
			// 		password: undefined,
			// 		confirmPassword: undefined,
			// 		description: undefined,
			// 		departmentName: undefined,
			// 		departmentId: undefined,
			// 		birthday: undefined,
			// 		address: undefined,
			// 		mobilePhone: undefined,
			// 		telPhone: undefined,
			// 		email: undefined,
			// 		idCard: undefined,
			// 		nation: undefined,
			// 		nativePlace: undefined,
			// 		education: undefined,
			// 		politicalOutlook: undefined,
			// 		workUnit: undefined,
			// 		dateOfWork: undefined,
			// 		rank: undefined,
			// 		post: undefined
			// 	};
			// }
		}
	}
</script>

<style lang="scss" scoped>
    ::v-deep .app-main {
        background-color: #fff !important;
    }
	.page-content-title {
		padding: 18px 20px;
    	border-bottom: 1px solid #EBEEF5;
		font-size: 16px;
        // font-weight: 700;
	}
    .content-text {
        // margin-left: 150px;
        width: 60%;
        margin: 0 auto;
        padding: 0px 20px;
    }
	.content-title {
		margin-bottom: 15px;
	}
	.title-label {
		width: 150px;
		display: inline-block;
	}
    .title-label-top {
        // text-decoration:underline;
    }
    .page-content-form {
        padding: 18px 20px 0px 18px;
		font-size: 16px;
        // font-weight: 700;
    }
    .page-form {
        width: 60%;
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
        text-align: right;
    }
	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}
</style>
