<template>
	<div class="body" v-if="toRouter">
		<!-- <div class="head-info">
			<div class="title">三重一大监督情况：</div>
			<div class="btn"><span @click="handleMore()">查看更多>></span></div>
		</div> -->
		<div class="body-archives">
			<div ref="searchSection" class="body-archives-cl">
				<div class="body-info">
					<!-- <div class="statis-wrapper">
						<StatisCard v-for="(item, index) in statis" :key="index"
							:title="item.title"
							:num="obj[item.key] || 0"
							:imgSrc="item.imgSrc"
							:bgColor="item.bgColor"
							:valueColor="item.valueColor"
						/>
					</div> -->
					<div class="body-info-personal" @click="handleFilesPer">
						<div class="img-info bg-personal">
							<div style="width: 120px;text-align: left;" class="img-info-title col-personal">
								<div class="img-info-text">个人档案</div>
								<div class="img-info-num">
									<countTo class="img-info-num-alteration" :startVal='0' :endVal='obj.individualArchivesNum ? obj.individualArchivesNum : 0' :duration='2000'></countTo>
									<span class="img-info-num-text">人</span>
								</div>
							</div>
							<div class="img-info-icon"><img src="~@/assets/img/icon_personal.png" alt="图标"></img></div>
						</div>
					</div>
					<div class="body-info-personal" @click="handleInformation">
						<div class="img-info bg-information">
							<div style="width: 120px;text-align: left;" class="img-info-title col-information">
								<div class="img-info-text">单位信息档案</div>
								<div class="img-info-num">
									<countTo class="img-info-num-alteration" :startVal='0' :endVal='obj.unitArchivesNum ? obj.unitArchivesNum : 0' :duration='2000'></countTo>
									<span class="img-info-num-text">本</span>
								</div>
							</div>
							<div class="img-info-icon"><img src="~@/assets/img/icon_points.png" alt="图标"></img></div>
						</div>
					</div>
					<div class="body-info-personal" @click="handleScreeningCom">
						<div class="img-info bg-points">
							<div style="width: 120px;text-align: left;" class="img-info-title col-points">
								<div class="img-info-text">单位风险点排查</div>
								<div class="img-info-num">
									<countTo class="img-info-num-alteration" :startVal='0' :endVal='obj.unitRiskPointsNum ? obj.unitRiskPointsNum : 0' :duration='2000'></countTo>
									<span class="img-info-num-text">个</span>
								</div>
							</div>
							<div class="img-info-icon"><img src="~@/assets/img/icon_company.png" alt="图标"></img></div>
						</div>
					</div>
				</div>
				<div class="search-info" style="padding-bottom:0;">
					<el-divider class="el-divider"></el-divider>
				</div>
				<div class="page-info" ref="pageInfo" style="margin-bottom: -40px;">
					<div>
						<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
							<el-form-item>
								<el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
									<el-tree style="min-width: 350px;" ref="treeData" :props="defaultPropsOrg" :data="treeData"
										node-key="id" :expand-on-click-node="false" class="roll-containers">
											<span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
												<span
													v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
												</span>
											</span>
										</el-tree>
									<el-select style="width: 400px;" v-model="deptName" placeholder="请选择单位" class="input-item" slot="reference" clearable @clear="clearDep"
										ref="selectIt" @focus="closeIt">
									</el-select>
								</el-popover>
							</el-form-item>
							<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
							<el-button v-waves type="primary" @click="handleReset">重置</el-button>
						</el-form>
					</div>
					<!-- <el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
						<el-table-column label="排序" header-align="center" align="center" width="50px" type="index" />
						<el-table-column align="center" label="子公司">
							<template slot-scope="scope">
								<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.deptName}}</div>
							</template>
						</el-table-column>
						<el-table-column header-align="center" align="center" label="个人档案">
							<template slot-scope="scope">
								{{scope.row.individualArchivesNum}}
							</template>
						</el-table-column>
						<el-table-column header-align="center" align="center" label="单位信息档案">
							<template slot-scope="scope">
								{{scope.row.unitArchivesNum}}
							</template>
						</el-table-column>
						<el-table-column header-align="center" align="center" label="单位风险点排查">
							<template slot-scope="scope">
								{{scope.row.unitRiskPointsNum}}
							</template>
						</el-table-column>
						<el-table-column fixed="right" header-align="center" align="center" width="100" label="操作">
							<template slot-scope="scope">
								<el-button type="text" size="small" @click="handleDetail(scope.row.deptId,scope.row.deptName)">查看</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination-container">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
							:page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
							:total="total">
						</el-pagination>
					</div> -->
				</div>
			</div>
			<div class="page-info">
				<el-table :height="tableHeight" ref="table" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
					<el-table-column label="排序" header-align="center" align="center" width="50px" type="index" />
					<el-table-column align="center" label="子公司">
						<template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.deptName}}</div>
						</template>
					</el-table-column>
					<el-table-column header-align="center" align="center" label="个人档案">
						<template slot-scope="scope">
							{{scope.row.individualArchivesNum}}
						</template>
					</el-table-column>
					<el-table-column header-align="center" align="center" label="单位信息档案">
						<template slot-scope="scope">
							{{scope.row.unitArchivesNum}}
						</template>
					</el-table-column>
					<el-table-column header-align="center" align="center" label="单位风险点排查">
						<template slot-scope="scope">
							{{scope.row.unitRiskPointsNum}}
						</template>
					</el-table-column>
					<el-table-column fixed="right" header-align="center" align="center" width="100" label="操作">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="handleDetail(scope.row.deptId,scope.row.deptName)">查看</el-button>
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
	</div>
