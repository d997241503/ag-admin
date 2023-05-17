<template>
<el-dialog title="上报议题" :close-on-click-modal="false" top="9vh" :visible.sync="visible">
  <div class="app-container">
    <div class="page-info">
      <div class="form-wrapper">
        <el-form :inline="true" :rules="rules" :model="formData" ref="form">
          <el-form-item prop="deptId">
            <el-select v-model="formData.deptId" placeholder="请选择单位" clearable>
                  <el-option v-for="item in treeData" :key="item.deptId" :label="item.deptName" :value="item.deptId">
                  </el-option>
                </el-select>
          </el-form-item>
          <div>
            <el-form-item>
              <el-date-picker
                v-model="year"
                value-format="yyyy"
                type="year"
                placeholder="请选择年份">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="grid-wrapper">
        <div class="grid-operation">
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
        <el-table rowKey='id' :data="dataList" border highlight-current-row>
          <el-table-column align="center" label="序号" width="50px" type="index" />
          <el-table-column align="center" label="议题">
            <template slot-scope="{row}">
              {{row.topicName}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="类别">
            <template slot-scope="{row}">
              {{topicCategoryMap[row.type]}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="附件">
            <template slot-scope="{row}">
              <div @click="handleDownload(item.response.fileUrl, 'archives')" class="click-text" v-for="item in row.fileList" :key="item.uid">{{item.name}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleEdit(scope)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-button type="primary" @click="handleSave" :loading="saveLoading">确定并保存</el-button>
      </div>
    </div>
    <TopicModal
      :title="modalTitle"
      :visible.sync="modalVisible"
      :formData="modalFormData"
      @closed="handleClosed"
      @confirm="handleConfirm"
    />
  </div>
  </el-dialog>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
  import TopicModal from './TopicModal.vue'
  import { topicCategoryMap } from './common'
  import { addMeetingTopic, meetingThemeList } from 'api/meeting/index';
  import {
		listSimpleDepts
	} from 'api/admin/department/index';
    import {downloadFile} from 'utils/file'
        import {
		getGroupdeptlist
	} from 'api/admin/group/index';
  export default {
    name:'ReportTopic',
    components: { TopicModal },
    data() {
      this.defaultProps = {
        children: 'children',
        label: 'departmentFullName'
      }
      this.topicCategoryMap = topicCategoryMap
      this.id = 0
      this.editIndex = null
      this.rules = {
        deptId: [
            { required: true, message: '请选择单位', trigger: 'blur' }
        ]
      }
      return {
        visible: false,
        formData: {
            deptId: '',
        },
        year: new Date().getFullYear() + '',
        dataList: [],
        modalVisible: false,
        modalTitle: '添加议题',
        modalFormData: {},
        loading: true,
        treeData: [],
        themeOptions: [],
        meetingJoint_btn_department: false,
        saveLoading: false
      }
    },
    created() {
      // this.meetingJoint_btn_department = this.elements['meetingJoint:btn_department']
      // this.getTreeInfo()
      // this.getThemeList()
    },
    computed: {
        ...mapGetters([
            'elements', 'userId'
        ]),
    },
    methods: {
      // 初始化当前页面
			init() {
				this.visible = true;
        this.dataList = [];
        this.meetingJoint_btn_department = this.elements['meetingJoint:btn_department']
        this.getTreeInfo()
        this.getThemeList()
      },
        handleDownload: downloadFile,
      handleAdd() {
        this.modalTitle = '添加议题'
        this.modalVisible = true
      },
      handleEdit({row, $index}) {
        this.modalTitle = '编辑议题'
        this.modalFormData = row
        this.modalVisible = true
        this.editIndex = $index
      },
      handleDelete(scope) {
        const {$index} = scope
        this.$confirm('此操作将删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
                        this.dataList.splice($index, 1)
                    })
      },
      handleClosed() {
        this.modalFormData = {}
      },
      handleConfirm(formData) {
        if (!formData.id) {
            formData.id = ++this.id
            this.dataList.push(formData)
        } else {
            this.dataList.splice(this.editIndex, 1, formData)
        }
        this.modalVisible = false
      },
      getThemeList() {
        const data  = {
            year: this.year
        }
            meetingThemeList(data).then(res => {
                if (res?.status === 200) {
                    this.themeOptions = res.data.rows
                }
            })
        },
      getTreeInfo() {
            const params = {
                code: 'dept',
                userId: this.meetingJoint_btn_department ? undefined : this.userId
            }
            getGroupdeptlist(params)
                        .then(res => {
                            if (res && res.status === 200) {
                                this.treeData = res.data ? res.data : [];
                                this.formData.deptId = this.treeData[0]?.deptId
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
      handleSave() {
        this.$refs['form'].validate(valid => {
            if (valid) {
                if (!this.dataList.length) {
                    this.$message.error('请添加议题')
                } else {
                    this.postData()
                }
            }
        })
      },
      postData() {
        this.saveLoading = true
        const {dataList, formData: {deptId}, year, treeData} = this
        const deptName = treeData.find(item => item.deptId === deptId).deptName
        const data = {
            deptId,
            deptName,
            year,
            topicList: dataList.map(({topicName, type, fileList}) => {
                return {
                    topicName,
                    type,
                    fileUrls: fileList.map(file => file.response.fileUrl),
                    reportType: this.meetingJoint_btn_department ? '2' : '1'
                }
            })
        }
        addMeetingTopic(data, 'post')
        .then((res) => {
            if (res?.status === 200) {
                this.$notify({
                    title: '成功',
                    message: '操作成功',
                    type: 'success',
                    duration: 2000
                });
                setTimeout(() => {
										this.visible = false;
										this.$emit("refreshDataList")
									}, 1000)
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
        }).finally(() => this.saveLoading = false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../unit/form-page.scss';
  .el-form {
    display: flex;
    justify-content: space-between;
  }
</style>