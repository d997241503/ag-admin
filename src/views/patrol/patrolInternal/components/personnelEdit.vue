<template>
	<el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
			<el-form-item label="巡查小组：" prop="teamName">
				<el-input v-model="dataForm.teamName" placeholder="请输入巡查小组" style="width: 86%" maxlength="250"></el-input>
			</el-form-item>
			<el-form-item label="巡查小组组长：" prop="groupLeader" class="box-form">
				<!-- <el-select v-model="dataForm.groupLeader" multiple filterable remote placeholder="请输入巡查小组组长名称"
				 key="groupLeader-type" :remote-method="remoteLeaderMethod"
				  @change="groupLeaderChange" :loading="loading" style="width: 86%">
					<el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select> -->
				<el-button @click="personnelFistHandle('组长')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.groupLeader.length ? dataForm.groupLeader.length : 0}}人)</span>
				</el-button>
				<el-select v-if="personnelFistVisible" class="input-item input-select elinput" v-model="dataForm.groupLeader" multiple @focus="closeIt" ref="selectIt" style="width:90%;"
				 placeholder="">
				</el-select>
			</el-form-item>
			<el-form-item label="巡查小组副组长：" prop="deputyGroupLeader" class="box-form">
				<!-- <el-select v-model="dataForm.deputyGroupLeader" multiple filterable remote placeholder="请输入巡查小组副组长名称"
				 key="deputyGroupLeader-type" :remote-method="remoteGroupLeaderMethod" :loading="loading" style="width: 86%">
					<el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select> -->
				<el-button @click="personnelFistHandle('副组长')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.deputyGroupLeader.length ? dataForm.deputyGroupLeader.length : 0}}人)</span>
				</el-button>
				<el-select v-if="personnelFistVisible" class="input-item input-select elinput" v-model="dataForm.deputyGroupLeader" multiple @focus="closeIt1" ref="selectIt1" style="width:90%;"
				  placeholder="">
				</el-select>
			</el-form-item>
			<el-form-item label="巡查小组组员：" prop="groupMember" class="box-form">
				<!-- <el-select v-model="dataForm.groupMember" multiple filterable remote placeholder="请输入巡查小组组员名称"
				 key="groupMember-type" :remote-method="remoteMemberMethod" :loading="loading" style="width: 86%">
					<el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select> -->
				<el-button @click="personnelFistHandle('组员')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.groupMember.length ? dataForm.groupMember.length : 0}}人)</span>
				</el-button>
				<el-select v-if="personnelFistVisible" class="input-item input-select elinput" v-model="dataForm.groupMember" multiple @focus="closeIt2" ref="selectIt2" style="width:90%;"
				 placeholder="">
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit()" :loading="subLoading">确定</el-button>
		</span>
		<!-- 弹窗 选择人员 -->
		<fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
	</el-dialog>
</template>

