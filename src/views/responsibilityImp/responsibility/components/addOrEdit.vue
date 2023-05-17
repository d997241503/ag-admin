<template>
	<el-dialog :title="!form.id ? '下发责任清单' : '编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<div class="page-form">
			<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="150px"
			label-position="right">
				<el-form-item label="下发组织：" prop="issueOrgs" class="box-form">
					<!-- <div class="treeSelect-containers">
						<el-popover popper-class="tree-select" v-model="treeVisible" ref="deptListPopover" placement="bottom-start" trigger="click">
							<el-tree ref="tree" :data="treeData" :props="defaultProps" node-key="id" :show-checkbox="true" :check-on-click-node="true" 
								@check="handlePartyBranch" class="roll-containers">
								<span class="custom-tree-node" slot-scope="{ node, data }">
									<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
								</span>
							</el-tree>
						</el-popover>
						<el-input style="width: 86%;" v-model="form.deptName" v-popover:deptListPopover placeholder="请选择下发对象" readonly>
							<i v-if="form.deptName" slot="suffix" @click.stop="deptListTreeSetDefaultHandle()"
								class="el-icon-circle-close el-input__icon">
							</i>
						</el-input>
					</div> -->
					<el-button @click="selectHandle()" type="text"
						class="but-css">
						批量选择下发组织
						<span v-if="form.issueOrgs.length <= 100">({{form.issueOrgs.length}})</span>
						<span v-else>(100+)</span>
					</el-button>
					<el-select class="input-item input-select elinput" v-model="form.issueOrgs" multiple @focus="closeIt" ref="selectIt" style="width:86%;"
					placeholder="">
					</el-select>
				</el-form-item>
				<el-form-item label="下发主题：" prop="issueTheme">
					<el-input style="width: 86%;" v-model="form.issueTheme" placeholder="请输入下发主题" clearable
					></el-input>
				</el-form-item>
				<el-form-item label="下发年份：" prop="issueYear">
					<el-date-picker style="width: 86%;" v-model="form.issueYear" type="year" value-format='yyyy' placeholder="选择年">
					</el-date-picker>
				</el-form-item>
				<div class="form-sign" v-for="(item, index) in form.issueListData" :key="index">
						<el-form-item label="责任类别：" prop="liabilityCategory" style="margin-top: 22px;">
							<div class="form-member">
								<el-input style="width: 86%;" v-model="form.issueListData[index].liabilityCategory" placeholder="请输入责任类别" clearable
								></el-input>
								<div class="item-btn">
									<span class="btn-info" v-show="index == form.issueListData.length - 1"
										@click="itemAdd('issueListData')"><i
											class="el-icon-circle-plus-outline"></i></span>
									<span class="btn-info" v-show="form.issueListData.length > 1"
										@click="itemDel('issueListData',index)"><i
											class="el-icon-remove-outline"></i></span>
								</div>
							</div>
						</el-form-item>
						<el-form-item v-if="form.id" label="责任内容：" prop="liabilityContent">
							<div class="form-member" v-for="(item, indexs) in form.issueListData[index].liabilityContent">
								<el-input style="width: 86%;" v-model="form.issueListData[index].liabilityContent[indexs].content" placeholder="请输入责任内容" clearable
								></el-input>
								<div class="item-btn">
									<span class="btn-info" v-show="indexs == form.issueListData[index].liabilityContent.length - 1"
										@click="itemAdd('liabilityContent',index)"><i
											class="el-icon-circle-plus-outline"></i></span>
									<span class="btn-info" v-show="form.issueListData[index].liabilityContent.length > 1"
										@click="itemDel('liabilityContent',index,indexs)"><i
											class="el-icon-remove-outline"></i></span>
								</div>
							</div>
						</el-form-item>
						<el-form-item v-else label="责任内容：" prop="liabilityContent">
							<div class="form-member" v-for="(item, indexs) in form.issueListData[index].liabilityContent">
								<el-input style="width: 86%;" v-model="form.issueListData[index].liabilityContent[indexs]" placeholder="请输入责任内容" clearable
								></el-input>
								<div class="item-btn">
									<span class="btn-info" v-show="indexs == form.issueListData[index].liabilityContent.length - 1"
										@click="itemAdd('liabilityContent',index)"><i
											class="el-icon-circle-plus-outline"></i></span>
									<span class="btn-info" v-show="form.issueListData[index].liabilityContent.length > 1"
										@click="itemDel('liabilityContent',index,indexs)"><i
											class="el-icon-remove-outline"></i></span>
								</div>
							</div>
						</el-form-item>
				</div>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</span>
		<!-- <div slot="footer" class="dialog-footer" align="center">
			<el-button @click="goBack()">返 回</el-button>
			<el-button v-if="operation == 'edit'" type="primary" @click="update('form')" :loading="loading">修 改</el-button>
			<el-button v-else type="primary" @click="create('form')" :loading="loading">提
				交</el-button>
		</div> -->
		<!-- 弹窗, 选择下发组织 -->
		<fuhsi-tree-check v-if="fuhsiTreeCheckVisible" ref="fuhsiTreeCheck" @refreshData="initTreeData">
		</fuhsi-tree-check>
		<!-- 弹窗 选择人员 -->
		<fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
	</el-dialog>
		<!-- <UserDialog v-if="userVisible" ref="userDialog" @refreshData="getUserInfo"></UserDialog> -->
	<!-- </div> -->
