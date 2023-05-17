<template>
	<div class="tier-page content">
		<div class="content-body">
			<el-form :model="form" ref="form" size="mini" style="font-size: 15px;" label-position="left" label-width="100px">
				<el-form-item label="巡查主题：" prop="name">
					<div class="form-text">{{form.inspectionTheme}}</div>
				</el-form-item>
				<el-form-item label="巡查时间：">
					<div class="form-text" v-if="form.inspectionStartDate && form.inspectionEndDate">{{form.inspectionStartDate}}至{{form.inspectionEndDate}}</div>
				</el-form-item>
				<el-form-item label="巡查小组：">
					<div class="form-text">
                        {{form.inspectionObjectName}}<p> </p>
						<span v-if="headman && headman.length">组长：
							<span v-for="(item,index) in headman" :key="index">
								<span>{{item}}</span>
								<span v-if="index !== headman.length - 1">、</span>
								<span v-if="index == headman.length - 1">；</span>
							</span>
						</span>
						<span v-if="pendragon && pendragon.length">副组长：
							<span v-for="(item,index) in pendragon" :key="index">
								<span>{{item}}</span>
								<span v-if="index !== pendragon.length - 1">、</span>
								<span v-if="index == pendragon.length - 1">；</span>
							</span>
						</span>
						<span v-if="member && member.length">成员：
							<span v-for="(item,index) in member" :key="index">
								<span>{{item}}</span>
								<span v-if="index !== member.length - 1">、</span>
								<span v-if="index == member.length - 1">；</span>
							</span>
						</span>
                    </div>
				</el-form-item>
				<el-form-item label="巡查对象：">
					<div class="form-text">{{form.inspectionObjectName}}</div>
				</el-form-item>
				<el-form-item label="下发时间：">
					<div class="form-text">{{form.issuedTime}}</div>
				</el-form-item>
				<el-form-item label="文件：">
					<div v-if="form.planFiles && form.planFiles.length" class="file-roll-containers">
						<div class="file-info" v-for="(item, index) in form.planFiles" :key="index">
							<div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item | formatFile}}</div>
							<div class="file-download" @click="downloadHadle(item)">下载</div>
						</div>
					</div>
				</el-form-item>
                <el-form-item label="备注：">
                    <div class="row-value">{{form.note}}</div>
                </el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
    import {
		getPlanObj
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
				// 类型
				userTypes: [{
					value: '组长',
					code: '1'
				}, {
					value: '副组长',
					code: '2'
				}, {
					value: '成员',
					code: '3'
				}],
				headman: [],
				pendragon: [],
				member: []
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
			userType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.userTypes.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			},

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
						getPlanObj(this.$route.query.id)
							.then(response => {
								this.form = response.data;
								if(response.data.inspectionTeamMembers && response.data.inspectionTeamMembers.length) {
									for(let i = 0; i < response.data.inspectionTeamMembers.length; i++) {
										if(response.data.inspectionTeamMembers[i].userType == '1') {
											this.headman.push(response.data.inspectionTeamMembers[i].name);
										}
										if(response.data.inspectionTeamMembers[i].userType == '2') {
											this.pendragon.push(response.data.inspectionTeamMembers[i].name);
										}
										if(response.data.inspectionTeamMembers[i].userType == '3') {
											this.member.push(response.data.inspectionTeamMembers[i].name);
										}
									}
								}
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
