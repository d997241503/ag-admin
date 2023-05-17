<template>
	<div class="tier-page content">
		<div class="content-body">
			<el-form :model="form" ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="120px">
                <el-form-item label="考核评价材料：">
					<div v-if="form && form.inspectionAssessFiles && form.inspectionAssessFiles.length" class="file-roll-containers">
						<div class="file-info" v-for="(item, index) in form.inspectionAssessFiles" :key="index">
							<div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item | formatFile}}</div>
							<div class="file-download" @click="downloadHadle(item)">下载</div>
						</div>
					</div>
				</el-form-item>
                <el-form-item label="提报时间：">
					<div class="form-text" v-if="form && form.submitTime">{{form.submitTime}}</div>
				</el-form-item>
                <el-form-item label="考核评价：:">
                    <div class="form-text" v-if="form && form.evaluation">{{form.evaluation}}</div>
                </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
    import {
		getAssessmentObj
	} from 'api/patrol/index';
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
	export default {
		data() {
			return {
				form: {},
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
			])

		},
		created() {
			this.init();
		},
		methods: {

			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=bucket`;
			},

			// 初始化当前页面
			init() {
				this.$nextTick(() => {
					if (this.$route.query.id) {
						getAssessmentObj(this.$route.query.id)
							.then(response => {
								this.form = response.data;
							});
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {

        .row-value {
            min-height: 36px;
            border: 0.0625rem solid #EFEFEF;
            border-radius: 5px;
            padding: 0 15px;
            color: #666666;
        }

		.content-body {
			width: 100%;
			margin: 0 auto;
			// text-align: right;

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
					// flex: 1;
					width: 200px;
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
