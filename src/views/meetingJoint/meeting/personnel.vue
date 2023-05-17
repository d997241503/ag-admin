<template>
	<div class="app-container calendar-list-container nav-content" style="margin-left: 20px;">
		<div class="search-info page-info" style="padding-bottom:0;">
			<div class="search-left">
				<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
					<!-- <el-form-item>
						<el-input v-model="dataForm.key" placeholder="查询题目" clearable maxlength="20" show-word-limit></el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="dataForm.subjectType" clearable placeholder="请选择题目类型">
							<el-option v-for="(item,index) in subjectTypes" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item> -->
					<!-- <el-form-item>
						<el-button v-if="meetingJoint_btn_partAdd" type="primary" @click="addOrUpdateHandle()">联席会成员</el-button>
					</el-form-item> -->
				</el-form>
			</div>
			<div style="margin-bottom: 22px;">
				<el-button v-if="meetingJoint_btn_partAdd" type="primary" @click="addOrUpdateHandle()">新增</el-button>
			</div>
			<!-- <div style="width: 150px;text-align: right;line-height: 50px;">
				<span class="template" type="primary" @click="downloadTemplateHandle()">下载考题模板</span>
			</div> -->
		</div>
		<div class="page-info" ref="pageInfo">
			<el-table :data="dataList" :span-method="objectSpanMethod" border v-loading="dataListLoading" fit highlight-current-row @selection-change="selectionChangeHandle">
				<!-- <el-table-column header-align="center" align="center" type="selection" width="50"></el-table-column> -->
				<el-table-column label="序号" header-align="center" align="center" prop="Nosort" width="50px" />
				<el-table-column prop="orgName" header-align="center" align="center" min-width="300" :show-overflow-tooltip="true" label="成员单位">
				</el-table-column>
				<el-table-column prop="name" header-align="center" align="center" min-width="100" label="成员">
				</el-table-column>
				<el-table-column prop="position" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="职务">
					<template slot-scope="scope">
						<span>{{jointMeetingPostType(scope.row.position)}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button v-if="meetingJoint_btn_partEdit" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
						<el-button v-if="meetingJoint_btn_partDelete" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination-container">
				<el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page.sync="pageIndex"
				 :page-sizes="[10,20,30,50]" :page-size="pageSize" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="totalPage">
				</el-pagination>
			</div>
		</div>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script>
	import AddOrUpdate from './components/personnelEdit';
	import {
		meetingmemberPage,
		delMeetingmemberObj
	} from 'api/meeting/index';
	// import {
	// 	getSubjects,
	// 	subjectDelete
	// } from 'api/exam/manage/index';
	import {
		MessageBox
	} from 'element-ui';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	export default {
		data() {
			return {
				dataForm: {
					key: '',
					subjectType: undefined
				},
				examVisible: false,
				dataList: [],
				pageIndex: 1,
				pageSize: 10,
				totalPage: 0,
				dataListLoading: false,
				examListLoading: false,
				dataListSelections: [],
				addOrUpdateVisible: false,
				examList: [],
				subjectId: '',
				numberTopicsVisible: false,
				subjectTypes: [{
					label: '单选',
					value: '1'
				}, {
					label: '多选',
					value: '2'
				}, {
					label: '填空',
					value: '4'
				}],
				jointMeetingPost: [],
				meetingJoint_btn_partAdd: false,
				meetingJoint_btn_partEdit: false,
				meetingJoint_btn_partDelete: false,
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			jointMeetingPostType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.jointMeetingPost.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			}
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
			// 获取联席会成员职务分类
			this.getDataDicts("jointMeetingPost").then((res) => {
				this.jointMeetingPost = res;
			});
		},
		methods: {
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
			// objectSpanMethod({ row, column, rowIndex, columnIndex }) {
			// 	if (columnIndex === 0) {
			// 	if (rowIndex % 2 === 0) {
			// 		return {
			// 		rowspan: 2,
			// 		colspan: 1
			// 		};
			// 	} else {
			// 		return {
			// 		rowspan: 0,
			// 		colspan: 0
			// 		};
			// 	}
			// 	}
			// },
			getSpanArr(data) {
				var vm = this;
				vm.spanArr = [];
				vm.pos = 0;
				data.forEach(function (item, index) {
					//判断是否是第一项
					if (index === 0) {
					vm.spanArr.push(1);
					vm.pos = 0;
					} else {
					//不是第一项时，就根据标识去存储
					if (data[index].orgName === data[index - 1].orgName) {
						// 查找到符合条件的数据时每次要把之前存储的数据+1
						vm.spanArr[vm.pos] += 1;
						vm.spanArr.push(0);
					} else {
						// 没有符合的数据时，要记住当前的index
						vm.spanArr.push(1);
						vm.pos = index;
					}
					}
				});
				// 表格序号
				let Nosort = 0
				for(let n in vm.spanArr){
					if(vm.spanArr[n]>0){
						Nosort += 1
						this.$set(data[n],'Nosort',Nosort)
					}
				}
			},
			objectSpanMethod(obj) {
				if (obj.columnIndex === 0 || obj.columnIndex === 1) {
					// 二维数组存储的数据 取出
					var _row = this.spanArr[obj.rowIndex];
					var _col = _row > 0 ? 1 : 0;
					return {
					rowspan: _row,
					colspan: _col,
					};
				} else {
					return false;
				}
			},
			goBack() {
				this.$router.go(-1);
			},
			// 获取数据列表
			getDataList() {
				this.dataList = [];
				this.dataListLoading = true;
				meetingmemberPage({
					'page': this.pageIndex,
					'limit': this.pageSize
				}).then(data => {
					if (data && data.status === 200) {
						this.dataList = data.data.rows
						this.totalPage = parseInt(data.data.total)
						this.getSpanArr(this.dataList);
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
			// 多选
			selectionChangeHandle(val) {
				this.dataListSelections = val
			},
			// 下载模板
			downloadTemplateHandle() {
				window.location.href = `/api/examination/test/dateinfo/downTemplate?state=1&token=${getToken()}`;
			},
			// 新增 / 修改
			addOrUpdateHandle(id) {
				this.addOrUpdateVisible = true
				this.$nextTick(() => {
					// this.$refs.addOrUpdate.dataForm = row;
					this.$refs.addOrUpdate.init(id);
				})
			},
			// 删除
			deleteHandle(id) {
				// var ids = id ? [id] : this.dataListSelections.map(item => {
				// 	return item.subjectId
				// })
				this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					delMeetingmemberObj(id)
						.then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 2000
								});
								this.getDataList();
							} else {
								this.$notify({
									title: '失败',
									message: '删除失败',
									type: 'error',
									duration: 2000
								});
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '删除失败',
								type: 'error',
								duration: 2000
							});
						});
				}).catch(() => {});
			},
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
