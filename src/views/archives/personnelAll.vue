<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="search-info page-info">
			<div class="search-left">
				<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
					<el-form-item>
						<el-input @keyup.enter.native="handleFilter" style="width: 200px;" clearable class="filter-item" placeholder="请输入标题"
						v-model="listQuery.taskTitle">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="listQuery.type" class="filter-item" placeholder="请选择分类"
						clearable style="width: 200px;">
							<el-option v-for="item in classificationTask" :key="item.code" :label="item.value" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
							unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
				</el-form>
			</div>
		</div>
		<div class="tree-info tree-roll-containers" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div>
		<div class="page-info" ref="pageInfo" style="margin-left: 310px;">
            <!-- <div class="radio-group">
                <el-radio-group class="radio-group-button" v-model="tabPosition" style="margin-bottom: 30px;" @change="radioChange">
                    <el-radio-button label="个人档案">个人档案：{{row.individualArchivesNum}}</el-radio-button>
                    <el-radio-button label="单位信息档案">单位信息档案：{{row.unitArchivesNum}}</el-radio-button>
                    <el-radio-button label="单位风险点排查">单位风险点排查：{{row.unitRiskPointsNum}}</el-radio-button>
                </el-radio-group>
				<el-form v-if="tabPosition == '个人档案'" class="radio-group-form" :inline="true" style="text-align: right">
					<el-form-item>
						<el-button type="primary" @click="personnelAllHandle()">单位内所有人员数据</el-button>
					</el-form-item>
                </el-form>
                <el-form v-if="tabPosition == '单位信息档案'" class="radio-group-form" :inline="true">
                    <el-form-item label="档案编号：">
                        <el-input clearable placeholder="请输入" v-model="archivesNum" :readonly="isReadonly">
                        </el-input>
                    </el-form-item>
					<el-form-item v-if="integrityArchives_btn_informationnumber">
						<el-button v-if="isReadonly" type="primary" @click="numberEditHandle()">编辑</el-button>
						<el-button v-else type="primary" @click="numberDetermineHandle()">确定</el-button>
					</el-form-item>
                </el-form>
				<el-form v-if="tabPosition == '单位风险点排查'" class="radio-group-form" :inline="true">
                    <el-form-item label="档案编号：">
                        <el-input clearable placeholder="请输入" v-model="archivesNumScreening" :readonly="isReadonlyScreening">
                        </el-input>
                    </el-form-item>
					<el-form-item v-if="integrityArchives_btn_riskpointsnumber">
						<el-button v-if="isReadonlyScreening" type="primary" @click="numberEditScreeningHandle()">编辑</el-button>
						<el-button v-else type="primary" @click="numberDetermineScreeningHandle()">确定</el-button>
					</el-form-item>
                </el-form>
            </div> -->
			<el-table v-if="tabPosition == '个人档案'" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
				<!-- <el-table-column align="center" type="index" label="序号" width="65">
				</el-table-column> -->
				<el-table-column width="435" align="center" label="标题">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.taskTitle}}</div>
					</template>
				</el-table-column>
				<el-table-column width="120" align="center" label="姓名">
					<template slot-scope="scope">
						<span>{{scope.row.name}}</span>
					</template>
				</el-table-column>
				<el-table-column width="435" align="center" label="子公司">
					<template slot-scope="scope">
						<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.orgName}}</div>
					</template>
				</el-table-column>
				<el-table-column width="120" align="center" label="所属分类">
					<template slot-scope="scope">
						<span>{{classificationTaskType(scope.row.type)}}</span>
					</template>
				</el-table-column>
				<el-table-column width="150" align="center" label="提报时间">
					<template slot-scope="scope">
						<span>{{scope.row.actualCommitTime}}</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" align="center" label="操作" width="200"> <template slot-scope="scope">
						<el-button size="small" type="text" @click="solidificationPutHandle('detail',scope.row)">查看
						</el-button>
						<el-button size="small" type="text" @click="handleDelete(scope.row)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div v-if="tabPosition == '个人档案'" class="pagination-container">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
				 :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper"
				 :total="total">
				</el-pagination>
			</div>
            <!-- <div>
                <InformationCom v-if="tabPosition == '单位信息档案'" ref="informationCom" :tabPosition="tabPosition" @tabRefreshData="tabTreeHandle"></InformationCom>
            </div>
			<div>
                <ScreeningCom v-if="tabPosition == '单位风险点排查'" ref="screeningCom" :tabPosition="tabPosition" @tabRefreshData="tabTreeScreeningHandle"></ScreeningCom>
            </div> -->
		</div>
	</div>