</template>

<script>
	import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	// import UserDialog from './components/userDialog';
	// import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		liabilitycategoryListPage,
		// typeList,
		addIssueliability,
		getIssueliabilityObj
	} from 'api/responsibility/index';
	import {
		getTree
	} from 'api/admin/department/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	import {
		toDate
	} from '@/utils'
	import {
		getByType
	} from 'api/admin/dict/index';
	import fuhsiTreeCheck from '@/components/fuhsi-tree-check';
	export default {
		name: 'honestReport',
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			return {
				fuhsiTreeCheckVisible: false,
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				visible: false,
				flag: false,
				fileOrNotNoteVisible: false,
				form: {
					id: undefined,
					issueListData: [
						{
							liabilityCategory: '',
							liabilityContent: [
								''
								// {
								// 	content: '',
								// 	id: undefined
								// }
							]
						}
					],
					issueOrgs: [],
					issueOrgsId: [],
					issueTheme: '',
					issueYear: ''
				},
				value: '',
				taskVisible: false,
				superviseVisible: false,
				supervisionUser: '',
				rules: {
					issueOrgs: {
						required: true,
						message: '请选择下发组织',
						trigger: 'blur'
					},
					issueTheme: {
						required: true,
						message: '下发主题不能为空',
						trigger: 'blur'
					},
					issueYear: {
						required: true,
						message: '请选择下发年份',
						trigger: 'change'
					}
				},
				loading: false,
				userVisible: false,
				informationSources: [],
				categorys: [],
				subclassCh: [],
				informerWaies: [],
				// 文件上传
				url: '',
				num: 0,
				successNum: 0,
				fileList: [],
				operation: '',
				// conferenceTypeList: [],
				largeTripleEventList: [],
				largeTripleSituation: [],
				largeTripleOpinion: [],
				method: '',
				personnelFistVisible:false,
				checkedData:[],
				dataList: []
			}
		},
		components: {
			fuhsiSelectPersonnel,
			fuhsiTreeCheck
			// UserDialog
			// UploadFiles
		},
		watch : {
		},
		created() {
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
			disciplineInspectionOpinionChange(e) {
			},
			// 获取字典
			getDataDicts(type) {
				if (!type) return;
				let val = null;
				val = getByType({
						type: type
					})
					.then(res => {
						if (res && res.code === 0) {
							return res.data;
						} else {
							this.$notify({
								title: '失败',
								message: '获取数据字典失败',
								type: 'success',
								duration: 2000
							});
						}
					});
				return Promise.resolve(val);
			},

			goBack() {
				this.$router.go(-1);
			},

			// 初始化当前页面
			init(id) {
				this.visible = true;
				// this.getTreeInfo();
				// this.$nextTick(() => {
				// 	this.resetTemp();
				// })
				if (id) {
					getIssueliabilityObj(id)
						.then(response => {
							this.form = response.data;
							// if(response.data.compere && response.data.compere.length) this.form.compereName = response.data.compere.map(item => {return item.name});
							// if(response.data.conferee && response.data.conferee.length) this.form.confereeName = response.data.conferee.map(item => {return item.name});
							// if(response.data.attendee && response.data.attendee.length) this.form.attendeeName = response.data.attendee.map(item => {return item.name});
							if(this.form.issueOrgs) {
								this.form.issueOrgsId = this.form.issueOrgs.map(item => {
									return parseInt(item.deptId)
								});
							}
							this.$nextTick(() => {
								this.$refs.form.clearValidate();
							});
						});
				} else {
					liabilitycategoryListPage().then(data => {
						if (data && data.status === 200) {
							if(data.data.length) {
								this.form.issueListData = [];
								for(let i = 0; i < data.data.length; i++) {
									this.form.issueListData.push(
										{
											liabilityCategory: data.data[i].liabilityCategory,
											liabilityContent: data.data[i].liabilityContent.map(item => {return item.content})
										}
									)
									// this.form.issueListData = data.data[i].liabilityContent.map(item => {return item.content});
								}
							}
						} else {
							this.dataList = []
							this.$notify.error(data.msg)
						}
					})
					this.form.id = undefined;
					this.$nextTick(() => {
						this.resetTemp();
					})
				}
			},

			// 选择下发组织
			selectHandle() {
				this.fuhsiTreeCheckVisible = true;
				this.$nextTick(() => {
					this.$refs.fuhsiTreeCheck.title = '下发组织';
					// this.$refs.fuhsiTreeCheck.type = treeType;
					this.$refs.fuhsiTreeCheck.init(this.form.issueOrgsId);
				})
			},

			// 获取下发组织
			initTreeData(data) {
				this.form.issueOrgs = data.checkedNodes.map(item => {
					return { deptId: item.id, deptName: item.departmentFullName}
				});
				this.form.issueOrgsId = data.nodes;
			},

			// handlePartyBranch(current, data) {
			// 	this.form.issueOrgs = data.checkedNodes.map(item => {
			// 		return { deptId: item.id, deptName: item.departmentFullName}
			// 	});
			// 	let names = data.checkedNodes.map(item => {
			// 		return item.departmentFullName
			// 	});
			// 	this.form.deptName = names.join('、');
			// },

			// // 清除
			// deptListTreeSetDefaultHandle() {
			// 	this.treeVisible = false;
			// 	this.form.deptName = '';
			// 	this.form.issueOrgs = [];
			// 	this.$refs.tree.setCheckedKeys([]);
			// 	this.$refs.tree.setCurrentKey(null);
			// },

			// // 获取部门树
			// getTreeInfo() {
			// 	getTree({
			// 				departmentAttribute: '1'
			// 			})
			// 		.then(res => {
			// 			if (res && res.code === 0) {
			// 				this.treeData = res.data ? res.data : [];
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: "获取部门树失败",
			// 					type: 'error',
			// 					duration: 2000
			// 				});
			// 			}
			// 		});
			// },

			// 新增元素
			itemAdd(field,index) {
				// if (this.form[field].length >= 10) return this.$message.error("最多添加10条");
				if(this.form.id) {
					if(field == 'liabilityContent') {
						this.form['issueListData'][index].liabilityContent.push({
										content: '',
										id: undefined
									})
					} else {
						this.form[field].push({
								liabilityCategory: '',
								liabilityContent: [
									{
										content: '',
										id: undefined
									}
								]
							});
					}
				} else {
					if(field == 'liabilityContent') {
						this.form['issueListData'][index].liabilityContent.push('')
					} else {
						this.form[field].push({
								liabilityCategory: '',
								liabilityContent: [
									''
								]
							});
					}
				}
			},

			// 删除元素
			itemDel(field, index, indexs) {
				if(field == 'liabilityContent') {
					this.form['issueListData'][index].liabilityContent.splice(indexs, 1);
				} else {
					this.form[field].splice(index, 1);
				}
			},

			// 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					if(label == '主持人') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.compere));
					if(label == '参会人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.conferee));
					if(label == '列席人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.form.attendee));
   	  				this.$refs.personnelFist.init();
    			})
   			},

			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},

			closeIt1() {
				this.$refs.selectIt1.blur();
			},

			closeIt2() {
				this.$refs.selectIt2.blur();
			},

			valueChange(e) {
				if(e == '0') {
					this.superviseVisible = false;					
					this.taskVisible = true;
					this.form.implementationDetails = '';
				} else if(e == '1') {
					this.taskVisible = false;					
					this.superviseVisible = true;
					this.form.implementationFile = [];
				}
			},

			valueClear() {
				this.taskVisible = false;
				this.superviseVisible = false;
			},

			create(formName) {
				this.form.id ? this.method = 'put' : this.method = 'post'
				// this.method = 'put';
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addIssueliability(this.form, this.method)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										// this.goBack();
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

			// // 修改
			// update(formName) {
			// 	this.$confirm('确定进行修改?', '提示', {
			// 			confirmButtonText: '确定',
			// 			cancelButtonText: '取消',
			// 			type: 'warning'
			// 		})
			// 		.then(() => {
			// 			const set = this.$refs;
			// 			set[formName].validate(valid => {
			// 				if (valid) {
			// 					this.loading = true;
			// 					updateObj(this.form).then(res => {
			// 						if (res && res.status === 200) {
			// 							this.$notify({
			// 								title: '成功',
			// 								message: '修改成功',
			// 								type: 'success',
			// 								duration: 2000
			// 							});
			// 							setTimeout(() => {
			// 								this.goBack();
			// 								this.loading = false;
			// 							}, 2000)
			// 						} else {
			// 							this.$notify({
			// 								title: '失败',
			// 								message: res.msg,
			// 								type: 'error',
			// 								duration: 2000
			// 							});
			// 							this.loading = false;
			// 						}
			// 					}).catch(() => {
			// 						this.$notify({
			// 							title: '失败',
			// 							message: '修改选人用人情况失败',
			// 							type: 'error',
			// 							duration: 2000
			// 						});
			// 						this.loading = false;
			// 					});
			// 				} else {
			// 					return false;
			// 				}
			// 			});
			// 		}).catch(() => {

			// 		});
			// },

			// 重置数据
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					id: undefined,
					issueListData: [
						{
							liabilityCategory: '',
							liabilityContent: ['']
						}
					],
					issueOrgs: [],
					issueTheme: '',
					issueYear: ''
				};
				// this.conferenceTypeList = [];
				this.largeTripleEventList = [];
				this.largeTripleSituation = [];
				this.largeTripleOpinion = [];
			}
		}
	}
