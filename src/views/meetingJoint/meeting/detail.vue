<template>
	<div class="app-container calendar-list-container nav-content" v-loading="listLoading">
		<div class="page-info" ref="pageInfo">
			<div v-if="!isEdit" class="detail-cnt">
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span>会议主题：</span>
                                <span>{{`${record.themeName} ${record.year}年`}}</span>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content bg-purple">
                                <span>会议时间：</span>
                                <span>{{record.meetingTime}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span>参会人员：</span>
                                <span>{{$chaining(record, 'conferee', 'length')}}人</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span>会议地点：</span>
                                <span>{{record.meetingPlace}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="grid-content bg-purple">
                                <span class="title">会议描述：</span>
                                <span class="content">{{record.description}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="grid-content bg-purple">
                                <span class="title">会议备注：</span>
                                <span class="content">{{record.remarks}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="page-info-text">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="grid-content bg-purple">
                                <span>会议纪要：</span>
                                <div class="wrapper">
                                    <div v-for="file in record.meetingSummaryFiles" :key="file">{{formatFile(file)}}</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div v-else class="edit-cnt">
                <el-form ref="editForm" label-width="130px" :model="sFormData" :rules="rules">
                    <el-row :gutter="0">
                        <el-col :span="10">
                        <el-form-item label="会议主题：">
                            <el-date-picker style="width: 130%;" v-model="sFormData.year" type="year" format="yyyy" value-format="yyyy" placeholder="请选择年份" @change="handleYearChange">
                            </el-date-picker>
                        </el-form-item>
                        </el-col>
                        <el-col :span="14">
                        <el-form-item style="width: 100%;" prop="themeId">
                            <el-select v-model="sFormData.themeId" placeholder="请选择会议主题" style="width: 100%">
                                <el-option v-for="item in themeOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="会议时间：" prop="meetingTime">
                            <el-date-picker
                                v-model="sFormData.meetingTime"
                                type="datetime"
                                placeholder="请选择日期"
                                value-format="yyyy-MM-dd HH:mm"
                                format="yyyy-MM-dd HH:mm"
                                style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="参会人员：" class="box-form" prop="conferee">
                                <el-button @click="personnelFistHandle('参会人员')" type="text"
                                                    class="but-css">
                                                    批量选择人员
                                                    <span>已选{{sFormData.conferee.length}}人</span>
                                                </el-button>
                                                <el-select style="width: 100%;" class="input-item elinput" v-model="supervisionName" multiple @focus="closeIt" ref="selectIt"
                                                @remove-tag="removeTag" placeholder="" @clear="clear">
                                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col  :span="14">
                            <el-form-item label="会议地点：" prop="meetingPlace">
                                <el-input v-model="sFormData.meetingPlace"  placeholder="请输入会议地点" class="form-item-content"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="会议描述：" prop="description">
                        <el-input type="textarea" v-model="sFormData.description"  placeholder="请输入会议描述" class="form-item-content"></el-input>
                    </el-form-item>
                    <el-form-item label="会议备注：" prop="remarks">
                        <el-input type="textarea" v-model="sFormData.remarks"  placeholder="请输入会议备注" class="form-item-content"></el-input>
                    </el-form-item>
                    <el-form-item label="会议纪要：" prop="fileList">
                        <UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
                        :accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
                        @refreshData="getFiles"></UploadFiles>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="isEdit" class="grid-operation">
                <el-button type="primary" @click="selTopicModalVisible = true">选择议题</el-button>
            </div>
			<el-table :data="checkedTopic" border fit highlight-current-row style="width: 100%">
				<el-table-column label="序号" header-align="center" align="center" type="index" width="50px" />
				<el-table-column prop="topicName" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="议题">
				</el-table-column>
				<el-table-column prop="deptName" header-align="center" align="center" min-width="200" :show-overflow-tooltip="true" label="上报单位">
				</el-table-column>
				<el-table-column header-align="center" align="center" min-width="150" label="议题附件">
                    <template slot-scope="{row}">
                        <div class="click-text" @click="handleDownload(file, 'archives')" v-for="file in row.fileUrls" :key="file">{{formatFile(file)}}</div>
                    </template>
				</el-table-column>
				<el-table-column prop="meetingType" header-align="center" align="center" min-width="80" label="类别">
					<template slot-scope="scope">
						<span v-if="scope.row.type == '0'">任务</span>
						<span v-if="scope.row.type == '1'">监督</span>
					</template>
				</el-table-column>
				<el-table-column v-if="!isEdit" header-align="center" align="center" min-width="150" label="办理过程">
					<template slot-scope="{row}">
						<template v-for="(process, index) in row.rectificationProcess || []">
                            <div :key="index" style="margin-left: 20px;text-align: left">
                                {{formatRec(process, index)}}</div>
                        </template>
					</template>
				</el-table-column>
				<el-table-column v-if="!isEdit" prop="rectificationReview" header-align="center" align="center" min-width="150" label="办理附件">
                    <template slot-scope="{row}">
                        <div class="click-text" @click="handleDownload(file, 'archives')" v-for="file in row.rectificationFiles" :key="file">{{formatFile(file)}}</div>
                    </template>
				</el-table-column>
				<el-table-column v-if="!isEdit" prop="orgName" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="办理结果">
                    <template slot-scope="{row}">
                        {{row.rectificationResult}}
                    </template>
				</el-table-column>
				<el-table-column prop="crtTime" header-align="center" align="center" min-width="150" :show-overflow-tooltip="true" label="创建时间">
				</el-table-column>
				<el-table-column v-if="isEdit" fixed="right" header-align="center" align="center" width="180" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="handleEdit(scope)">编辑</el-button>
						<el-button type="text" size="small" @click="handleDelete(scope)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
            <div class="footer" v-if="isEdit">
                <el-button type="primary" @click="handleSave">确定并保存</el-button>
            </div>
		</div>
        <TopicModal
            :title="'编辑议题'"
            :visible.sync="modalVisible"
            :formData="modalFormData"
            @closed="handleClosed"
            @confirm="handleConfirm"
            />
        <SelectTopicModal :visible.sync="selTopicModalVisible" @checked="handleChecked" :checkedIds="checkedTopicIds"/>
        <fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" ref="personnelFist" title="人员">
		</fuhsiSelectPersonnel>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
    import {detailMeetingRecord, meetingThemeSelList, addMeetingRecord} from 'api/meeting'
    import {recProOptions} from './department/common'
      import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
    import TopicModal from './topicMng/TopicModal'
  import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
  import SelectTopicModal from './components/SelectTopicModal.vue';
  import cloneDeep from 'lodash/cloneDeep'
         import {downloadFile} from 'utils/file'
	export default {
		name: "index",
		data() {
            this.uploadFile = {
                textFirst: ' +上传文件',
                limit: 9,
                size: 30,
                url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
                accepts: '.pdf,.jpg,.png'
            }
            this.rules = {
                themeId: [
                    { required: true, message: '请选择主题', trigger: 'blur' }
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
                conferee: [
                    { required: true, validator: (rule, val, cb) => {
                        if (!val.length) cb('请选择人员')
                        else cb()
                    } }
                ]
            }
			return {
                isEdit: false,
				list: null,
				total: null,
				listLoading: true,
				name: '',
				index: 0,
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				meetingJoint_btn_department: false,
				ruleForm: {
					form: []
				},
				dataList: [],
                record: {},
                personnelFistVisible: false,
                checkedData: {},
                sFormData: {
                    conferee: []
                },
                supervisionName: [],
                modalFormData: {},
                modalVisible: false,
                selTopicModalVisible: false,
                checkedTopic: [],
                themeOptions: []
			}
		},
        watch: {
            checkedData: {
				handler(newVal, oldVal) {
					if(newVal && newVal.resultList && newVal.resultList.length) {
						this.personnelFistVisible=false;
						this.$nextTick(()=>{
							this.personnelFistVisible=true;
						})
					}
					if(newVal.label == '参会人员') this.sFormData.conferee = newVal.resultList;
				},
				immediate: true
			},
        },

		computed: {
			...mapGetters([
				'elements'
			]),
            checkedTopicIds() {
                return this.checkedTopic.map(topic => topic._id)
            }
		},
		
		components: {
            fuhsiSelectPersonnel,UploadFiles,TopicModal, SelectTopicModal
		},

		created() {
            this.init()
		},
		methods: {
            formatFile,
            formatRec(process, index) {
                const data = recProOptions.find(item => item.value === process)
                return `${index + 1}、${data.label} √`
            },
            handleYearChange() {
                this.sFormData.themeId = ''
                this.getThemeList()
            },
            getThemeList() {
                meetingThemeSelList({year: this.sFormData.year, status: '0', limit: 9999, page: 1,}).then(res => {
                    if (res?.status === 200) {
                        let originalOptions = this._originalYear === this.sFormData.year ? [this.themeObj] : []
                        this.themeOptions = res.data.concat(originalOptions)
                    }
                })
            },
            init() {
                const {id, isEdit} = this.$route.query
                this.themeObj = this.$route.params.themeObj
                this.isEdit = isEdit
                this.id = id
                this.getList()
            },
			
			getList() {
				this.listLoading = true;
				detailMeetingRecord(this.id)
					.then(response => {
						if (response && response.status === 200) {
                            let topicList = response.data.topicList || []
                            this.record = response.data
                            this.checkedTopic = topicList.map(topic => {
                                topic._id = topic.id + '_old'
                                return topic
                            })
                            if (this.isEdit) this.initEditForm(response.data)
						}
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},
            initEditForm(data) {
                const {themeName, meetingTime, meetingPlace, description, remarks, meetingSummaryFiles, conferee, themeId, id, year} = data
                let fileList = meetingSummaryFiles.map(fileUrl => ({
                        name: formatFile(fileUrl),
                        url: fileUrl
                    }))
                this.sFormData = {
                    themeName, meetingPlace, year,
                    meetingTime, description, remarks, conferee, themeId, id, fileList
                }
                this._originalYear = year
                this.getThemeList()
                this.$refs['uploadFiles'].init(fileList)
            },
            handleChecked(row) {
                const copy = cloneDeep(row)
                copy._id = copy.id
                this.checkedTopic.push(copy)
            },
            // 批量选择人员
   			personnelFistHandle(label) {
   				this.personnelFistVisible = true;
    			this.$nextTick(() => {
					this.$refs.personnelFist.label = label;
					if(label == '参会人员') this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify(this.sFormData.conferee));
   	  				this.$refs.personnelFist.init();
    			})
   			},

			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},

			// 参会人员
			removeTag(val){
				for(let i = 0; i < this.formData.conferee.length; i++) {
					if(this.formData.conferee[i].name == val) {
						this.formData.conferee.splice(i,1)
						this.$forceUpdate()
					}
				}
			},

			clear() {
				this.formData.conferee = [];
			},
            getFiles({files}) {
                this.sFormData.fileList = files
            },
            handleSave() {
                this.$refs['editForm'].validate(valid => {
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
                const { themeId, meetingTime, meetingPlace, description, remarks, conferee, fileList, id } = this.sFormData
                const {checkedTopic} = this
                let data = {
                    themeId,
                    meetingPlace,
                    meetingTime,description,remarks,
                    conferee, id: +id,
                    meetingSummaryFiles: fileList.map(file => file.response?.fileUrl || file.url),
                    topicList: checkedTopic.map(topic => {
                        let newObj = {...topic}
                        const _index = newObj._id.indexOf('_')
                        if (_index === -1) {
                            delete newObj.id
                        }
                        
                        return newObj
                    })
                }
                addMeetingRecord(data, 'put')
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
                })
            },
            handleClosed() {
                this.modalFormData = {}
            },
            handleConfirm(formData) {
                const {topicName, type, fileList} = formData
                const index = this.checkedTopic.findIndex(item => item._id === formData._id)
                const source = this.checkedTopic[index]
                Object.assign(source, {
                    topicName,
                    type,
                    fileUrls: fileList.map(file => file.url || file.response.fileUrl)
                })
                this.checkedTopic.splice(index, 1, source)
                this.modalVisible = false
            },
            handleEdit({row}) {
                const {fileUrls, topicName, type, _id, themeId} = row
                let fileList = (fileUrls || []).map(file => {
                    return {
                        name: formatFile(file),
                        url: file
                    }
                })
                this.modalFormData = {
                    topicName,
                    type,
                    fileList,
                    id: _id,
                    _id,
                    themeId
                }
                this.modalVisible = true
            },
            handleDelete(scope) {
                const {$index} = scope
                this.checkedTopic.splice($index, 1)
            },
            handleDownload: downloadFile
		}
	}
</script>

<style lang="scss" scoped>

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
        min-height: 733px;
        .footer {
            margin-top: 70px;
            text-align: right;
        }
	}

	.page-info-text {
		font-size: 14px;
		padding-bottom: 20px;

		.grid-content {
			display: flex;

			.title {
				width: 70px;
			}

			.content {
				flex: 1;
			}
		}

		el-row {
			// margin-bottom: 20px;
		}
	}
    .edit-cnt {
        width: 80%;
    }
    .grid-operation {
        text-align: right;
        padding: 20px;
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
    .elinput{
		/deep/ .el-input__inner{
			text-indent: 100px;
		}
		/deep/ .el-icon-arrow-up:before {
			content: '';
		}
		/deep/ .el-select__input{
			text-indent: 100px;
		}
		/deep/ .el-select__tags {
			span:first-child{
				margin-top: 0px;
			}
		}
	}
	
</style>d