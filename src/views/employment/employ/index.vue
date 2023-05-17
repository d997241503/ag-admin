<template>
	<div class="app-container">
        <div ref="searchSection" class="page-content list-search-container">
			<el-form :inline="true" :model="listQuery" @keyup.enter.native="getList()">
                <el-form-item>
                    <el-popover class="input-item" v-model="popoverVisibel" trigger="click" v-loading="loading">
                        <el-tree style="min-width: 350px;" ref="treeData" :props="defaultProps" :data="treeData"
                            node-key="id" :expand-on-click-node="false" class="roll-containers">
                                <span class="custom-tree-node" slot-scope="{ node, data }" @click="handleCheckChange(data)">
                                    <span
                                        v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}
                                    </span>
                                </span>
                            </el-tree>
                        <el-select v-model="deptName" placeholder="请选择单位" class="input-item" slot="reference"
                            ref="selectIt" @focus="closeIt" clearable @clear="deptClear">
                        </el-select>
                    </el-popover>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="listQuery.type" class="filter-item" placeholder="请选择申请事项类别"
                    style="width: 200px;" clearable>
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                        unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-button class="filter-item query" type="primary" icon="search" @click="handleFilter">查询</el-button>
                <el-button type="primary" @click="handleReset">重置</el-button>
                <el-button v-if="employment_araigner && employment_btn_add" class="filter-item" style="margin-left: 10px;" @click="addApprove()"
                    type="primary" icon="edit">廉审发起</el-button>
            </el-form>
		</div>
        <div class="page-content" ref="pageInfo">
            <el-table :height="tableHeight" ref="table" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
                <el-table-column label="序号" width="50px" align="center" type="index" />
                <el-table-column width="150" align="center" label="申请事项类别">
                    <template slot-scope="scope">
                        {{scope.row.type}}
                    </template>
                </el-table-column>
                <el-table-column width="100" align="center" label="廉审对象">
                    <template slot-scope="scope">
                        {{scope.row.auditMemberNum ? scope.row.auditMemberNum : 0}}人
                    </template>
                </el-table-column>
                <el-table-column align="center" label="发起人" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{scope.row.initiatorName}}</span>
                        <span v-if="scope.row.initiatorDeptName">-{{scope.row.initiatorDeptName}}</span>
                        <span v-if="scope.row.initiatorOrgName">（{{scope.row.initiatorOrgName}}）</span>
                    </template>
                </el-table-column>
                <el-table-column header-align="center" label="核对人员意见" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <div v-if="scope.row.checkerOpinions && scope.row.checkerOpinions.length">
                            <div v-for="(item,index) in scope.row.checkerOpinions" :key="index" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                                <span>{{index+1}}、{{item.opinion}}</span>
                            </div>
                        </div>
                        <div v-else style="text-align: center;">-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="纪检负责人意见" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                         <div v-if="scope.row.disciplineInspectionOpinions && scope.row.disciplineInspectionOpinions.length">
                            <div v-for="(item,index) in scope.row.disciplineInspectionOpinions" :key="index" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                                <span v-if="item.status == '1'">同意</span>
                                <span v-if="item.status == '0'">其它意见</span>
                                <span v-if="item.opinion">，{{item.opinion}}</span>
                            </div>
                        </div>
                        <div v-else style="text-align: center;">-</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="纪委主要负责人意见" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                         <div v-if="scope.row.disciplineInspectionCommissionOpinions && scope.row.disciplineInspectionCommissionOpinions.length">
                            <div v-for="(item,index) in scope.row.disciplineInspectionCommissionOpinions" :key="index" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                                <span v-if="item.status == '1'">同意</span>
                                <span v-if="item.status == '0'">其它意见</span>
                                <span v-if="item.opinion">，{{item.opinion}}</span>
                            </div>
                        </div>
                        <div v-else style="text-align: center;">-</div>
                    </template>
                </el-table-column>
                <el-table-column width="160" align="center" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.crtTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.checkerOpinions && !scope.row.checkerUserId && employment_department && employment_btn_assigned" type="text" @click="handlePerson(scope.row.id)">指派人员</el-button>
                        <!-- 纪检负责人 -->
                        <el-button v-if="scope.row.checkerOpinions && scope.row.checkerOpinions.length && !scope.row.disciplineInspectionOpinions && employment_department && employment_btn_check" type="text" @click="handleCheck(scope.row, true)">审核</el-button>
                        <!-- 核对人员 -->
                        <el-button v-if="!scope.row.checkerOpinions && employment_check && employment_btn_check && scope.row.checkerUserId && scope.row.checkerUserId == userId" type="text" @click="handleCheck(scope.row, true)">审核</el-button>
                        <!-- 纪委主要负责人 -->
                        <el-button v-if="!scope.row.disciplineInspectionCommissionOpinions && scope.row.checkerOpinions && scope.row.checkerOpinions.length && scope.row.disciplineInspectionOpinions && scope.row.disciplineInspectionOpinions.length && employment_committee && employment_btn_check" type="text" @click="handleCheck(scope.row, true)">审核</el-button>
                        <el-button v-if="employment_btn_detail" type="text" @click="handleCheck(scope.row)">查看</el-button>
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
        <AddApprove v-if="visible" ref="modalRef" @refreshDataList="getList"/>
        <el-dialog :visible.sync="personVisible" title="指派人员" :close-on-click-modal="false">
            <el-form ref="dialogFormRef" label-width="130px" :model="dialogFormData" :rules="dialogFormRules">
                <el-form-item label="指派人员：" prop="checkerUserId" class="box-form">
                    <!-- <el-select v-model="dialogFormData.personId" placeholder="请选择指派人员" filterable clearable class="form-item-content">
                        <el-option v-for="item in UserData" :key="item.value" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select> -->
                    <el-button @click="personnelFistHandle('指派人员')" type="text"
                        class="but-css">
                        选择人员
                        <span v-if="!sFormData.checkerName">(未选择)</span>
                        <span v-else>(已选择{{sFormData.checkerName ? sFormData.checkerName : ''}})</span>
                    </el-button>
                    <el-select class="form-item-content input-item input-select elinput" v-model="sFormData.checkerUserId" @focus="closeIt" ref="selectIt"
                        placeholder="">
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="personVisible = false">取消</el-button>
                <el-button type="primary" @click="handlePersonOk" :loading="personOkLoading">确定</el-button>
            </div>
        </el-dialog>
        <!-- 弹窗 选择人员 -->
        <fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" :choiceSingle="true" :defaultSelected="'100004059'" ref="personnelFist" title="人员">
        </fuhsiSelectPersonnel>
	</div>