</template>

<script>
	// import InformationCom from './informationCom';
	// import ScreeningCom from './screeningCom';
	import {
		memberArchivesPage,
		delIndividualtaskObj,
		updateUnitarchivesObj,
		indexStatistic,
		updateUnitriskpointsObj
	} from 'api/archives/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import tree from "./components/personneltree";
	export default {
		name: "index",
		data() {
			return {
				isReadonly: true,
				isReadonlyScreening: true,
                tabPosition: '个人档案',
				archivesNum: '',
				archivesNumScreening: '',
				list: null,
				total: null,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 10,
					userId: undefined,
                    startDate: '',
                    endDate: '',
                    taskTitle: '',
                    type: ''
                },
                times: [],
				tableKey: 0,
				classificationTask: [], // 分类
				value: '',
				baseParentId: undefined,
				valueScreening: '',
				baseParentIdScreening: undefined,
				row: {},
				departmentFullName: undefined,
				integrityArchives_btn_informationnumber: false,
				integrityArchives_btn_riskpointsnumber: false,
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			// 筛选符合条件的参数
			classificationTaskType() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					let label = this.classificationTask.filter((item) => {
						return (item.code.indexOf(val) >= 0)
					});
					return label.length ? label[0].value : '';
				}
			}
        },
        
        components: {
			tree,
			// InformationCom,
			// ScreeningCom
        },
        
		created() {
			// 获取列表
            // this.listQuery.deptId = this.$route.query.deptId;
			this.departmentFullName = this.$route.query.deptName;
			// this.row = this.$route.query.row;
			// this.getList();
			// this.getindexPageList();
			// 获取个人档案分类
			this.getDataDicts("classificationTask").then((res) => {
                this.classificationTask = res;
			});

			// 获取权限
			this.integrityArchives_btn_informationnumber = this.elements['integrityArchives:btn_informationnumber'];
			this.integrityArchives_btn_riskpointsnumber = this.elements['integrityArchives:btn_riskpointsnumber'];
		},
		methods: {
			radioChange(e) {
				// if(e == '单位信息档案') this.$refs.informationCom.getDeptId(this.listQuery.deptId,this.departmentFullName);
				// if(e == '单位风险点排查') this.$refs.screeningCom.getDeptId(this.listQuery.deptId,this.departmentFullName);
			},
			numberEditHandle() {
				this.isReadonly = false;
			},
			numberDetermineHandle() {
				let updateForm = {
					archivesNum: this.archivesNum,
					id: this.baseParentId,
					value: this.value
				}
				updateUnitarchivesObj(updateForm)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功！',
								type: 'success',
								duration: 1000
							});
							this.isReadonly = true;
							// this.nextTick(() => {
								this.$refs.tree.getTreeInfo();
							// })
							// this.getTreeInfo();
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
							this.isReadonly = true;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 1000
						});
						this.isReadonly = true;
					})
			},
            // tabTreeHandle(val) {
			// 	if(val) {
			// 		this.archivesNum = val.archivesNum ? val.archivesNum : val.baseArchivesNum;
			// 		this.baseParentId = val.parentId == "0" ? val.id : val.baseParentId;
			// 		this.value = val.value;
			// 	}
			// },
			// numberEditScreeningHandle() {
			// 	this.isReadonlyScreening = false;
			// },
			// numberDetermineScreeningHandle() {
			// 	let updateFormScreening = {
			// 		archivesNum: this.archivesNumScreening,
			// 		id: this.baseParentIdScreening,
			// 		value: this.valueScreening
			// 	}
			// 	updateUnitriskpointsObj(updateFormScreening)
			// 		.then((res) => {
			// 			if (res && res.status === 200) {
			// 				this.$notify({
			// 					title: '成功',
			// 					message: '档案编号修改成功！',
			// 					type: 'success',
			// 					duration: 1000
			// 				});
			// 				this.isReadonlyScreening = true;
			// 				// this.nextTick(() => {
			// 					this.$refs.tree.getTreeInfo();
			// 				// })
			// 				// this.getTreeInfo();
			// 			} else {
			// 				this.$notify({
			// 					title: '失败',
			// 					message: res.msg,
			// 					type: 'error',
			// 					duration: 1000
            //                 });
            //                 this.isReadonlyScreening = true;
			// 			}
			// 		}).catch(() => {
			// 			this.$notify({
			// 				title: '失败',
			// 				message: '档案编号修改失败',
			// 				type: 'error',
			// 				duration: 1000
            //             });
            //             this.isReadonlyScreening = true;
			// 		})
			// },
			// tabTreeScreeningHandle(val) {
			// 	if(val) {
			// 		this.archivesNumScreening = val.archivesNum ? val.archivesNum : val.baseArchivesNum;
			// 		this.baseParentIdScreening = val.parentId == "0" ? val.id : val.baseParentId;
			// 		this.valueScreening = val.value;
			// 	}
			// },
			// 点击部门刷新列表数据
			treeHandle(val) {
				this.listQuery.userId = val.userId;
				// this.departmentFullName = val.departmentFullName;
				this.getList();
				// this.getindexPageList();
				// if(this.$refs.informationCom) this.$refs.informationCom.getDeptId(this.listQuery.deptId,this.departmentFullName);
				// if(this.$refs.screeningCom) this.$refs.screeningCom.getDeptId(this.listQuery.deptId,this.departmentFullName);
			},

			// // 获取首页统计列表
			// getindexPageList() {
			// 	indexStatistic({
			// 		deptId: this.listQuery.deptId
			// 	})
			// 		.then(response => {
			// 			if (response && response.status === 200) {
			// 				this.row = response.data;
			// 			}
			// 		}).catch(() => {
			// 		})
			// },

			// 获取数据列表
			getList() {
                this.listLoading = true;
                this.listQuery.startDate = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endDate = this.times && this.times.length ? this.times[1] : '';
				memberArchivesPage(this.listQuery,this.listQuery.userId)
					.then(response => {
						if (response && response.status === 200) {
							this.list = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
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

			handleFilter() {
				this.getList();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},

			// // 新增
			// handleCreate() {
			// 	this.$router.push({
			// 		path: '/newlyHonestReport'
			// 	});
			// },

			// 查看
			solidificationPutHandle(path, row) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: '/backstage/solidificationPut/add',
				// 		query: {
				// 			id: row ? row.id : undefined,
				// 			// templateId: row ? row.templateId : undefined
				// 			operation: path,
				// 			status: row.status ? row.status : undefined
				// 		}
				// 	})
				// } else {
					this.$router.push({
						path: '/solidificationPut/add',
						query: {
							id: row ? row.id : undefined,
							// templateId: row ? row.templateId : undefined
							operation: path,
							status: row.status ? row.status : undefined
						}
					})
				// }
			},

			// 删除
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delIndividualtaskObj(row.id)
						.then(res => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 2000
								});
								this.getList();
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
					}).catch(() => {

					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	
	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

    .page-info /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        color: #FFF;
        background-color: rgb(188,0,0);
        border-color: rgb(188,0,0);
        -webkit-box-shadow: -1px 0 0 0 rgb(188,0,0);
        box-shadow: -1px 0 0 0 rgb(188,0,0);
		// background-color: #bc0000;
        // border-color: #bc0000;
        // -webkit-box-shadow: -1px 0 0 0 #bc0000;
        // box-shadow: -1px 0 0 0 #bc0000;
    }

    .radio-group {
        display: flex;

        .radio-group-button {
            width: 70%;
            min-width: 431px;
        }

        .radio-group-form {
            width: 30%;
            min-width: 400px;
        }
    }

	.query {
		// margin-left: 10px;
	}
</style>
