<template>
	<div class="custom-tree-container">
		<div>
			<div>
				<el-form :inline="true">
					<el-form-item v-if="!$route.query.look">
						<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
							<el-tree style="min-width: 350px;" ref="treeData" :props="defaultPropsOrg" :data="treeData"
								 node-key="id" :expand-on-click-node="false" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
										<span
											v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
										</span>
									</span>
								</el-tree>
							<el-select style="width: 200px;" v-model="deptName" placeholder="请选择子公司" class="input-item" slot="reference"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="year" type="year" format="yyyy" value-format="yyyy" placeholder="选择年" style="width: 100px;" @change="yearChange" :clearable="false">
						</el-date-picker>
					</el-form-item>
				</el-form>
			</div>
			<!-- <div class="custom-nweRoot">
				<el-button v-if="integrityArchives_btn_riskpointsnameadd" type="primary" size="mini" @click="nweRoot()">新建档案</el-button>
			</div> -->
			<el-tree class="folder-content" :style="{'height':($route.query.look?'calc(100vh - 500px)':'calc(100vh - 360px)')}" :data="data" draggable node-key="id" :expand-on-click-node="false" @node-click="handlePartyBranch" :props="defaultProps" highlight-current ref="scrTree">
				<span class="custom-tree-node show-hide" slot-scope="{ node, data }" tabindex="1">
					<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
					<!-- <i class="el-icon-document" style="color: #DFBA49; margin-right: 5px;"></i> -->
					<span style="width: 90%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;font-size: 15px;">
						<!-- <span v-if="data.parentId == '0'">({{data.orgName}})</span> -->
                        <EllipsisText style="flex: 1" :content="data.fowNum ? data.orgName : node.label"/>
					</span>
					<span class="tree-item-opt">
						<i class="el-icon-plus" v-if="integrityArchives_btn_riskpointsnameadd && !$route.query.look" @click="append(data,node)" />
						<i class="el-icon-edit" v-if="integrityArchives_btn_riskpointsedit && data.parentId !== '0' && !$route.query.look" @click="rename(data,node)" style="margin-left: 6px;" />
						<i class="el-icon-delete" v-if="integrityArchives_btn_riskpointsdelete && data.parentId !== '0' && !$route.query.look" @click="remove(data,node)" style="margin-left: 6px;" />
					</span>
				</span>
			</el-tree>

			<el-dialog top="10vh" :title="title" :visible.sync="dialogVisinle" @close="cancel">
				<el-form :model="form" :rules="dataRule" ref="form" label-position="right" @keyup.enter.native="baseDataFormSubmit()"
		 			label-width="100px">
					<!-- <el-form-item v-if="!$route.query.look" label="子公司：" prop="orgName">
						<el-input v-model="form.orgName" placeholder="点击右侧按钮选择子公司" readonly>
							<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
								<el-tree :data="treeData" :props="defaultPropsOrg" node-key="id" @node-click="handlePartyBranchOrg" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }">
										<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
									</span>
								</el-tree>
								<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
							</el-popover>
						</el-input>
					</el-form-item> -->
					<el-form-item v-if="value == '2、流程图' || recordType == '2' || fowNum" label="部门：" prop="orgName">
						<el-input style="width: 86%;" v-model="form.orgName" placeholder="点击右侧按钮选择部门" readonly>
							<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
								<el-tree :data="treeData" :props="defaultPropsOrg" node-key="id" @node-click="handlePartyBranchDep" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }">
										<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
									</span>
								</el-tree>
								<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
							</el-popover>
						</el-input>
					</el-form-item>
					<el-form-item v-if="value == '2、流程图' || fowNum" label="名称：" prop="fowName">
						<el-input style="width: 86%;" v-model="form.fowName"
						placeholder="请输入名称（如：×××（第××01号））"></el-input>
					</el-form-item>
					<el-form-item v-if="value == '2、流程图' || fowNum" label="编号：" prop="fowNum">
						<el-input style="width: 86%;" v-model="form.fowNum"
						placeholder="请输入编号"></el-input>
					</el-form-item>
					<el-form-item v-if="value == '2、流程图' || recordType == '2'" prop="jianApprovalContents">
						<span slot="label">
							<span class="formLabel">文件：</span>
						</span>
						<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
							:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
							@refreshData="getFiles"></UploadFiles>
					</el-form-item>
					<el-form-item v-if="value !== '2、流程图' &&  !fowNum" label="文件名">
						<el-input style="width: 86%;" class="textarea-info form-item" placeholder="请输入文件名" v-model="form.value">
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<!-- <el-button @click="cancel('form')">取 消</el-button> -->
					<el-button type="primary" @click="nweRootAdd" :loading="subLoading">确 定</el-button>
					<!-- <el-button v-else type="primary" @click="update('form')">确 定</el-button> -->
				</div>
			</el-dialog>

		</div>
	</div>
