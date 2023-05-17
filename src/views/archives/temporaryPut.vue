<template>
	<div class="tier-page">
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
        <!-- <div class="page-content-form">
            <div slot="header" class="content-title clearfix">
				<span class="title-label title-label-top">临时任务提报：</span>
			</div>
		</div> -->
        <div class="page-form">
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
	export default {
		name: 'temporaryPut',
		data() {
			return {
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
					label: 'departmentName'
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
										message: '操作成功',
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
									message: '操作失败',
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
