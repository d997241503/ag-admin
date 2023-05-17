<template>
	<el-dialog title="导入" :close-on-click-modal="false" @close="closeHandle" :visible.sync="visible">
		<el-upload drag :action="url" :accept="accepts" :on-remove="handleRemove" :before-upload="beforeUploadHandle"
		 :on-exceed="fileExceed" :on-success="successHandle" :multiple="false" :limit="1" :file-list="fileList" style="text-align: center;">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div slot="tip" class="el-upload__tip">支持{{accepts}}等格式文件，且不超过{{size}}M</div>
		</el-upload>

		<div align="center" class="btn-info">
			<el-button @click="visible = false">取 消</el-button>
			<el-button type="primary" @click="saveFiles">确 认</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		getToken
	} from 'utils/auth';
	export default {
		data() {
			return {
				visible: false,
				url: '',
				num: 0,
				size: 10,
				accepts: ".xls,.xlsx",
				successNum: 0,
				fileList: []
			}
		},
		methods: {
			init(url) {
				// this.url = this.$http.adornUrl(url + `?token=${this.$cookie.get('token')}`)
				this.url = `/api/${url}?token=${getToken()}`;
				this.visible = true
			},
			// 上传之前
			beforeUploadHandle(file) {
				if (file.size / 1024 / 1024 > this.size) {
					this.$notify.error(`不支持${this.size}MB以上的文件`);
					return false;
				}
				let index = file.name.lastIndexOf('.');
				let type = file.name.substring(index, file.name.length);
				let suffixArray = this.accepts.split(",") //限制的文件类型
				if (suffixArray.indexOf(type) == -1) {
					this.$notify({
						message: '文件格式错误',
						type: 'error',
						duration: 2000
					})
					return false;
				}
				this.num++
			},
			// 删除文件
			handleRemove(file, fileList) {
				var index = this.fileList.indexOf(file);
				if (index != -1)
					this.fileList.splice(index, 1);
			},
			// 超出最大值
			fileExceed(file, fileList) {
				this.$notify({
					message: `上传文件数量超出最大限制，请先删除再上传`,
					type: 'error',
					duration: 1500,
				});
			},
			// 上传成功
			successHandle(response, file, fileList) {
				this.fileList = fileList
				this.successNum++
				if (response && response.status === 200) {
					if (this.num === this.successNum) {
						this.$notify.success("操作成功")
					}
				} else {
					this.$notify.error(response.msg)
				}
			},

			saveFiles() {
				let obj = {
					fileName: "",
					fileUrl: ""
				}
				if (this.fileList.length) {
					obj.fileName = this.fileList[0].name;
					obj.fileUrl = this.fileList[0].response.testUserFile;
				}
				this.$emit('refreshData', obj);
				this.visible = false;
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
		margin-top: 10px;
	}
</style>
