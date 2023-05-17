<template>
	<el-dialog :title="!dataForm.id ? '新增' : '编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<el-form :model="dataForm" :rules="rules" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
            <el-form-item label="年份：" prop="year">
				<el-date-picker style="width: 86%;" v-model="dataForm.year" type="year" format="yyyy" value-format="yyyy" placeholder="选择年">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="会议主题：" prop="name">
				<el-input style="width: 86%;" v-model="dataForm.name" placeholder="请输入会议主题" clearable
				></el-input>
			</el-form-item>
            <el-form-item label="序号：" prop="sort">
				<el-input-number v-model="dataForm.sort" :min="1"
				></el-input-number>
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
		addMeetingTheme
	} from 'api/meeting/index';
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				visible: false,
				loading: false,
				dataForm: {
                    id: undefined,
                    year: '',
					name: '',
                    sort: 1
				},
				rules: {
					year: [
                        {required: true, message: '请选择年份', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入主题名称', trigger: 'blur'}
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
				} else {
					this.$refs['dataForm'].resetFields()
                    this.dataForm.id = undefined
				}
			},
			
			// 表单提交
			dataFormSubmit(formName) {
				this.dataForm.id ? this.method = 'put' : this.method = 'post'
				// this.method = 'put'
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
                        addMeetingTheme(this.dataForm, this.method)
                        .then((res) => {
                            if (res?.status === 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.visible = false;
                                this.$emit("refreshDataList")
                            } else {
                                this.$notify({
                                    title: '失败',
                                    message: res.msg,
                                    type: 'error',
                                    duration: 2000
                                });
                            }
                        }).catch(() => {
                            this.$notify({
                                title: '失败',
                                message: '操作失败',
                                type: 'error',
                                duration: 2000
                            });
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