</template>

<script>
	import {
		indexStatistic,
		indexPage
	} from 'api/archives/index';
	import countTo from 'vue-count-to';
	import {
		mapGetters
	} from 'vuex';
	import {
		getTree
	} from 'api/admin/department/index';
	import StatisCard from '@/components/Card/StatisCard/StatisCard.vue'
  	import { cardStyle } from '@/components/Card/StatisCard/StatisCard.js'
	export default {
		data() {
			this.statis = [
				{ title: '个人档案', key: 'individualArchivesNum' },
				{ title: '单位信息档案', key: 'unitArchivesNum' },
				{ title: '单位风险点排查', key: 'unitRiskPointsNum' }
			]
			this.statis = this.statis.map((item, index) => {
				return Object.assign(item, cardStyle[index % cardStyle.length])
			})
			return {
				toRouter: false,
				obj: {
					individualArchivesNum: undefined,
					unitArchivesNum: undefined,
					unitRiskPointsNum: undefined
				},
				listLoading: true,
				loading: false,
				list: [],
				total: null,
                listQuery: {
					page: 1,
					limit: 10,
					orgId: undefined
				},
				integrityArchives_btn_first: false,
				integrityArchives_btn_m6high: false,
				integrityArchives_btn_inspection: false,
				popoverVisibel: false,
				deptName: '',
				treeVisible: false,
				treeData: [],
				defaultPropsOrg: {
					children: 'children',
					label: 'departmentFullName'
				},
				tableHeight: undefined
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
			this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];	
			this.integrityArchives_btn_m6high = this.elements['integrityArchives:btn_m6high'];
			this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection'];
			// this.integrityArchives_btn_individualentry = this.elements['integrityArchives:btn_individualentry'];
			// this.integrityArchives_btn_unitentry = this.elements['integrityArchives:btn_unitentry'];
			// this.integrityArchives_btn_fxdentry = this.elements['integrityArchives:btn_fxdentry'];
			this.getOrgTreeInfo();
			// if(this.integrityArchives_btn_first || this.integrityArchives_btn_inspection) {
				this.toRouter = true;
				this.statistical();
				this.$nextTick(() => {
					this.getList();
				})
			// } else if(this.integrityArchives_btn_individualentry) {
			// 	this.toRouter = false;
			// 		this.$router.push({
			// 			path: '/filesPer'
			// 		})
			// } else if(this.integrityArchives_btn_unitentry) {
			// 	this.toRouter = false;
			// 		this.$router.push({
			// 			path: '/informationCom'
			// 		})
			// } else if(this.integrityArchives_btn_fxdentry) {
			// 	this.toRouter = false;
			// 		this.$router.push({
			// 			path: '/screeningComCom'
			// 		})
			// }
		},

		methods: {
			clearDep() {
				this.listQuery.orgId = undefined;
			},
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			handleFilter() {
				this.getList();
			},
			// 选择部门
			handleCheckChange(data) {
				this.listQuery.orgId = data.id;
				this.deptName = data.departmentFullName;
				this.popoverVisibel = false;
			},
			// 获取部门树
			getOrgTreeInfo() {
				this.loading = true;
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
							// if(this.treeData) {
							// 	this.listQuery.orgId = this.treeData[0].id;
							// 	this.deptName = this.treeData[0].departmentFullName;
							// }
							this.$nextTick(() => {
								// this.getTreeInfo();
								// if(this.integrityArchives_btn_addCompanyarchives) this.getTreeInfoCompany();
							})
							this.loading = false;
						} else {
							this.$notify({
								title: '失败',
								message: "获取部门树失败",
								type: 'error',
								duration: 2000
							});
							this.loading = false;
						}
					});
			},
			// 获取统计总数量
			statistical() {
				indexStatistic()
					.then(response => {
						if (response && response.status === 200) {
							this.obj.individualArchivesNum = parseInt(response.data.individualArchivesNum);
							this.obj.unitArchivesNum = parseInt(response.data.unitArchivesNum);
							this.obj.unitRiskPointsNum = parseInt(response.data.unitRiskPointsNum);
						}
					}).catch(() => {
					})
			},
			// 获取统计列表
			getList() {
				this.listLoading = true;
				indexPage(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.tableLayout();
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
			tableLayout(option) {
				const {searchRefName = 'searchSection', tableRefName = 'table', subtractVal = 270} = option || {}
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal
				this.tableHeight = computedHeight > 500 ? computedHeight : 400
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},
			handleReset() {
				this.listQuery = {
					page: 1,
					limit: 10,
					orgId: undefined
				};
				this.deptName = '';
				this.getList();
			},
			// 个人档案
			handleFilesPer() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/filesPer'
				// 	})
				// } else {
					this.$router.push({
						path: '/filesPer'
					})
				// }
			},
			// 单位信息档案
			handleInformation() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/informationCom',
				// 		query: {
				// 			operation: 'operation'
				// 		}
				// 	})
				// } else {
				// 	this.$router.push({
				// 		path: '/informationCom',
				// 		query: {
				// 			operation: 'operation'
				// 		}
				// 	})
				// }
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/subsidiary',
				// 		query: {
				// 			look: 'detail',
				// 			tabPosition: '单位信息档案'
				// 		}
				// 	})
				// } else {
					this.$router.push({
						path: '/subsidiary',
						query: {
							look: 'detail',
							tabPosition: '单位信息档案'
						}
					})
				// }
			},
			// 单位风险点排查
			handleScreeningCom() {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/screeningComCom',
				// 		query: {
				// 			operation: 'operation'
				// 		}
				// 	})
				// } else {
				// 	this.$router.push({
				// 		path: '/screeningComCom',
				// 		query: {
				// 			operation: 'operation'
				// 		}
				// 	})
				// }
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/subsidiary',
				// 		query: {
				// 			look: 'detail',
				// 			tabPosition: '单位风险点排查'
				// 		}
				// 	})
				// } else {
					this.$router.push({
						path: '/subsidiary',
						query: {
							look: 'detail',
							tabPosition: '单位风险点排查'
						}
					})
				// }
			},
			// 查看
			handleDetail(deptId,deptName) {
				this.$router.push({
					path: '/subsidiary',
					query: {
						deptId: deptId,
						deptName: deptName,
						look: 'detail',
						tabPosition: '个人档案'
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/components/Card/StatisCard/StatisCard.scss';
	.statis-wrapper {
		justify-content: flex-start;
	}
	.statis-wrapper .statis-card {
		flex: unset;
	}
	.body-archives {
		padding: 20px;
		// background-color: #FFFFFF;
	}
	.body-archives-cl {
		background-color: #FFFFFF;
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
		// margin-top: 10px;
		width: 100%;
		// height: 200px;
		display: flex;
		align-items: center;
		position: relative;
		background-color: #FFFFFF;
		padding: 20px;

		.body-info-personal {
			width: 400px;
			height: 90px;
			margin-right: 10px;
			cursor: pointer;

			.img-info {
				display: flex;
				text-align: center;
				// background-color: #f0f6ff;
				// margin-right: 10px;
				padding: 0px 20px;
				height: 90px;
				border-radius: 4px;

				.img-info-text {
					font-size: 16px;
					color: #666666;
					font-weight: bold;
				}

				.img-info-num {

					.img-info-num-alteration {
						font-size: 24px;
						font-weight: bold;
					}

					.img-info-num-text {
						font-size: 14px;
						color: #666666;
					}

				}

				.img-info-title {
					font-size: 14px;
					width: 60px;
					line-height: 25px;
					// height: 40px;
					// margin-top: 25px;
					/* white-space: normal; */
					/* transform: translateY(-50%); */
					text-align: center;
					white-space: normal;
					height: fit-content;
					position: relative;
					top: 50%;
					transform: translateY(-50%);
					// color: #3b88ff;

					div:first-child {
						// height: 20px;
						// margin-top: 20%;
					}
				}

				.img-info-icon {

					flex: 1;
					text-align: right;

					img {
						width: 45px;
						height: 45px;
						margin-top: 45px;
						transform: translateY(-50%);
					}

				}
			}

			.bg-personal {
				background-color: #f0f6ff;
			}

			.bg-information {
				background-color: #f4effc;
			}

			.bg-points {
				background-color: #fff4ee;
			}

			.col-personal {
				color: #3b88ff;
			}

			.col-information {
				color: #752fdd;
			}

			.col-points {
				color: #fd7311;
			}
		}

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
				// min-width: 284px;
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
			width: 24%;
			// min-width: 370px;
			text-align: center;

			.item {
				width: 80%;
				// min-width: 370px;
				margin: 0 auto;
				padding: 5px 0 10px 0;

				.text {
					width: 65%;
					min-width: 154px;
					height: 80px;
					line-height: 80px;
					display: inline-block;
					border: solid 1px black;
				}

				.num {
					display: inline-block;
					margin-top: 20px;
					margin-left: 10px;
    				font-size: 35px;
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
		// min-width: 1052px;
		// border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

    .search-info {
		width: 98%;
		margin: 0 auto;
	}
</style>
