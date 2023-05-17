<template>
	<div class="custom-tree-container">
		<div>
			<div>
				<el-form>
					<el-form-item>
						<el-input prefix-icon="el-icon-search" clearable placeholder="请输入目录标题" v-model="value" @input="searchHandle">
						</el-input>
					</el-form-item>
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
							<el-select style="width: 100%;" v-model="deptName" placeholder="请选择子公司" class="input-item" slot="reference"
								ref="selectIt" @focus="closeIt">
							</el-select>
						</el-popover>
					</el-form-item>
					<!-- <el-form-item>
						<el-date-picker v-model="year" type="year" format="yyyy" value-format="yyyy" placeholder="选择年" style="width: 120px;" @change="yearChange" :clearable="false">
						</el-date-picker>
					</el-form-item> -->
				</el-form>
			</div>
			<!-- <div class="custom-nweRoot">
				<el-button type="primary" size="mini" @click="numberHandle()">档案编号</el-button>
			</div> -->
			<!-- <div class="custom-nweRoot"> -->
				<!-- <el-button v-if="integrityArchives_btn_informationnameadd" type="primary" size="mini" @click="nweRoot()">新建档案</el-button> -->
			<!-- </div> -->
			 <!-- :style="{'height':(integrityArchives_btn_untSubsidiary?'calc(100vh - 410px)':'calc(100vh - 515px)')}" -->
			<div class="folder-content" :style="siteHeight">
			<el-tree v-if="data.length" ref="scrTree" :data="data" draggable node-key="id" :default-expanded-keys="expandedKeys" :expand-on-click-node="false" @node-click="handlePartyBranch" :props="defaultProps" highlight-current>
				<span class="custom-tree-node show-hide" slot-scope="{ node, data }" tabindex="1">
					<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
					<el-tag v-if="data.isReport && data.parentId == '0' && integrityArchives_btn_untInspection" type="info" effect="plain">
						<span v-if="data.isReport=='1'">已提报</span>
						<span v-if="data.isReport=='0'">未提报</span>
					</el-tag>
					<el-tag v-if="data.updateOrNot && data.parentId !== '0'" type="info" effect="plain">
						<span v-if="data.updateOrNot=='1'">有变化</span>
						<span v-if="data.updateOrNot=='0'">无变化</span>
					</el-tag>
                    <EllipsisText style="flex: 1;font-size: 15px;margin-left: 5px;" :content="node.label"/>
					<span class="tree-item-opt">
						<!-- <i class="el-icon-plus" v-if="integrityArchives_btn_informationnameadd && !data.code && !$route.query.look" @click="append(data,node)" /> -->
						<!-- <i class="el-icon-edit" v-if="integrityArchives_btn_informationedit && data.parentId !== '0' && !$route.query.look" @click="rename(data,node)" style="margin-left: 6px;" /> -->
						<i class="el-icon-delete" v-if="integrityArchives_btn_informationdelete && data.parentId !== '0' && !$route.query.look" @click="remove(data,node)" style="margin-left: 6px;" />
					</span>
				</span>
			</el-tree>

			<!-- <el-tree v-if="dataCompany.length" ref="scrTreeInspection" :data="dataCompany" draggable node-key="id" :expand-on-click-node="false" @node-click="handlePartyBranchInspection" :props="defaultProps" highlight-current>
				<span class="custom-tree-node show-hide" slot-scope="{ node, data }" tabindex="1">
					<i class="el-icon-folder" style="color: #DFBA49; margin-right: 5px;"></i>
					<EllipsisText style="flex: 1" :content="node.label"/>
					<span class="tree-item-opt">
						<i class="el-icon-plus" v-if="integrityArchives_btn_informationnameadd && !$route.query.look" @click="append(data,node)" />
						<i class="el-icon-edit" v-if="integrityArchives_btn_informationedit && data.parentId !== '0' && !$route.query.look" @click="rename(data,node)" style="margin-left: 6px;" />
						<i class="el-icon-delete" v-if="integrityArchives_btn_informationdelete && data.parentId !== '0' && !$route.query.look" @click="remove(data,node)" style="margin-left: 6px;" />
					</span>
				</span>
			</el-tree> -->
			</div>

			<el-dialog top="10vh" title="新增" :visible.sync="dialogVisinle" @close="cancel">
				<el-form :model="form" ref="form" label-position="right" @keyup.enter.native="baseDataFormSubmit()"
		 			label-width="100px">
					<!-- <el-form-item v-if="!$route.query.look" label="子公司：" prop="orgName">
						<el-input v-model="form.orgName" placeholder="点击右侧按钮选择子公司" readonly>
							<el-popover v-model="treeVisible" slot="append" placement="left-start" trigger="click">
								<el-tree :data="treeData" :props="defaultPropsOrg" node-key="id" @node-click="handlePartyBranchOrg" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }">
										<span v-bind:class="{'el-icon-s-custom': node.level == 1, 'el-icon-user': node.level == 2, 'el-icon-user-solid': node.level > 2}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
									</span>
								</el-tree>
								<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
							</el-popover>
						</el-input>
					</el-form-item> -->
					<el-form-item label="文件名">
						<el-input class="textarea-info form-item" placeholder="请输入 " v-model="form.value">
						</el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<!-- <el-button v-if="integrityArchives_btn_addCompanyarchives" type="primary" @click="nweRootCompany">确 定</el-button>
					<el-button v-else type="primary" @click="nweRootAdd">确 定</el-button> -->
				</div>
			</el-dialog>

		</div>
		<!-- 弹窗, 新增 / 修改 -- 档案编号 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
