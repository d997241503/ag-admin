<template>
	<div>
		<!-- <div class="head-info">
			<div class="title">三重一大监督情况：</div>
			<div class="btn"><span @click="handleMore()">查看更多>></span></div>
		</div> -->
		<div class="body-info">
			<div class="hint-box">
				<!-- <img src="~@/assets/img/chengfa.png" alt=""> -->
				<!-- <div class="title">总数量</div>
				<div class="time">数据更新时间：{{obj.updateTime ? obj.updateTime : '-'}}</div> -->
			</div>
			<div class="item-first">
				<div class="box">
					<img src="~@/assets/img/chengfa.png" alt="">
					<!-- <countTo :startVal='0' :endVal='obj.total' :duration='2000'></countTo> -->
				</div>
			</div>
			<div class="cut-line"></div>
			<div class="item-box">
				<div class="item">
					<div class="num">
						<countTo :startVal='0' :endVal='obj.competitiveEmploymentNum ? obj.competitiveEmploymentNum : 0' :duration='2000'></countTo>
					</div>
					<div class="title">固化任务提报</div>
				</div>
			</div>
			<div class="item-box">
				<div class="item">
					<div class="num">
						<countTo :startVal='0' :endVal='obj.interviewNum ? obj.interviewNum : 0' :duration='2000'></countTo>
					</div>
					<div class="title"> 临时任务提报</div>
				</div>
			</div>
            <div class="item-box">
				<div class="item">
					<div class="num">
						<!-- <countTo :startVal='0' :endVal='obj.numFour' :duration='2000'></countTo> -->
					</div>
					<div class="title">总数量
                        <span class="num">
                            <countTo :startVal='0' :endVal='obj.allNum ? obj.allNum : 0' :duration='2000'></countTo>
                        </span>
                    </div>
				</div>
			</div>
		</div>
        <!-- <div class="search-info page-info" style="padding-bottom:0;">
			<div>
				<el-button v-if="employment_btn_situation" class="filter-item" type="primary" v-waves icon="search" @click="situationHandle()">选人用人监督</el-button>
			</div>
		</div> -->
        <div class="page-info" ref="pageInfo">
            <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column label="排序" width="50px" type="index" />
                <el-table-column width="200" align="center" label="单位名称">
                    <template slot-scope="scope">
                        <div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.deptName}}</div>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="固化任务提报">
                    <el-table-column header-align="center" align="center" label="下发数量">
                        <template slot-scope="scope">
                            {{scope.row.competitiveEmploymentNum}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="提报数量">
                        <template slot-scope="scope">
                            {{scope.row.interviewNum}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="临时任务提报">
                    <el-table-column header-align="center" align="center" label="下发数量">
                        <template slot-scope="scope">
                            {{scope.row.inspectionNum}}
                        </template>
                    </el-table-column>
                    <el-table-column header-align="center" align="center" label="提报数量">
                        <template slot-scope="scope">
                            {{scope.row.otherNum}}
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="总数量">
                    <template slot-scope="scope">
                        {{scope.row.allNum}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" align="center" label="提报比例">
                    <template slot-scope="scope">
                        {{scope.row.allNum}}
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
	</div>
</template>

<script>
	import countTo from 'vue-count-to';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				obj: {
					allNum: undefined,
					competitiveEmploymentNum: undefined,
					inspectionNum: undefined,
					interviewNum: undefined,
					otherNum: undefined
				},
				listLoading: true,
				list: [],
				total: null,
                listQuery: {
					page: 1,
					limit: 10
				},
				employment_btn_situation: false,
			}
		},

		components: {
			countTo
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},

		created() {
			// 获取权限
			// this.employment_btn_situation = this.elements['employment:btn_situation'];
			this.$nextTick(() => {
				this.getList();
			})
		},

		methods: {
			// 获取统计列表
			getList() {
				
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
			// 选人用人监督
			situationHandle() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/situationTemploy'
				// 	})
				// } else {
					this.$router.push({
						path: '/situationTemploy'
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
		border-radius: 12px;
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
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

    .search-info {
		float: right;
        margin-bottom: 20px;
	}
</style>
