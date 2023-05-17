<template>
	<div class="clue app-container">
        <div ref="searchSection" class="page-content search-info">
            <el-form inline>
                <el-form-item>
                    <el-input v-model="listQuery.clueNum" placeholder="请输入线索编号" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="listQuery.handlingStatus" placeholder="请选择办理状态" clearable>
                        <el-option v-for="item in MANAGE_STATUS_OPTIONS"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="listQuery.clueType" placeholder="请选择线索类型" clearable>
                        <el-option v-for="item in CLUE_SOURCE_OPTIONS"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="listQuery.clueClassification" placeholder="请选择线索分类" clearable>
                        <el-option v-for="item in CLUE_TYPE_OPTIONS"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="listQuery.involvedField" placeholder="请选择线索涉及领域" clearable>
                        <el-option v-for="item in CLUE_FIELD_OPTIONS"  :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="handleFilter">查询</el-button>
                <el-button type="primary" @click="handleReset">重置</el-button>
                <el-button v-if="clue_btn_add" type="primary" @click="handleAdd">新增录入</el-button>
            </el-form>
		</div>
        <div class="page-content">
            <el-table :height="tableHeight" ref="table" :data="list" border v-loading="listLoading">
                <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
                <el-table-column align="center" label="线索编号" width="120">
                    <template slot-scope="{row}">
                        <span>{{row.clueNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理状态">
                    <template slot-scope="{row}">
                        <span>{{manageStatusMap[row.handlingStatus]}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线索">
                    <el-table-column align="center" label="线索类型" width="160">
                        <template slot-scope="{row}">
                            <span>{{clueSourceMap[row.clueType]}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="线索分类" width="100">
                        <template slot-scope="{row}">
                            <span>{{clueTypeMap[row.clueClassification]}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="签批时间" width="120">
                    <template slot-scope="{row}">
                        <span>{{row.signatureTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="办理时限" width="120">
                    <template slot-scope="{row}">
                        <span>{{row.processTimeLimit}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="信访线索">
                    <el-table-column align="center" label="处置结果" width="120">
                        <template slot-scope="{row}">
                            <span>{{row.toProblemClue ? '转问题线索' : (row.petitionClue ? letterDisposeMap[row.petitionClue[0]] : '')}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="问题线索">
                    <el-table-column align="center" label="处置方式" width="120">
                        <template slot-scope="{row}">
                            <span>{{problemDisposeMap[row.problemClue]}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="立案">
                    <el-table-column align="center" label="立案类型" show-overflow-tooltip>
                        <template slot-scope="{row}">
                            <span>{{row.registerType ? row.registerType.map(item => recordTypeMap[item]).join() : ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="处理处分">
                        <template slot-scope="{row}">
                            <span>{{row.haveDispose ? '有' : '无'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="职务调整">
                        <template slot-scope="{row}">
                            <span>{{row.havePostChange ? '有' : '无'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="文书编号" show-overflow-tooltip width="120">
                        <template slot-scope="{row}">
                            <span>{{row.punishmentNums ? row.punishmentNums.filter(item => !!item).join(',') : ''}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="承办主体" width="200">
                    <template slot-scope="{row}">
                        <span>{{$chaining(row, 'undertakerOrg', '0', 'orgName')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线索涉及领域" show-overflow-tooltip width="150">
                    <template slot-scope="{row}">
                        <span>{{filterField(row.involvedField)}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="线索涉及人员">
                    <template slot-scope="{row}">
                        <span>{{row.memberNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="档案编号" width="120">
                    <template slot-scope="{row}">
                        <span>{{row.archivesNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150" fixed="right">
                    <template slot-scope="{row}">
                        <el-button v-if="clue_btn_detail" type="text" @click="handleDetail(row.id)">查看</el-button>
                        <el-button v-if="clue_btn_edit" type="text" @click="handleEdit(row)">编辑</el-button>
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
</template>

<script>
    import tableMixin from '@/mixins/table/table.mixin'
    import {
        getMap, MANAGE_STATUS_OPTIONS, CLUE_TYPE_OPTIONS, CLUE_FIELD_OPTIONS, CLUE_SOURCE_OPTIONS,
        RECORD_TYPE_OPTIONS, PROBLEM_DISPOSE_OPTIONS, LETTER_DISPOSE, PROBLEM_DISPOSE
    } from './common'
	import {
		mapGetters
	} from 'vuex';
    import {clueList} from 'api/clue'
	export default {
		name: "Anonymos",
        mixins: [tableMixin],
		data() {
            this.PROBLEM_DISPOSE = PROBLEM_DISPOSE
            this.MANAGE_STATUS_OPTIONS = MANAGE_STATUS_OPTIONS
            this.CLUE_FIELD_OPTIONS = CLUE_FIELD_OPTIONS
            this.CLUE_TYPE_OPTIONS = CLUE_TYPE_OPTIONS
            this.CLUE_SOURCE_OPTIONS = CLUE_SOURCE_OPTIONS
            this.manageStatusMap = getMap(MANAGE_STATUS_OPTIONS)
            this.clueFiledMap = getMap(CLUE_FIELD_OPTIONS)
            this.clueTypeMap = getMap(CLUE_TYPE_OPTIONS)
            this.clueSourceMap = getMap(CLUE_SOURCE_OPTIONS)
            this.letterDisposeMap = getMap(LETTER_DISPOSE)
            this.problemDisposeMap = getMap(PROBLEM_DISPOSE_OPTIONS)
            this.recordTypeMap = getMap(RECORD_TYPE_OPTIONS)
			return {
                clue_btn_add: false,
                clue_btn_edit: false,
                clue_btn_detail: false,
                listQuery: {
                    clueNum: '',
                    handlingStatus: '',
                    clueType: '',
                    clueClassification: '',
                    involvedField: '',
                    limit: 10,
                    page: 1
                }
			}
		},
        created() {
            this.clue_btn_add = this.elements['clue:btn_add']
            this.clue_btn_edit = this.elements['clue:btn_edit']
            this.clue_btn_detail = this.elements['clue:btn_detail']
        },
		computed: {
			...mapGetters([
				'elements'
			])
		},
        methods: {
            getListApi() {
                return clueList(this.listQuery)
            },
            handleAdd() {
                this.$router.push('/reviewDiscipline/clue/addClue')
            },
            handleReset() {
                this.listQuery = {
                    clueNum: '',
                    handlingStatus: '',
                    clueType: '',
                    clueClassification: '',
                    involvedField: '',
                    limit: 10,
                    page: 1
                }
                this.getList()
            },
            handleEdit(row) {
                this.$router.push({
                    path: '/reviewDiscipline/clue/editClue',
                    query: {
                        operation: 'edit',
                        id: row.id,
                        activeTab: row.recordStep
                    }
                })
            },
            handleDetail(id) {
                this.$router.push({
                    path: '/reviewDiscipline/clue/detailClue',
                    query: {
                        operation: 'detail',
                        id: id
                    }
                })
            },
            filterField(val) {
                val = val || []
                return val.map(field => this.clueFiledMap[field]).filter(field => !!field).join(',')
            }
        }
	}
</script>

<style lang="scss" scoped>
	.search-info {
		margin-bottom: 20px;
        .el-form-item {
            margin-bottom: 0;
        }
	}
</style>