<script>
	import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	import {
		page
	} from 'api/admin/user/index';
	import {
		getUsers,
		modifyUsers
	} from 'api/admin/group/index';
	import {
		addTeamObj,
		updateTeamObj
	} from 'api/patrol/index';
	import { mapGetters } from 'vuex';
	export default {
		props: {
			groupId: {
				default: '1'
			}
		},
		data() {
			return {
				subLoading: false,
				visible: false,
				lItems: [],
				mItems: [],
				loading: false,
				dataForm: {
					id: undefined,
					teamName: '',
					groupLeader: [],
					deputyGroupLeader: [],
					groupMember: []
				},
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
					teamName: [{
						required: true,
						message: '巡查小组名不能为空',
						trigger: 'blur'
					}],
					groupLeader: [{
						required: true,
						message: '请选择组长',
						trigger: 'change'
					}],
					deputyGroupLeader: [{
						required: true,
						message: '请选择副组长',
						trigger: 'change'
					}],
					groupMember: [{
						required: true,
						message: '请选择小组成员',
						trigger: 'change'
					}]
				},
				method: '',
				personnelFistVisible:false,
				checkedData:[],
			}
		},
		components: {
			fuhsiSelectPersonnel
		},
		watch : {
			checkedData: {
				handler(newVal, oldVal) {
					// if(newVal.label == '组长') this.dataForm.groupLeaderName = [];
					// if(newVal.label == '副组长') this.dataForm.deputyGroupLeaderName = [];
					// if(newVal.label == '组员') this.dataForm.groupMemberName = [];
					// if(newVal && newVal.resultList && newVal.resultList.length) {
					// 	for(let i=0;i<newVal.resultList.length;i++){
					// 		if(newVal.label == '组长') this.dataForm.groupLeaderName.push(newVal.resultList[i].name);
					// 		if(newVal.label == '副组长') this.dataForm.deputyGroupLeaderName.push(newVal.resultList[i].name);
					// 		if(newVal.label == '组员') this.dataForm.groupMemberName.push(newVal.resultList[i].name);
					// 	}
					// 	this.personnelFistVisible=false;
					// 	this.$nextTick(()=>{
					// 		this.personnelFistVisible=true;
					// 	})
					// }
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
			remoteLeaderMethod(query) {
				if (query !== '') {
					this.loading = true;
					this.loading = false;
					page({
						name: query
					}).then(response => {
						this.mItems = response.data.rows;
						this.total = response.data.total;
						this.loading = false;
					});
				} else {
					this.mItems = [];
				}
			},
			remoteGroupLeaderMethod(query) {
				if (query !== '') {
					this.loading = true;
					this.loading = false;
					page({
						name: query
					}).then(response => {
						this.mItems = response.data.rows;
						this.total = response.data.total;
						this.loading = false;
					});
				} else {
					this.mItems = [];
				}
			},
			remoteMemberMethod(query) {
				if (query !== '') {
					this.loading = true;
					this.loading = false;
					page({
						name: query
					}).then(response => {
						this.mItems = response.data.rows;
						this.total = response.data.total;
						this.loading = false;
					});
				} else {
					this.mItems = [];
				}
			},
			groupLeaderChange(val) {
			},
			initUsers() {
			},
			init(row) {
				this.personnelFistVisible=true;
				this.mItems = [];
				this.dataForm.id = undefined
				if(row) {
					this.dataForm = {...row}
					// this.dataForm.id = row.id
					// this.dataForm.teamName = row.teamName
					// for(let i = 0; i < row.groupLeader.length; i++) {
					// 	this.mItems.push(row.groupLeader[i]);
					// }
					// for(let j = 0; j < row.deputyGroupLeader.length; j++) {
					// 	this.mItems.push(row.deputyGroupLeader[j]);
					// }
					// for(let k = 0; k < row.groupMember.length; k++) {
					// 	this.mItems.push(row.groupMember[k]);
					// }
					// for(let m = 0; m < this.mItems.length; m++) {
					// 	this.mItems[m].id = this.mItems[m].userId;
					// }
					// this.$nextTick(() => {
					// 	this.dataForm.groupLeader = row.groupLeader.map(item => { return item.userId })
					// 	this.dataForm.deputyGroupLeader = row.deputyGroupLeader.map(item => { return item.userId })
					// 	this.dataForm.groupMember = row.groupMember.map(item => { return item.userId })
					// })
				} else {
					// this.$nextTick(() => {
					// 	if(!this.dataForm.id) this.$refs['dataForm'].resetFields()
					// })
					this.dataForm = {
						id: undefined,
						teamName: '',
						groupLeader: [],
						deputyGroupLeader: [],
						groupMember: []
					}
					this.$nextTick(() => {
						this.$refs['dataForm'].clearValidate();
					})
				}
				this.visible = true
			},
			// 表单提交
			dataFormSubmit() {
				this.dataForm.id ? this.method = 'put' : this.method = 'post'
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.subLoading = true;
						addTeamObj(this.dataForm,this.method).then(data=> {
								if (data && data.status === 200) {
									this.$notify({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
											this.subLoading = false;
											this.visible = false
											this.$emit('refreshDataList')
										}
									})
								} else {
									this.subLoading = false;
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
	.input-select {
		>>> .el-select__tags {
			display: none !important;
		}
	}
</style>