</template>

<script>
    import EllipsisText from 'components/Popover/EllipsisTooltip.vue'
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		addUnitriskpointsObj,
		updateUnitriskpointsObj,
		getUnitriskpointsTree,
		delUnitriskpointsObj
	} from 'api/archives/index';
	// import {
	// 	getTree,
	// } from 'api/incorrupt/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		getToken
	} from 'utils/auth';
	export default {
		data() {
			return {
				subLoading: false,
				popoverVisibel: false,
				deptName: '',
				loading: true,
				dialogVisinle: false,
				treeVisible: false,
				treeData: [],
				defaultPropsOrg: {
					children: 'children',
					label: 'departmentFullName'
				},
				optionCardX: '', // 文件夹节点撰作卡位置
				optionCardY: '',
				optionCardShow: false, // 文件夹方点模作卡是否显示
				optionData: [], // 石键选中的节点的data
				node: null, // 当前右莲选中的节点信息
				tree: null,
				data:[
				],
				id: 10,
				value: '',
				flowChartValue: '',
				form: {
					archivesNum: '',
					parentId: 0,
					sort: undefined,
					value: '',
					orgId: undefined,
					orgName: '',
					fowNum: '',
					files: [],
					id: undefined,
					fowName: ''
				},
				updateForm: {
					archivesNum: '',
					id: undefined,
					sort: undefined,
					value: ''
				},
				defaultProps: {
					children: 'children',
					label: 'value'
				},
				integrityArchives_btn_riskpointsnameadd: false,
				integrityArchives_btn_riskpointsedit: false,
				integrityArchives_btn_riskpointsdelete: false,
				year: new Date().getFullYear().toString(),
				title: '',
				recordType: '',
				value: '',
				uploadFile: {
					textFirst: ' +上传文件',
					limit: 9,
					size: 30,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
					accepts: '.pdf,.jpg,.png'
				},
				dataRule: {
					orgName: [{
						required: true,
						message: '请选择部门',
						trigger: 'change'
					}],
					fowName: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}],
					fowNum: [{
						required: true,
						message: '编号不能为空',
						trigger: 'blur'
					}]
				},
				fowNum: '',
				fowName: '',
				isAdd: false,
			}
		},

		components: {
			UploadFiles, EllipsisText
		},

		computed: {
			...mapGetters([
				'deptFields','elements'
			])
		},

		watch: {
			value(newVal, oldVal) {
				this.value = newVal;
			},
		},

		created() {
			// 获取权限
			this.integrityArchives_btn_riskpointsnameadd = this.elements['integrityArchives:btn_riskpointsnameadd'];	
			this.integrityArchives_btn_riskpointsedit = this.elements['integrityArchives:btn_riskpointsedit'];
			this.integrityArchives_btn_riskpointsdelete = this.elements['integrityArchives:btn_riskpointsdelete'];
			// this.defaultProps.label = this.deptFields;
			// if(this.$route.query.operation) 
			// if(!this.$route.query.look) this.getTreeInfo();
			// this.$emit('refreshDataTree', this.data[0]);
			this.getOrgTreeInfo();
			// if(!this.$route.query.look) this.getTreeInfo();
		},

		methods: {
			// 获取批量上传文件
			getFiles(data) {
				try {
					this.form.files = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},
			// 选择部门
			handlePartyBranchDep(data) {
				this.form.orgId = data.id;
				this.form.orgName = data.departmentFullName;
				this.treeVisible = false;
			},
			yearChange(e) {
				this.year = e;
				this.getTreeInfo();
			},
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			// 选择部门
			handleCheckChange(data) {
				this.form.orgId = data.id;
				this.deptName = data.departmentFullName;
				this.form.orgName = data.departmentFullName;
				this.popoverVisibel = false;
				this.$nextTick(() => {
					this.getTreeInfo();
				})
			},
			// 获取部门树
			getOrgTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							if(this.treeData) {
								this.form.orgId = this.treeData[0].id;
								this.deptName = this.treeData[0].departmentFullName;
								this.form.orgName = this.treeData[0].departmentFullName;
							}
							this.$nextTick(() => {
								this.getTreeInfo();
							})
							this.loading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
							this.loading = false;
						}
					});
			},

			handlePartyBranchOrg(data) {
				this.form.orgId = data.id;
				this.form.orgName = data.departmentFullName;
				this.treeVisible = false;
			},
			nweRootAdd() {
				// this.$emit('refreshDataTree')
				this.form.id = undefined;
				this.form.parentId = this.optionData.id;
				this.subLoading = true;
				addUnitriskpointsObj(
					{ ...this.form,
					  deptId: this.form.orgId,
					  deptName: this.form.orgName
					})
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功！',
								type: 'success',
								duration: 1000
							});
							this.subLoading = false;
							this.dialogVisinle = false;
							// if(!this.$route.query.look) {
							// 	this.form.orgId = undefined;
							// 	this.form.orgName = ''
							// }
							this.$nextTick(() => {
								this.getTreeInfo('','dia');
								this.$emit('refreshDataTree')
							})
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
							this.subLoading = false;
							this.dialogVisinle = false;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 1000
						});
						this.subLoading = false;
						this.dialogVisinle = false;
					})
			},

			cancel() {
				this.value = '';
				// if(!this.$route.query.look) {
				// 	this.form.archivesNum = '';
				// 	this.form.parentId = 0,
				// 	this.form.sort = '';
				// 	this.form.value = '';
				// 	this.form.orgId = '';
				// 	this.form.orgName = '';
				// } else {
					this.form.archivesNum = '';
					// this.form.parentId = 0,
					this.form.sort = '';
					this.form.value = '';
					this.form.fowNum = '';
					this.form.fowName = '';
					// this.form.orgId = '';
					// this.form.orgName = '';
				// }
			},

			// 新建一个根目录
			nweRoot(data, n) {
				this.dialogVisinle = true;
				this.isAdd = true;
				if(data) this.optionData = data;
				if(n) this.node = n; // 将当前节点保存
				// this.optionCardShow = false
				// this.$prompt('请输入文件名', '新增', {   // 弹出框用于输入文件名
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	// inputPattern: /^\S{1,10}$/,
				// 	// inputErrorMessage: '文件名长度在1到10之间'
				// }).then(({
				// 	value
				// }) => {
				// 	this.form.parentId = 0;
				// 	this.form.value = value;
				// 	addUnitriskpointsObj(this.form)
				// 		.then((res) => {
				// 			if (res && res.status === 200) {
				// 				this.$notify({
				// 					title: '成功',
				// 					message: '文件夹新建成功！',
				// 					type: 'success',
				// 					duration: 1000
				// 				});
				// 				this.getTreeInfo();
				// 			} else {
				// 				this.$notify({
				// 					title: '失败',
				// 					message: res.msg,
				// 					type: 'error',
				// 					duration: 1000
				// 				});
				// 			}
				// 		}).catch(() => {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: '文件夹新建失败',
				// 				type: 'error',
				// 				duration: 1000
				// 			});
				// 		})
				// }).catch(() => {
				// 	this.$message({
				// 		type: 'info',
				// 		message: '取消输入'
				// 	});
				// });
			},

			// 新建一个子文件夹
			append(data, n) {
				this.dialogVisinle = true;
				if(data) this.optionData = data;
				if(n) this.node = n; // 将当前节点保存
				// this.optionCardShow = false
				// this.$prompt('请输入文件名', '新增', {   // 弹出框用于输入文件名
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	// inputPattern: /^\S{1,10}$/,
				// 	// inputErrorMessage: '文件名长度在1到10之间'
				// }).then(({
				// 	value
				// }) => {
				// 	if(this.optionData.id) this.form.parentId = this.optionData.id;
				// 	this.form.value = value;
				// 	addUnitriskpointsObj(this.form)
				// 		.then((res) => {
				// 			if (res && res.status === 200) {
				// 				this.$notify({
				// 					title: '成功',
				// 					message: '文件夹新建成功！',
				// 					type: 'success',
				// 					duration: 1000
				// 				});
				// 				if(!this.$route.query.look) {
				// 					this.form.orgId = undefined;
				// 					this.form.orgName = ''
				// 				}
				// 				this.$nextTick(() => {
				// 					this.getTreeInfo();
				// 				})
				// 			} else {
				// 				this.$message.error(res.msg)
				// 				// this.$notify({
				// 				// 	title: '失败',
				// 				// 	message: res.msg,
				// 				// 	type: 'error',
				// 				// 	duration: 1000
				// 				// });
				// 			}
				// 		}).catch(() => {
				// 			this.$notify({
				// 				title: '失败',
				// 				message: '文件夹新建失败',
				// 				type: 'error',
				// 				duration: 1000
				// 			});
				// 		})
				// }).catch(() => {
				// 	this.$message({
				// 		type: 'info',
				// 		message: '取消输入'
				// 	});
				// });
			},

			// 删除文件夹
			remove(data, n) {
				this.optionData = data;
				this.node = n; // 将当前节点保存
				this.optionCardShow = false
				this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delUnitriskpointsObj(this.optionData.id)
						.then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 1000
								});
								// if(!this.$route.query.look) {
								// 	this.form.orgId = undefined;
								// 	this.form.orgName = ''
								// }
								this.$nextTick(() => {
									this.getTreeInfo();
									this.$emit('refreshDataTree')
								})
							} else {
								this.$notify({
									title: '失败',
									message: '删除失败',
									type: 'error',
									duration: 1000
								});
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '删除失败',
								type: 'error',
								duration: 1000
							});
						});;
					// const parent = this.node.parent;
					// const children = parent.data.children || parent.data;
					// const index = children.findIndex(d => d.id === this.data.id);
					// children.splice(index, 1);
					// this.$message({
					// 	type: 'success',
					// 	message: '删除成功!'
					// });
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},

			// 修改文件夹名字
			rename(data, n){
				this.optionData = data;
				this.node = n; // 将当前节点保存
				this.fowNum = data.fowNum;
				this.fowName = data.fowName;
				if(!data.fowNum) {
					this.optionCardShow = false
					this.$prompt('请输入文件名', '修改', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						inputPlaceholder: this.node.data.value,
						// inputPattern: /^\S{1,10}$/,
						// inputErrorMessage: '文件名长度在1到10之间'
					}).then(({
						value
					}) => {
						this.updateForm.archivesNum = this.optionData.archivesNum;
						this.updateForm.id = this.optionData.id;
						this.updateForm.sort = this.optionData.sort;
						this.updateForm.value = value;
						updateUnitriskpointsObj(this.updateForm)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功！',
										type: 'success',
										duration: 1000
									});
									if(!this.$route.query.look) {
										this.form.orgId = undefined;
										this.form.orgName = ''
									}
									this.$nextTick(() => {
										this.getTreeInfo();
									})
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 1000
									});
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '操作失败',
									type: 'error',
									duration: 1000
								});
							})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});
					});
				} else {
					this.form = data;
					this.dialogVisinle = true;
				}
				
			},

			// onOffHandle(val) {
			// 	this.allNodeVisible = val;
			// 	this.showVisible = false;
			// 	setTimeout(() => {
			// 		this.showVisible = true;
			// 	}, 1);
			// },

			// 同步数据到父页面
			handlePartyBranch(data) {
				this.form.id = data.id;
				this.form.parentId = data.parentId;
				this.recordType = data.recordType;
				this.value = data.value;
				this.$emit('refreshDataTree', data);
			},

			// 获取单位风险点树结构
			getTreeInfo(id,dia) {
				// this.value = '';
				if(dia) this.value = '';
				getUnitriskpointsTree({ value: this.value, orgId: this.form.orgId , flowChartValue: this.flowChartValue, year: this.year})
					.then(res => {
						if (res && res.status === 200) {
							this.data = res.data ? res.data : [];
							this.value = '';
							this.$nextTick(() => {
								this.$refs.scrTree.setCurrentKey(id ? id : res.data[0].id);
								if(id) {
									for(let i = 0; i < res.data.length; i++) {
										if(id == res.data[i].id) {
											this.$emit('refreshDataTree', this.data[i]);
										}
									}
								} else {
									if(this.data[0]) this.$emit('refreshDataTree', this.data[0]);
									else this.$emit('refreshDataTree');
								}
								// this.isAdd = false
							})
							// if(this.data[0]) this.$emit('refreshDataTree', this.data[0]);
							// else this.$emit('refreshDataTree');
						} else {
							this.$notify({
								title: '失败',
								message: "获取单位档案树失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			},
		}
	};
</script>

<style lang="scss" scoped>
	.custom-tree-container {
		width: 350px;
	}

	.folder-content {
		overflow: auto;
		height: calc(100vh - 360px);
	}

	.custom-nweRoot {
		margin-bottom: 10px;
	}

	.tree-roll-containers {
		height: 500px;
		/* max-height: 500px; */
		overflow: auto;
	}

	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		/* justify-content: space-between; */
		font-size: 14px;
		padding-right: 8px;
		/* font-family: "楷体" !important; */
		/* Helvetica Neue, Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mar-top {
		margin-top: 10px;
	}

	.mar-top-lar {
		margin-top: 20px;
	}

	.el-icon-s-custom {
		font-size: 15px;
		letter-spacing: 1px;
		/* color: #555; */
		margin: 5px 0;
	}

	.el-icon-user {
		letter-spacing: 1px;
		/* color: #666; */
		margin: 5px 0;
	}

	/* 文件夹卡片 */
	.folder-box {
		height: 100%;
	}

	/* 右键菜单按钮 */
	.option-card-button {
		width: 100%;
		margin-left: 0;
		font-size: 10px;
		border-radius: 0;
	}

	.tree-item-opt {
        display: none;
    }
    .el-tree {
        /deep/ .el-tree-node.is-current{
            .tree-item-opt {
                display: inline-block;
            }
        }
    }

</style>
