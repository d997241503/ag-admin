<template>
	<el-dialog :title="!form.id ? '添加意见：' : '编辑'" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
		<div class="page-form">
			<el-form :model="form" :rules="rules" ref="form" style="font-size: 15px;" label-width="150px"
			label-position="right">
				<el-form-item label="临时议题：" prop="place">
					<el-radio v-model="form.temporary" :label="true">有临时议题</el-radio>
  					<el-radio v-model="form.temporary" :label="false">无临时议题</el-radio>
				</el-form-item>
				<el-form-item label="意见选择：" prop="disciplineInspectionOpinion" style="margin-top: 22px;">
					<el-select style="width: 86%;" v-model="form.disciplineInspectionOpinion" placeholder="请选择" clearable @change="disciplineInspectionOpinionChange">
						<el-option
						v-for="item in largeTripleOpinion"
						:key="item.code"
						:label="item.value"
						:value="item.code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="form.disciplineInspectionOpinion !== '1'" label="意见说明：" prop="disciplineInspectionOpinionNote" key="disciplineInspectionOpinionNote0">
					<el-input style="width: 86%;" v-model="form.disciplineInspectionOpinionNote" type="textarea" rows="4" maxlength="500" resize="none"
					placeholder="请输入意见说明"></el-input>
				</el-form-item>
                <el-form-item v-else label="意见说明：" key="disciplineInspectionOpinionNote1">
					<el-input style="width: 86%;" v-model="form.disciplineInspectionOpinionNote" type="textarea" rows="4" maxlength="500" resize="none"
					placeholder="请输入意见说明"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<span slot="footer" class="dialog-footer" align="center">
			<el-button @click="visible = false">取消</el-button>
			<el-button type="primary" @click="create('form')" :loading="loading">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
	import {
		audit
	} from 'api/large/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getByType
	} from 'api/admin/dict/index';
	export default {
		name: '',
		data() {
			return {
				visible: false,
				form: {
					id: undefined,
					temporary: undefined,
					disciplineInspectionOpinion: '',
					disciplineInspectionOpinionNote: '',
				},
				rules: {
					disciplineInspectionOpinion: {
						required: true,
						message: '请选择意见',
						trigger: 'change'
					},
                    disciplineInspectionOpinionNote: {
						required: true,
						message: '请输入意见说明',
						trigger: 'blur'
					},
				},
				loading: false,
				largeTripleOpinion: [],
				id: undefined
			}
		},
		components: {
		},
		created() {
		},
		computed: {
			...mapGetters([
				'elements','deptFields'
			])
		},
		methods: {
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

			// 初始化当前页面
			init(id) {
				this.visible = true;
				this.id = id;
				// 获取三重一大纪检意见
				this.getDataDicts("largeTripleOpinion").then((res) => {
					this.largeTripleOpinion = res;
				});
				this.$nextTick(() => {
					this.resetTemp();
				})
			},

            disciplineInspectionOpinionChange(e) {
                if(e == '1') {
                    this.$nextTick(() => {
                        this.$refs.form.clearValidate('disciplineInspectionOpinionNote')
                    })
                }
            },

			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						audit(this.form, this.id )
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
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

			// 重置数据
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					id: undefined,
					temporary: undefined,
					disciplineInspectionOpinion: '',
					disciplineInspectionOpinionNote: '',
				};
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
</style>
