<template>
	<div class="app-container">
        <div class="page-content">
			<div class="form-cnt" ref="formCnt">
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content">
                                <span>专项监督主题：</span>
                                <span>{{record.supervisionTheme}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="grid-content">
                                <span>项目负责人：</span>
                                <span>{{$chaining(record, 'responsiblePerson', '0', 'name')}}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="grid-content">
                                <span>下发时间：</span>
                                <span>{{record.issueTime}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content">
                                <span>监督时间：</span>
                                <span>{{record.startTime}} ~ {{record.endTime}}</span>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content">
                                <span>状态：</span>
                                <span>{{record.status === '1' ? '已结束' : '进行中'}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <el-divider/>
            <el-form inline>
                <el-form-item>
                    <SelectDeptItem ref="selectDep" v-model="listQuery.orgId"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handelSearch">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button v-waves type="primary" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table ref="table" :height="tableHeight" :data="list" v-loading="listLoading" border style="width: 100%">
                <el-table-column align="center" label="序号" width="50px" type="index" />
                <el-table-column align="center" label="被监督对象">
                    <template slot-scope="{row}">
                        <div>{{row.orgName}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="监督报告">
                    <template slot-scope="{row}">
                        <template v-for="(item, index) in getTextArr(row, reportList)">
                            <div :key="index" style="text-align:left;margin-left:33%">{{item}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="整改情况">
                    <template slot-scope="{row}">
                        <template v-for="(item, index) in getTextArr(row, recList)">
                            <div :key="index" style="text-align:center">{{item}}</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column width="200" align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="isDetail(scope.row)" type="text" @click="goReport(scope.row, 'detail')">查看详情</el-button>
                        <el-button v-else type="text" @click="goReport(scope.row, 'edit')">去提报</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
    import {supervisionDetail, supervisionOrgList} from 'api/special'
    import SelectDeptItem from 'components/formItem/SelectDeptItem'
	export default {
		data() {
            this.reportList = [
                {label: '监督检查报告', value: 'supervisionInspectionReport'},
                {label: '自查自检报告', value: 'selfCheckReport'},
                {label: '问题清单', value: 'problemList'},
            ]
            this.recList = [
                {label: '整改报告', value: 'rectificationReport'},
                {label: '整改情况', value: 'rectificationSituation'}
            ]
			return {
                listLoading: true,
                deptId: '',
                list: [],
                listQuery: {
                    orgId: undefined
                },
                record: {},
                tableHeight: 500
			}
		},
        components: {SelectDeptItem},
        created() {
            // this.recordId = this.$route.query.id
            if (this.$route.query.id) {
				this.recordId = this.$route.query.id;
			} else {
				const specialDetailParams = localStorage.getItem(
					'specialDetailParams',
				);
				this.recordId = JSON.parse(specialDetailParams).id;
			}
            this.getDetail()
            this.getList()
        },
        mounted() {
            this.tableLayout()
        },

		computed: {
			...mapGetters([
				'elements', 'userId'
			])
		},

		methods: {
            getDetail() {
                supervisionDetail(this.recordId).then(res => {
                    if (res?.status === 200) {
                        this.record = res.data
                    }
                })
            },
            getList() {
                this.listLoading = true;
                supervisionOrgList(this.recordId, this.listQuery)
                .then(res => {
                    if (res?.status === 200) {
                        this.list = res.data.rows
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                })
            },
            handelSearch() {
                this.getList()
            },
            tableLayout(option) {
                const pageHeight = window.innerHeight
                const formHeight = this.$refs['formCnt'].offsetHeight
                const computedHeight = pageHeight - formHeight - 300
                this.tableHeight = computedHeight > 500 ? computedHeight : 500
                this.$nextTick(() => {
                    this.$refs['table']?.doLayout()
                })
            },
            handleReset() {
				this.$refs['selectDep'].deptName = '';
                this.listQuery = {
					orgId: undefined
				};
                this.$nextTick(() => {
                    this.getList();
                })
			},
            goReport(row, opt) {
                const {currentStep, id} = row
                this.$router.push({
                    path: `/filesImplementation/special/specialDetail/${opt === 'detail' ? 'detailOrg' : 'editOrg'}`,
                    query: {
                        operation: opt,
                        id,
                        superviseId: this.recordId,
                        name: currentStep === '1' ? 'third' : 'second',
						pageId: this.recordId + ''
                    }
                })
            },
            isDetail(row) {
                const reportMember = row.reportMember || this.userId == this.record.responsiblePerson?.[0]?.userId
                return !reportMember || this.reportList.concat(this.recList).filter(item => item.value !== 'selfCheckReport' && item.value !== 'supervisionInspectionReport').every(item => row[item.value])
            },
            getTextArr(row, opt) {
                return opt.map((item, index)=> {
                    const flag = row[item.value] ? '√' : '×'
                    return `${index + 1}、${item.label} ${flag}`
                })
            }
		}
	}
</script>

<style lang="scss" scoped>
  .page-info-text {
    padding-bottom: 20px;
  }

</style>
