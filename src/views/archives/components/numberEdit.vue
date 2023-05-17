<template>
	<el-dialog title="编辑" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
			<!-- <el-form-item label="会议类型：" prop="type">
				<el-input style="width: 86%;" v-model="dataForm.type" placeholder="请输入" clearable
				></el-input>
			</el-form-item> -->
			<el-form-item label="档案编号：" prop="deputyGroupLeader">
				<!-- <div v-if="dataForm.id" class="form-member">
					<el-input style="width: 86%;" v-model="dataForm.name" placeholder="请输入" clearable
				    ></el-input>
				</div> -->
				 <!-- v-else -->
				<div class="form-member" v-for="(item, index) in dataForm" :key="index">
					<el-input style="width: 86%;" v-model="dataForm[index].value" placeholder="请输入档案编号" clearable
				    ></el-input>
					<div class="item-btn">
						<span class="btn-info" v-show="index == dataForm.length - 1"
							@click="itemAdd()"><i
								class="el-icon-circle-plus-outline"></i></span>
						<span class="btn-info" v-show="dataForm.length > 1"
							@click="itemDel(index)"><i
								class="el-icon-remove-outline"></i></span>
					</div>
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
        unitarchivesNumber,
		unitarchivesNumberEdit
	} from 'api/archives/index';
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
				dataForm: [
					// id: undefined,
					// type: '',
					// conferenceTypeEvent: [
					// 	{ conferenceTypeEvent: '', id: undefined }
					// ]
                ],
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
				method: '',
                orgId: undefined
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
			init(id) {
				this.visible = true
                if (id) {
                    this.orgId = id;
					unitarchivesNumber(id)
						.then(response => {
                            if(response.data && response.data.length) {
                                this.dataForm = response.data
                            } else {
                                this.dataForm = [
                                    {
                                        id: undefined,
                                        value: ""
                                    }
                                ];
                            }
						});
				}else {
					this.dataForm = [
						 {
                            id: undefined,
                            value: ""
                        }
                    ];
				}
			},

			// 新增元素
			itemAdd() {
				// if (this.dataForm[field].length >= 10) return this.$message.error("最多添加10条");
				this.dataForm.push({ id: undefined, value: "" });
			},

			// 删除元素
			itemDel(index) {
				this.dataForm.splice(index, 1);
			},
			
			// 表单提交
			dataFormSubmit(formName) {
				// const set = this.$refs;
				// set[formName].validate(valid => {
				// 	if (valid) {
						this.loading = true;
						unitarchivesNumberEdit(this.dataForm, this.orgId)
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
				// 	} else {
				// 		return false;
				// 	}
				// });
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
