<template>
	<div class="tier-page content">
		<div class="content-body" v-for="(item,index) in form" :key="index">
			<div style="width: 70%;margin:10px auto;">
				<el-form ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="120px">
					<el-form-item label="文件提报时间：">
						<div class="form-text">{{form[index].fileSubmitTime}}</div>
					</el-form-item>
					<el-form-item label="实施过程文件：">
						<div v-if="form[index].rectificationConditionFiles && form[index].rectificationConditionFiles.length" class="file-roll-containers">
							<div class="file-info" v-for="(item, index) in form[index].rectificationConditionFiles" :key="index">
								<div class="file-img">
									<img src="~@/assets/img/file.png" alt="图标"></img>
								</div>
								<div class="file-text">{{item | formatFile}}</div>
								<div class="file-download" @click="downloadHadle(item)">下载</div>
							</div>
						</div>
					</el-form-item>
				</el-form>
			</div>
            <el-divider v-if="form.length > 1"></el-divider>
		</div>
		<el-divider v-if="DataForm"></el-divider>
		<div v-if="DataForm" class="content-body">
			<div style="width: 70%;margin:10px auto;">
				<el-form ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="120px">
					<el-form-item label="文书：">
						<span>党支部书记履行第一责任人责任抓好反馈意见落实情况的报告：</span>
						<div v-if="DataForm.fileList1 && DataForm.fileList1.length" class="file-roll-containers">
							<div class="file-info" v-for="(item, index) in DataForm.fileList1" :key="index">
								<div class="file-img">
									<img src="~@/assets/img/file.png" alt="图标"></img>
								</div>
								<div class="file-text">{{item | formatFile}}</div>
								<div class="file-download" @click="downloadHadle(item)">下载</div>
							</div>
						</div>
						<span>党集团党委××年第×轮巡查的整改报告：</span>
						<div v-if="DataForm.fileList2 && DataForm.fileList2.length" class="file-roll-containers">
							<div class="file-info" v-for="(item, index) in DataForm.fileList2" :key="index">
								<div class="file-img">
									<img src="~@/assets/img/file.png" alt="图标"></img>
								</div>
								<div class="file-text">{{item | formatFile}}</div>
								<div class="file-download" @click="downloadHadle(item)">下载</div>
							</div>
						</div>
						<span>巡查反馈意见的整改清单：</span>
						<div v-if="DataForm.fileList3 && DataForm.fileList3.length" class="file-roll-containers">
							<div class="file-info" v-for="(item, index) in DataForm.fileList3" :key="index">
								<div class="file-img">
									<img src="~@/assets/img/file.png" alt="图标"></img>
								</div>
								<div class="file-text">{{item | formatFile}}</div>
								<div class="file-download" @click="downloadHadle(item)">下载</div>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="备注：">
						<div class="form-text">{{DataForm.note}}</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
    import {
		getSituationObj,
		getDocumentObj
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
				form: [],
				DataForm: []
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
						getSituationObj(this.$route.query.id)
							.then(response => {
								this.form = response.data;
							});
						getDocumentObj(this.$route.query.id)
							.then(response => {
								this.DataForm = response.data;
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
