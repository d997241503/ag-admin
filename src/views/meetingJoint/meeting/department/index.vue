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
							<el-input style="width: 200px;" clearable class="filter-item" placeholder="请输入议题关键字查询"
							v-model="listQuery.topicName">
							</el-input>
						</el-form-item>
                        <el-form-item>
							<el-date-picker v-model="listQuery.year" type="year" format="yyyy" value-format="yyyy" placeholder="请选择会议年份" @change="handleYearChange">
                            </el-date-picker>
						</el-form-item>
                        <el-form-item>
							<el-select v-model="listQuery.themeId" class="filter-item" placeholder="请选择会议主题"
							style="width: 200px;" clearable>
								<el-option v-for="item in themeOptions" :key="item.id" :label="item.name" :value="item.id">
								</el-option>
							</el-select>
						</el-form-item>
                        <el-form-item>
							<el-select v-model="listQuery.type" class="filter-item" placeholder="请选择监督类别"
							style="width: 200px;" clearable>
								<el-option v-for="item in superviseOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
						<el-button v-waves type="primary" @click="handleReset">重置</el-button>
						<el-button v-if="meetingJoint_btn_situationAdd" class="filter-item" style="margin-left: 10px;" @click="requestMeeting()"
							type="primary" icon="edit">添加会议</el-button>
						<el-button v-if="meetingJoint_btn_reportTopicMng" class="filter-item" style="margin-left: 10px;" @click="handleComments"
							type="primary" icon="edit">上报议题管理</el-button>
					</el-form>
				</div>
			</div>
		</div>
		<div class="page-info" ref="pageInfo" style="min-height: 560px">
			<div class="grid-wrapper">
                <el-table ref="table" :height="tableHeight" rowKey='id' :data="formList" v-loading="listLoading" border :span-method="arraySpanMethod()" :header-cell-style="headerStyle()">
                <el-table-column align="center" label="序号" width="50px" type="index" fixed="left">
                    <template slot-scope="{row}">
                        {{$chaining(row, 'meetingData', 'themeIndex')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="会议主题" width="190" fixed="left">
                    <template slot-scope="{row}">
                    {{getThemeText(row)}}
                    </template>
                </el-table-column>
                <el-table-column align="left" header-align="center" label="基本情况" width="210">
                    <template slot-scope="{row}">
                        <el-tooltip class="item" effect="dark" :content="'会议地点: ' + $chaining(row, 'meetingData', 'meetingPlace')" placement="top">
                            <div>
                                <div>会议时间：{{$chaining(row, 'meetingData', 'meetingTime')}}</div>
                                <div class="text-ellipsis-1">会议地点：{{$chaining(row, 'meetingData', 'meetingPlace')}}</div>
                                <div>参会人员：{{$chaining(row, 'meetingData', 'confereeNum')}}</div>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="left" header-align="center" label="议题" width="190" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        {{row.index + '、' + row.topicName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上报单位" width="190" show-overflow-tooltip>
                    <template slot-scope="{row}">
                    {{row.deptName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="类别" width="100">
                    <template slot-scope="{row}">
                    {{row.type === '0' ? '任务' : '监督'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理情况" width="190">
                    <template slot-scope="{row}">
                        <template v-if="row.type === '0'">
                            <div v-for="(process, index) in row.rectificationProcess || []" :key="index" style="margin-left: 20px;text-align: left">
                                {{formatRec(process, index)}}</div>
                        </template>
                        <template v-else>/</template>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理结果" width="190" show-overflow-tooltip>
                    <template slot-scope="{row}">
                        {{row.type === '0' ? row.rectificationResult : '/'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="相关附件" width="190">
                    <template slot-scope="{row}">
                        <template v-if="row.type === '0'">
                            <div class="click-text" v-for="file in row.rectificationFiles" :key="file" @click="handleDownload(file, 'archives')">{{formatFile(file)}}</div>
                        </template>
                        <template v-else>/</template>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="会议纪要" width="190">
                    <template slot-scope="{row}">
                        <div class="click-text" @click="handleDownload(file, 'archives')" v-for="file in $chaining(row, 'meetingData', 'meetingSummaryFiles') || []" :key="file">{{file && formatFile(file)}}</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="meetingJoint_btn_department" align="center" label="操作" width="120" fixed="right">
                    <template slot-scope="{row}">
                        <template v-if="row.type === '0'">
                            <el-button v-if="$chaining(row, 'rectificationProcess', 'length') && meetingJoint_btn_rectificationEdit" type="text" @click="handleRectification(row)" icon="el-icon-edit-outline">办理情况</el-button>
                            <el-button v-else-if=" meetingJoint_btn_rectificationAdd" type="text" @click="handleRectification(row)" icon="el-icon-document-add">办理情况</el-button>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="130" fixed="right">
                    <template slot-scope="{row}">
                        <el-button v-if="meetingJoint_btn_situationDetail" type="text" @click="detailHandle(row)">查看</el-button>
                        <el-divider direction="vertical"/>
                        <el-dropdown @command="fn => fn()">
                            <span class="el-dropdown-link">
                                更多<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="$chaining(row, 'meetingData', 'meetingSummaryFiles').length && meetingJoint_btn_summaryEdit" :command="() => {handleSummary(row)}">编辑会议纪要</el-dropdown-item>
                                <el-dropdown-item v-else-if="meetingJoint_btn_summaryAdd" :command="() => {handleSummary(row)}">添加会议纪要</el-dropdown-item>
                                <el-dropdown-item v-if="row.isEdit && meetingJoint_btn_situationEdit" :command="() => {detailHandle(row, true)}">编辑</el-dropdown-item>
                                <el-dropdown-item v-if="meetingJoint_btn_situationDelete" :command="() => {handleDelete(row)}">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
        <RectificationModal v-if="recModalVisible" ref="RecModal" @update="getList"/>
        <el-dialog :visible.sync="sumModalVisible" :title="sumModaltitle" :close-on-click-modal="false">
            <el-form ref="sumForm" label-width="130px" :model="sumForm">
                <el-form-item label="附件：" prop="fileList">
                    <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="11"
                    :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
                    @refreshData="getFiles"></UploadFiles>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="sumModalVisible = false">取消</el-button>
                <el-button type="primary" @click="sumModalConfirm" :loading="sumModalLoading">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
    } from 'utils/auth';
    // import {
	// 	getTree
	// } from 'api/admin/department/index';
	import {
		getGroupdeptlist
	} from 'api/admin/group/index';
    import {meetingRecordList, meetingThemeList, deleteMeetingRecord, updateThemeSum} from 'api/meeting'
    import RectificationModal from './RectificationModal'
  import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
   import {recProOptions} from './common'
   import {downloadFile} from 'utils/file'
   import {formatFile} from 'utils'
   import tableMixin from '@/mixins/table/table.mixin.js'
	export default {
		name: "index",
		components: {
            RectificationModal, UploadFiles
		},
        props: {
            tabType: String
        },
        mixins: [tableMixin],
		data() {
            this.recProOptions = recProOptions
            this.uploadFile = {
                textFirst: ' +上传文件',
                limit: 9,
                size: 30,
                url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
                accepts: '.pdf,.jpg,.png'
            }
			return {
                popoverVisibel: false,
                treeVisible: false,
				treeData: [],
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
                    year: new Date().getFullYear().toString()
				},
				times: [],
				recModalVisible: false,
                themeOptions: [],
                superviseOptions: [
                    {label: '任务', value: '0'},
                    {label: '监督', value: '1'}
                ],
                dataList: [],
                sumModalVisible: false,
                sumModaltitle: '',
                sumForm: {},
                sumModalLoading: false,
                meetingJoint_btn_department: false,
                meetingJoint_btn_situationAdd: false,
                meetingJoint_btn_situationEdit: false,
                meetingJoint_btn_situationDelete: false,
                meetingJoint_btn_reportTopicMng: false,
                meetingJoint_btn_summaryAdd: false,
                meetingJoint_btn_summaryEdit: false,
                meetingJoint_btn_rectificationAdd: false,
                meetingJoint_btn_rectificationEdit: false,
                meetingJoint_btn_situationDetail: false
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
            },
            formList() {
                const { dataList } = this
                let list = []
                dataList.forEach((theme, themeIndex) => {
                    if (!theme.topicList) return
                    let isHasRec = false
                    let isHasSum = !!theme.meetingSummaryFiles
                    theme.topicList.forEach((topic, index) => {
                        if (index === 0) {
                            let meetingData = {themeIndex: themeIndex + 1}
                            Object.keys(theme).filter(filterItem => filterItem !== 'topicList').forEach(key => {
                                meetingData[key] = theme[key]
                            })
                            topic.rowSpan = theme.topicList.length
                            topic.meetingData = meetingData 
                        }
                        if (topic.rectificationFiles) {
                            isHasRec = true
                        }
                        topic.index = index + 1
                    })
                    theme.topicList[0].isEdit = !isHasRec && !isHasSum
                    list = list.concat(theme.topicList)
                })
                return list
            }
		},
		created() {
			// 获取权限
			this.meetingJoint_btn_department = this.elements['meetingJoint:btn_department']
			this.meetingJoint_btn_situationAdd = this.elements['meetingJoint:btn_situationAdd']
			this.meetingJoint_btn_situationEdit = this.elements['meetingJoint:btn_situationEdit']
			this.meetingJoint_btn_situationDelete = this.elements['meetingJoint:btn_situationDelete']
			this.meetingJoint_btn_reportTopicMng = this.elements['meetingJoint:btn_reportTopicMng']
			this.meetingJoint_btn_summaryAdd = this.elements['meetingJoint:btn_summaryAdd']
			this.meetingJoint_btn_summaryEdit = this.elements['meetingJoint:btn_summaryEdit']
			this.meetingJoint_btn_rectificationAdd = this.elements['meetingJoint:btn_rectificationAdd']
			this.meetingJoint_btn_rectificationEdit = this.elements['meetingJoint:btn_rectificationEdit']
			this.meetingJoint_btn_situationDetail = this.elements['meetingJoint:btn_situationDetail']
            this.getTreeInfo();
            this.getThemeList()
			this.$nextTick(() => {
				// 获取列表
				this.getList();
			})
        },
		methods: {
            formatFile,
            formatRec(process, index) {
                const data = recProOptions.find(item => item.value === process)
                return `${index + 1}、${data.label} √`
            },
            getThemeText(row) {
                const {year, themeName} = row.meetingData
                return `${themeName} ${year}年`
            },
            handleSummary(row) {
                const {meetingSummaryFiles, id} = row.meetingData
                if (meetingSummaryFiles?.length) {
                    this.sumForm.fileList = meetingSummaryFiles.map(fileUrl => ({
                        name: this.formatFile(fileUrl),
                        url: fileUrl
                    }))
                    this.sumModaltitle = '编辑会议纪要'
                } else {
                    this.sumForm.fileList = []
                    this.sumModaltitle = '添加会议纪要'
                }
                this.$nextTick(() => {
                    this.$refs['uploadFiles'].init(this.sumForm.fileList)
                })
                this.sumForm.id = id
                this.sumModalVisible = true
            },
            getFiles({files}) {
                this.sumForm.fileList = files
            },
            sumModalConfirm() {
                this.$refs['sumForm'].validate(valid => {
                    if (valid) {
                        this.sumModalLoading = true
                        updateThemeSum(this.sumForm.id, this.sumForm.fileList.map(file => file.response?.fileUrl || file.url))
                        .then((res) => {
                            if (res?.status === 200) {
                                this.$notify({
                                    title: '成功',
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 2000
                                });
                                this.sumModalVisible = false
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
                        }).finally(() => this.sumModalLoading = false)
                    }
                })
            },
            handleYearChange() {
                this.listQuery.themeId = ''
                this.getThemeList()
            },
            getThemeList() {
                meetingThemeList({year: this.listQuery.year}).then(res => {
                    if (res?.status === 200) {
                        this.themeOptions = res.data.rows
                    }
                })
            },
            arraySpanMethod() {
                let mergeColIndex = [0, 1, 2, 9, this.meetingJoint_btn_department ? 11 : 10]
                let indexObj = {}
                mergeColIndex.forEach(key => indexObj[key] = true)

                return ({ row, column, rowIndex, columnIndex }) => {
                    if (indexObj[columnIndex]) {
                        if (row.rowSpan) {
                            return [row.rowSpan, 1]
                        } else {
                            return [0, 0]
                        }
                    }
                }
            },
            headerStyle() {
                return this.meetingJoint_btn_department
                    ? ({row, columnIndex}) => {
                        row[10].colSpan = 2
                        row[11].colSpan = 0
                        if (columnIndex === 11) return 'display:none'
                    }
                    : undefined
            },
            getList(type) {
				this.listLoading = true;
                meetingRecordList(this.listQuery)
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
            radioChange() {},
            handleComments() {
                this.$router.push({ path: '/filesImplementation/meeting/topicMng' })
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
            
            // 添加/申请会议
            requestMeeting(temporary) {
                this.$router.push({
                    path: '/filesImplementation/meeting/requestMeeting',
                    query: {
                        temporary: temporary,
                        // row: row
                    }
                })
            },

            // 查看
            detailHandle(data, isEdit) {
                const {themeId, themeName} = data.meetingData
                this.$router.push({
                    // path: '/filesImplementation/meeting/meetingDetail',
                    name: `监督联席会${isEdit ? '编辑' : '详情'}`,
                    query: {
                        id: data.meetingData.id,
                        isEdit
                    },
                    params: {
                        themeObj: {
                            name: themeName,
                            id: themeId
                        }
                    }
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
						deleteMeetingRecord(row.meetingData.id)
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
					}).catch(() => {

					});
			},
            handleRectification(row) {
                this.recModalVisible = true
                this.$nextTick(() => {
                    this.$refs['RecModal'].init(row)
                })
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
                    year: new Date().getFullYear().toString()
				}
                this.getList()
            }
		}
	}
</script>

<style lang="scss" scoped>
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
