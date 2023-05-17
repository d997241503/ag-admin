<template>
	<div class="tier-page content">
		<!-- <div @click="goBack()" class="go-back-img">
			<img src="~@/assets/img/go_back.png" alt="返回"></img>
		</div> -->
		<div class="page-title">{{$route.name}}</div>
		<el-divider></el-divider>
		<div class="content-body">
			<el-form :model="form" ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="100px">
				<el-form-item label="名称：" prop="name">
					<div class="form-text">{{form.educationName}}</div>
				</el-form-item>
				<!-- <el-form-item label="媒体级别：">
					<div class="form-text">{{fomatMediaLevel(form.educationRank)}}</div>
				</el-form-item> -->
				<el-form-item label="所属分类：">
					<div class="form-text">{{form.categoryName}}</div>
				</el-form-item>
				<el-form-item label="展示位置：">
					<div class="form-text">{{form.sort}}</div>
				</el-form-item>
				<el-form-item label="类型：">
					<div class="form-text">{{fomatType(form.educationType)}}</div>
				</el-form-item>
				<el-form-item label="文字条例：" v-if="form.educationType == '0'">
					<div class="form-text" v-html="form.files.length && form.files[0].value"></div>
				</el-form-item>
				<el-form-item label="图片文件：" v-if="form.educationType == '1'">
					<div v-if="form.files && form.files.length" class="file-roll-containers">
						<div class="file-info" v-for="(item, index) in form.files" :key="index">
							<div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item.value | formatFile}}</div>
							<div class="file-download" @click="downloadHadle(item.value)">下载</div>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="视频文件：" v-if="form.educationType == '2'">
					<div v-if="form.files && form.files.length" class="file-roll-containers">
						<div class="file-info" v-for="(item, index) in form.files" :key="index">
							<div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item.value | formatFile}}</div>
							<div class="file-download" @click="downloadHadle(item.value)">下载</div>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="链接地址：" v-if="form.educationType == '3'">
					<div class="form-text">{{form.files && form.files.length ? form.files[0].value : ''}}</div>
				</el-form-item>
			</el-form>
			<!-- <div slot="footer" class="dialog-footer" align="right">
				<el-button @click="goBack()">返 回</el-button>
			</div> -->
		</div>
	</div>
</template>

<script>
	import {
		getArticleObj
	} from 'api/incorrupt/education/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		formatFile
	} from 'utils';
	import {
		getProcessInstance
	} from "@/api/bpm/processInstance";
	export default {
		data() {
			return {
				form: {
					educationName: undefined,
					files: []
				},
				// 类型
				educationTypes: [{
					value: '文字条例',
					code: '0'
				}, {
					value: '图片图解',
					code: '1'
				}, {
					value: '音视频',
					code: '2'
				}, {
					value: '外部链接',
					code: '3'
				}],
				// 媒体级别
				mediaLevels: [],
				operation: '',
				processId: undefined
			}
		},
		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			}
		},
		computed: {
			...mapGetters([
				'elements'
			]),

			// 类型转换
			fomatType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.educationTypes.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},

			// 媒体级别转换
			fomatMediaLevel() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.mediaLevels.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},

		},
		created() {
			this.operation = this.$route.query.operation;
			this.processId = this.$route.query.processId;
			// 获取媒体级别
			this.getDataDicts("mediaLevel").then((res) => {
				this.mediaLevels = res;
			});
			this.init();
		},
		methods: {
			// goBack() {
			// 	this.$router.go(-1);
			// },

			// 下载文件
			downloadHadle(url) {
				// window.location.href = `/api/upload/download/downloadEducationFile?fileUrl=${url}&token=${getToken()}`;
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=education`;
			},

			// 初始化当前页面
			init() {
				this.$nextTick(() => {
					if (this.$route.query.id) {
						getArticleObj(this.$route.query.id)
							.then(response => {
								this.form = response.data;
							});
					} else if (this.processId) {
						getProcessInstance(this.processId).then(response => {
							if (!response.data) {
								this.$message.error('查询不到流程信息！');
								return;
							}
							this.form = response.data.formVariables;
						});
					}
				})
			},

			// 获取字典
			getDataDicts(type) {
				if (!type) return;
				let val = null
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

			.file-info {
				display: flex;

				.file-img {
					width: 30px;
					// margin-top: 5px;

					img {
						width: 25px;
						height: 25px
					}
				}

				.file-text {
					flex: 1;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #555555;
					text-align: left;
					margin-left: 5px;
				}

				.file-download {
					width: 50px;
					text-align: center;
					color: #555555;
					text-decoration: underline;
				}

				.file-download:hover {
					cursor: pointer;
					color: #888888;
				}
			}
		}
	}
</style>