</script>

<style lang="scss" scoped>

	.page-form {
		max-height: 600px;
		overflow-x: auto;
	}

	.content {
		border: 0.0625rem solid #eaeaea;
		padding: 20px;
		border-radius: 10px;
	}

	.page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: -24px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}

	.select-item>>>.el-radio {
		min-width: 140px;
	}

	 .el-icon-close:before {
		content: "\E78D";
	}

	.personnel-row {
		width: 86%;
		display: flex;
		justify-content: space-between;

		.item-gird {
			width: 38%;
			text-align: center;
			// border: 0.0625rem solid #EFEFEF;
			border-radius: 10px;
			font-size: 15px;
		}
	}

	.box-form{
		/deep/ .el-select__tags span:first-child{
			margin-left: 105px;
			margin-top: 4px;
		}
		/deep/ .el-select__tags span span .el-select__tags-text{
			margin-left: 0px;
			margin-top: 0px;
		}

		.but-css{
			border: 1px dashed rgb(188,0,0);
			color:rgb(188,0,0);
			// position:fixed;
			position: absolute;
			z-index:9999;
			text-align: center;
			padding-bottom: 5px;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: 6px;
			margin-left: 6px;
		}
	}

	.form-member {
		display: flex;
		margin-bottom: 10px;

		.item-btn {
			// position: absolute;
			width: 5%;
    		min-width: 80px;
			// top: 11px;
			right: -25px;
			padding: 0 10px;

			.btn-info,
			.btn-info {
				font-size: 17px;
				margin-right: 10px;
			}

			.btn-info:hover {
				font-weight: bold;
				color: #000;
				cursor: pointer;
			}
		}
	}
	
	.form-sign {
		border-top: 1px dashed #bc0000;
    	border-bottom: 1px dashed #bc0000;
	}

	.treeSelect-containers {

		>>>.el-input__inner,
		>>>.el-input__suffix {
			cursor: pointer;
		}
	}

	.input-select {
		>>> .el-select__tags {
			display: none !important;
		}
	}
</style>
