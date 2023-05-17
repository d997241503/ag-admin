<template>
	<el-dialog :title="!dataForm.id ? '规则设置新增' : '规则设置编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
			<el-form-item label="事项：" prop="eventName">
				<el-input style="width: 86%;" v-model="dataForm.eventName" placeholder="请输入事项" clearable
				></el-input>
			</el-form-item>
			<el-form-item label="时间要求：" prop="reportTime">
				<div class="personnel-row">
					<div style="width:100px;text-align:center;">会议召开前</div>
					<div class="item-gird">
						<el-input v-model="dataForm.reportTime" type="number" placeholder="请输入" clearable
						></el-input>
					</div>
					<div style="width:25px;text-align:center;">天</div>
				</div>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="dataFormSubmit('dataForm')" :loading="loading">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		addRuleset
	} from 'api/large/index';
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				visible: false,
				loading: false,
				dataForm: {
					id: undefined,
					eventName: '',
					reportTime: ''
				},
				dataRule: {
					// eventName: [{
					// 	required: true,
					// 	message: '事项不能为空',
					// 	trigger: 'blur'
					// }],
					// reportTime: [{
					// 	required: true,
					// 	message: '时间要求不能为空',
					// 	trigger: 'blur'
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
				} else {
					this.dataForm = {
						id: undefined,
						eventName: '',
						reportTime: ''
					};
				}
			},
			
			// 表单提交
			dataFormSubmit(formName) {
				this.dataForm.id ? this.method = 'put' : this.method = 'post'
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						addRuleset(this.dataForm, this.method)
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

		.form-member-select-id {
			width: 42%;
		}

		.form-member-post-id {
			width: 42%;
    		margin-left: 16px;
		}

		.form-member-select {
			width: 38%;
		}

		.form-member-post {
			width: 38%;
			margin-left: 20px;
		}

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

	.personnel-row {
		width: 86%;
		display: flex;
		justify-content: space-between;

		.item-gird {
			width: 75%;
			text-align: center;
			// border: 0.0625rem solid #EFEFEF;
			border-radius: 10px;
			font-size: 15px;
		}
	}
</style>
