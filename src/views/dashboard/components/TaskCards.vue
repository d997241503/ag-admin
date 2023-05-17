<template>
  <div class="task-cards">
        <div class="card card-container" v-for="(list, cardIndex) in taskList" :key="cardIndex">
            <div class="page-title-info">
                <div class="page-title">
                    <span>
                        <i :class="cardConfig[cardIndex].icon"></i>
                        <span class="page-title-text">{{cardConfig[cardIndex].title}} ({{totalList[cardIndex]}})</span>
                    </span>
                </div>
                <span class="underline-link" @click="$router.push('/taskCenter')">更多</span>
            </div>
            <div class="task-list">
                <template v-if="list.length">
                    <div v-for="(task, index) in list" :key="index" class="list-item">
                        <div class="title text-ellipsis-1" :title="task.subject" @click="handleRoute(task)">{{task.subject}}</div>
                        <div class="extra">
                            <span v-if="cardIndex !== '1'">当前处理人：{{task.currUserName}}</span>
                            <span v-if="cardIndex !== '1'">当前状态：{{task.status}}</span>
                            <span>{{task.crtTime}}</span>
                        </div>
                    </div>
                </template>
                <el-empty v-else :image-size="80"></el-empty>
            </div>
        </div>
    </div>
</template>

<script>
    import {taskCenterList, taskCenterSta} from 'api/admin/base-tobe-done'
  export default {
    name: 'dashboard',
    components: {  },
    data() {
        this.cardConfig = {
            1: { title: '我的待办', icon: 'el-icon-s-release' },
            2: { title: '我的已办', icon: 'el-icon-s-claim' },
            3: { title: '我的发起', icon: 'el-icon-s-order' }
        }
      return {
        taskList: {
            1: [],
            2: [],
            3: []
        },
        totalList: {
            1: '0',
            2: '0',
            3: '0',
        },
        queryOptions: {
            page: 1,
            limit: 20,
            type: undefined
        }
      }
    },
    created() {
        this.getList()
        this.timer = setInterval(() => {
            this.getList()
        }, 2000);
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        getList() {
            const pArr = [1, 2, 3].map(msgType => {
                return taskCenterList(msgType, this.queryOptions).then(res => {
                    if (res?.status === 200) {
                        this.taskList[msgType] = res.data.rows
                        this.totalList[msgType] = res.data.total
                    }
                })
            })
            Promise.all(pArr)
            .catch(() => {
                clearInterval(this.timer)
            })
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
    .task-cards {
        height: 335px;
        display: flex;
        .card {
            display: flex;
            flex-direction: column;
            padding: 0 20px 20px 20px;
            background-color: #fff;
            flex: 1;
            overflow: hidden;
            &:not(:last-child) {
                margin-right: 20px;
            }
        }
        .page-title-info {
            height: 50px;
            font-size: 15px;
            // font-weight: bold;
            border-bottom: solid 1px #c8c8c8;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .page-title {
                height: 50px;
                line-height: 50px;
                color: rgb(188, 0, 0);
                border-bottom: solid 2px rgb(188, 0, 0);
                // padding: 20px 0px 0px 10px;
                font-size: 16px;

                .page-title-text {
                    color: black;
                }

                i {
                    margin-right: 6px;
                }
            }
        }
        .task-list {
            flex: 1;
            overflow: auto;
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
    }
</style>
