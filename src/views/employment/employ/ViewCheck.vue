<template>
	<div class="app-container">
        <div class="page-content">
            <div class="page-header">
                <span>本次廉审提出意见 {{detObj.opinionNum}} 人/次</span>
            </div>
			<div ref="formCnt" class="form-cnt">
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content">
                                <span class="content-title">发起人：</span>
                                <span>{{detObj.initiatorName}}</span>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content">
                                <span class="content-title">创建时间：</span>
                                <span>{{detObj.crtTime}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content">
                                <span class="content-title">申请事项类别：</span>
                                <span>{{detObj.type}}</span>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content">
                                <!-- <span>廉审对象：</span> -->
                                <!-- <span class="click-text">{{detObj.auditMemberFileUrl}}</span>
                                <el-button type="primary" size="mini">点击下载</el-button> -->
                                <div class="file-info">
                                    <span class="content-title">廉审对象：</span>
                                    <div class="file-img">
                                        <img src="~@/assets/img/file.png" alt="图标"></img>
                                    </div>
                                    <div class="file-text">{{detObj.auditMemberFileUrl | formatFile}}</div>
                                    <div class="file-download" @click="downloadHadle(detObj.auditMemberFileUrl)">下载</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content">
                                <span class="content-title">备注：</span>
                                <span>{{detObj.remarks}}</span>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content">
                                <div>
                                    <span class="content-title">附件：</span>
                                    <div class="content-right">
                                        <div class="file-info files-content" v-for="(item,index) in detObj.attachment" :key="index">
                                            <div class="file-img">
                                                <img src="~@/assets/img/file.png" alt="图标"></img>
                                            </div>
                                            <div class="file-text">{{item | formatFile}}</div>
                                            <div class="file-download" @click="downloadHadle(item)">下载</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <el-divider/>
            <div v-if="employment_araigner" class="page-target">
                <span>廉审对象名单</span>
            </div>
            <el-table :height="tableHeight" ref="table" :data="list" v-loading="listLoading" :span-method="objectSpanMethod" border style="width: 100%">
                <el-table-column label="序号" align="center" width="50px" type="index" />
                <el-table-column align="center" label="单位" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.orgName}}
                    </template>
                </el-table-column>
                <el-table-column width="100" align="center" label="部门" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.department}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="人员姓名">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="职务" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.position}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="核对人员" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{scope.row.checkerName ? scope.row.checkerName : '-'}}
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="核对人员意见">
                    <template slot-scope="scope">
                        <div v-if="scope.row.checkerOpinions && scope.row.checkerOpinions.length">
                            <div v-for="(item,index) in scope.row.checkerOpinions">
                                <span>{{index+1}}、{{item.opinion}}</span>
                            </div>
                        </div>
                        <div v-else style="text-align: center;">-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="纪检负责人意见">
                    <template slot-scope="scope">
                        <div v-if="scope.row.disciplineInspectionOpinions && scope.row.disciplineInspectionOpinions.length">
                            <div v-for="(item,index) in scope.row.disciplineInspectionOpinions">
                                <span v-if="item.status == '1'">同意</span>
                                <span v-if="item.status == '0'">其它意见</span>
                                <span v-if="item.opinion">，{{item.opinion}}</span>
                            </div>
                        </div>
                        <div v-else style="text-align: center;">-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="纪委主要负责人意见">
                    <template slot-scope="scope">
                        <div v-if="scope.row.disciplineInspectionCommissionOpinions && scope.row.disciplineInspectionCommissionOpinions.length">
                            <div v-for="(item,index) in scope.row.disciplineInspectionCommissionOpinions">
                                <span v-if="item.status == '1'">同意</span>
                                <span v-if="item.status == '0'">其它意见</span>
                                <span v-if="item.opinion">，{{item.opinion}}</span>
                            </div>
                        </div>
                        <div v-else style="text-align: center;">-</div>
                    </template>
                </el-table-column>
                <el-table-column v-if="isEdit" align="center" width="180" label="操作">
                    <template slot-scope="scope">
                        <!-- <el-button v-if="employment_committee" type="text" @click="handleCheck(scope.row)">审批</el-button>
                        <el-button v-else type="text" @click="handleCheck(scope.row)">审核</el-button> -->
                        <!-- 纪检负责人 -->
                        <el-button v-if="scope.row.checkerOpinions && scope.row.checkerOpinions.length && !scope.row.disciplineInspectionOpinions && employment_department && employment_btn_check" type="text" @click="handleCheckDep(scope.row)">添加纪检负责人意见</el-button>
                        <!-- 核对人员 -->
                        <el-button v-if="!scope.row.checkerOpinions && employment_check && employment_btn_check" type="text" @click="handleCheckChe(scope.row)">添加核对人员意见</el-button>
                        <!-- 纪委主要负责人 -->
                        <el-button v-if="!scope.row.disciplineInspectionCommissionOpinions && scope.row.checkerOpinions && scope.row.checkerOpinions.length && scope.row.disciplineInspectionOpinions && scope.row.disciplineInspectionOpinions.length && employment_committee && employment_btn_check" type="text" @click="handleCheckCom(scope.row)">添加纪委主要负责人意见</el-button>
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
        <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false">
            <el-form ref="dialogFormRef" label-width="130px" :model="dialogFormData" :rules="dialogFormRules">
                <template v-if="cheVisible">
                   <el-form-item label="意见与建议：" required>
                    <el-form-item
                        v-for="(item, index) in dialogFormData.suggestions"
                        :key="item.key"
                        :prop="'suggestions.' + index + '.opinion'"
                        :rules="{
                            required: true, message: '请输入意见与建议', trigger: 'blur'
                        }"
                    >
                        <div class="form-member">
                            <el-input v-model="dialogFormData.suggestions[index].opinion" placeholder="请输入意见与建议" class="form-item-content"></el-input>
                            <div class="item-btn">
                                <span class="btn-info" v-show="index === dialogFormData.suggestions.length - 1"
                                    @click="itemAdd()"><i
                                        class="el-icon-circle-plus-outline"></i></span>
                                <span class="btn-info" v-show="dialogFormData.suggestions.length > 1"
                                    @click="itemDel(index)"><i
                                        class="el-icon-remove-outline"></i></span>
                            </div>
                        </div>
                    </el-form-item>
                    </el-form-item>
                </template>
                
                <!-- <el-form-item v-else label="意见与建议：" prop="suggestion" class="form-item-content">
                    <el-input v-model="dialogFormData.suggestion" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入意见与建议"></el-input>
                </el-form-item> -->
                <el-form-item v-if="!cheVisible" label="意见：" prop="status">
					<el-select v-model="dialogFormData.status" placeholder="请选择" @change="change" style="width: 86%;">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="!cheVisible && dialogFormData.status == '1'" label="建议：" key="opinion1">
					<el-input type="textarea" :rows="4" style="width: 86%;"
						placeholder="请输入" v-model="dialogFormData.opinion" maxlength="500" clearable>
					</el-input>
				</el-form-item>
                <el-form-item v-if="!cheVisible && dialogFormData.status == '0'" label="建议：" prop="opinion" key="opinion0">
					<el-input type="textarea" :rows="4" style="width: 86%;"
						placeholder="请输入" v-model="dialogFormData.opinion" maxlength="500" clearable>
					</el-input>
				</el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="handleOk" :loading="loading">确定</el-button>
            </div>
        </el-dialog>
	</div>
