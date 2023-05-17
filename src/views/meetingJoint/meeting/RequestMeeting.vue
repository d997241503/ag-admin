<template>
  <div class="app-container">
    <div class="page-info">
      <div class="request-meeting">
        <el-form label-width="150px" :model="formData" ref="meetingForm" :rules="rules">
          <el-row :gutter="0">
            <el-col :span="10">
              <el-form-item label="会议主题：" prop="year">
                <el-date-picker style="width: 130%;" v-model="formData.year" type="year" format="yyyy" value-format="yyyy" placeholder="请选择年份" @change="handleYearChange">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item style="width: 100%;" prop="themeId">
                <el-select v-model="formData.themeId" placeholder="请选择会议主题" style="width: 100%">
                    <el-option v-for="item in themeOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="12">
              <el-form-item label="会议时间：" prop="meetingTime">
                <el-date-picker
                    v-model="formData.meetingTime"
                    type="datetime"
                    placeholder="请选择日期"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    style="width: 100%">
                    </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会议地点：" prop="meetingPlace">
                <el-input v-model="formData.meetingPlace" placeholder="请输入会议地点"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="参会人员：" class="box-form" prop="supervisionUser">
              <el-button @click="personnelFistHandle('参会人员')" type="text"
								class="but-css">
								批量选择人员
                                <span>已选{{formData.supervisionUser.length}}人</span>
							</el-button>
							<el-select style="width: 100%;" class="input-item elinput" v-model="formData.supervisionName" multiple @focus="closeIt" ref="selectIt"
							@remove-tag="removeTag" placeholder="" @clear="clear">
							</el-select>
          </el-form-item>
          <el-form-item label="会议描述：" prop="description">
            <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入会议描述"></el-input>
          </el-form-item>
          <el-form-item label="会议备注：" prop="remarks">
            <el-input v-model="formData.remarks" type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入会议备注"></el-input>
          </el-form-item>
        </el-form>
          <div class="grid-wrapper">
          <div class="grid-operation">
            <el-button type="primary" @click="selTopicModalVisible = true">选择议题</el-button>
          </div>
          <el-table rowKey='id' :data="checkedTopic" border highlight-current-row>
            <el-table-column label="序号" width="50px" type="index" />
            <el-table-column align="center" label="议题">
            <template slot-scope="{row}">
                {{row.topicName}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="上报单位">
            <template slot-scope="{row}">
                {{row.deptName}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="类别">
            <template slot-scope="{row}">
                {{row.type === '0' ? '任务' : '监督'}}
            </template>
            </el-table-column>
            <el-table-column align="center" label="附件">
            <template slot-scope="{row}">
                <div class="click-text" @click="handleDownload(file, 'archives')" v-for="file in row.fileUrls" :key="file">{{formatFile(file)}}</div>
            </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{row}">
                <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                <el-button type="text" @click="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="footer">
          <el-button type="primary" @click="handleSave" :loading="btnLoading">确定并保存</el-button>
        </div>
      </div>
    </div>
    <!-- 弹窗 选择人员 -->
		<fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
        <SelectTopicModal :visible.sync="selTopicModalVisible" @checked="handleChecked" :checkedIds="checkedTopicIds"/>
        <TopicModal
            title="编辑议题"
            :visible.sync="editModalVisible"
            :formData="editModalFormData"
            @closed="handleClosed"
            @confirm="handleConfirm"
            />
  </div>
</template>

<script>
  import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
  import {
		getTree
	} from 'api/admin/department/index';
    import { meetingThemeSelList, addMeetingRecord } from 'api/meeting/index';
import SelectTopicModal from './components/SelectTopicModal.vue';
    import TopicModal from './topicMng/TopicModal'
    import cloneDeep from 'lodash/cloneDeep'
           import {downloadFile, formatFile} from 'utils/file'
  export default {
    name:'ReportTopic',
    data() {
        this.rules = {
            year: [
                { required: true, message: '请选择主题年份', trigger: 'change' }
            ],
            themeId: [
                { required: true, message: '请选择主题', trigger: 'change' }
            ],
            meetingPlace: [
                { required: true, message: '请输入会议地点', trigger: 'blur' }
            ],
            meetingTime: [
                { required: true, message: '请选择会议时间', trigger: 'blur' }
            ],
            description: [
                { required: true, message: '请输入会议描述', trigger: 'blur' }
            ],
            supervisionUser: [
                { required: true, validator: (rule, val, cb) => {
                    if (!val.length) cb('请选择人员')
                    else cb()
                } }
            ]
        }
      return {
        formData: {
          meetingTime: '',
          themeId: '',
          meetingPlace: '',
          description: '',
          remarks: '',
          year: new Date().getFullYear().toString(),
          supervisionName: [],
          supervisionUser: []
        },
        dataList: [],
        dialogFormVisible: false,
        treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
        },
        personnelFistVisible: true,
        checkedData: [],
        themeOptions: [],
        checkedTopic: [],
        selTopicModalVisible: false,
        editModalFormData: {},
        editModalVisible: false,
        btnLoading: false
      }
    },
    components: {
			fuhsiSelectPersonnel, SelectTopicModal, TopicModal
		},
    created() {
      this.getTreeInfo();
      this.getThemeList()
    },
    watch : {
			checkedData: {
				handler(newVal, oldVal) {
					if(newVal && newVal.resultList && newVal.resultList.length) {
						this.personnelFistVisible=false;
						this.$nextTick(()=>{
							this.personnelFistVisible=true;
						})
					}
					if(newVal.label == '参会人员') this.formData.supervisionUser = newVal.resultList;
				},
				immediate: true
			},
		},
        computed: {
            checkedTopicIds() {
                return this.checkedTopic.map(topic => topic.id)
            }
        },
    methods: {
        formatFile,
        handleYearChange() {
            this.formData.themeId = ''
            this.getThemeList()
        },
        getThemeList() {
            meetingThemeSelList({year: this.formData.year, status: '0', limit: 9999, page: 1,}).then(res => {
                if (res?.status === 200) {
                    this.themeOptions = res.data
                }
            })
        },
      // 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					if(label == '参会人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.formData.supervisionUser));
   	  				this.$refs.personnelFist.init();
    			})
   			},

			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},

			// 参会人员
			removeTag(val){
				for(let i = 0; i < this.formData.supervisionUser.length; i++) {
					if(this.formData.supervisionUser[i].name == val) {
						this.formData.supervisionUser.splice(i,1)
						this.$forceUpdate()
					}
				}
			},

			clear() {
				this.formData.supervisionUser = [];
			},
      // 选择部门
			handlePartyBranch(data) {
				this.formData.deptId = data.id;
				this.formData.name = data.departmentFullName;
				this.treeVisible = false;
      },
      
      handleChange() {
      },

      // 获取部门树
			getTreeInfo() {
				getTree({
							departmentAttribute: '1'
						})
					.then(res => {
						if (res && res.code === 0) {
							this.treeData = res.data ? res.data : [];
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
            handleChecked(row) {
                this.checkedTopic.push(cloneDeep(row))
            },
        handleDelete(row) {
            const {$index} = row
            this.checkedTopic.splice($index, 1)
        },
        handleClosed() {
            this.editModalFormData = {}
        },
        handleConfirm(formData) {
            const {topicName, type, fileList} = formData
            const index = this.checkedTopic.findIndex(item => item.id === formData.id)
            const source = this.checkedTopic[index]
            Object.assign(source, {
                topicName,
                type,
                fileUrls: fileList.map(file => file.url || file.response.fileUrl)
            })
            this.checkedTopic.splice(index, 1, source)
            this.editModalVisible = false
        },
        handleEdit(row) {
            const {fileUrls, topicName, type, id, themeId} = row
            let fileList = (fileUrls || []).map(file => {
                return {
                    name: formatFile(file),
                    url: file
                }
            })
            this.editModalFormData = {
                topicName,
                type,
                fileList,
                id,
                themeId
            }
            this.editModalVisible = true
        },
        handleSave() {
            this.$refs['meetingForm'].validate(valid => {
                if (valid) {
                    if (!this.checkedTopic.length) {
                        this.$message.error('请选择议题')
                    } else {
                        this.postData()
                    }
                }
            })
        },
        postData() {
            this.btnLoading = true
            const {formData, checkedTopic} = this
            const {supervisionUser, meetingTime, meetingPlace, description, remarks, themeId} = formData
            const data = {
                meetingTime,
                meetingPlace,
                description,
                remarks,
                themeId,
                topicList: checkedTopic,
                conferee: supervisionUser
            }

            addMeetingRecord(data, 'post')
            .then((res) => {
                if (res?.status === 200) {
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success',
                        duration: 2000
                    });
                    this.$router.go(-1)
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
            }).finally(() => this.btnLoading = false)
        },
        handleDownload: downloadFile
    }
  }
</script>

<style lang="scss" scoped>
  .request-meeting {
    width: 70%;
    margin: 10px auto;
  }

  .page-info {
    padding: 20px;
    background-color: #fff;
    border: 0.0625rem solid #EAEAEA;
	border-radius: 10px;
    min-height: 733px;
    .footer {
      margin-top: 70px;
      text-align: right;
    }
  }

  .grid-wrapper {
    .grid-operation {
      padding: 20px 0;
      text-align: right;
    }
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
			// position:fixed;
			position: absolute;
			z-index:9;
			text-align: center;
			padding-bottom: 5px;
			padding-top: 5px;
			padding-left: 5px;
			padding-right: 5px;
			margin-top: 6px;
			margin-left: 6px;
		}
	}
</style>