<template>
	<div class="app-container calendar-list-container nav-content">
		<!-- <div class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
			</div>
			<div style="margin-bottom: 22px;">
				<el-button type="primary" @click="addOrUpdateHandle()">规则设置</el-button>
			</div>
		</div> -->
		<div class="page-info" ref="pageInfo">
			<el-table :data="dataList" :span-method="objectSpanMethod" border v-loading="dataListLoading" fit highlight-current-row @selection-change="selectionChangeHandle">
				<!-- <el-table-column header-align="center" align="center" type="selection" width="50"></el-table-column> -->
				<el-table-column label="序号" header-align="center" align="center" type="index" width="50px" />
				<el-table-column prop="eventName" header-align="center" align="center" :show-overflow-tooltip="true" label="事项">
				</el-table-column>
				<el-table-column header-align="center" align="center" label="规则">
					<template slot-scope="scope">
                        <div v-if="scope.$index == '0'">
							会议召开前
							<el-input style="width: 20%;" v-model="scope.row.reportTime" type="number" min="0" :disabled="formEdit"></el-input>
						 	天
						 </div>
						 <div v-else>{{scope.row.reportTime}}</div>
                    </template>
				</el-table-column>
				<!-- <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<!-- <div class="pagination-container">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="pageIndex"
				 :page-sizes="[10,20,30,50]" :page-size="pageSize" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="totalPage">
				</el-pagination>
			</div> -->
			<div class="pagination-container" style="text-align: right;">
				<el-button v-if="formEdit" type="primary" @click="handlerEdit">编辑</el-button>
				<el-button v-if="!formEdit" type="primary" @click="cancel">取消</el-button>
				<el-button v-if="!formEdit" type="primary" @click="dataFormSubmit" :loading="loading">保存</el-button>
			</div>
		</div>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import AddOrUpdate from './components/ruleEdit';
	import {
		rulesetPage,
		addRuleset,
		delRulesetObj
	} from 'api/large/index';
	import {
		MessageBox
	} from 'element-ui';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	export default {
		data() {
			return {
				loading: false,
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false,
				meetingJoint_btn_partAdd: false,
				meetingJoint_btn_partEdit: false,
				meetingJoint_btn_partDelete: false,
				formEdit: true,
			}
		},

		computed: {
			...mapGetters([
				'elements'
			])
		},
		
		components: {
			AddOrUpdate
		},
		created() {
			// 获取权限
			this.meetingJoint_btn_partAdd = this.elements['meetingJoint:btn_partAdd'];
			this.meetingJoint_btn_partEdit = this.elements['meetingJoint:btn_partEdit'];
			this.meetingJoint_btn_partDelete = this.elements['meetingJoint:btn_partDelete'];
			this.getDataList();
		},
		methods: {
			cancel() {
				this.formEdit = true;
				this.getDataList();
			},
			handlerEdit() {
				this.formEdit = false;
			},
			goBack() {
				this.$router.go(-1);
			},
			// 获取数据列表
			getDataList() {
				// this.dataList = [];
				this.dataListLoading = true;
				rulesetPage({
					'page': this.pageIndex,
					'limit': this.pageSize
				}).then(data => {
					if (data && data.status === 200) {
						this.dataList = data.data.rows
						if(this.dataList) this.dataList.push({ eventName: '临时议题的数目',reportTime: '统计会议临时议题数目' })
						this.totalPage = parseInt(data.data.total)
						this.dataListLoading = false
					} else {
						this.dataList = []
						this.totalPage = 0
						this.$notify.error(data.msg)
						this.dataListLoading = false
					}
				}).catch(() => {
					this.dataList = []
					this.totalPage = 0
					this.dataListLoading = false
					this.$notify.error("获取数据列表失败")
				})
			},
			// 每页数
			sizeChangeHandle(val) {
				this.pageSize = val
				this.pageIndex = 1
				this.getDataList()
			},
			// 当前页
			currentChangeHandle(val) {
				this.pageIndex = val
				this.getDataList()
			},
			// // 多选
			// selectionChangeHandle(val) {
			// 	this.dataListSelections = val
			// },
			// 新增 / 修改
			addOrUpdateHandle(row) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(row);
				})
			},

			// 保存
			dataFormSubmit() {
				this.loading = true;
				addRuleset({ 
					reportTime: this.dataList[0].reportTime,
					eventName: this.dataList[0].eventName
				 })
				 .then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000
							});
							setTimeout(() => {
								this.loading = false;
								this.formEdit = true;
								this.getDataList()
							}, 1000)
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
							this.loading = false;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '失败',
							type: 'error',
							duration: 1000
						});
						this.loading = false;
					})
			}
		}
	}
</script>

<style scoped>
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.template {
		color: #FF4C52;
		text-decoration: underline;
	}

	.template:hover {
		cursor: pointer;
	}
</style>
