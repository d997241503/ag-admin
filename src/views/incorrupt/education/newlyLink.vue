<template>
	<div class="tier-page content">
		<!-- <div @click="goBack()" class="go-back-img">
			<img src="~@/assets/img/go_back.png" alt="返回"></img>
		</div> -->
		<div class="page-title">{{category && category.name}}</div>
		<el-divider></el-divider>
		<div class="content-body">
			<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-position="left"
			 label-width="100px">
				<el-form-item label="名称：" prop="educationName">
					<el-input v-model="form.educationName" maxlength="50" show-word-limit placeholder="请输入名称" clearable></el-input>
				</el-form-item>
				<el-form-item label="所属分类：">
					<div class="form-text">{{category && category.name}}</div>
				</el-form-item>
				<el-form-item label="类型：">
					<div class="form-text">超链接</div>
				</el-form-item>
				<el-form-item label="链接地址：" prop="linkUrl">
					<el-input v-model="form.linkUrl" placeholder="请输入链接地址" maxlength="1000" clearable></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer" align="center">
				<el-button @click="goBack()">返 回</el-button>
				<el-button type="primary" @click="create('form')" :loading="loading">确 定</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		getLinkArticleObj,
		addObj
	} from 'api/incorrupt/education/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	import {
		validateURL
	} from '@/utils/validate'
	export default {
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			var validateUrl = (rule, value, callback) => {
				if (!validateURL(value)) {
					callback(new Error('链接地址格式错误'))
				} else {
					callback()
				}
			};
			return {
				loading: false,
				form: {
					categoryId: undefined,
					educationName: undefined,
					educationType: '3',
					linkUrl: undefined,
					files: []
				},
				rules: {
					educationName: [{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						},
						{
							validator: validateEmpty,
							trigger: 'blur'
						}
					],
					linkUrl: [{
							required: true,
							message: '请输入链接地址',
							trigger: 'blur'
						},
						{
							validator: validateUrl,
							trigger: 'blur'
						}
					]
				},
			}
		},
		created() {
			if (this.category == undefined) this.goBack();
			if (this.category) this.getList();
		},
		mounted() {
			this.$nextTick(() => {
				this.resetTemp();
			})
		},
		computed: {
			...mapGetters([
				'category'
			]),
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},

			// 创建链接类信息
			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						var val = {
							value: ""
						}
						val.value = this.form.linkUrl;
						this.form.files.push(val);
						this.form.categoryId = this.category && this.category.categoryId;
						this.loading = true;
						addObj(this.form)
							.then((res) => {
								if (res && res.code === 0) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										this.loading = false;
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
								this.loading = false;
							})
					} else {
						return false;
					}
				});
			},

			// 获取数据列表
			getList() {
				getLinkArticleObj({
						categoryId: this.category && this.category.categoryId
					})
					.then(response => {
						if (response && response.code === 0) {
							var data = response.data;
							if (data) {
								this.form.educationName = data.educationName;
								this.form.linkUrl = data.files[0].value;
							}
						} else {}
					}).catch(() => {})
			},

			// 重置数据
			resetTemp() {
				this.$refs.form.resetFields();
				this.form = {
					categoryId: undefined,
					educationName: undefined,
					educationType: '3',
					linkUrl: undefined,
					files: []
				};
			}

		}
	}
</script>

<style lang="scss" scoped>
	.content {
		.page-title {
			width: 180px;
			height: 30px;
			margin: 0 auto;
			margin-bottom: -24px;
			line-height: 30px;
			background-color: #bc0000;
			color: #FFFFFF;
			font-size: 15px;
			text-align: center;
			border-radius: 5px;
		}

		.content-body {
			width: 50%;
			margin: 0 auto;
			text-align: right;

			.form-item {
				width: 100%;
			}

			.form-text {
				color: #555555;
				text-align: left;
				word-wrap: break-word;
				word-break: normal;
			}
		}
	}
</style>
