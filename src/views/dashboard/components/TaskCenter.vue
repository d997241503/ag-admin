<template>
    <div>
        <div class="task-center app-container">
            <div class="left page-content">
                <el-tree
                    icon-class="el-icon-folder"
                    :data="taskTreeList"
                    :props="defaultProps"
                    @node-click="handleClick"
                    node-key="key"
                    :default-expanded-keys="['all']"
                    highlight-current
                    ref="tree"
                ></el-tree>
            </div> 
            <div class="right page-content">
                <el-radio-group class="radio-group-button" v-model="msgType" size="small">
                    <el-radio-button label="1">我的待办 ({{listQuery[1].total}})</el-radio-button>
                    <el-radio-button label="2">我的已办 ({{listQuery[2].total}})</el-radio-button>
                    <el-radio-button label="3">我的发起 ({{listQuery[3].total}})</el-radio-button>
                </el-radio-group>
                <div class="task-list" v-loading="listLoading">
                    <template v-if="taskList[msgType].length">
                        <div v-for="(task, index) in taskList[msgType]" :key="index" class="list-item">
                            <div class="title text-ellipsis-1" :title="task.subject" @click="handleRoute(task)">{{task.subject}}</div>
                            <div class="extra">
                                <span v-if="msgType !== '1'">当前处理人：{{task.currUserName}}</span>
                                <span v-if="msgType !== '1'">当前状态：{{task.status}}</span>
                                <span>{{task.crtTime}}</span>
                            </div>
                        </div>
                    </template>
                    <el-empty v-else :image-size="80"></el-empty>
                </div>
                <div class="pagination-container">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery[msgType].page"
                        :page-sizes="[10,20,30,50]" :page-size="listQuery[msgType].limit" align="right" layout="total, sizes, prev, pager, next, jumper"
                        :total="listQuery[msgType].total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {taskCenterList, taskCenterSta} from 'api/admin/base-tobe-done'
    const treeMap = {
                    chooseEmployMember: { label: '选人用人', key: '5'},
                    clueCaseManagement: { label: `线索及案件管理`, key: '2'},
                    education: { label: `廉政宣教`, key: '8'},
                    incorruptibleArchives: { label: `廉政档案`, key: '1'},
                    internalInspection: { label: `内部巡查`, key: '7'},
                    pecialSupervision: { label: `专项监督`, key: '4'},
                    threeImportancesOneGreatness: { label: `三重一大`, key: '3'},
                    twoDutyImplementation: { label: `两个责任落实`, key: '6'},
                    superviseJointMeeting: { label: `监督联席会`, key: '9'}
                }
    const listQuery = {
                page: 1,
                limit: 10,
                total: 0
            }
  export default {
    name: 'dashboard',
    components: {  },
    data() {
        this.defaultProps = {
            children: 'children',
            label: 'label'
        }
      return {
        msgType: '1',
        listLoading: true,
        staData: {},
        taskList: {
            1: [],
            2: [],
            3: []
        },
        listQuery: {
            1: {
                ...listQuery
            },
            2: {
                ...listQuery
            },
            3: {
                ...listQuery
            }
        },
        type: undefined,
      }
    },
    created() {
        this.getSta()
        this.handleClick('all')
    },
    computed: {
        taskTreeList() {
            const {staData} = this
            const children = Object.entries(staData).slice(1).map(([key, value]) => {
                return {
                    label: `${treeMap[key].label} (${value})`,
                    key: treeMap[key].key
                }
            })
            const list = [{
                label: `全部 (${staData.all})`,
                key: 'all',
                children
            }]
            return list
        }
    },
    methods: {
        handleClick(opt) {
            const {listQuery, msgType} = this
            this.type = opt.key === 'all' ? undefined :opt.key
            this.listLoading = true
            this.initQuery()
            const query = {
                ...listQuery[msgType],
                type: this.type
            }
            const pArr = [1, 2, 3].map(msgType => {
                return taskCenterList(msgType, query).then(res => {
                    if (res?.status === 200) {
                        this.taskList[msgType] = res.data.rows
                        this.listQuery[msgType].total = +res.data.total
                    }
                })
            })
            Promise.all(pArr).finally(() => {
                this.listLoading = false
            })
        },
        initQuery() {
            Object.keys(this.listQuery).forEach(key => {
                this.listQuery[key] = {
                    ...listQuery
                }
            })
        },
        getSta() {
            taskCenterSta().then(res => {
                if (res?.status === 200) {
                    this.staData = res.data
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey('all')
                    })
                }
            })
        },
        getList() {
            const {listQuery, msgType, type} = this
            const query = {
                ...listQuery[msgType],
                type
            }
            this.listLoading = true
            taskCenterList(msgType, query).then(res => {
                if (res?.status === 200) {
                    this.taskList[msgType] = res.data.rows
                    this.listQuery[msgType].total = +res.data.total
                }
            })
            this.listLoading = false
        },
        handleSizeChange(val) {
            this.listQuery[this.msgType].limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery[this.msgType].page = val;
            this.getList();
        },
        handleFilter() {
           this.listQuery[this.msgType].page = 1
           this.getList()
        },
        handleRoute({pageUrl}) {
            if (pageUrl) {
                this.$router.push({
                    path: pageUrl.substr(pageUrl.indexOf('#') + 1)
                })
            }
        }
    }
  }
</script>

<style lang="scss" scoped>
    .task-center {
        display: flex;
        height: 777px;
        .left {
            width: 300px;
            margin-right: 20px;
            border: 1px solid #EAEAEA;
            overflow: auto;
            >>> .el-tree-node__expand-icon {
                color: #DFBA49;
                &.expanded {
                    transform: none;
                }
            }
        }
        .right {
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 1px solid #EAEAEA;
            overflow: hidden;
            .task-list {
                flex: 1;
                overflow: auto;
                margin-top: 20px;
                .list-item {
                    border-bottom: 1px solid #c8c8c854;
                    padding-bottom: 5px;
                    .title {
                        margin-top: 20px;
                        margin-bottom: 10px;
                        cursor: pointer;
                        &:hover {
                            color: #bc0000;
                        }
                    }
                    span {
                        color: #777;
                        margin-right: 10px
                    }
                }
            }
        };
    }
</style>
