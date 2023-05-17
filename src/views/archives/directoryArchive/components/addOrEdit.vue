<template>
	<el-dialog :title="!dataForm.id ? '新增' : '编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
			<el-form-item label="目录：" prop="value">
				<el-input style="width: 86%;" v-model="dataForm.value" placeholder="请输入" clearable
				></el-input>
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
		unitarchivestemplateUpdate
	} from 'api/archives/index';
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				visible: false,
				loading: false,
				dataForm: {
                    id: undefined,
					value: ''
				},
				rules: {
                    value: [
                        {required: true, message: '请输入目录', trigger: 'blur'}
                    ]
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
			init(data) {
				this.visible = true
				if (data) {
					this.dataForm = {
                        ...data
                    }
					this.$nextTick(() => {
						this.$refs['dataForm'].clearValidate()
					})
				} else {
					this.$refs['dataForm'].resetFields()
                    this.dataForm.id = undefined
				}
			},
			
			// 表单提交
			dataFormSubmit(formName) {
				// this.dataForm.id ? this.method = 'put' : this.method = 'post'
				// this.method = 'put'
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
                        unitarchivestemplateUpdate(this.dataForm)
                        .then((res) => {
                            if (res?.status === 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 2000
                                });
								this.loading = false
                                this.visible = false;
                                this.$emit("refreshDataList")
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: res.msg,
                                    type: 'error',
                                    duration: 2000
                                });
								this.loading = false
                            }
                        }).catch(() => {
                            this.$notify({
                                title: '失败',
                                message: '操作失败',
                                type: 'error',
                                duration: 2000
                            });
							this.loading = false
                        }).finally(() => this.loading = false)
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
