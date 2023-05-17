<template>
	<el-dialog :visible.sync="visible" width="780px" :title="title" :close-on-click-modal="false"
		:close-on-press-escape="false" :before-close="handleClose">
		<div class="hint-text">
			<span>导入需使用系统模板，请先下载模板，编辑完成后导入</span>
			<el-button v-if="options && options.length" v-for="(item, indnex) in options" :key="indnex" type="text"
				@click="downloadHandle(item.value)"><i class="el-icon-download"></i>下载{{ item.label }}模板</el-button>
			<el-button v-if="!options" type="text" @click="downloadHandle()"><i class="el-icon-download"></i>下载模板</el-button>
		</div>
		<el-upload class="upload-box" drag :action="url" :on-success="successHandle" :before-upload="beforeUploadHandle"
			:on-remove="handleRemove" :accept="accepts" :before-remove="beforeRemove" :multiple="multiple"
			:limit="limit" :on-exceed="fileExceed" :file-list="fileList">
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div slot="tip" class="el-upload__tip">支持{{accepts}}等格式文件，且不超过{{size}}M</div>
		</el-upload>
		<div class="dialog-footer" align="center">
			<el-button @click="handleClose()" size="small">取消</el-button>
			<el-button :disabled="!fileList.length" type="primary" @click="commitHandle()" size="small">
				确定
			</el-button>
		</div>
	</el-dialog>
</template>
<script>
	import debounce from 'lodash/debounce';
	import {
		getToken
	} from 'utils/auth';
	import {
		personnelrosterUpload
	} from 'api/archives/index';
	export default {
		data() {
			return {
				visible: false,
				url: "",
				limit: 1,
				multiple: false,
				obj: {
					fileUrl: '',
				},
				fileList: []
			}
		},
		props: {
			title: {
				type: String,
				default: "导入"
			},
			actionURL: {
				type: String,
				default: "/file/upload"
			},
			options: {
				type: Array
			},
			importURL: String,
			templateURL: String,
			size: {
				type: Number,
				default: 10,
			},
			accepts: {
				type: String,
				default: ".xls,.xlsx"
			},
		},
		methods: {
			init() {
				this.visible = true;
				this.url = `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`;
			},
			// 下载模板
			downloadHandle(val) {
				window.location.href = `/api/incorruptibleArchives/personnel-roster/template?token=${getToken()}`;
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
					}
				} else {
					this.fileList.splice(this.fileList.indexOf(file));
					this.$message.error(response.msg);
				}
			},

			// 提交导入
			commitHandle: debounce(function() {
				if (!this.fileList.length) return this.$message.error("请先上传需要导入的文件");
				this.obj.fileUrl = this.fileList[0].response.fileUrl;
				this.$emit('refreshData',this.obj.fileUrl);
				this.handleClose();
			}, 1000, {
				'leading': true,
				'trailing': false
			}),
			handleClose(done) {
				this.fileList = [];
				if (done) done();
				this.visible = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hint-text {
		text-align: center;
		font-size: 16px;
		margin-bottom: 10px;
	}

	.upload-box {
		text-align: center;
		padding: 0 20px;

		.el-upload__text {
			font-size: 15px;

		}

		.el-upload__tip {
			font-size: 15px;
		}
	}

	.dialog-footer {
		border-top: 0.0625rem solid #F2F2F2;
		padding: 20px;
		margin-top: 20px;
		
		button {
			height: 36px;
			padding: 0 30px;
			font-size: 15px;
		}
	}
</style>
