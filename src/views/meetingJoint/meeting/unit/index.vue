<template>
	<div class="calendar-list-container nav-content">
		<div class="page-info" ref="searchSection" style="padding-bottom:0;margin-bottom: 20px;">
			 <div class="radio-group">
                <el-radio-group class="radio-group-button" v-model="sTabType" style="margin-bottom: 30px;">
                    <el-radio-button label="joint">联席会议</el-radio-button>
                    <el-radio-button label="temporary">监督管理</el-radio-button>
                </el-radio-group>
            </div>
			<div class="search-info" style="margin-bottom: 0px;">
				<div class="search-left">
					<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
						<el-form-item>
                            <el-select v-model="listQuery.deptId" placeholder="请选择单位" clearable>
                            <el-option v-for="item in treeData" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                            </el-option>
                            </el-select>
                        </el-form-item>
						<el-form-item>
							<el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
								unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item>
						<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
						<el-button v-waves type="primary" @click="handleReset">重置</el-button>
                        <el-button v-if="meetingJoint_btn_superviseAdd" class="filter-item" style="margin-left: 10px;" @click="addSupervise(null)"
							type="primary" icon="edit">添加监督情况</el-button>
					</el-form>
				</div>
			</div>
		</div>
		<div class="page-info grid-section" ref="pageInfo">
			<div class="grid-wrapper">
                <el-table ref="table" :height="tableHeight" rowKey='id' :data="dataList" v-loading="listLoading" border>
                <el-table-column align="center" label="序号" width="50px" type="index" />
                <el-table-column align="center" label="成员单位" show-overflow-tooltip>
                    <template slot-scope="{row}">
                    {{row.deptName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="监督项目名称">
                    <template slot-scope="{row}">
                    {{row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="起止时间" width="200">
                    <template slot-scope="{row}">
                    {{row.startTime}} ~ {{row.endTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发现的问题" show-overflow-tooltip>
                    <template slot-scope="{row}">
                    {{row.problem}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="整改情况" show-overflow-tooltip>
                    <template slot-scope="{row}">
                    {{row.rectificationSituation}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="附件">
                    <template slot-scope="{row}">
                        <div class="click-text" @click="handleDownload(file, 'archives')" v-for="(file, index) in row.superviseFiles" :key="index">{{formatFile(file)}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="添加人" width="140">
                    <template slot-scope="{row}">
                    {{row.crtName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" width="140">
                    <template slot-scope="{row}">
                    {{row.crtTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="{row}">
                        <el-button v-if="meetingJoint_btn_superviseEdit" type="text" @click="addSupervise(row)">编辑</el-button>
                        <el-button v-if="meetingJoint_btn_superviseDelete" type="text" @click="handleDelete(row)">删除</el-button>
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
        <SuperviseModal v-if="modalVisible" ref="superviseModal" @update="getList"/>
    </div>
</template>

<script>
    import SuperviseModal from './SuperviseModal'
    import { meetingSuperviseList, deleteMeetingSupervise } from 'api/meeting/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
    } from 'utils/auth';
    import {
		getGroupdeptlist
	} from 'api/admin/group/index';
       import {downloadFile, formatFile} from 'utils/file'
    import tableMixin from '@/mixins/table/table.mixin.js';
	export default {
		name: "index",
		components: {
            SuperviseModal
		},
        mixins: [tableMixin],
        props: {
            tabType: String
        },
		data() {
			return {
                popoverVisibel: false,
                treeVisible: false,
				treeData: [],
                // userDeptIds: [],
				index: 0,
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
                },
                loading: true,
                deptName: '',
                total: 0,
				listQuery: {
					page: 1,
					limit: 10,
					endTime: '',
					startTime: '',
					deptId: undefined,
                    deptName: '',
				},
				times: [],
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
				options: [{
					value: '1',
					label: '个人廉政档案'
				}, {
					value: '2',
					label: '个人事项报告'
				}],
                listLoading: false,
                dataList: [],
                modalVisible: true,
                meetingJoint_btn_superviseAdd: false,
                meetingJoint_btn_superviseEdit: false,
                meetingJoint_btn_superviseDelete: false,
			}
		},

		computed: {
			...mapGetters([
				'elements','userId'
			]),
            sTabType: {
                get() {
                    return this.tabType
                },
                set(val) {
                    this.$emit('update:tabType', val)
                }
            }
		},
		created() {
			// 获取权限
            this.meetingJoint_btn_superviseAdd = this.elements['meetingJoint:btn_superviseAdd'];
            this.meetingJoint_btn_superviseEdit = this.elements['meetingJoint:btn_superviseEdit'];
            this.meetingJoint_btn_superviseDelete = this.elements['meetingJoint:btn_superviseDelete'];
            this.getTreeInfo();
            // this.getUserDeptIds()
			this.$nextTick(() => {
				// 获取列表
				this.getList();
			})
        },
        
		methods: {
            formatFile,
            getList() {
				this.listLoading = true;
                this.listQuery.startTime = this.times?.[0] || undefined
                this.listQuery.endTime = this.times?.[1] || undefined
				meetingSuperviseList(this.listQuery)
					.then(response => {
						if (response && response.status === 200) {
							this.dataList = response.data.rows;
							this.total = parseInt(response.data.total);
                            this.tableLayout()
						} else {
							this.total = 0;
						}
					}).finally(() => {
                        this.listLoading = false
                    })
			},
            radioChange() {},
            handleComments() {
                this.$router.push({ path: '/filesImplementation/meeting/topicMng' })
            },
            addSupervise(data) {
                this.$nextTick(() => {
                    this.$refs['superviseModal'].init(data)
                })
            },
            // 获取部门树
			getTreeInfo() {
                getGroupdeptlist({
                    code: 'dept',
                    userId: undefined
                                })
                            .then(res => {
                                if (res && res.status === 200) {
                    this.treeData = res.data ? res.data : [];
                                } else {
                                    this.$notify({
                                        title: '失败',
                                        message: "获取部门树失败",
                                        type: 'error',
                                        duration: 2000
                                    });
                                }
                });
			},
            // getUserDeptIds() {
            //     getGroupdeptlist({
            //         code: 'dept',
            //         userId: this.userId
            //                     })
            //                 .then(res => {
            //                     if (res && res.status === 200) {
            //                         const deptList = res.data || []
            //                         this.userDeptIds = deptList.map(dept => dept.deptId)
            //                     } else {
            //                         this.$notify({
            //                             title: '失败',
            //                             message: "获取部门树失败",
            //                             type: 'error',
            //                             duration: 2000
            //                         });
            //                     }
            //     });
            // },
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			
			deptClear(e) {
				this.listQuery.deptId = undefined;
			},
			// 选择部门
			handleCheckChange(data) {
				this.listQuery.deptId = data.id;
				this.listQuery.deptName = data.departmentFullName;
				this.popoverVisibel = false;
			},

			// 删除
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						deleteMeetingSupervise(row.id)
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
									return Promise.reject()
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '删除失败',
									type: 'error',
									duration: 2000
								});
							});
					})
			},
            handleDownload: downloadFile,
            handleReset() {
                this.listQuery = {
					page: 1,
					limit: 10,
					endTime: '',
					startTime: '',
					deptId: undefined,
                    deptName: '',
				}
                this.times = []
                this.getList()
            }
		}
	}
</script>

<style lang="scss" scoped>
    .grid-section {
        min-height: 560px;
    }
	.radio-group {
		display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;

        .text {
            margin-right: 20px;
            text-decoration:underline;
            font-size: 14px;
            cursor: pointer;
        }
        
        .text:hover {
            color: #bc0000;
        }
	}
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.active {
		margin-bottom: 0px;
	}

	.otherActiveClass {
		border-bottom: solid 1px #DCDFE6;
	}
	
	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.tree-info-first {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 10px;
		background-color: #FFFFFF;
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;

		// 表格高度不一致，将高度撑开
		>>> .el-table__fixed-right {
			height: 100% !important;
		}

		>>> .el-table__row {
			height: 65px !important;
		}
	}

	.page-info-taskTitle {

		>>> .el-button--text{
			color: #606266;
			text-decoration:underline
		}

		>>> .el-table__row {
			height: 57px !important;
		}
	}

	.pagination-container {
		margin-top: 15px;
	}

	.tree-roll-containers-first {
		max-height: 480px;
    	overflow: auto;
	}

</style>
