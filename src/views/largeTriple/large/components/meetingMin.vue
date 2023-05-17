<template>
	<el-dialog :title="title" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<div class="page-form">
			<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="150px"
			label-position="right">
				<el-form-item label="会议纪要：" prop="summaryDocument">
					<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
						:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
						@refreshData="getFiles"></UploadFiles>
				</el-form-item>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
    import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
        getConferenceRecordObj,
		summary
	} from 'api/large/index';
    import {
		formatFile
	} from 'utils';
    import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: '',
		data() {
            this.rules = {
                summaryDocument: [{
                    required: true, validator: (rule, val, cb) => {
                        if (!val.length) return cb(new Error('请选择会议纪要'))
                        cb()
                    } 
                }]
            }
			return {
				visible: false,
                title: '',
				form: {
					summaryDocument: []
				},
				loading: false,
                id: undefined,
                uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=largetriple`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
                fileArray: []
			}
		},
		components: {
            UploadFiles
		},
		created() {
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			// 初始化当前页面
			init(id) {
				this.visible = true;
                this.id = id;
                this.getInfo();
			},

            // 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},

            getInfo() {
                getConferenceRecordObj(this.id)
                    .then(response => {
                        this.form.summaryDocument = response.data.summaryDocument;
                        // 纪要文件
                        if (this.form.summaryDocument && this.form.summaryDocument.length) {
                            this.title = '编辑会议纪要';
                        	this.fileArray = this.form.summaryDocument.map(item => { return {name: this.formatFile(item),
                        		response: {fileUrl: item}}})
                        	this.$nextTick(() => {
                        		this.$refs.uploadFiles.init(this.fileArray);
                        	})
                        } else {
                            this.title = '添加会议纪要';
                            this.$nextTick(() => {
                                this.resetTemp();
                                this.$refs.uploadFiles.init([]);
                            })
                        }
                        this.$nextTick(() => {
                            this.$refs.form.clearValidate();
                        });
                    });
            },

            // 获取批量上传文件
			getFiles(data) {
				try {
                    this.form.summaryDocument = data.files.map(item => {
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
						summary(this.form.summaryDocument, this.id)
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
			// 重置数据
			resetTemp() {
                this.$refs.form.resetFields();
				this.form = {
					summaryDocument: []
				};
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-form {
		max-height: 600px;
		overflow-x: auto;
	}
</style>
