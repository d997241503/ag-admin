<template>
	<div class="tier-page content">
		<div class="content-body">
			<el-form :model="form" ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="150px">
                <el-form-item label="专项监督主题：" prop="name">
					<div class="form-text">{{superviseOrgInfo.supervisionTheme}}</div>
				</el-form-item>
				<el-form-item label="专项监督时间：">
					<div class="form-text" v-if="superviseOrgInfo.startTime && superviseOrgInfo.endTime">{{superviseOrgInfo.startTime}} 至 {{superviseOrgInfo.endTime}}</div>
				</el-form-item>
                <el-form-item label="项目负责人：">
					<div class="form-text">{{superviseOrgInfo.responsiblePerson ? superviseOrgInfo.responsiblePerson.map(person => person.name).join('、') : ''}}</div>
				</el-form-item>
				<el-form-item label="被监督对象：">
					<div class="form-text">
						<span v-for="(item,index) in superviseOrgInfo.issueOrg" :key="index">
							<span>{{item.orgName}}</span>
							<span v-if="index !== superviseOrgInfo.issueOrg.length-1">、</span>
						</span>
					</div>
				</el-form-item>
				<el-form-item label="下发时间：">
					<div class="form-text">{{superviseOrgInfo.issueTime}}</div>
				</el-form-item>
				<el-form-item label="附件：">
					<div v-if="superviseOrgInfo.issueFiles && superviseOrgInfo.issueFiles.length" class="file-roll-containers">
						<div class="file-info" v-for="(item, index) in superviseOrgInfo.issueFiles" :key="index">
							<div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item | formatFile}}</div>
							<div class="file-download" @click="downloadHadle(item)">下载</div>
						</div>
					</div>
				</el-form-item>
                <el-form-item label="备注：">
                    <div class="row-value">{{superviseOrgInfo.remarks}}</div>
                </el-form-item>
			</el-form>
		</div>
        <!-- <div style="width:100%;margin: 50px auto;text-align: center;">
			<el-button @click="$emit('cancel')" style="width:180px;">取消</el-button>
		</div> -->
	</div>
</template>

<script>
    
	import {
		getToken
	} from 'utils/auth';
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
        props: {
          superviseOrgInfo: {
            type: Object,
            default: () => ({})
          }  
        },
		methods: {

			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=special`;
			},

			// 初始化当前页面
			init() {
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.content {

        .row-value {
            min-height: 36px;
            color: #555;
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
