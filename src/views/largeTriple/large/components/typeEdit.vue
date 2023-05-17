<template>
	<el-dialog :title="!dataForm.id ? '新增' : '编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
			<el-form-item label="会议类型：" prop="type">
				<el-input style="width: 86%;" v-model="dataForm.type" placeholder="请输入会议类型" clearable
				></el-input>
			</el-form-item>
			<!-- <el-form-item label="会议题：" prop="deputyGroupLeader">
				<div class="form-member" v-for="(item, index) in dataForm.conferenceTypeEvent" :key="index">
					<el-input style="width: 86%;" v-model="dataForm.conferenceTypeEvent[index].conferenceTypeEvent" placeholder="请输入会议题" clearable
				    ></el-input>
					<div class="item-btn">
						<span class="btn-info" v-show="index == dataForm.conferenceTypeEvent.length - 1"
							@click="itemAdd('conferenceTypeEvent')"><i
								class="el-icon-circle-plus-outline"></i></span>
						<span class="btn-info" v-show="dataForm.conferenceTypeEvent.length > 1"
							@click="itemDel('conferenceTypeEvent',index)"><i
								class="el-icon-remove-outline"></i></span>
					</div>
				</div>
			</el-form-item> -->
		</el-form>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit('dataForm')" :loading="loading">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		addConferencetype
	} from 'api/large/index';
	import { mapGetters } from 'vuex';
	export default {
		props: {
			groupId: {
				default: '1'
			}
		},
		data() {
			return {
				visible: false,
				loading: false,
				dataForm: {
					id: undefined,
					type: '',
					conferenceTypeEvent: [
						{ conferenceTypeEvent: '', id: undefined }
					]
				},
				dataRule: {
					// teamName: [{
					// 	required: true,
					// 	message: '巡查小组名不能为空',
					// 	trigger: 'blur'
					// }],
					// groupLeader: [{
					// 	required: true,
					// 	message: '请选择组长',
					// 	trigger: 'change'
					// }]
				},
				method: ''
			}
		},
		created() {
		},
		computed: {
			...mapGetters([
				'userId'
			])
		},
		methods: {
			init(row) {
				this.visible = true
				if (row) {
					this.dataForm = {...row};
					if(!this.dataForm.conferenceTypeEvent) {
						this.dataForm.conferenceTypeEvent = [
							{ conferenceTypeEvent: '', id: undefined }
						]
					}
				} else {
					this.dataForm = {
						id: undefined,
						type: '',
						conferenceTypeEvent: [
							{ conferenceTypeEvent: '', id: undefined }
						]
					};
				}
			},

			// 新增元素
			itemAdd(field) {
				// if (this.dataForm[field].length >= 10) return this.$message.error("最多添加10条");
				this.dataForm[field].push({ conferenceTypeEvent: '', id: undefined });
			},

			// 删除元素
			itemDel(field, index) {
				this.dataForm[field].splice(index, 1);
			},
			
			// 表单提交
			dataFormSubmit(formName) {
				this.dataForm.id ? this.method = 'put' : this.method = 'post'
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addConferencetype(this.dataForm, this.method)
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
			}
		}
	}
</script>

<style lang="scss" scoped>
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
</style>
