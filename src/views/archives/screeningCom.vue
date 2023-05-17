<template>
	<div class="app-container calendar-list-container nav-content" @click="OptionCardClose">
		<div v-if="!tabPosition" class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery">
					<el-form-item>
						<el-input clearable placeholder="请输入目录标题查询" v-model="listQuery.value">
						</el-input>
					</el-form-item>
					<!-- <el-form-item>
						<el-input clearable placeholder="请输入流程图编号/名称查询" v-model="listQuery.flowChartValue" style="width: 220px;">
						</el-input>
					</el-form-item> -->
					<el-form-item>
						<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button v-waves type="primary" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<el-button class="filter-item" type="primary" v-waves icon="search" @click="downloadTemplate()">模板下载</el-button>
			</div>
		</div>
		<!-- <div v-if="!tabPosition" class="search-info page-info">
			<el-form :inline="true">
				<el-form-item label="档案编号：">
					<el-input clearable placeholder="请输入" v-model="archivesNum" :readonly="isReadonly">
					</el-input>
				</el-form-item>
				<el-form-item v-if="integrityArchives_btn_riskpointsnumber">
					<el-button v-if="isReadonly" type="primary" @click="numberEditHandle()">编辑</el-button>
					<el-button v-else type="primary" @click="numberDetermineHandle()">确定</el-button>
				</el-form-item>
			</el-form>
		</div> -->
		<div class="page-right">
			<div class="tree-info" ref="tree-info" :style="{'height':($route.query.look?'calc(100vh - 398px)':'calc(100vh - 265px)')}">
				<tree @refreshDataTree="treeHandle" ref="tree"></tree>
			</div>
			<div class="page-info-img" ref="pageInfo" style="flex: 1;margin-left: 20px;">
				<div v-if="fowName || fowNum" style="font-size: 14px;margin-left: -70px;">
					<span>名称：{{fowName ? fowName : '-'}}</span>
					<span style="margin-left: 20px;">编号：{{fowNum ? fowNum : '-'}}</span>
				</div>
				<div class="page-info-button">
					<el-button v-if="integrityArchives_btn_riskpointsfilesadd && !$route.query.look" type="primary" @click="handleEdit()">{{form.fileUrls.length ? '编辑' : '添加'}}</el-button>
				</div>
				<div v-if="form.fileUrls.length" class="area-show" :style="{'height':($route.query.look?'calc(100vh - 498px)':'calc(100vh - 365px)')}">
					<div v-for="(item,index) in form.fileUrls" :key="index" class="content-show">
						<!-- {{formatFileSuffix(item)}} -->
						<div class="file-info" v-if="formatFileSuffix(item) == 'pdf'" style="margin-top: 20px;">
							<iframe :id="`bi_iframe${index}`" @load="adjustIframe(index)" scrolling="auto" :src="item" frameborder="0" height="300px" style=""></iframe>
							<!-- <div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item | formatFile}}</div>
							<div class="file-download" @click="previewHadle(item)">预览</div> -->
						</div>
						<img v-else :src="item" style="margin-top: 20px;">
					</div>
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
				<el-button type="primary" @click="archivesfileHandle" :loading="loading">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	// import pdf from 'vue-pdf'
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		updateUnitriskpointsfileObj,
		unitRiskPointsfileInfo,
		updateUnitriskpointsObj
	} from 'api/archives/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import tree from "./components/screeningFolder";
	import {
		formatFile,
		// formatFileSuffix
	} from 'utils';
	import {
		getTree
	} from 'api/admin/department/index';
	export default {
		name: "informationCom",
		data() {
			return {
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				isReadonly: true,
				dialogFormVisible: false,
				popoverVisibel: false,
				loading: false,
				listLoading: true,
				listQuery: {
					value: '',
					flowChartValue: ''
				},
				dataForm: {
					deptId: undefined,
					deptName: '',
					fowNum: '',
					value: '',
					files: [],
					parentId: 0,
					id: undefined
				},
				archivesNum: '',
				deptName: '',
				// imageUrl: [],
				fileUrlsUpl: [],
				form: {
					fileUrls: [],
					recordId: undefined
				},
				uploadFile: {
					textFirst: ' +上传文件',
					limit: 9,
					size: 30,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
					accepts: '.pdf,.jpg,.png'
				},
				integrityArchives_btn_riskpointsfilesadd: false,
				integrityArchives_btn_riskpointsnumber: false,
				fileArray1: [],
				value: '',
				baseParentId: undefined,
				recordType: '',
				fowNum: '',
				fowName: ''
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
			UploadFiles,
			// pdf
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		created() {
			// 获取权限
			this.integrityArchives_btn_riskpointsfilesadd = this.elements['integrityArchives:btn_riskpointsfilesadd'];	
			this.integrityArchives_btn_riskpointsnumber = this.elements['integrityArchives:btn_riskpointsnumber'];
			// this.$nextTick(() => {
			// 	this.getList();
			// })
		},
		methods: {
			adjustIframe(index) {
				var ifm = document.getElementById("bi_iframe"+index);
				ifm.height = document.documentElement.clientHeight;
				ifm.width = document.documentElement.clientWidth;
				// var y=(ifm.contentWindow || ifm.contentDocument);
				// if (y.document) y=y.document;
				// y.body.style.backgroundColor="#0000ff";
				// let iframeBox=document.getElementById("bi_iframe");
				// let _obj=iframeBox.contentWindow || iframeBox.contentDocument;
				// let doc=_obj.document;
				// let _box=doc.getElementById("viewer");
				// _box.style.background="#ffffff"
			},
			downloadTemplate() {

			},
			// // 选择部门
			// handlePartyBranch(data) {
			// 	this.dataForm.deptId = data.id;
			// 	this.dataForm.deptName = data.departmentFullName;
			// 	this.treeVisible = false;
			// },
			// 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			},
			// // 预览文件
			// previewHadle(url) {
			// 	const Base64 = require('js-base64').Base64
			// 	window.open(`${window.SITE_CONFIG['previewUrl']}/onlinePreview?url=`+encodeURIComponent(Base64.encode(url)));
			// },
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
				updateUnitriskpointsObj(updateForm)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功！',
								type: 'success',
								duration: 1000
							});
							this.isReadonly = true;
							// this.nextTick(() => {
								this.$refs.tree.getTreeInfo(this.form.recordId);
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
							message: '操作失败',
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
						this.$refs.tree.getTreeInfo(this.form.recordId);
					})
				}
			},
			// 点击部门刷新列表数据
			treeHandle(val) {
				// this.listQuery.deptId = val.id;
                // this.getList();
                // this.form.fileUrls = val.imageUrl;
				// if(!val) this.$emit('tabRefreshDataScr');
                if(val) {
                    this.form.recordId = val.id;
					this.dataForm.id = val.id;
					this.dataForm.parentId = val.parentId;
					this.recordType = val.recordType;
                    this.baseParentId = val.parentId == "0" ? val.id : val.baseParentId;
                    this.value = val.value;
					if(val.fowNum) {
						this.fowNum = val.fowNum;
					} else {
						this.fowNum = '';
					}
					if(val.fowName) {
						this.fowName = val.fowName;
					} else {
						this.fowName = '';
					}
                    this.getList(val.id);
                    // if(val.archivesNum) {
                        this.archivesNum = val.archivesNum;
					// }
					if(this.tabPosition) {
						this.$emit('tabRefreshDataScr', val);
					}
                } else {
					this.form.fileUrls = [];
					this.archivesNum = '';
					this.$emit('tabRefreshDataScr');
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
				unitRiskPointsfileInfo(id)
					.then(response => {
						if (response && response.status === 200) {
							this.form.fileUrls = response.data;
						} else {
							this.$message.error(response.msg);
						}
					}).catch(() => {
					})
			},

			handleFilter(nameScr,noScr) {
				if(nameScr) {
					this.$refs.tree.value = nameScr;
				} else {
					this.$refs.tree.value = this.listQuery.value;
				}
				if(noScr) {
					this.$refs.tree.flowChartValue = noScr;
				} else {
					this.$refs.tree.flowChartValue = this.listQuery.flowChartValue;
				}
				this.$nextTick(() => {
					this.$refs.tree.getTreeInfo();
				})
			},

			resetQuery() {
				this.listQuery.value = '';
				this.$refs.tree.value = '';
				this.listQuery.flowChartValue = '';
				this.$refs.tree.flowChartValue = '';
				this.$refs.tree.getTreeInfo();
			},

			// 编辑
			handleEdit() {
				this.dialogFormVisible = true;
				this.getTreeInfo();
				if (this.form.fileUrls && this.form.fileUrls.length) {
					this.fileArray = this.form.fileUrls.map(item => { return {name: item.substring(item.lastIndexOf("_")+1,item.length),
						response: {fileUrl: item}}})
					this.$nextTick(() => {
						this.$refs.uploadFiles.init(this.fileArray);
					})
				} else {
					this.$nextTick(() => {
						this.$refs.uploadFiles.init([]);
					})
				}
			},

			// 获取批量上传文件
			getFiles(data) {
				try {
					this.fileUrlsUpl = data.files.map(item => {
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
					this.loading = true;
						updateUnitriskpointsfileObj({
							fileUrls: this.fileUrlsUpl,
							recordId: this.form.recordId
						}).then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '成功',
										type: 'success',
										duration: 1000
									});
									this.loading = false;
									this.getList(this.form.recordId);
									this.dialogFormVisible = false;
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 1000
									});
									this.loading = false;
									this.dialogFormVisible = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '失败',
									type: 'error',
									duration: 1000
								});
								this.loading = false;
								this.dialogFormVisible = false;
							})
				// 	} else {
				// 		return false;
				// 	}
				// });
			},
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
		width: calc(100% - 420px);
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		// padding: 50px 120px;
		background-color: #FFFFFF;
		// height: calc(100vh - 265px);
		
		.page-info-button {
			text-align: right;
			padding: 20px;
		}

		.area-show {
			height: calc(100vh - 365px);
			overflow: auto;
				
			.content-show {
				padding: 0px 120px;
			}
		}
        
        img {
            width: 100%;
            height: 100%;
        }

		.file-info {
			display: flex;
			width: 100%;

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

	.page-right {
		display: flex;
	}

	.tree-info {
		// position: absolute;
		width: 392px;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
		height: calc(100vh - 265px);
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

	.query {
		// margin-left: 10px;
	}
</style>