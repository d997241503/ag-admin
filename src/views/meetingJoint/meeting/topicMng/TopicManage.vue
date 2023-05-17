<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="page-info" ref="searchSection" style="padding-bottom:0;margin-bottom: 20px;">
			<div class="search-left">
        <el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
          <el-form-item>
            <el-select v-model="listQuery.deptId" placeholder="请选择单位" clearable>
                  <el-option v-for="item in treeData" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                  </el-option>
                </el-select>
        </el-form-item>
          <el-form-item>
            <el-input style="width: 200px;" clearable class="filter-item" placeholder=" 请输入议题关键字查询"
            v-model="listQuery.topicName">
            </el-input>
          </el-form-item>
          <el-form-item class="filter-item" prop="year">
				<el-date-picker v-model="listQuery.year" type="year" format="yyyy" value-format="yyyy" placeholder="选择年">
				</el-date-picker>
			</el-form-item>
          <el-form-item class="filter-item" prop="type">
            <el-select v-model="listQuery.type" placeholder="请选择类别" class="form-item-content" clearable>
                <el-option label="任务" value="0"></el-option>
                <el-option label="监督" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
          <el-button v-waves type="primary" @click="handleReset">重置</el-button>
          <el-button class="filter-item" style="margin-left: 10px;" @click="handleComments"
            type="primary" icon="edit">上报议题</el-button>
        </el-form>
      </div>
		</div>
        <div class="grid-wrapper page-info">
        <el-table ref="table" :height="tableHeight" rowKey='id' :data="dataList" v-loading="listLoading" border>
            <el-table-column align="center" label="序号" width="50px" type="index" />
            <el-table-column align="center" label="年份" prop="year" width="120" />
            <el-table-column align="center" label="议题" width="190" show-overflow-tooltip>
            <template slot-scope="{row}">
                {{row.topicName}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="上报单位" width="190" show-overflow-tooltip>
            <template slot-scope="{row}">
                {{row.deptName}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="类别">
            <template slot-scope="{row}">
                {{row.type === '0' ? '任务' : '监督'}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="附件" width="190">
            <template slot-scope="{row}">
                <template>
                    <div class="click-text" @click="handleDownload(file, 'archives')" v-for="file in row.fileUrls" :key="file">{{formatFile(file)}}</div>
                </template>
            </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
            <template slot-scope="{row}">
                {{topicStatusMap[row.status]}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="标记情况说明" width="190" show-overflow-tooltip>
            <template slot-scope="{row}">
                <template v-if="row.markingConditions">
                    <span class="click-text" @click="handleRemarkHistory(row.markingConditions)">{{row.status === '0' ? row.markingConditions[0].remarks : '历史情况'}}</span>
                </template>
            </template>
            </el-table-column>
            <el-table-column align="center" label="更新人">
            <template slot-scope="{row}">
                {{(row.markingConditions ? row.markingConditions.at(-1).operationUserName : '')}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="190">
            <template slot-scope="{row}">
                {{row.crtTime}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120">
            <template slot-scope="{row}" v-if="(meetingJoint_btn_department || userDeptIds.includes(row.deptId))">
                <el-button type="text" @click="markValid(row)">标记{{row.status === '0' ? '有效' : '无效'}}</el-button>
                <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                    :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
        </div>
        <TopicModal
        ref="TopicModal"
        title="编辑议题"
        :visible.sync="modalVisible"
        :formData="modalFormData"
        @closed="handleClosed"
        @confirm="handleConfirm"
        />
        <el-dialog :visible.sync="markVisible" title="标记无效" @closed="markDialogClosed" :close-on-click-modal="false">
            <el-form ref="markDialog" label-width="130px" :model="markDialogForm" :rules="markDialogRules">
                <el-form-item prop="remarks" label="标记情况说明：">
                    <el-input v-model="markDialogForm.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="markVisible = false">取消</el-button>
                <el-button type="primary" @click="handleMarkOk" :loading="dialogBtnLoading">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="markHisVisible" title="标记历史情况">
            <el-table rowKey='id' :data="markHisList" border>
                <el-table-column align="center" label="序号" width="50px" type="index" />
                <el-table-column align="center" label="标记人姓名" prop="operationUserName" />
                <el-table-column align="center" label="情况说明" prop="remarks" show-overflow-tooltip=""/>
                <el-table-column align="center" label="标记时间" prop="crtTime"/>
            </el-table>
        </el-dialog>
        
		<!-- 弹窗, 上报议题 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></add-or-update>
  </div>
</template>

<script>
    import AddOrUpdate from './ReportTopic';
	import {
		myviewPage,
		archivesAuditAll
	} from 'api/archives/index';
	import {
		getByType
	} from 'api/admin/dict/index';
    import { meetingTopicMngList, deleteMeetingTopic, addMeetingTopic, markMeetingTopic, meetingThemeList } from 'api/meeting/index';
	import {
		mapGetters
	} from 'vuex';
    import {
		getGroupdeptlist
	} from 'api/admin/group/index';
  import TopicModal from './TopicModal.vue'
    import { topicStatusMap } from './common'
       import {downloadFile} from 'utils/file'
       import {formatFile} from 'utils'
    import tableMixin from '@/mixins/table/table.mixin.js';
	export default {
		name: "index",
		components: {
      // Department, Unit
      TopicModal, AddOrUpdate
		},
        mixins: [tableMixin],
		data() {
            this.pickerOptions = {
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
            }
            this.topicStatusMap = topicStatusMap
            this.markDialogRules = {
                remarks: [{ required: true, trigger: 'blur', message: '请输入标记情况说明' }]
            }
            return {
                addOrUpdateVisible: false,
                tabPosition: 'joint',
                popoverVisibel: false,
                treeData: [],
                userDeptIds: [],
                index: 0,
                defaultProps: {
                    children: 'children',
                    label: 'departmentFullName'
                },
                listLoading: true,
                deptName: '',
                total: 0,
				listQuery: {
					page: 1,
					limit: 10,
					deptId: undefined,
					type: '',
					topicName: '',
                    themeId: '',
                    year: new Date().getFullYear() + ''
				},
				times: [],
				options: [{
					value: '1',
					label: '个人廉政档案'
				}, {
					value: '2',
					label: '个人事项报告'
				}],
                modalVisible: false,
                modalFormData: {},
                dataList: [],
                markVisible: false,
                markDialogForm: {
                    remarks: ''
                },
                meetingJoint_btn_department: false,
                markHisList: [],
                markHisVisible: false,
                dialogBtnLoading: false
			}
		},

		computed: {
			...mapGetters([
				'elements', 'userId'
			]),
		},
		created() {
			// 获取权限
			this.meetingJoint_btn_department = this.elements['meetingJoint:btn_department']
            this.getTreeInfo();
            this.getUserDeptIds()
			this.$nextTick(() => {
				// 获取列表
				this.getList();
			})
        },
        
		methods: {
            formatFile,
            handleComments() {
                // this.$router.push({
                // path: '/filesImplementation/meeting/topicMng/reportTopic'
                // })
                this.addOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init();
				})
            },
            // 获取部门树
			getTreeInfo() {
				const p1 = getGroupdeptlist({
					code: 'jjjcs',
					userId: undefined
				})
				const p2 = getGroupdeptlist({
					code: 'dept',
					userId: undefined
				})
                Promise.all([p1, p2]).then(([res1, res2]) => {
                    if (res1?.status === 200 && res2?.status === 200) {
                        this.treeData = res1.data.concat(res2.data)
                    } else {
						this.$notify({
							title: '失败',
							message: "获取部门树失败",
							type: 'error',
							duration: 2000
						});
					}
                })
			},
            getUserDeptIds() {
                getGroupdeptlist({
                    code: 'dept',
                    userId: this.userId
                                })
                            .then(res => {
                                if (res && res.status === 200) {
                                    const deptList = res.data || []
                                    this.userDeptIds = deptList.map(dept => dept.deptId)
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
				this.deptName = data.departmentFullName;
				this.popoverVisibel = false;
			},
			// 获取数据列表
			getList(type) {
				this.listLoading = true;
                meetingTopicMngList(this.listQuery)
                    .then(response => {
                        if (response && response.status === 200) {
                            this.dataList = response.data.rows;
                            this.total = parseInt(response.data.total);
                            this.tableLayout()
                        } else {
                            this.total = 0;
                        }
                        this.listLoading = false;
                    }).catch(() => {
                        this.listLoading = false;
                    })
			},

			// 删除
			handleDelete(row) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
                        deleteMeetingTopic(row.id)
                        .then((res) => {
                                if (res?.status === 200) {
                                    this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success',
                                        duration: 2000
                                    });
                                    this.getList()
                                } else {
                                    return Promise.reject(res.msg)
                                }
                            }).catch((msg) => {
                                this.$notify({
                                    title: '失败',
                                    message: msg || '删除失败',
                                    type: 'error',
                                    duration: 2000
                                });
                            })
                        })
			},
            handleConfirm(row) {
                const {topicName, type, fileList, id, themeId} = row
                let data = {
                    topicName,
                    type,
                    fileUrls: fileList.map(file => file.response?.fileUrl || file.url),
                    id,
                    themeId
                }
                this.$refs['TopicModal'].btnLoading = true
                addMeetingTopic(data, 'put')
                .then((res) => {
                    if (res?.status === 200) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.modalVisible = false
                        this.getList()
                    } else {
                        return Promise.reject(res.msg)
                    }
                }).catch((msg) => {
                    this.$notify({
                        title: '失败',
                        message: msg || '操作失败',
                        type: 'error',
                        duration: 2000
                    });
                }).finally(() => this.$refs['TopicModal'].btnLoading = false)
                
            },
            handleClosed() {
                this.modalFormData = {}
            },
            handleEdit(row) {
                const {fileUrls, topicName, type, id, themeId} = row
                let fileList = (fileUrls || []).map(file => {
                    return {
                        name: formatFile(file),
                        url: file
                    }
                })
                this.modalFormData = {
                    topicName,
                    type,
                    fileList,
                    id,
                    themeId
                }
                this.modalVisible = true
            },
            handleMarkOk() {
                this.$refs['markDialog'].validate(valid => {
                    if (valid) {
                        this.postMarkValid()
                    }
                })
            },
            markValid(row) {
                const {status, id} = row
                this.markDialogForm.id = id
                if (status === '1') {
                    this.markDialogForm.status = '0'
                    this.markVisible = true
                } else {
                    this.markDialogForm.status = '1'
                    this.postMarkValid()
                }
            },
            postMarkValid() {
                this.dialogBtnLoading = true
                markMeetingTopic(this.markDialogForm.id, this.markDialogForm)
                .then((res) => {
                    if (res?.status === 200) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success',
                            duration: 2000
                        });
                        this.markVisible = false
                        this.getList()
                    } else {
                        return Promise.reject(res.msg)
                    }
                }).catch((msg) => {
                    this.$notify({
                        title: '失败',
                        message: msg || '操作失败',
                        type: 'error',
                        duration: 2000
                    });
                }).finally(() => this.dialogBtnLoading = false)
            },
            markDialogClosed() {
                this.$refs['markDialog'].resetFields()
            },
            handleRemarkHistory(data) {
                this.markHisList = data.filter(item => item.remarks)
                this.markHisVisible = true
            },
            handleDownload: downloadFile,
            handleReset() {
                this.listQuery = {
					page: 1,
					limit: 10,
					deptId: undefined,
					type: '',
					topicName: '',
                    themeId: '',
                    year: new Date().getFullYear() + ''
				}
                this.getList()
            }
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

    .el-pagination {
      margin-top: 15px;
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
