<template>
	<div>
		<el-form :model="baseDataForm" :rules="rules" ref="baseDataForm" label-position="left" @keyup.enter.native="baseDataFormSubmit()"
		 label-width="150px">
			<el-form-item label="专项监督主题：" prop="supervisionTheme">
				<el-input class="form-item input-info" v-model="baseDataForm.supervisionTheme" placeholder="请输入专项监督主题" maxlength="30" clearable
				 ></el-input>
			</el-form-item>
			<el-form-item label="专项监督时间：" prop="times">
				<el-date-picker class="form-item" v-model="baseDataForm.times" type="daterange" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
				 	@input="timesChange"
					unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
            <el-form-item label="项目负责人" prop="userId">
                <el-select class="form-item" v-model="baseDataForm.userId" placeholder="请选择项目负责人" filterable clearable>
                    <el-option v-for="(item) in personOpt" :label="item.name" :value="item.userId" :key="item.userId"></el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="被监督对象：" prop="issueOrg">
                <SelectDept @check="handleDept"/>
			</el-form-item>
			<el-form-item label="附件：" prop="issueFiles">
				<UploadFiles ref="uploadFiles2" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="2"
					:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
					@refreshData="getFiles"></UploadFiles>
			</el-form-item>
			<el-form-item label="备注：" prop="remarks">
				<el-input class="textarea-info form-item" type="textarea" placeholder="请输入要点..." resize="none" :rows="4" v-model="baseDataForm.remarks"
				 maxlength="300">
				</el-input>
			</el-form-item>
		</el-form>
		<div style="width:100%;margin: 50px auto;text-align: center;">
			<el-button @click="cancel" style="width:180px;">取消</el-button>
			<el-button type="primary" style="width:180px;" @click="baseDataFormSubmit()" :loading="subLoading">确定下发</el-button>
		</div>
	</div>
</template>
<script>
    import SelectDept from 'components/formItem/SelectDept'
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import {
		mapGetters
	} from 'vuex';
	import {
		addSupervision
	} from 'api/special/index';
    import {getGroupUserlist} from 'api/admin/group'
	import {
		getToken
	} from 'utils/auth';
	import {
		formatFile
	} from 'utils';
	export default {
		data() {
            this.rules = {
                supervisionTheme: [{
                    required: true, message: '请输入专项监督主题', trigger: 'blur'
                }],
                times: [{
                    required: true, message: '请选择专项监督时间', trigger: 'blur'
                }],
                userId: [{
                    required: true, message: '请选择项目负责人', trigger: 'change'
                }],
                issueOrg: [{
                    required: true, validator: (rule, val, cb) => {
                        if (!val.length) return cb(new Error('请选择被监督对象'))
                        cb()
                    }, trigger: 'blur'
                }],
                issueFiles: [{
                    required: true, validator: (rule, val, cb) => {
                        if (!val.length) return cb(new Error('请选择附件'))
                        cb()
                    } 
                }]
            }
			return {
				baseDataForm: {
					id: undefined,
					supervisionTheme: '',
					issueFiles: [],
					issueForm: [],
					remarks: '',
					orgName: '',
					issueOrg: [
						// orgId: undefined,
						// orgName: ''
					],
					times: [],
					startTime: '',
					endTime: '',
                    userId: undefined
				},
				treeVisible: false,
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'departmentFullName'
				},
				subLoading: false,
				dictType: "examType",
				times: [],
				pickerOptions: {
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
				},
				uploadFile: {
					textFirst: ' +上传材料',
					limit: 9,
					size: 50,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=special`,
					accepts: '.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
				},
				fileArray1: [],
				fileArray2: [],
				method: '',
				typePareChilds: [],
                personOpt: []
			}
		},
		components: {
			UploadFiles, SelectDept
		},
		computed: {
			...mapGetters([
				'userId'
			])
		},
		created() {
            this.getDeptPerson()
			this.init();
		},
		methods: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
			timesChange(time) {
				// this.baseDataForm.times = time;
				this.$set(this.times,0,time[0])
				this.$set(this.times,1,time[1])
				this.baseDataForm.times = this.times
			},
			inspectionTeamIdChange(e) {
			},
			init() {
				this.$nextTick(() => {
					this.$refs['baseDataForm'].resetFields();
					if (!this.$route.query.id) {
						this.baseDataForm = {
							id: undefined,
							supervisionTheme: '',
							issueFiles: [],
							issueForm: [],
							remarks: '',
							orgName: '',
							issueOrg: [
								// orgId: undefined,
								// orgName: ''
							],
							times: [],
							startTime: '',
							endTime: '',
                            userId: undefined
						}
					} else {
						this.baseDataForm.id = this.$route.query.id;
					}
				})
			},

			// 表单提交
			baseDataFormSubmit() {
				this.baseDataForm.startTime = this.baseDataForm.times && this.baseDataForm.times.length ? this.baseDataForm.times[0] : '';
				this.baseDataForm.endTime = this.baseDataForm.times && this.baseDataForm.times.length ? this.baseDataForm.times[1] : '';
				this.$refs['baseDataForm'].validate((valid,object) => {
					if (valid) {
						this.subLoading = true;
						this.add();
					}
				})
			},

			add() {
                this.baseDataForm.responsiblePerson = [this.personOpt.find(person => person.userId === this.baseDataForm.userId)]
                addSupervision(this.baseDataForm, 'post').then(res => {
                    if (res.status === 200) {
                        this.$message.success('创建成功')
                        this.cancel()
                    }
                }).finally(() => {
                    this.subLoading = false
                })
			},
			// 获取批量上传文件
			getFiles(data) {
				try {
					if(data.index == '2') {
						this.baseDataForm.issueFiles = data.files.map(item => {
							return item.response ? item.response.fileUrl : item.url;
						});
                        if (data.files.length) {
                            this.$refs['baseDataForm'].clearValidate('issueFiles')
                        }
					}
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},

			cancel() {
				this.$router.go(-1)
			},
            getDeptPerson() {
                getGroupUserlist({code: 'inspection'}).then(res => {
                    if (res?.status === 200) {
                        this.personOpt = res.data
                        const id = +this.userId
                        if (this.personOpt.some(user => user.userId === id)) {
                            this.baseDataForm.userId = id
                        }
                    }
                })
            },
            handleDept(data) {
                const {checkedNodes = []} = data
               this.baseDataForm.issueOrg = checkedNodes.map(item => {
					return { orgId: item.id, orgName: item.departmentFullName}
				});
                this.$refs.baseDataForm.validateField('issueOrg')
            }
		}

	}
</script>
<style lang="scss" scoped>
	.goback-info {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.form-item {
		width: 100%;
	}

	/* 	.input-info>>>.el-input__count-inner {
		height: 33px;
	}

	.textarea-info>>>.el-textarea__inner {
		padding-right: 50px;
	} */

	.go-handle {
		font-weight: 700;
		cursor: pointer;
	}

	.go-handle:hover {
		color: #FF4C52;
	}

	.tab-info {
		margin-top: 20px;
	}

	.tab-content {
		padding: 10px 20px;
	}

	.download-template {
		width: 90px;
		float: right;
		margin-top: 0;
		margin-right: -90px;
		text-align: center;
		color: #666;
		text-decoration: underline;
	}

	.download-template:hover {
		color: #888;
		cursor: pointer;
	}

	.treeSelect-containers {

		>>>.el-input__inner,
		>>>.el-input__suffix {
			cursor: pointer;
		}
	}
</style>
