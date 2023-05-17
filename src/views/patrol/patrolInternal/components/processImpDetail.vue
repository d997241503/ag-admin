<template>
	<div class="tier-page content">
		<div class="content-body">
            <span class="content-title">实施过程：</span>
            <div class="content-form" style="width: 70%;margin:10px auto;min-width: 925px;">
                <el-form :model="form" ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="120px">
                    <el-form-item>
                        <el-checkbox-group v-model="checkedCities" :disabled="true">
                            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                        </el-checkbox-group>
                        <el-input class="form-item input-info" v-model="form.otherInfoRecord" placeholder="" clearable :readonly="true"></el-input>
                    </el-form-item>
                    <el-form-item label="文件提报时间：">
                        <div class="form-text">{{form.fileSubmitTime}}</div>
                    </el-form-item>
                    <el-form-item label="实施过程文件：">
                        <div v-if="form.processFiles && form.processFiles.length" class="file-roll-containers">
                            <div class="file-info" v-for="(item, index) in form.processFiles" :key="index">
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
            <el-divider></el-divider>
            <span class="content-title">巡查周例会：</span>
            <div style="width: 70%;margin:10px auto;min-width: 925px;">
                <el-table :data="dataList" border v-loading="dataListLoading" fit highlight-current-row>
                    <el-table-column header-align="center" align="center" type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="meetingTime" header-align="center" align="center" min-width="150" label="周例会时间">
                        <template slot-scope="scope">
                            {{scope.row.meetingTime}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="weeklyMeetingFiles" header-align="center" align="center" min-width="250" label="文件">
                        <template slot-scope="scope">
                            <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-for="(item,index) in scope.row.weeklyMeetingFiles" :key="index">{{item | formatFile}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fileSubmitTime" header-align="center" align="center" min-width="150" label="提报时间">
                        <template slot-scope="scope">
                            {{scope.row.fileSubmitTime}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" width="250" label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.weeklyMeetingFiles && scope.row.weeklyMeetingFiles.length" type="text" size="small" @click="downloadHadle(scope.row.weeklyMeetingFiles)">下载</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
		</div>
	</div>
</template>

<script>
    import {
        getProcessObj,
        getMeetingObj
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
    const cityOptions = ['召开见面及动员会', '问卷调查', '听取工作汇报', '个别谈话','受理信访', '审阅材料', '深入了解', '其他'];
	export default {
		data() {
			return {
                checkedCities: [],
                cities: cityOptions,
                form: {},
				dataList: [],
				dataListLoading: true
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
				if(typeof(url) == 'string') {
					window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=bucket`;
				} else {
					window.location.href = `/api/upload/download/downloadFilesByBucketName?fileUrls=${url}&token=${getToken()}&bucketName=bucket`;
				}
				// if(url.length > 1) window.location.href = `/api/upload/download/downloadFilesByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=bucket`;
				// else window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=bucket`;
			},
			// 初始化当前页面
			init() {
				this.$nextTick(() => {
                    this.checkedCities = [];
					if (this.$route.query.id) {
						this.dataListLoading = true;
						getProcessObj(this.$route.query.id)
							.then(response => {
                                this.form = response.data;
                                if(this.form.handlingLettersAndVisits) this.checkedCities.push('受理信访');
                                if(this.form.individualTalk) this.checkedCities.push('个别谈话');
                                if(this.form.insight) this.checkedCities.push('深入了解');
                                if(this.form.listenEnterpriseWorkReport) this.checkedCities.push('听取工作汇报');
                                if(this.form.meetMobilizationMeeting) this.checkedCities.push('召开见面及动员会');
                                if(this.form.otherInfo) this.checkedCities.push('其它');
                                if(this.form.questionnaireSurvey) this.checkedCities.push('问卷调查');
                                if(this.form.reviewMaterials) this.checkedCities.push('审阅材料');
                            });
                        getMeetingObj(this.$route.query.id)
							.then(response => {
								this.dataList = response.data;
								this.dataListLoading = false;
							});
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
    .content-title {
        font-size: 17px;
        margin-left: 20px;
    }

    .content-form /deep/ .el-checkbox-group {
		display: inline-block;
		width: 70%;
		min-width: 646px;
	}

	.content-form /deep/ .el-checkbox {
		width: 35%;
	}

	.content-form /deep/ .form-item {
		width: 35% !important;
		margin-left: -35%;
	}

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
