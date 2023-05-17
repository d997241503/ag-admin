<template>
  <el-dialog :visible.sync="sVisible" title="选择议题" :close-on-click-modal="false">
    <div class="search-info">
        <el-form inline>
            <el-form-item>
              <el-date-picker
                v-model="listQuery.year"
                value-format="yyyy"
                type="year"
                placeholder="请选择年份">
              </el-date-picker>
            </el-form-item>
            <el-button class="filter-item query" type="primary" v-waves icon="search" @click="handleFilter">查询</el-button>
        </el-form>
    </div>
    <el-table rowKey='id' :data="dataList" border highlight-current-row v-loading="false" height="530">
        <el-table-column align="center" label="序号" width="50px" type="index" />
        <el-table-column align="center" label="议题" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.topicName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="上报单位" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{row.deptName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类别" width="80">
          <template slot-scope="{row}">
            {{row.type === '0' ? '任务' : '监督'}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="附件">
          <template slot-scope="{row}">
            <div class="click-text" @click="handleDownload(file, 'archives')" v-for="file in row.fileUrls" :key="file">{{formatFile(file)}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleSelect(row)" :disabled="checkedIds.indexOf(row.id) > -1">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" align="right" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
  </el-dialog>
</template>

<script>
import {meetingTopicList, meetingThemeList} from 'api/meeting'
import {formatFile, downloadFile} from 'utils/file'
  export default {
    name:'TopicModal',
    data() {
      return {
        dataList: [],
        listQuery: {
            limit: 10,
            page: 1,
            status: '1',
            year: new Date().getFullYear() + ''
        },
        total: 0,
        themeOptions: [],
      }
    },
    props: {
      checkedIds: {
        type: Array,
        default: () => ([])
      },
      visible: Boolean
    },
    created() {
        this.getList()
    },
    computed: {
        sVisible: {
            get() {
            return this.visible
            },
            set(newVal) {
            this.$emit('update:visible', newVal)
            }
        }
    },
    methods: {
        formatFile,
        handleDownload: downloadFile,
      handleSizeChange(val) {
            this.listQuery.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        handleSelect(row) {
            this.$emit('checked', row)
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        getList() {
            this.listLoading = true;
            meetingTopicList(this.listQuery)
                .then(response => {
                    if (response && response.status === 200) {
                        this.dataList = response.data.rows;
                        this.total = parseInt(response.data.total);
                    } else {
                        this.total = 0;
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                })
        },
    }
  }
</script>

<style lang="scss" scoped>
  .form-item-content {
    width: 86%;
  }
  .el-pagination {
    margin-top: 40px;
  }
  .el-table {
    height: 600px;
    overflow: scroll;
  }
</style>