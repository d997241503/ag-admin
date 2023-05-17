<template>
	<div class="app-container calendar-list-container nav-content" @click="OptionCardClose">
		<div v-if="!tabPosition" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery">
					<el-form-item>
						<el-input clearable placeholder="请输入目录标题查询" v-model="listQuery.value">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div v-if="!tabPosition" class="search-info page-info">
			<el-form :inline="true">
				<el-form-item label="档案编号：">
					<el-input clearable placeholder="请输入档案编号" v-model="archivesNum" :readonly="isReadonly">
					</el-input>
				</el-form-item>
				<el-form-item v-if="integrityArchives_btn_informationnumber">
					<el-button v-if="isReadonly" type="primary" @click="numberEditHandle()">编辑</el-button>
					<el-button v-else type="primary" @click="numberDetermineHandle()">确定</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="tree-info tree-roll-containers" ref="tree-info">
			<tree @refreshDataTree="treeHandle" ref="tree"></tree>
		</div>
		<div class="page-info-img" ref="pageInfo" style="margin-left: 310px;">
            <el-button v-if="integrityArchives_btn_informationfilesadd" type="primary" @click="handleEdit()" style="float: right;margin-right: -70px;margin-top: -30px;">{{form.fileUrls.length ? '编辑' : '添加'}}</el-button>
			<div v-if="form.fileUrls.length">
				<div v-for="(item,index) in form.fileUrls" :key="index">
					<!-- {{formatFileSuffix(item)}} -->
					<div class="file-info" v-if="formatFileSuffix(item) == 'pdf'">
						<div class="file-img">
							<img src="~@/assets/img/file.png" alt="图标"></img>
						</div>
						<div class="file-text">{{item | formatFile}}</div>
						<div class="file-download" @click="previewHadle(item)">预览</div>
					</div>
					<img v-else :src="item" style="margin-top: 20px;">
				</div>
			</div>
		</div>
		<el-dialog :visible.sync="dialogFormVisible">
			<el-form ref="form" label-width="100px">
				<el-form-item prop="jianApprovalContents">
                    <span slot="label">
                        <span class="formLabel">文件：</span>
                    </span>
                    <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
                        :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
                        @refreshData="getFiles"></UploadFiles>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="archivesfileHandle">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		updateArchivesfileObj,
		archivesfileInfo,
		updateUnitarchivesObj
	} from 'api/archives/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import tree from "./components/folder";
	import {
		formatFile,
		// formatFileSuffix
	} from 'utils';
	export default {
		name: "informationCom",
		data() {
			return {
				isReadonly: true,
				dialogFormVisible: false,
				popoverVisibel: false,
				loading: true,
				listLoading: true,
				listQuery: {
					value: ''
				},
				archivesNum: '',
				deptName: '',
				// imageUrl: [],
				form: {
					fileUrls: [],
					recordId: undefined
				},
				uploadFile: {
					textFirst: ' +上传图片',
					limit: 9,
					size: 30,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=bucket`,
					accepts: '.pdf,.jpg,.png'
				},
				integrityArchives_btn_informationfilesadd: false,
				integrityArchives_btn_informationnumber: false,
				fileArray1: [],
				value: '',
				baseParentId: undefined
			}
		},
		
		props: {
			tabPosition: {
				type: String
			}
		},
        
        watch: {
			'form.fileUrls'(newVal, oldVal) {
                this.form.fileUrls = newVal;
			},

			tabPosition(newVal, oldVal) {
				this.tabPosition = newVal;
			},
		},

		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
			// // 格式化文件后缀名
			// formatFileSuffix(url) {
			// 	return formatFileSuffix(url);
			// }
        },

		components: {
			tree,
			UploadFiles
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		created() {
			// 获取权限
			this.integrityArchives_btn_informationfilesadd = this.elements['integrityArchives:btn_informationfilesadd'];	
			this.integrityArchives_btn_informationnumber = this.elements['integrityArchives:btn_informationnumber'];
			// this.$nextTick(() => {
			// 	this.getList();
			// })
		},
		methods: {
			// 预览文件
			previewHadle(url) {
				// const Base64 = require('js-base64').Base64
				// window.open(`${window.SITE_CONFIG['previewUrl']}/onlinePreview?url=`+encodeURIComponent(Base64.encode(url)));
			},
			formatFileSuffix( url) {
				let index = url.lastIndexOf("/");
				let name = "";
				name = url.substring(index + 1, url.length);
				return name.substring(name.indexOf(".") + 1, name.length);
			},
			numberEditHandle() {
				this.isReadonly = false;
			},
			numberDetermineHandle() {
				let updateForm = {
					archivesNum: this.archivesNum,
					id: this.baseParentId,
					value: this.value
				}
				updateUnitarchivesObj(updateForm)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '档案编号修改成功！',
								type: 'success',
								duration: 1000
							});
							this.isReadonly = true;
							// this.nextTick(() => {
								this.$refs.tree.getTreeInfo();
							// })
							// this.getTreeInfo();
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
							this.isReadonly = true;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '档案编号修改失败',
							type: 'error',
							duration: 1000
						});
						this.isReadonly = true;
					})
			},
			getDeptId(deptId,departmentFullName) {
				if(deptId) {
					this.$refs.tree.form.orgId = deptId;
					this.$refs.tree.form.orgName = departmentFullName;
					this.$nextTick(() => {
						this.$refs.tree.getTreeInfo();
					})
				}
			},
			// 点击部门刷新列表数据
			treeHandle(val) {
				// this.listQuery.deptId = val.id;
                // this.getList();
				// this.form.fileUrls = val.imageUrl;
				if(val) {
					this.form.recordId = val.id;
					this.baseParentId = val.parentId == "0" ? val.id : val.baseParentId;
					this.value = val.value;
					this.getList(val.id);
					if(val.archivesNum) {
						this.archivesNum = val.archivesNum;
					}
					if(this.tabPosition) {
						this.$emit('tabRefreshData', val);
					}
				} else {
					this.form.fileUrls = [];
					this.archivesNum = '';
				}
            },
            OptionCardClose(event) {
                var currentCli = document.getElementById("option-button-group");
                if (currentCli) {
                    if (!currentCli.contains(event.target)) { //点击到了id为option-button-group以外的区域，就隐藏菜单
                        this.$refs.tree.optionCardShow = false;
                    }
                }
            },
			// 获取数据列表
			getList(id) {
				// this.listLoading = true;
				// this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				// this.listQuery.endtDate = this.times && this.times.length ? this.times[1] : '';
				archivesfileInfo(id)
					.then(response => {
						if (response && response.status === 200) {
							this.form.fileUrls = response.data;
						} else {
							this.$message.error(response.msg);
						}
					}).catch(() => {
					})
			},

			handleFilter() {
				this.$refs.tree.value = this.listQuery.value;
				this.$refs.tree.getTreeInfo();
			},

			// 编辑
			handleEdit() {
				this.dialogFormVisible = true;
				if (this.form.fileUrls && this.form.fileUrls.length) {
					this.fileArray = this.form.fileUrls.map(item => { return {name: item.substring(item.indexOf("_")+1,item.length),
						response: {fileUrl: item}}})
					this.$nextTick(() => {
						this.$refs.uploadFiles.init(this.fileArray);
					})
				}
			},

			// 获取批量上传文件
			getFiles(data) {
				try {
					this.form.fileUrls = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},

			archivesfileHandle(formName) {
				// const set = this.$refs;
				// set[formName].validate(valid => {
				// 	if (valid) {
						updateArchivesfileObj(this.form)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '成功',
										type: 'success',
										duration: 1000
									});
									this.getList(this.form.recordId);
									this.dialogFormVisible = false;
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 1000
									});
									this.dialogFormVisible = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '失败',
									type: 'error',
									duration: 1000
								});
								this.dialogFormVisible = false;
							})
				// 	} else {
				// 		return false;
				// 	}
				// });
			},

			// 删除
			// handleDelete(id) {
			// 	this.$confirm('此操作将永久删除, 是否继续?', '提示', {
			// 			confirmButtonText: '确定',
			// 			cancelButtonText: '取消',
			// 			type: 'warning'
			// 		})
			// 		.then(() => {
			// 			delObj(
			// 					id
			// 				)
			// 				.then(res => {
			// 					if (res && res.status === 200) {
			// 						this.$notify({
			// 							title: '成功',
			// 							message: '删除成功',
			// 							type: 'success',
			// 							duration: 2000
			// 						});
			// 						this.getList();
			// 					} else {
			// 						this.$notify({
			// 							title: '失败',
			// 							message: '删除失败',
			// 							type: 'error',
			// 							duration: 2000
			// 						});
			// 					}
			// 				}).catch(() => {
			// 					this.$notify({
			// 						title: '失败',
			// 						message: '删除失败',
			// 						type: 'error',
			// 						duration: 2000
			// 					});
			// 				});
			// 		}).catch(() => {

			// 		});
			// },
		}
	}
</script>

<style lang="scss" scoped>
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
    }
    
    .page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.page-info-img {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 50px 100px;
        background-color: #FFFFFF;
        
        img {
            width: 100%;
            height: 100%;
        }

		.file-info {
			display: flex;

			.file-img {
				width: 30px;
				// margin-top: 5px;

				img {
					width: 25px;
					height: 25px
				}
			}

			.file-text {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: #555555;
				text-align: left;
				margin-left: 5px;
			}

			.file-download {
				width: 50px;
				text-align: center;
				color: #555555;
				text-decoration: underline;
				margin-right: 15px;
			}

			.file-download:hover {
				cursor: pointer;
				color: #888888;
			}
		}
	}

	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

    .page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: 20px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}
</style>