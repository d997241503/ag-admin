<template>
	<div>
		<el-upload class="upload-demo" :action="url" :on-success="successHandle" :before-upload="beforeUploadHandle"
			:on-remove="handleRemove" :accept="accepts" :before-remove="beforeRemove" multiple :limit="limit"
			:on-exceed="fileExceed" :file-list="fileList">
			<el-button v-if="!disabled" size="small" type="primary">{{btnText}}</el-button>
			<el-button v-else slot="tip" size="small" type="primary" disabled>{{btnText}}</el-button>
			<span class="el-upload__tip">&nbsp;&nbsp;{{hintText}}</span>
			<div slot="tip" class="el-upload__tip">支持{{accepts}}等格式文件，且不超过{{size}}M</div>
		</el-upload>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				num: 0,
				successNum: 0,
				fileList: [],
			}
		},

		props: {
			index: {
				type: Number
			},
			btnText: {
				type: String
			},
			hintText: {
				type: String
			},
			limit: {
				type: Number,
				default: 9,
			},
			size: {
				type: Number,
				default: 10,
			},
			accepts: {
				type: String,
				default: ".doc,.docx,.xls,.xlsx,.txt,.pdf,.ppt,.pptx,.jpg,.jpeg,.png"
			},
			url: {
				type: String
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},

		watch: {
			accepts(newVal, oldVal) {
				this.accepts = newVal
			},
			limit(newVal, oldVal) {
				this.limit = newVal
			},
			size(newVal, oldVal) {
				this.size = newVal
			}
		},

		methods: {
			init(files) {
				this.fileList = files;
			},
			// 上传之前
			beforeUploadHandle(file) {
				if (file.size / 1024 / 1024 > this.size) {
					this.$message.error(`不支持${this.size}MB以上的文件`);
					return false;
				}
				let index = file.name.lastIndexOf('.');
				let type = file.name.substring(index, file.name.length);
				let suffixArray = this.accepts.split(",") //限制的文件类型
				if (suffixArray.indexOf(type) == -1) {
					this.$message({
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
				if (index != -1) {
					this.fileList.splice(index, 1);
					this.$emit('refreshData', {
						files: this.fileList,
						index: this.index
					});
				}
			},

			// 删除之前
			beforeRemove(file, fileList) {
				// return this.$confirm(`确定移除 ${ file.name }？`);
			},

			// 超出最大值
			fileExceed(file, fileList) {
				this.$message({
					message: `上传文件数量超出最大限制，请先删除再上传`,
					type: 'error',
					duration: 1500,
				});
			},
			// 上传成功
			successHandle(response, file, fileList) {
				this.successNum++;
				this.fileList = fileList;
				if (response && response.code == 0) {
					if (this.num == this.successNum) {
						this.$message({
							message: '上传成功',
							type: 'success',
							duration: 1500,
						})
						this.$emit('refreshData', {
							files: this.fileList,
							index: this.index
						});
					}
				} else {
					this.fileList.splice(this.fileList.indexOf(file));
					this.$emit('refreshData', {
						files: this.fileList,
						index: this.index
					});
					this.$message.error(response.msg);
				}
			},
		}
	}
</script>

<style>
</style>
