<template>
	<el-dialog :title="title" :close-on-click-modal="false" @close="closeHandle" :visible.sync="visible">
		<el-upload drag :action="url" :accept="accepts" :before-upload="beforeUploadHandle" :on-success="successHandle"
		 :multiple="false" :limit="1" :file-list="fileList" style="text-align: center;">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div slot="tip" class="el-upload__tip">支持{{accepts}}等格式文件，且不超过{{size}}M</div>
		</el-upload>
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
				successNum: 0,
				size: 10,
				accepts: ".xls,.xlsx",
				fileList: []
			}
		},
		props:{
			title: {
				type: String,
				default: '导入文件'
			}
		},
		methods: {
			init(url, dateId) {
				// this.url = this.$http.adornUrl(url + `?token=${this.$cookie.get('token')}`)
				this.url = `/api/${url}?token=${getToken()}&dateId=${dateId}`;
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
			// 上传成功
			successHandle(response, file, fileList) {
				this.fileList = fileList
				this.successNum++
				if (response && response.code === 0) {
					if (this.num === this.successNum) {
						this.$notify.success("上传成功");
						this.$emit('refreshDataList')
						setTimeout(() => {
							this.visible = false;
						}, 200)
						// this.$confirm('操作成功, 是否继续操作?', '提示', {
						// 	confirmButtonText: '确定',
						// 	cancelButtonText: '取消',
						// 	type: 'warning'
						// }).catch(() => {
						// 	this.visible = false
						// })
					}
				} else {
					this.$notify.error(response.msg)
				}
			},
			// 弹窗关闭时
			closeHandle() {
				this.fileList = [];
			}
		}
	}
</script>
