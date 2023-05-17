<template>
	<el-dialog title="新增：" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px" label-position="right">
				<el-form-item label="派驻组组名：" prop="name">
					<el-input style="width: 90%;" class="form-item input-info" v-model="dataForm.name" placeholder="请输入派驻组组名" maxlength="50" clearable
					></el-input>
				</el-form-item>
			<el-form-item label="组长：" prop="groupLeaderName" class="box-form">
				<el-button @click="personnelFistHandle('组长')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.groupLeaderName.length ? dataForm.groupLeaderName.length : 0}}人)</span>
				</el-button>
				<el-select v-if="personnelFistVisible" class="input-item input-select elinput" v-model="dataForm.groupLeaderName" multiple @focus="closeIt" ref="selectIt" style="width:90%;"
				 @remove-tag="groupLeaderRemoveTag" placeholder="">
				</el-select>
			</el-form-item>
			<el-form-item label="副组长：" prop="deputyGroupLeaderName" class="box-form">
				<el-button @click="personnelFistHandle('副组长')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.deputyGroupLeaderName.length ? dataForm.deputyGroupLeaderName.length : 0}}人)</span>
				</el-button>
				<el-select v-if="personnelFistVisible" class="input-item input-select elinput" v-model="dataForm.deputyGroupLeaderName" multiple @focus="closeIt1" ref="selectIt1" style="width:90%;"
				 @remove-tag="deputyGroupLeaderRemoveTag" placeholder="">
				</el-select>
			</el-form-item>
			<el-form-item label="组员：" prop="groupMemberName" class="box-form">
				<el-button @click="personnelFistHandle('组员')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.groupMemberName.length ? dataForm.groupMemberName.length : 0}}人)</span>
				</el-button>
				<el-select v-if="personnelFistVisible" class="input-item input-select elinput" v-model="dataForm.groupMemberName" multiple @focus="closeIt2" ref="selectIt2" style="width:90%;"
				 @remove-tag="groupMemberRemoveTag" placeholder="">
				</el-select>
			</el-form-item>
			<el-form-item label="管辖子公司：" prop="deptId" class="box-form-org">
				<el-button @click="selectHandle()" type="text"
					class="but-css">
					批量选择子公司
					<span v-if="dataForm.manageOrgIds.length <= 100">({{dataForm.manageOrgIds.length}})</span>
					<span v-else>(100+)</span>
				</el-button>
				<el-select class="input-item input-select elinput" v-model="dataForm.deptName" multiple @focus="closeIt3" ref="selectIt3" style="width:90%;"
				placeholder="" @remove-tag="removeTag">
				</el-select>
				<!-- <el-input v-else v-model="form.departmentName" readonly></el-input> -->
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit()" :loading="loading">确定</el-button>
		</span>
		<!-- 弹窗 选择人员 -->
		<fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
		<!-- 弹窗, 选择下发子公司 -->
		<fuhsi-tree-check v-if="fuhsiTreeCheckVisible" ref="fuhsiTreeCheck" @refreshData="initTreeData">
		</fuhsi-tree-check>
	</el-dialog>
</template>