</template>

<script>
    import {
        getObj,
        objectPage,
        opinionChecker,
        opinionDisciplineInspection,
        opinionDisciplineInspectionCommission
    } from 'api/employ/index';
    import tableMixin from '@/mixins/table/table.mixin' 
	import {
		mapGetters
    } from 'vuex';
    import {
		formatFile
    } from 'utils';
    import {
		getToken
	} from 'utils/auth';
	export default {
        mixins: [tableMixin],
		data() {
            this.dialogFormRules = {
                status: [
                    { required: true, message: '请选择意见', trigger: 'change' }
                ],
                opinion: [
                    { required: true, message: '请输入建议', trigger: 'blur' }
                ]
            }
			return {
                loading: false,
                visible: false,
                listLoading: false,
                formData: {
                    userId: '',
                    list: []
                },
                dialogFormData: {
                    suggestion: '',
                    status: '',
                    opinion: '',
                    suggestions: [
                        {opinion: '', id: undefined}
                    ]
                },
                employment_araigner: false,
                employment_department: false,
                employment_check: false,
                employment_committee: false,
                employment_btn_detail: false,
                employment_btn_add: false,
                employment_btn_check: false,
                employment_btn_assigned:false,
                isEdit: false,
                detObj: {},
                listQuery: {
					page: 1,
					limit: 10
                },
                list: [],
                total: 0,
                title: '',
                depVisible: false, //纪检负责人
                cheVisible: false, //核对人员
                comVisible: false, //纪委主要负责人
                options: [{
					value: '1',
					label: '同意'
				}, {
					value: '0',
					label: '其它意见'
				}],
			}
		},
        created() {
            this.isEdit = this.$route.query.isEdit
            this.employment_araigner = this.elements['employment:araigner'] // 提审人
            this.employment_department = this.elements['employment:department'] // 纪检
            this.employment_check = this.elements['employment:check'] // 核对人员
            this.employment_committee = this.elements['employment:committee'] // 纪委
            this.employment_btn_detail = this.elements['employment:btn_detail'] // 查看审查详情
            this.employment_btn_add = this.elements['employment:btn_add'] // 发起廉审
            this.employment_btn_check = this.elements['employment:btn_check'] // 审核
            this.employment_btn_assigned = this.elements['employment:btn_assigned'] // 指派人员
            // this.employment_araigner = false // 提审人
            // this.employment_department = false // 纪检
            // this.employment_check = false // 核对人员
            // this.employment_committee = true // 纪委
            this.getObj();
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
			])
		},

		methods: {
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
					if (data[index].recordId === data[index - 1].recordId) {
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
				// // 表格序号
				// let Nosort = 0
				// for(let n in vm.spanArr){
				// 	if(vm.spanArr[n]>0){
				// 		Nosort += 1
				// 		this.$set(data[n],'Nosort',Nosort)
				// 	}
				// }
			},
			objectSpanMethod(obj) {
				if (obj.columnIndex !== 0 && obj.columnIndex !== 1 && obj.columnIndex !== 2 && obj.columnIndex !== 3 && obj.columnIndex !== 4) {
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
            // 获取详情
			getObj() {
				if(!this.$route.query.id) return;
				getObj(this.$route.query.id)
					.then(response => {
						if (response && response.status === 200) {
                            this.detObj = response.data;
                            this.$nextTick(() => {
                                this.getTableList();
                            })
						} else {
						}
					}).catch(() => {
                    })
            },
            getTableList() {
                this.list = [];
                this.listLoading = true;
                objectPage(this.listQuery,this.$route.query.id)
                    .then(response => {
                        if (response && response.status === 200) {
                            // this.list = response.data.rows;
                            for(let i = 0; i < response.data.rows.length; i++) {
                                this.list.push(
                                    {   ...response.data.rows[i],
                                        "checkerOpinions": this.detObj.checkerOpinions,
                                        "disciplineInspectionOpinions":  this.detObj.disciplineInspectionOpinions,
                                        "disciplineInspectionCommissionOpinions":  this.detObj.disciplineInspectionCommissionOpinions,
                                        "checkerName":  this.detObj.checkerName
                                    }
                                )
                            }
                            this.getSpanArr(this.list);
                            this.total = parseInt(response.data.total);
                        } else {
                            this.total = 0;
                        }
                        this.listLoading = false;
                    }).catch(() => {
                        this.listLoading = false;
                    })
            },
            handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getTableList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getTableList();
			},
            // 下载文件
			downloadHadle(url) {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${url}&token=${getToken()}&bucketName=employ`;
			},
            // 添加纪检意见
            handleCheckDep(row) {
                this.dialogFormData = {
                    suggestion: '',
                    status: '',
                    opinion: '',
                    suggestions: [
                        {opinion: '', id: undefined}
                    ]
                };
                this.dialogFormData.id = row.id
                this.title = '添加纪检负责人意见：';
                this.depVisible = true, //纪检负责人
                this.cheVisible = false, //核对人员
                this.comVisible = false //纪委主要负责人
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dialogFormRef'].resetFields()
                })
            },
            // 添加核对人员意见
            handleCheckChe(row) {
                this.dialogFormData = {
                    suggestion: '',
                    status: '',
                    opinion: '',
                    suggestions: [
                        {opinion: '', id: undefined}
                    ]
                };
                this.dialogFormData.id = row.id
                this.title = '添加核对人员意见：';
                this.depVisible = false, //纪检负责人
                this.cheVisible = true, //核对人员
                this.comVisible = false //纪委主要负责人
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dialogFormRef'].resetFields()
                })
            },
            // 添加纪委意见
            handleCheckCom(row) {
                this.dialogFormData = {
                    suggestion: '',
                    status: '',
                    opinion: '',
                    suggestions: [
                        {opinion: '', id: undefined}
                    ]
                };
                this.dialogFormData.id = row.id
                this.title = '添加纪委主要负责人意见：';
                this.depVisible = false, //纪检负责人
                this.cheVisible = false, //核对人员
                this.comVisible = true //纪委主要负责人
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dialogFormRef'].resetFields()
                })
            },
            change(e) {
                if(e == '1') {
                    this.$nextTick(() => {
                        this.$refs.dialogFormRef.clearValidate();
                    })
                }
            },
            handleOk() {
                this.$refs['dialogFormRef'].validate(valid => {
                    if (valid) {
                        if(this.depVisible) {
                            this.departmentHandle();
                        } else if(this.cheVisible) {
                            this.checkerHandle();
                        } else if(this.comVisible) {
                            this.committeeHandle();
                        }
                    }
                })
            },
            itemAdd() {
                this.dialogFormData.suggestions.push({opinion: '', key: undefined})
            },
            itemDel(index) {
                this.dialogFormData.suggestions.splice(index, 1)
            },
            departmentHandle() {
                this.loading = true;
                opinionDisciplineInspection(
                    { status: this.dialogFormData.status,
                      opinion: this.dialogFormData.opinion }
                    ,this.$route.query.id
                ).then(data=> {
                        if (data && data.status === 200) {
                            this.$notify({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.loading = false;
                                    this.visible = false
                                    this.getObj();
                                    this.isEdit = false;
                                }
                            })
                        } else {
                            this.loading = false;
                            this.$notify.error(data.msg)
                        }
                })
            },
            checkerHandle() {
                this.loading = true;
                opinionChecker(this.dialogFormData.suggestions,this.$route.query.id).then(data=> {
                        if (data && data.status === 200) {
                            this.$notify({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.loading = false;
                                    this.visible = false
                                    this.getObj();
                                    this.isEdit = false;
                                }
                            })
                        } else {
                            this.loading = false;
                            this.$notify.error(data.msg)
                        }
                })
            },
            committeeHandle() {
                this.loading = true;
                opinionDisciplineInspectionCommission(
                    { status: this.dialogFormData.status,
                      opinion: this.dialogFormData.opinion }
                    ,this.$route.query.id
                ).then(data=> {
                        if (data && data.status === 200) {
                            this.$notify({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.loading = false;
                                    this.visible = false
                                    this.getObj();
                                    this.isEdit = false;
                                }
                            })
                        } else {
                            this.loading = false;
                            this.$notify.error(data.msg)
                        }
                })
            },
            tableLayout(option) {
                const pageHeight = window.innerHeight
                const formHeight = this.$refs['formCnt'].offsetHeight
                const computedHeight = pageHeight - formHeight - 300
                this.tableHeight = computedHeight > 500 ? computedHeight : 500
                this.$nextTick(() => {
                    this.$refs[tableRefName]?.doLayout()
                })
            }
		}
	}
</script>

<style lang="scss" scoped>
.form-item-content {
    width: 86%;
  }
  .page-header {
    text-align: right;
    margin-bottom: 20px;
  }
  .page-info-text {
    padding-bottom: 20px;

    .content-title {
        display: inline-block;
        width: 120px;
        text-align: right;
    }
  }

  .page-target {
      text-align: center;
      margin-bottom: 20px;
      font-size: 15px;
  }

  .form-member {
		display: flex;

		.item-btn {
			width: 5%;
    		min-width: 80px;
			padding: 0 10px;

			.btn-info {
				font-size: 17px;
				margin-right: 10px;
			}

			.btn-info:hover {
				font-weight: bold;
				color: #000;
				cursor: pointer;
			}
		}
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

    .content-right {
        margin-top: -21px;
    }

    .files-content {
        margin-left: 120px;
        // margin-top: -21px;
    }
</style>