import EllipsisText from 'components/Popover/EllipsisTooltip'
    import debounce from 'lodash/debounce';
	import AddOrUpdate from './numberEdit';
	import {
		addUnitarchivesObj,
		unitriskpointsInspection,
		updateUnitarchivesObj,
		getUnitarchivesTree,
		inspectionTreeList,
		delUnitarchivesObj
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
	export default {
		data() {
			return {
				addOrUpdateVisible: false,
				popoverVisibel: false,
				loading: true,
				// treeVisible: false,
				// treeData: [],
				// listQuery: {
				// 	deptId: undefined
				// },
				deptName: '',
				dialogVisinle: false,
				treeVisible: false,
				treeData: [],
				defaultPropsOrg: {
					children: 'children',
					label: 'departmentFullName'
				},
				// allNodeVisible: true,
				// showVisible: true,
				// treeData: [],
				// defaultProps: {
				// 	children: 'children',
				// 	label: 'departmentName'
				// }
				optionCardX: '', // 文件夹节点撰作卡位置
				optionCardY: '',
				optionCardShow: false, // 文件夹方点模作卡是否显示
				optionData: [], // 石键选中的节点的data
				node: null, // 当前右莲选中的节点信息
				tree: null,
				data:[
				// 	{ //文件夹信息
				// 	id: 1,
				// 	label: '默认文件夹',
				// 	image: require('../../../assets/img/logo.png'),
				// 	children: [{
				// 		id: 4,
				// 		label: '二级',
				// 		image: require('../../../assets/img/university.png'),
				// 		children:[{
				// 			id: 9,
				// 			label:'三级',
				// 			image: require('../../../assets/img/party-logo.png'),
				// 		}]
				// 	}]
				// }
				],
				id: 10,
				value: '',
				form: {
					archivesNum: '',
					parentId: 0,
					sort: undefined,
					value: '',
					orgId: undefined,
					orgName: ''
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
				integrityArchives_btn_informationnameadd: false,
				integrityArchives_btn_informationedit: false,
				integrityArchives_btn_informationdelete: false,
				integrityArchives_btn_addCompanyarchives: false,
				integrityArchives_btn_untInspection: false,
				integrityArchives_btn_untSubsidiary: false,
				dataCompany: [],
				year: new Date().getFullYear().toString(),
				checkData: {},
				rel: undefined,
				expandedKeys: []
			}
		},

		computed: {
			...mapGetters([
				'deptFields','elements'
			]),

			siteHeight() {
				if(this.integrityArchives_btn_untSubsidiary) {
					return {
                        'height': 'calc(100vh - 420px)'
                    }
				} else if(this.$route.query.look && this.integrityArchives_btn_untInspection) {
					return {
                        'height': 'calc(100vh - 443px)'
                    }
				} else if(this.integrityArchives_btn_untInspection) {
					return {
                        'height': 'calc(100vh - 470px)'
                    }
				} else if(!this.integrityArchives_btn_untSubsidiary && !this.integrityArchives_btn_untInspection && this.$route.query.look) {
					return {
                        'height': 'calc(100vh - 445px)'
                    }
				} else if(!this.integrityArchives_btn_untSubsidiary && !this.integrityArchives_btn_untInspection && !this.$route.query.look) {
					return {
                        'height': 'calc(100vh - 370px)'
                    }
				}
			},
		},
		
		components: {
			AddOrUpdate, EllipsisText
		},

		created() {
			// 获取权限
			this.integrityArchives_btn_informationnameadd = this.elements['integrityArchives:btn_informationnameadd'];	
			this.integrityArchives_btn_informationedit = this.elements['integrityArchives:btn_informationedit'];
			this.integrityArchives_btn_informationdelete = this.elements['integrityArchives:btn_informationdelete'];
			this.integrityArchives_btn_addCompanyarchives = this.elements['integrityArchives:btn_addCompanyarchives'];
			this.integrityArchives_btn_untInspection = this.elements['integrityArchives:btn_untInspection'];
			this.integrityArchives_btn_untSubsidiary = this.elements['integrityArchives:btn_untSubsidiary'];
			// this.defaultProps.label = this.deptFields;
			this.getOrgTreeInfo();
			if(this.$route.query.operation) {
				// this.getTreeInfo();
				// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
			}
			// this.$emit('refreshDataTree', this.data[0]);
			// this.getOrgTreeInfo();
		},

		methods: {
			// 查询
			searchHandle() {
				this.getTreeInfo();
				// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
			},
			getDataList() {
				this.getTreeInfo();
				// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
			},
			// 档案编号
			numberHandle() {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init(this.form.orgId);
				})
			},
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			
			// deptClear(e) {
			// 	this.form.orgId = undefined;
			// },
			// 选择部门
			handleCheckChange(data) {
				this.form.orgId = data.id;
				this.deptName = data.departmentFullName;
				this.form.orgName = data.departmentFullName;
				this.popoverVisibel = false;
				this.getTreeInfo();
				// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
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
								// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
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

			// handlePartyBranchOrg(data) {
			// 	this.form.orgId = data.id;
			// 	this.form.orgName = data.departmentFullName;
			// 	this.treeVisible = false;
			// },
			nweRootAdd() {
				addUnitarchivesObj(this.form)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功！',
								type: 'success',
								duration: 1000
							});
							this.dialogVisinle = false;
							this.getTreeInfo();
							// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
							this.$emit('refreshDataTree')
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
							this.dialogVisinle = false;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 1000
						});
						this.dialogVisinle = false;
					})
			},

			nweRootCompany() {
				unitriskpointsInspection(this.form)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功！',
								type: 'success',
								duration: 1000
							});
							this.dialogVisinle = false;
							// this.getTreeInfoCompany();
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
							this.dialogVisinle = false;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 1000
						});
						this.dialogVisinle = false;
					})
			},

			cancel() {
				if(!this.$route.query.look) {
					this.form.archivesNum = '';
					this.form.parentId = 0,
					this.form.sort = '';
					this.form.value = '';
					this.form.orgId = '';
					this.form.orgName = '';
				} else {
					this.form.archivesNum = '';
					this.form.parentId = 0,
					this.form.sort = '';
					this.form.value = '';
				}
			},

			// 新建一个根目录
			nweRoot(data, n) {
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
				// 	this.form.parentId = 0;
				// 	this.form.value = value;
				// 	addUnitarchivesObj(this.form)
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
				if(data) this.optionData = data;
				if(n) this.node = n; // 将当前节点保存
				this.optionCardShow = false
				this.$prompt('请输入文件名', '新增', {   // 弹出框用于输入文件名
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					// inputPattern: /^\S{1,10}$/,
					// inputErrorMessage: '文件名长度在1到10之间'
				}).then(({
					value
				}) => {
					if(this.optionData.id) this.form.parentId = this.optionData.id;
					this.form.value = value;
					addUnitarchivesObj(this.form)
						.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功！',
									type: 'success',
									duration: 1000
								});
								this.getTreeInfo();
								// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
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
					delUnitarchivesObj(this.optionData.id)
						.then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 1000
								});
								this.getTreeInfo();
								// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
							} else {
								this.$message.error(res.msg)
								// this.$notify({
								// 	title: '失败',
								// 	message: '删除失败',
								// 	type: 'error',
								// 	duration: 1000
								// });
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
					updateUnitarchivesObj(this.updateForm)
						.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '操作成功！',
									type: 'success',
									duration: 1000
								});
								this.getTreeInfo();
								// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
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
					// this.node.data.label = value
					// this.$message({
					// 	type: 'success',
					// 	message: '文件夹已重命名！'
					// });
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
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
				// this.$nextTick(() => {
				// 	if(this.$refs.scrTreeInspection) this.$refs.scrTreeInspection.setCurrentKey(null);
				// })
				this.checkData = data;
				this.$emit('refreshDataTree', data,this.form.orgId,this.rel);
			},

			// // 同步数据到父页面
			// handlePartyBranchInspection(data) {
			// 	this.$nextTick(() => {
			// 		if(this.$refs.scrTree) this.$refs.scrTree.setCurrentKey(null);
			// 	})
			// 	this.checkData = data;
			// 	this.$emit('refreshDataTree', data,this.form.orgId);
			// },

			// 获取单位档案树结构
			getTreeInfo(id,parentId) {
				getUnitarchivesTree({ value: this.value, deptId: this.form.orgId, year: '', type: this.integrityArchives_btn_untSubsidiary ? '11' : '22' })
					.then(res => {
						this.rel = res.rel;
						if (res && res.status === 200) {
							this.data = res.data ? res.data : [];
							this.$nextTick(() => {
								console.log("id",id)
								console.log("parentId",parentId)
								this.$refs.scrTree.setCurrentKey(id ? id : res.data[0].id);
								if(parentId) {
									this.$nextTick(() => {
										let node = this.$refs.scrTree.getNode(parentId);
										this.expandedKeys = this.getDescendantIds(node);
									})
									// this.$refs.scrTree.expand(this.$refs.scrTree.getNodeByKey(parentId));
								}
								if(this.data[0] && !id) this.$emit('refreshDataTree', this.data[0],this.form.orgId,this.rel);
								// else this.$emit('refreshDataTree');
							})
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

			getDescendantIds(node) {
				let descendants = [];
				if (node.data !== undefined && node.data.children !== undefined && node.data.children.length > 0) {
					node.data.children.forEach(child => {
						descendants.push(child.id);
						this.getDescendantIds(child);
					});
				}
				return descendants;
			}

			// // 获取单位档案树结构(纪检)
			// getTreeInfoCompany() {
			// 	inspectionTreeList({ value: this.value, deptId: this.form.orgId, year: '' })
			// 		.then(res => {
			// 			if (res && res.status === 200) {
			// 				this.dataCompany = res.data ? res.data : [];
			// 				if(!this.data && this.dataCompany[0]) this.$emit('refreshDataTree', this.dataCompany[0]);
			// 				else this.$emit('refreshDataTree');
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取单位档案树失败",
			// 					type: 'error',
			// 					duration: 2000
			// 				});
			// 			}
			// 		});
			// },
		}
	};
</script>

<style lang="scss" scoped>
	.custom-tree-container {
		width: 350px;
		/* overflow: auto; */
	}

	.folder-content {
		overflow: auto;
		height: calc(100vh - 515px);

		>>> .el-tag {
			height: 20px;
			line-height: 20px;
			font-size: 7px;
			// opacity: 0.4;
		}

		>>> .el-tag--plain.el-tag--info {
			background-color: #fff4ee;
			border-color: #fd7311;
			color: #fd7311;
		}
	}

	.custom-nweRoot {
		margin-bottom: 10px;
		text-align: right;
	}

	.tree-roll-containers {
		height: 500px;
		/* max-height: 500px; */
		/* overflow: auto;c */
		width: fit-content;
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