<script>
	import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	import fuhsiTreeCheck from '@/components/fuhsi-tree-check';
	import {
		page
	} from 'api/admin/user/index';
	import {
		personnelpool,
		accreditGroup
	} from 'api/archives/index';
	import {
		addTeamObj,
		updateTeamObj
	} from 'api/patrol/index';
	import { mapGetters } from 'vuex';
	import {
		getTree
	} from 'api/admin/department/index';
	export default {
		props: {
			groupId: {
				default: '1'
			}
		},
		data() {
			return {
				fuhsiTreeCheckVisible: false,
				checkedData:[],
				visible: false,
				lItems: [],
				mItems: [],
				loading: false,
				dataForm: {
					id: undefined,
					groupLeaderName: [],
					deputyGroupLeaderName: [],
					groupMemberName: [],
					groupLeader: [],
					deputyGroupLeader: [],
					groupMember: [],
					manageOrgIds: [],
					deptName: [],
					dept: [],
					name: ''
				},
				personnelFistVisible:false,
				types:  [{
					label: '单选',
					value: '1'
				}, {
					label: '多选',
					value: '2'
				}, {
					label: '填空',
					value: '4'
				}],
				dataRule: {
					// aboveM6Name: [{
					// 	required: true,
					// 	message: '请选择M8及以上',
					// 	trigger: 'change'
					// }],
					// highRiskPositionName: [{
					// 	required: true,
					// 	message: '请选择关键岗位人员',
					// 	trigger: 'change'
					// }]
				},
				method: '',
				num:undefined,
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
			}
		},
		components: {
			fuhsiSelectPersonnel,
			fuhsiTreeCheck
		},
		watch : {
			checkedData: {
				handler(newVal, oldVal) {
					if(newVal.label == '组长') this.dataForm.groupLeaderName = [];
					if(newVal.label == '副组长') this.dataForm.deputyGroupLeaderName = [];
					if(newVal.label == '组员') this.dataForm.groupMemberName = [];
					if(newVal && newVal.resultList && newVal.resultList.length) {
						for(let i=0;i<newVal.resultList.length;i++){
							if(newVal.label == '组长') this.dataForm.groupLeaderName.push(newVal.resultList[i].name);
							if(newVal.label == '副组长') this.dataForm.deputyGroupLeaderName.push(newVal.resultList[i].name);
							if(newVal.label == '组员') this.dataForm.groupMemberName.push(newVal.resultList[i].name);
						}
						this.personnelFistVisible=false;
						this.$nextTick(()=>{
							this.personnelFistVisible=true;
						})
					}
					if(newVal.label == '组长') this.dataForm.groupLeader = newVal.resultList;
					if(newVal.label == '副组长') this.dataForm.deputyGroupLeader = newVal.resultList;
					if(newVal.label == '组员') this.dataForm.groupMember = newVal.resultList;
				},
				immediate: true
			},
		},
		created() {
			this.initUsers();
		},
		computed: {
			...mapGetters([
				'userId'
			])
		},
		methods: {
			// 获取管辖子公司
			initTreeData(data) {
				this.dataForm.dept = data.checkedNodes;
				this.dataForm.deptName = data.checkedNodes.map(item => { return item.departmentFullName });
				this.dataForm.manageOrgIds = data.nodes;
				this.$forceUpdate()
			},
			// 选择管辖子公司
			selectHandle() {
				this.fuhsiTreeCheckVisible = true;
				this.$nextTick(() => {
					this.$refs.fuhsiTreeCheck.title = '管辖子公司';
					// this.$refs.fuhsiTreeCheck.type = treeType;
					this.$refs.fuhsiTreeCheck.init(this.dataForm.manageOrgIds);
				})
			},
			// clear() {
			// 	this.dataForm.dept = [];
			// 	this.dataForm.deptName = [];
			// 	this.dataForm.manageOrgIds = [];
			// },
			removeTag(val){
				for(let i = 0; i < this.dataForm.dept.length; i++) {
					if(this.dataForm.dept[i].departmentFullName) {
						if(this.dataForm.dept[i].departmentFullName == val) {
							this.dataForm.dept.splice(i,1)
							this.dataForm.manageOrgIds.splice(i,1)
							this.$forceUpdate()
						}
					} else {
						if(this.dataForm.dept[i].name == val) {
							this.dataForm.dept.splice(i,1)
							this.dataForm.manageOrgIds.splice(i,1)
							this.$forceUpdate()
						}
					}
				}
			},
			initUsers() {
			},
			init(row) {
				// this.mItems = [];
				this.visible = true;
				this.personnelFistVisible=true;
				if(row) {
					this.dataForm = { ...row };
					if(row.manageOrg) {
						this.dataForm.dept = row.manageOrg;
						this.dataForm.deptName = row.manageOrg.map(item => { return item.name });
						this.dataForm.manageOrgIds = row.manageOrg.map(item => { return item.orgId });
					}
					if(row.groupLeader && row.groupLeader.length) {
						this.dataForm.groupLeader = row.groupLeader;
						this.dataForm.groupLeaderName = row.groupLeader.map(item => { return item.name });
					} else {
						this.dataForm.groupLeader = [];
						this.dataForm.groupLeaderName = [];
					}
					if(row.deputyGroupLeader && row.deputyGroupLeader.length) {
						this.dataForm.deputyGroupLeader = row.deputyGroupLeader;
						this.dataForm.deputyGroupLeaderName = row.deputyGroupLeader.map(item => { return item.name });
					} else {
						this.dataForm.deputyGroupLeader = [];
						this.dataForm.deputyGroupLeaderName = [];
					}
					if(row.groupMember && row.groupMember.length) {
						this.dataForm.groupMember = row.groupMember;
						this.dataForm.groupMemberName = row.groupMember.map(item => { return item.name });
					} else {
						this.dataForm.groupMember = [];
						this.dataForm.groupMemberName = [];
					}
					// if(row.groupLeader && row.groupLeader.length) this.dataForm.groupLeaderName = row.groupLeader.map(item => { return item.name });
					// if(row.deputyGroupLeader && row.deputyGroupLeader.length) this.dataForm.deputyGroupLeaderName = row.deputyGroupLeader.map(item => { return item.name });
					// if(row.groupMember && row.groupMember.length) this.dataForm.groupMemberName = row.groupMember.map(item => { return item.name });
					if(!row.manageOrg) this.dataForm.manageOrgIds = [];
				} else {
					this.dataForm = {
						id: undefined,
						groupLeaderName: [],
						deputyGroupLeaderName: [],
						groupMemberName: [],
						groupLeader: [],
						deputyGroupLeader: [],
						groupMember: [],
						manageOrgIds: [],
						deptName: [],
						dept: [],
						name: ''
					}
				}
				// this.getInfo();
				this.getTreeInfo();
				this.$nextTick(() => {
				})
			},
			// // 获取详情
			// getInfo() {
			// 	// personnelpool({
			// 	// 	orgId: undefined
			// 	// }).then(response => {
			// 	// 	if(response.data) {
			// 	// 		if(response.data.aboveM6) this.dataForm.aboveM6 = response.data.aboveM6;
			// 	// 		if(response.data.highRiskPosition) this.dataForm.highRiskPosition = response.data.highRiskPosition;
			// 	// 		if(response.data.aboveM6 && response.data.aboveM6.length) this.dataForm.aboveM6Name = response.data.aboveM6.map(item => { return item.name });
			// 	// 		if(response.data.highRiskPosition && response.data.highRiskPosition.length) this.dataForm.highRiskPositionName = response.data.highRiskPosition.map(item => { return item.name });
			// 	// 	}
			// 	// });
			// },
			// groupLeaderClear() {
			// 	this.dataForm.groupLeader = [];
			// },
			// deputyGroupLeaderClear() {
			// 	this.dataForm.deputyGroupLeader = [];
			// },
			// groupMemberClear() {
			// 	this.dataForm.groupMember = [];
			// },
			groupLeaderRemoveTag(val){
				for(let i = 0; i < this.dataForm.groupLeader.length; i++) {
					if(this.dataForm.groupLeader[i].name == val) {
						this.dataForm.groupLeader.splice(i,1)
						this.$forceUpdate()
					}
				}
			},
			deputyGroupLeaderRemoveTag(val){
				for(let i = 0; i < this.dataForm.deputyGroupLeader.length; i++) {
					if(this.dataForm.deputyGroupLeader[i].name == val) {
						this.dataForm.deputyGroupLeader.splice(i,1)
						this.$forceUpdate()
					}
				}
			},
			groupMemberRemoveTag(val){
				for(let i = 0; i < this.dataForm.groupMember.length; i++) {
					if(this.dataForm.groupMember[i].name == val) {
						this.dataForm.groupMember.splice(i,1)
						this.$forceUpdate()
					}
				}
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
			closeIt3() {
				this.$refs.selectIt3.blur();
			},
			// 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					if(label == '组长') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.dataForm.groupLeader));
					if(label == '副组长') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.dataForm.deputyGroupLeader));
					if(label == '组员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.dataForm.groupMember));
   	  				this.$refs.personnelFist.init();
    			})
   			},
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
			// // 选择管辖子公司
			// handlePartyBranch(data) {
			// 	this.form.deptId = data.id;
			// 	this.form.deptName = data.departmentFullName;
			// 	this.treeVisible = false;
			// },
			// 表单提交
			dataFormSubmit() {
				this.dataForm.id ? this.method = 'put' : this.method = 'post';
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.loading = true;
						accreditGroup(this.dataForm,this.method).then(data=> {
								if (data && data.status === 200) {
									this.$notify({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
											this.loading = false;
											this.visible = false
											this.$emit("refreshDataList")
										}
									})
								} else {
									this.loading = false;
									this.$notify.error(data.msg)
								}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
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
			position:fixed;
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
	.elinput{
		/deep/ .el-input__inner{
			text-indent: 100px;
		}
		/deep/ .el-icon-arrow-up:before {
			content: '';
		}
		/deep/ .el-select__input{
			text-indent: 100px;
		}
		/deep/ .el-select__tags {
			span:first-child{
				margin-top: 0px;
			}
		}
	}
	.input-item {
		width: 90%;
		
		li {
		    line-height: normal;
		    padding: 7px;
		
		    .name {
		      text-overflow: ellipsis;
		      overflow: hidden;
		    }
		    .addr {
		      font-size: 12px;
		      color: #b4b4b4;
			  
		    }
		
		    .highlighted .addr {
		      color: #ddd;
			 
		    }
		  }
	}
	.box-form-org{
		/deep/ .el-select__tags span:first-child{
			margin-left: 160px;
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
	.input-select {
		>>> .el-select__tags {
			display: none !important;
		}
	}
</style>
