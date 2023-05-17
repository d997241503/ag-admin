<template>
	<div class="app-container calendar-list-container nav-content" v-loading="listLoading">
		<div class="page-info" ref="pageInfo">
			<div class="detail-cnt">
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span class="title">会议名称：</span>
                                <span>{{record.conferenceName}}</span>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content bg-purple">
                                <span class="title">会议时间：</span>
                                <span>{{record.conferenceTime}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="grid-content bg-purple">
                                <span class="title">会议地点：</span>
                                <span>{{record.place}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span class="title">主持人：</span>
                                <span v-for="(item,index) in record.compere" :key="item.userId">
                                    {{ item.name }}
								    <span v-if="record.compere.length - 1 !== index">、</span
                                ></span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span class="title">参会人员：</span>
                                <el-popover placement="right" width="500" trigger="click">
									<div class="m-table-wrap">
										<table>
											<thead>
												<tr>
													<th width="70">序号</th>
													<th width="100">用户</th>
													<th width="150">部门</th>
													<th width="150">公司</th>
												</tr>
											</thead>
											<tbody class="m-body">
												<tr v-for="(data, index) in record.conferee" :key="index">
													<td>{{index+1}}</td>
													<td>{{data.name}}</td>
													<el-tooltip :content="data.deptName" placement="top">
														<td>{{data.deptName}}</td>
													</el-tooltip>
													<el-tooltip :content="data.orgName" placement="top">
														<td>{{data.orgName}}</td>
													</el-tooltip>
												</tr>
											</tbody>
										</table>
									</div>
									<span class="page-info-personnel" slot="reference">{{ record.conferee.length ? record.conferee.length : 0 }}人
									</span>
								</el-popover>
                            </div>
                        </el-col>
                         <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span class="title">列席人员：</span>
                                <span class="content">
									<span v-for="(item,index) in record.attendee" :key="item.userId">
										{{ item.name }}
										<span v-if="record.attendee.length - 1 !== index">、</span>
									</span>
									<span v-if="record.attendeeTxt">
										<span v-if="record.attendee && record.attendee.length">、</span>
										{{record.attendeeTxt}}
									</span>
								</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="grid-content bg-purple">
                                <span class="title">备注：</span>
                                <span class="content">{{record.remark}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
								<div>
									<span class="content-title">会议纪要：</span>
									<!-- <div class="wrapper">
										<div @click="handleDownload(file, 'archives')" v-for="file in record.summaryDocument" :key="file">{{formatFile(file)}}</div>
									</div> -->
									<div class="content-right">
										<div class="file-info files-content" v-for="(item,index) in record.summaryDocument" :key="index">
											<div class="file-img">
												<img src="~@/assets/img/file.png" alt="图标"></img>
											</div>
											<div class="file-text">{{item | formatFile}}</div>
											<div class="file-download" @click="downloadHadle(item)">下载</div>
										</div>
									</div>
								</div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
			<el-table :data="record.events" border fit highlight-current-row style="width: 100%;margin-top: 20px;">
				<!-- <el-table-column label="序号" header-align="center" align="center" type="index" width="50px" /> -->
				<el-table-column prop="conferenceEvent" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="研究议题">
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" label="相关文件">
                    <template slot-scope="{row}">
                        <div class="click-text" @click="handleDownload(file, 'largetriple')" v-for="file in row.relevantDocument" :key="file">{{formatFile(file)}}</div>
                    </template>
				</el-table-column>
				<el-table-column prop="orgName" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="决策情况">
                   <template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
								<span v-if="scope.row.decisionSituation">{{largeTripleSituationType(scope.row.decisionSituation)}}</span>
								<span v-if="scope.row.decisionSituationNote">，{{scope.row.decisionSituationNote}}</span>
							</div>
					</template>
				</el-table-column>
                <el-table-column prop="orgName" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="汇报人员">
                    <template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
							<span v-for="(item,index) in scope.row.reportingPerson" :key="item.userId">{{ item.name }}
								<span v-if="scope.row.reportingPerson.length - 1 !== index">、</span></span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
    import {getConferenceRecordObj} from 'api/large'
    import {
		getByType
	} from 'api/admin/dict/index';
    import cloneDeep from 'lodash/cloneDeep'
    import {downloadFile} from 'utils/file'
	export default {
		name: "index",
		data() {
			return {
				list: null,
				listLoading: true,
				name: '',
				index: 0,
                record: {},
                largeTripleSituation: [],
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			largeTripleSituationType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.largeTripleSituation.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},
		},
		
		components: {
		},

		created() {
            this.init();
            // 获取三重一大决策情况
			this.getDataDicts("largeTripleSituation").then((res) => {
				this.largeTripleSituation = res;
			});
		},
		methods: {
            formatFile,
            init() {
                const {id} = this.$route.query
                // this.themeObj = this.$route.params.themeObj
                // this.isEdit = isEdit
                this.id = id
                this.getList()
            },

			// 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=largetriple`;
			},

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
			
			getList() {
				this.listLoading = true;
				getConferenceRecordObj(this.id)
					.then(response => {
						if (response && response.status === 200) {
                            this.record = response.data
						}
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},
            handleDownload: downloadFile
		}
	}
</script>

<style lang="scss" scoped>

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
        min-height: 733px;
        .footer {
            margin-top: 70px;
            text-align: right;
        }
	}

    .page-info-personnel {
		text-decoration:underline;
		cursor: pointer;
	}

	.page-info-personnel:hover {
		color: #bc0000;
	}

	.page-info-personnel:focus {
		color: #bc0000;
	}

    .m-table-wrap {
		color: rgba(0, 0, 0, 0.65);
		font-size: 14px;
		line-height: 1.5;
		table {
			table-layout: fixed;
			width: 100%;
			text-align: center;
			border-radius: 4px 4px 0 0;
			border-collapse: separate;
			border-spacing: 0;
			thead tr th {
				padding: 16px;
				color: rgba(0, 0, 0, 0.85);
				font-weight: 500;
				text-align: center;
				background: #fafafa;
				border-bottom: 1px solid #e8e8e8;
				transition: background .3s ease;
				&:first-child {
					border-top-left-radius: 4px;
				}
				&:last-child {
					border-top-right-radius: 4px;
				}
			}
			.m-body {
				position: relative;
				.m-loading {
					position: absolute;
					width: 100%;
					height: 100%;
				}
				.m-empty {
					padding: 48px 16px;
					color: rgba(0, 0, 0, 0.25);
					font-size: 14px;
					text-align: center;
					background: #fff;
					border-bottom: 1px solid #e8e8e8;
					border-radius: 0 0 2px 2px;
					.u-empty-icon {
					width: 64px;
					height: 41px;
					margin-bottom: 8px;
					}
					.u-empty-desc {
					color: rgba(0, 0, 0, 0.25);
					font-size: 14px;
					}
				}
			}
			tbody tr {
				transition: background .3s;
				td {
					padding: 16px;
					border-bottom: 1px solid #e8e8e8;
					transition: background .3s;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				// &:hover {
				// 	background: #e6f7ff;
				// }
			}
		}
    }

	.page-info-text {
		font-size: 14px;
		padding-bottom: 20px;

		.grid-content {
			display: flex;

			.title {
				width: 100px;
                text-align: right;
			}

			.content-title {
				display: inline-block;
				width: 100px;
				text-align: right;
			}

			.content {
				flex: 1;
			}
		}

		el-row {
			// margin-bottom: 20px;
		}
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

	.content-right {
        margin-top: -21px;
    }

    .files-content {
        margin-left: 100px;
        // margin-top: -21px;
    }
	
</style>d