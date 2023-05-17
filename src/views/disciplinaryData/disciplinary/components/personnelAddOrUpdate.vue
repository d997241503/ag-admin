<template>
	<el-dialog title="人员库管理" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="135px" label-position="left">
			<el-form-item label="M8及以上：" prop="aboveM6Name" class="box-form">
				<!-- <el-select class="input-item elinput" v-model="dataForm.names" clearable multiple @focus="closeIt" ref="selectIt" style="width:100%;"
				 @remove-tag="removeTag" placeholder="点击右侧按钮选择人员">
					<el-button slot="append" icon="el-icon-thumb" @click="userDialogHandle('选择M8及以上人员')">选择</el-button>
				</el-select> -->
				<el-button @click="personnelFistHandle('M8及以上')" type="text"
					class="but-css">
					批量选择人员
				</el-button>
				<el-select class="input-item elinput" v-model="dataForm.aboveM6Name" clearable multiple @focus="closeIt" ref="selectIt" style="width:100%;"
				 @remove-tag="aboveM6RemoveTag" placeholder="" @clear="aboveM6Clear">
				</el-select>
			</el-form-item>
			<el-form-item label="：" prop="highRiskPositionName" class="box-form">
				<!-- <el-select v-model="dataForm.deputyGroupLeader" placeholder="请选择" clearable style="width: 86%">
					<el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select> -->
				<!-- <el-select v-model="dataForm.deputyGroupLeader" multiple filterable remote placeholder="请输入关键词"
				 key="deputyGroupLeader-type" :remote-method="remoteGroupLeaderMethod" :loading="loading" style="width:100%;">
					<el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select> -->
				<el-button @click="personnelFistHandle('高风险岗位人员')" type="text"
					class="but-css">
					批量选择人员
				</el-button>
				<el-select class="input-item elinput" v-model="dataForm.highRiskPositionName" clearable multiple @focus="closeIt1" ref="selectIt1" style="width:100%;"
				 @remove-tag="highRiskPositionRemoveTag" placeholder="" @clear="highRiskPositionClear">
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
		personnelpool,
		updatePersonnelpool
	} from 'api/archives/index';
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
				checkedData:[],
				visible: false,
				lItems: [],
				mItems: [],
				loading: false,
				dataForm: {
					aboveM6Name: [],
					highRiskPositionName: [],
					aboveM6: [],
					highRiskPosition: []
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
					aboveM6Name: [{
						required: true,
						message: '请选择M8及以上',
						trigger: 'change'
					}],
					highRiskPositionName: [{
						required: true,
						message: '请选择高风险岗位人员',
						trigger: 'change'
					}]
				},
				method: '',
				num:undefined,
			}
		},
		components: {
			fuhsiSelectPersonnel
		},
		watch : {
			checkedData: {
				handler(newVal, oldVal) {
					// this.dataForm.names = []
					// this.dataForm.userids = []
					// this.num = newVal.resultList.length
					if(newVal && newVal.resultList && newVal.resultList.length) {
						for(let i=0;i<newVal.resultList.length;i++){
							if(newVal.label == 'M8及以上') this.dataForm.aboveM6Name.push(newVal.resultList[i].name);
							if(newVal.label == '高风险岗位人员') this.dataForm.highRiskPositionName.push(newVal.resultList[i].name);
							// this.dataForm.userids.push(newVal[i].id)
						}
					}
					if(newVal.label == 'M8及以上') this.dataForm.aboveM6 = newVal.resultList;
					if(newVal.label == '高风险岗位人员') this.dataForm.highRiskPosition = newVal.resultList;
					// if(this.dataForm.aboveM6Name.length>20){
					// 	this.dataForm.aboveM6Name = []
					// 	this.dataForm.aboveM6Name.push(`已选择${this.num}人`)
					// }
					// if(this.dataForm.highRiskPositionName.length>20){
					// 	this.dataForm.highRiskPositionName = []
					// 	this.dataForm.highRiskPositionName.push(`已选择${this.num}人`)
					// }
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
			initUsers() {
				// getUsers(this.userId).then(response => {
				// 	this.lItems = response.data.leaders;
				// 	this.mItems = response.data.members;
				// });
			},
			init(row) {
				// this.initUsers();
				// if(row) this.dataForm = row
				// else this.$refs['dataForm'].resetFields()
				this.mItems = [];
				// if(row) {
				// 	this.dataForm.id = row.id
				// 	this.dataForm.teamName = row.teamName
				// 	// this.lItems = row.groupLeader;
				// 	// this.mItems = row.deputyGroupLeader;
				// 	for(let i = 0; i < row.groupLeader.length; i++) {
				// 		this.mItems.push(row.groupLeader[i]);
				// 		// this.mItems[i].id = row.groupLeader[i].userId;
				// 	}
				// 	for(let j = 0; j < row.deputyGroupLeader.length; j++) {
				// 		this.mItems.push(row.deputyGroupLeader[j]);
				// 		// this.mItems[j].id = row.deputyGroupLeader[j].userId;
				// 	}
				// 	for(let k = 0; k < row.groupMember.length; k++) {
				// 		this.mItems.push(row.groupMember[k]);
				// 		// this.mItems[k].id = row.groupMember[k].userId;
				// 	}
				// 	for(let m = 0; m < this.mItems.length; m++) {
				// 		this.mItems[m].id = this.mItems[m].userId;
				// 	}
				// 	this.$nextTick(() => {
				// 		this.dataForm.groupLeader = row.groupLeader.map(item => { return item.userId })
				// 		this.dataForm.deputyGroupLeader = row.deputyGroupLeader.map(item => { return item.userId })
				// 		this.dataForm.groupMember = row.groupMember.map(item => { return item.userId })
				// 	})
				// }
				this.visible = true;
				this.getInfo();
				this.$nextTick(() => {
					// this.$refs['dataForm'].resetFields()
					// if (this.dataForm.subjectId) {
					// 	subjectDetail(this.dataForm.subjectId).then(data => {
					// 		if (data && data.code === 0) {
					// 			this.dataForm = data.subjectInfo
					// 		}
					// 	})
					// }
				})
			},
			// 获取详情
			getInfo() {
				personnelpool({
					orgId: undefined
				}).then(response => {
					if(response.data) {
						if(response.data.aboveM6) this.dataForm.aboveM6 = response.data.aboveM6;
						if(response.data.highRiskPosition) this.dataForm.highRiskPosition = response.data.highRiskPosition;
						if(response.data.aboveM6 && response.data.aboveM6.length) this.dataForm.aboveM6Name = response.data.aboveM6.map(item => { return item.name });
						if(response.data.highRiskPosition && response.data.highRiskPosition.length) this.dataForm.highRiskPositionName = response.data.highRiskPosition.map(item => { return item.name });
					}
				});
			},
			aboveM6Clear() {
				this.dataForm.aboveM6 = [];
			},
			highRiskPositionClear() {
				this.dataForm.highRiskPosition = [];
			},
			aboveM6RemoveTag(val){
				for(let i = 0; i < this.dataForm.aboveM6.length; i++) {
					if(this.dataForm.aboveM6[i].name == val) {
						this.dataForm.aboveM6.splice(i,1)
					}
				}
				// this.dataForm.aboveM6.splice(this.dataForm.aboveM6.indexOf(val))
				// if(this.num>=20){
				// 	this.checkedData = []
				// }else{
					// this.checkedData.splice(this.checkedData.indexOf(val))
				// 	this.num--
				// }
			},
			highRiskPositionRemoveTag(val){
				for(let i = 0; i < this.dataForm.highRiskPosition.length; i++) {
					if(this.dataForm.highRiskPosition[i].name == val) {
						this.dataForm.highRiskPosition.splice(i,1)
					}
				}
				// this.dataForm.highRiskPosition.splice(this.dataForm.highRiskPosition.indexOf(val))
				// if(this.num>=20){
				// 	this.checkedData = []
				// }else{
					// this.checkedData.splice(this.checkedData.indexOf(val))
				// 	this.num--
				// }
			},
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			closeIt1() {
				this.$refs.selectIt1.blur();
			},
			// 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					if(label == 'M8及以上') this.$refs.personnelFist.resultList = this.dataForm.aboveM6;
					if(label == '高风险岗位人员') this.$refs.personnelFist.resultList = this.dataForm.highRiskPosition;
   	  				this.$refs.personnelFist.init();
    			})
   			},
			// 表单提交
			dataFormSubmit() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						updatePersonnelpool(this.dataForm).then(data=> {
								if (data && data.status === 200) {
									this.$notify({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
											this.visible = false
										}
									})
								} else {
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
</style>
