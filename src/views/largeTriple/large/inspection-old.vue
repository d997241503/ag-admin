<template>
	<div class="large-meeting">
		<div class="body-info">
      <div class="statis-wrapper">
        <StatisCard v-for="(item, index) in statis" :key="index"
          :title="item.title"
          :num="item.num"
          :imgSrc="item.imgSrc"
          :bgColor="item.bgColor"
          :valueColor="item.valueColor"
        />
      </div>
		</div>
        <div class="search-info page-info" style="padding-bottom:0;">
			<div>
				<el-button v-if="(large_btn_inspection || large_btn_subsidiary) && large_btn_subsidiaryaccount" class="filter-item" type="primary" v-waves icon="search" @click="accountHandle()">台账</el-button>
				<el-button v-if="large_btn_inspection && large_btn_rule" class="filter-item" type="primary" v-waves icon="search" @click="ruleHandle()">规则设置</el-button>
				<!-- <el-button v-if="large_btn_inspection && large_btn_conferencetype" class="filter-item" type="primary" v-waves icon="search" @click="typeHandle()">会议类型管理</el-button> -->
				<el-button v-if="(large_btn_inspection || large_btn_subsidiary) && large_btn_largeaccount" class="filter-item" type="primary" v-waves icon="search" @click="situationHandle()">三重一大情况</el-button>
			</div>
		</div>
        <div class="page-info" ref="pageInfo">
			<!-- 纪委统计统计列表 -->
			<div v-if="large_btn_inspection">
				<el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
					<el-table-column label="排序" header-align="center" align="center" width="50px" type="index" />
					<el-table-column min-width="300" align="center" :show-overflow-tooltip="true" label="部门">
						<template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.orgName}}</div>
						</template>
					</el-table-column>
					<el-table-column header-align="center" align="center" :label="item.name" v-for="(item,indexs) in headerList" :key="indexs">
						<template slot-scope="scope">
							{{ scope.row.statisticData[indexs].statisticNum }}
						</template>
					</el-table-column>
					<el-table-column v-if="headerList.length" header-align="center" align="center" label="总数量">
						<template slot-scope="scope">
							{{ toStringHandle(scope.row.num) }}
						</template>
					</el-table-column>
					<el-table-column header-align="center" align="center" label="提报比例">
						<template slot-scope="scope">
							{{scope.row.reportRatio}}
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination-container">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
						:page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
						:total="total">
					</el-pagination>
				</div>
			</div>
			<div v-else>
				<el-table :data="dataList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
					<el-table-column label="排序" header-align="center" align="center" type="index" width="50px" />
					<!-- <el-table-column prop="orgName" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="成员单位">
					</el-table-column> -->
					<el-table-column prop="conferenceType" header-align="center" align="center" min-width="150" label="会议类型">
						<!-- <template slot-scope="scope"> -->
							<!-- <div v-for="(item, index) in scope.row.eventType" :key="index">{{jointMeetingPostType(item)}}</div> -->
						<!-- </template> -->
					</el-table-column>
					<el-table-column prop="allNum" header-align="center" align="center" min-width="100" label="开展次数">
					</el-table-column>
					<el-table-column prop="pass" header-align="center" align="center" min-width="100" label="通过">
					</el-table-column>
					<el-table-column prop="veto" header-align="center" align="center" min-width="100" label="否决">
					</el-table-column>
					<el-table-column prop="disunity" header-align="center" align="center" min-width="100" label="意见不统一">
					</el-table-column>
					<el-table-column prop="passingRate" header-align="center" align="center" min-width="100" label="通过比例">
					</el-table-column>
				</el-table>
			</div>
            <!-- <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column label="排序" header-align="center" align="center" width="50px" type="index" />
                <el-table-column width="200" align="center" label="会议类型">
                    <template slot-scope="scope">
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.deptName}}</div>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="开展次数">
                    <template slot-scope="scope">
                        {{scope.row.competitiveEmploymentNum}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="通过">
                    <template slot-scope="scope">
                        {{scope.row.interviewNum}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="否决">
                    <template slot-scope="scope">
                        {{scope.row.inspectionNum}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="意见不统一">
                    <template slot-scope="scope">
                        {{scope.row.allNum}}
                    </template>
                </el-table-column>
				<el-table-column header-align="center" align="center" label="通过比例">
                    <template slot-scope="scope">
                        {{scope.row.allNum}}
                    </template>
                </el-table-column>
            </el-table> -->
            <!-- <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                    :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div> -->
        </div>
	</div>
</template>

<script>
	import {
		conferenceStatistic,
		statisticList,
		subsidiaryStatisticList
	} from 'api/large/index';
	import countTo from 'vue-count-to';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				obj: [],
				listLoading: true,
				list: [],
				total: null,
                listQuery: {
					page: 1,
					limit: 10
				},
				large_btn_inspection: false,
				large_btn_subsidiary: false,
				large_btn_rule: false,
				large_btn_largeaccount: false,
				large_btn_subsidiaryaccount: false,
				large_btn_conferencetype: false,
				headerList: [],
				num: 0,
				dataList: []
			}
		},

		components: {
			countTo,
      StatisCard
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},

		created() {
			// 获取权限
			this.large_btn_inspection = this.elements['large:btn_inspection'];
			this.large_btn_subsidiary = this.elements['large:btn_subsidiary'];
			this.large_btn_rule = this.elements['large:btn_rule'];
			this.large_btn_largeaccount = this.elements['large:btn_largeaccount'];
			this.large_btn_subsidiaryaccount = this.elements['large:btn_subsidiaryaccount'];
			// this.large_btn_conferencetype = this.elements['large:btn_conferencetype'];
			this.statistical();
			this.$nextTick(() => {
				if(this.large_btn_inspection) this.getList();
				else this.getDataList();
			})
		},

		methods: {
			// 获取统计总数量
			statistical() {
				conferenceStatistic()
					.then(response => {
						if (response && response.status === 200) {
							this.obj = response.data;
						}
					}).catch(() => {
					})
			},
			// 获取纪委统计统计列表
			getList() {
				this.listLoading = true;
				statisticList(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							if(response.data.rows.length) this.headerList = response.data.rows[0].statisticData.map(item => 
								{ return { name: item.name } });
							this.list = response.data.rows;
							for(let i = 0; i < this.list.length; i++) {
								this.list[i].num = 0;
								for(let j = 0; j < this.list[i].statisticData.length; j++) {
									this.list[i].num = this.list[i].num + parseInt(this.list[i].statisticData[j].statisticNum)
								}
							}
							this.total = parseInt(response.data.total);
							this.listLoading = false;
						} else {
							this.total = 0;
							this.listLoading = false;
						}
						// this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.getList();
			},

			// 获取子公司统计列表
			getDataList() {
				this.listLoading = true;
				subsidiaryStatisticList()
					.then(response => {
						if (response && response.status === 200) {
							this.dataList = response.data;
						} else {
						}
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			parsetIntHandle(val) {
				return parseInt(val);
			},

			toStringHandle(val) {
				return String(val);
			},

			// 台账
			accountHandle() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/accountLarge',
				// 	})
				// } else {
					this.$router.push({
						path: '/accountLarge',
					})
				// }
			},
			// 规则设置
			ruleHandle() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/ruleLarge',
				// 	})
				// } else {
					this.$router.push({
						path: '/ruleLarge',
					})
				// }
			},
			// // 会议类型管理
			// typeHandle() {
			// 	if(this.$store.state.user.isBackstage) {
			// 		this.$router.push({
			// 			path: '/backstage/typeLarge',
			// 		})
			// 	} else {
			// 		this.$router.push({
			// 			path: '/typeLarge',
			// 		})
			// 	}
			// },
			// 三重一大情况
			situationHandle() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/situationLarge'
				// 	})
				// } else {
					this.$router.push({
						path: '/situationLarge'
					})
				// }
			},
			// 详情
			handleDetail(id) {
				this.$router.push({
					path: '/topLeaders/taskList/detail',
					query: {
						id: id
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
  @import '~@/components/Card/StatisCard/StatisCard.scss';
	.large-meeting {
		padding: 20px;
	}
	.head-info {
		display: flex;
		font-size: 20px;

		.title {
			width: 50%;
			font-weight: 600;
			color: #666666;
		}

		.btn {
			width: 50%;
			text-align: right;
			color: #777777;
			padding-top: 8px;

			span:hover {
				cursor: pointer;
				color: #666666;
			}
		}
	}

	.body-info {
		margin-top: 10px;
		width: 100%;
		height: 200px;
		display: flex;
		align-items: center;
		// border-radius: 12px;
		// border: 0.125rem solid #3366FF;
		position: relative;
		background-color: #FFFFFF;

		.hint-box {
			position: absolute;
			top: 10px;
			width: 100%;
			display: flex;
			justify-content: space-between;
			color: #6B6B6B;
			padding: 0 10px 0 15px;

			.title {
				width: 200px;
				font-size: 20px;
			}

			.time {
				width: 280px;
				font-size: 18px;
			}
		}

		.item-first {
			// width: 295px;
			width: 27%;
			text-align: center;
			font-size: 70px;
			font-family: '华文中宋';
			font-weight: bold;
			color: #3366FF;
			margin-top: 25px;

			.box {
				width: 80%;
				margin: 0 auto;
			}

			.box:hover {
				cursor: pointer;
				color: #2a51ff;
			}
		}



		.cut-line {
			height: 120px;
			// border: 0.0625rem solid #3366FF;
			opacity: 0.5;
		}


		.item-box {
			width: 19%;
			text-align: center;

			.item {
				width: 80%;
				margin: 0 auto;
				padding: 5px 0 10px 0;

				.num {
					margin-top: 20px;
					font-size: 50px;
					font-family: '华文中宋';
					font-weight: bold;
					color: #3366FF;
				}

				.title {
					margin-top: 10px;
					font-size: 20px;
					font-family: 'Segoe UI';
					font-weight: bold;
					color: #797979;
				}
			}

			.item:hover>.num {
				cursor: pointer;
				color: #2a51ff;
			}

			.item:hover>.title {
				cursor: pointer;
			}
		}
	}

    .page-info {
		// border: 0.0625rem solid #EAEAEA;
		// border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

    .search-info {
		float: right;
        margin-bottom: 20px;
	}
</style>