</template>

<script>
    import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	import {
		statistical,
        page,
        recordChecker
    } from 'api/employ/index';
    import {
		getTree
	} from 'api/admin/department/index';
	import countTo from 'vue-count-to';
	import {
		mapGetters
	} from 'vuex';
    import tableMixin from '@/mixins/table/table.mixin' 
    // import {
	// 	getGroupdeptlist
	// } from 'api/admin/group/index';
    import AddApprove from './AddApprove.vue';
	export default {
        mixins: [tableMixin],
        components: {AddApprove, fuhsiSelectPersonnel },
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
            this.typeOptions = [
                {name: '竞聘', value: '竞聘'},
                {name: '访谈', value: '访谈'},
                {name: '考察', value: '考察'},
                {name: '其他', value: '其他'},
            ]
            // this.dialogFormRules = {
            //     checkerUserId: [
            //         { required: true, message: '请选择指派人员', trigger: 'change' }
            //     ]
            // }
			return {
                listQuery: {
					page: 1,
					limit: 10,
                    type: '',
                    orgId: '',
                    startTime: '',
                    endTime: ''
                },
                times: [],
                personOkLoading: false,
                listLoading: true,
                treeData: [],
                visible: false,
                personVisible: false,
                UserData: [
                    { name: '张三', value: '123' },
                    { name: '违法', value: '1231' },
                    { name: '阿斯蒂芬', value: '1232' },
                    { name: '告诉对方', value: '1233' },
                    { name: '张23', value: '1234' }
                ],
                dialogFormData: {
                    userId: ''
                },
                popoverVisibel: false,
                loading: true,
                defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
                deptName: '',
                treeVisible: false,
                employment_araigner: false,
                employment_department: false,
                employment_check: false,
                employment_committee: false,
                employment_btn_detail: false,
                employment_btn_add: false,
                employment_btn_check: false,
                employment_btn_assigned:false,
                personnelFistVisible:false,
                checkedData:[],
                sFormData: {
                    checkerDeptId: undefined,
                    checkerDeptName: '',
                    checkerName: '',
                    checkerOrgId: undefined,
                    checkerOrgName: '',
                    checkerUserId: undefined
                },
                id: undefined,
                dialogFormRules: {
					checkerUserId: [{
						required: true,
						message: '请选择指派人员',
						trigger: 'blur'
					}]
				},
			}
		},

		computed: {
			...mapGetters([
				'elements', 'userId'
			])
        },

        watch : {
			checkedData: {
				handler(newVal, oldVal) {
					if(newVal.label == '指派人员') {
                        this.sFormData.checkerUserId = newVal.resultList[0].userId;
                        this.sFormData.checkerName = newVal.resultList[0].name;
                        this.sFormData.checkerDeptId = newVal.resultList[0].deptId;
                        this.sFormData.checkerDeptName = newVal.resultList[0].deptName;
                        this.sFormData.checkerOrgId = newVal.resultList[0].orgId;
                        this.sFormData.checkerOrgName = newVal.resultList[0].orgName;
                         this.$set(this.sFormData,'checkerUserId',newVal.resultList[0].userId)
                         this.$forceUpdate()
                         this.$refs['dialogFormRef'].clearValidate()
                    }
				},
				immediate: true
			},
		},
        
        created() {
            this.employment_araigner = this.elements['employment:araigner'] // 提审人
            this.employment_department = this.elements['employment:department'] // 纪检
            this.employment_check = this.elements['employment:check'] // 核对人员
            this.employment_committee = this.elements['employment:committee'] // 纪委
            this.employment_btn_detail = this.elements['employment:btn_detail'] // 查看审查详情
            this.employment_btn_add = this.elements['employment:btn_add'] // 发起廉审
            this.employment_btn_check = this.elements['employment:btn_check'] // 审核
            this.employment_btn_assigned = this.elements['employment:btn_assigned'] // 指派人员
            // this.employment_araigner = true // 提审人
            // this.employment_department = false // 纪检
            // this.employment_check = false // 核对人员
            // this.employment_committee = true // 纪委
            this.getTreeInfo();
        },

		methods: {
            getTreeInfo() {
                // getGroupdeptlist({
                //         code: 'dept',
                //         userId: this.userId
                //                     })
                //                 .then(res => {
                //                     if (res && res.status === 200) {
                //                         this.treeData = res.data ? res.data : [];
                //                     } else {
                //                         this.$notify({
                //                             title: '失败',
                //                             message: "获取部门树失败",
                //                             type: 'error',
                //                             duration: 2000
                //                         });
                //                     }
                //     });
                getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
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
            // 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
			deptClear(e) {
				this.listQuery.orgId = undefined;
			},
			// 选择部门
			handleCheckChange(data) {
				this.listQuery.orgId = data.id;
				this.deptName = data.departmentFullName;
				this.popoverVisibel = false;
            },
            closeIt1() {
				this.$refs.selectIt1.blur();
            },
            // 批量选择人员
            personnelFistHandle(label) {
                this.personnelFistVisible = true;
                this.$nextTick(() => {
                    this.$refs.personnelFist.label = label;
                    if(label == '指派人员' && this.sFormData.checkerUserId && this.sFormData.checkerName) this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify([{
                        userId: this.sFormData.checkerUserId,
                        name: this.sFormData.checkerName ? this.sFormData.checkerName : '',
                        deptId: this.sFormData.checkerDeptId,
                        deptName: this.sFormData.checkerDeptName ? this.sFormData.checkerDeptName : '',
                        orgId: this.sFormData.checkerOrgId,
                        orgName: this.sFormData.checkerOrgName ? this.sFormData.checkerOrgName : ''
                    }]));
                    this.$refs.personnelFist.init();
                })
            },
			// 获取列表
			getList() {
                this.listLoading = true;
				this.listQuery.startTime = this.times && this.times.length ? this.times[0] : '';
				this.listQuery.endTime = this.times && this.times.length ? this.times[1] : '';
				page(this.listQuery)
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
            handleFilter() {
				this.listQuery.page = 1;
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
            addApprove() {
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['modalRef'].init()
                })
            },
			// 详情 
			handleDetail(id) {
				this.$router.push({
					path: '/topLeaders/taskList/detail',
					query: {
						id: id
					}
				})
			},
            handlePerson(id) {
                this.id = id;
                this.sFormData =  {
                    checkerDeptId: undefined,
                    checkerDeptName: '',
                    checkerName: '',
                    checkerOrgId: undefined,
                    checkerOrgName: '',
                    checkerUserId: undefined
                };
                this.personVisible = true
            },
            handlePersonOk() {
                if(this.sFormData.checkerUserId) {
                    this.personOkLoading = true;
                    recordChecker(this.sFormData, this.id).then(data=> {
								if (data && data.status === 200) {
									this.$notify({
										message: '操作成功',
										type: 'success',
										duration: 1500,
										onClose: () => {
                                            this.personOkLoading = false;
											this.personVisible = false
											this.getList();
										}
									})
								} else {
                                    this.personOkLoading = false;
									this.$notify.error(data.msg)
								}
						})
                } else {
                    this.$refs['dialogFormRef'].validate(valid => {
                        if (valid) {
                        
                        }
                    })
                }
            },
            handleCheck(row, isEdit) {
                this.$router.push({
                    path: `/filesImplementation/employ/${isEdit ? 'editcheck' : 'viewCheck'}`,
                    query: {
                        isEdit,
                        id: row.id
                    }
                })
            },
            handleReset() {
                this.listQuery = {
					page: 1,
					limit: 10,
                    type: '',
                    orgId: '',
                    startTime: '',
                    endTime: ''
                }
                this.times = []
                this.deptName = ''
                this.getList()
            }
		}
	}
</script>

<style lang="scss" scoped>
.form-item-content {
    width: 86%;
  }

  .box-form{
		/deep/ .el-select__tags span:first-child{
			margin-left: 105px;
			margin-top: 4px;
		}
		/deep/ .el-select__tags span span .el-select__tags-text{
			margin-left: 0px;
			margin-top: 0px;
		}

		.but-css{
			border: 1px dashed rgb(188,0,0);
			color:rgb(188,0,0);
			position:fixed;
			z-index:999;
			text-align: center;
			padding-bottom: 5px;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: 6px;
			margin-left: 6px;
		}
    }
    .input-select {
		>>> .el-select__tags {
			display: none !important;
        }
        >>> .el-input--suffix .el-input__inner {
            color: #ffffff;
        }
	}
</style>
