<template>
	<el-dialog title="上传文件" :close-on-click-modal="false" @close="closeHandle" :visible.sync="visible">
		<el-upload drag :action="url" :before-upload="beforeUploadHandle" :limit="1" :on-success="successHandle" :on-remove="handleRemove"
		 :multiple="false" :file-list="fileList" style="text-align: center;">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
		</el-upload>
		<div align="right" class="btn-info">
			<el-button @click="visible = false">取 消</el-button>
			<el-button type="primary" @click="saveFiles">确 认</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		uploadImage,
		deleteImage
	} from 'api/admin/menu/index';
	import {
		getToken
	} from 'utils/auth';
	export default {
		data() {
			return {
				visible: false,
				url: '',
				num: 0,
				successNum: 0,
				fileList: [],
				index: 0,
				fileObj: {
					index: 0,
					files: []
				}
			}
		},
		methods: {
			init() {
				this.url = `/api/upload/uploads/image?token=${getToken()}`;
				this.visible = true
			},
			// 上传之前
			beforeUploadHandle(file) {
				if (file.size / 1024 / 1024 > 50) {
					this.$message.error('不支持50M以上的文件');
					return false;
				}
				// if (file.size / 1024 > 50) {
				// 	this.$message.error('不支持50KB以上的图片')
				// 	return false
				// }
				let index = file.name.lastIndexOf('.')
				let type = file.name.substring(index + 1, file.name.length)
				if (file.type === 'application/x-msdownload' || type === 'bat') {
					this.$message.error('不支持.exe .bat文件')
					return false
				}
				this.num++
			},

			// 删除文件
			handleRemove(file, fileList) {
				if (file.response) {
					deleteImage({'imageUrl': file.response.data})
						.then(() => {
						});
				}
			},

			// 上传成功
			successHandle(response, file, fileList) {
				this.fileList = fileList
				this.successNum++
				if (response && response.code === 0) {
					if (this.num === this.successNum) {
						this.$notify({
							title: '成功',
							message: '上传成功',
							type: 'success',
							duration: 2000
						});
					}
				} else {
						this.$notify({
							title: '失败',
							message: '上传失败',
							type: 'error',
							duration: 2000
						});
				}
			},

			saveFiles() {
				this.fileObj.files = this.fileList
				this.$emit('refreshData', this.fileObj)
				this.visible = false
			},

			// 弹窗关闭时
			closeHandle() {
				this.fileList = []
			}
		}
	}
</script>

<style scoped>
	.btn-info {
		padding-top: 30px;
	}
</style>
