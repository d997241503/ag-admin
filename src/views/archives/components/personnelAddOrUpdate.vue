<template>
	<el-dialog title="人员库管理" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="135px" label-position="left">
			<el-form-item label="M8及以上：" prop="aboveM8Name" class="box-form">
				<!-- <el-select class="input-item elinput" v-model="dataForm.names" clearable multiple @focus="closeIt" ref="selectIt" style="width:100%;"
				 @remove-tag="removeTag" placeholder="点击右侧按钮选择人员">
					<el-button slot="append" icon="el-icon-thumb" @click="userDialogHandle('选择M8及以上人员')">选择</el-button>
				</el-select> -->
				<el-button @click="personnelFistHandle('M8及以上')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.aboveM8.length ? dataForm.aboveM8.length : 0}}人)</span>
				</el-button>
				<el-select class="input-item elinput" v-model="dataForm.aboveM8Name" clearable multiple @focus="closeIt" ref="selectIt" style="width:100%;"
				 @remove-tag="aboveM8RemoveTag" placeholder="" @clear="aboveM8Clear">
				</el-select>
			</el-form-item>
			<el-form-item label="关键岗位人员：" prop="highRiskPositionName" class="box-form">
				<!-- <el-select v-model="dataForm.deputyGroupLeader" placeholder="请选择" clearable style="width: 86%">
					<el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select> -->
				<!-- <el-select v-model="dataForm.deputyGroupLeader" multiple filterable remote placeholder="请输入关键词"
				 key="deputyGroupLeader-type" :remote-method="remoteGroupLeaderMethod" :loading="loading" style="width:100%;">
					<el-option v-for="item in mItems" :key="item.id" :label="item.name" :value="item.id"> </el-option>
				</el-select> -->
				<el-button @click="personnelFistHandle('关键岗位人员')" type="text"
					class="but-css">
					批量选择人员
					<span>(已选{{dataForm.highRiskPosition.length ? dataForm.highRiskPosition.length : 0}}人)</span>
				</el-button>
				<el-select class="input-item elinput" v-model="dataForm.highRiskPositionName" clearable multiple @focus="closeIt1" ref="selectIt1" style="width:100%;"
				 @remove-tag="highRiskPositionRemoveTag" placeholder="" @clear="highRiskPositionClear">
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit()" :loading="loading">确定</el-button>
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
					aboveM8Name: [],
					highRiskPositionName: [],
					aboveM8: [],
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
					// aboveM8Name: [{
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
			}
		},
		components: {
			fuhsiSelectPersonnel
		},
		watch : {
			checkedData: {
				handler(newVal, oldVal) {
					if(newVal && newVal.resultList && newVal.resultList.length) {
						for(let i=0;i<newVal.resultList.length;i++){
							// if(newVal.label == 'M8及以上') this.dataForm.aboveM8Name.push(newVal.resultList[i].name);
							// if(newVal.label == '关键岗位人员') this.dataForm.highRiskPositionName.push(newVal.resultList[i].name);
						}
					}
					if(newVal.label == 'M8及以上') this.dataForm.aboveM8 = newVal.resultList;
					if(newVal.label == '关键岗位人员') this.dataForm.highRiskPosition = newVal.resultList;
					// if(this.dataForm.aboveM8Name.length>20){
					// 	this.dataForm.aboveM8Name = []
					// 	this.dataForm.aboveM8Name.push(`已选择${this.num}人`)
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
			},
			init(row) {
				this.mItems = [];
				this.visible = true;
				this.getInfo();
				this.$nextTick(() => {
				})
			},
			// 获取详情
			getInfo() {
				personnelpool({
					orgId: undefined
				}).then(response => {
					if(response.data) {
						if(response.data.aboveM8) this.dataForm.aboveM8 = response.data.aboveM8;
						if(response.data.highRiskPosition) this.dataForm.highRiskPosition = response.data.highRiskPosition;
						// if(response.data.aboveM8 && response.data.aboveM8.length) this.dataForm.aboveM8Name = response.data.aboveM8.map(item => { return item.name });
						// if(response.data.highRiskPosition && response.data.highRiskPosition.length) this.dataForm.highRiskPositionName = response.data.highRiskPosition.map(item => { return item.name });
					}
				});
			},
			aboveM8Clear() {
				this.dataForm.aboveM8 = [];
			},
			highRiskPositionClear() {
				this.dataForm.highRiskPosition = [];
			},
			aboveM8RemoveTag(val){
				for(let i = 0; i < this.dataForm.aboveM8.length; i++) {
					if(this.dataForm.aboveM8[i].name == val) {
						this.dataForm.aboveM8.splice(i,1)
					}
				}
			},
			highRiskPositionRemoveTag(val){
				for(let i = 0; i < this.dataForm.highRiskPosition.length; i++) {
					if(this.dataForm.highRiskPosition[i].name == val) {
						this.dataForm.highRiskPosition.splice(i,1)
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
			// 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					if(label == 'M8及以上') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.dataForm.aboveM8));
					if(label == '关键岗位人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.dataForm.highRiskPosition));
   	  				this.$refs.personnelFist.init();
    			})
   			},
			// 表单提交
			dataFormSubmit() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.loading = true;
						updatePersonnelpool(this.dataForm).then(data=> {
								if (data && data.status === 200) {
									this.$notify({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
											this.loading = false;
											this.visible = false
											this.$emit('refreshDataList');
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
</style>
