<template>
	<div class="app-container calendar-list-container nav-content" @click="OptionCardClose">
		<div v-if="(integrityArchives_btn_infTaskDis || integrityArchives_btn_historicalTasks) && !$route.query.look && integrityArchives_btn_untInspection" class="search-info page-info">
			<div class="search-left">
			</div>
			<div class="bu-right">
				<el-button v-if="integrityArchives_btn_infTaskDis" class="filter-item" style="margin-left: 10px;" @click="distributionTaskHandle"
					type="primary" icon="edit">单位信息档案任务下发</el-button>
					<el-button v-if="integrityArchives_btn_historicalTasks" class="filter-item" type="text" v-waves icon="search" @click="historyHandle()">历史任务</el-button>
			</div>
		</div>
		<!-- <div v-if="!tabPosition" class="search-info page-info">
			<el-form :inline="true">
				<el-form-item label="档案编号：">
					<el-input clearable placeholder="请输入" v-model="archivesNum" :readonly="isReadonly">
					</el-input>
				</el-form-item>
				<el-form-item v-if="integrityArchives_btn_informationnumber">
					<el-button v-if="isReadonly" type="primary" @click="numberEditHandle()">编辑</el-button>
					<el-button v-else type="primary" @click="numberDetermineHandle()">确定</el-button>
				</el-form-item>
			</el-form>
		</div> -->
		<div class="page-right">
			 <!-- :style="{'height':(integrityArchives_btn_untSubsidiary?'calc(100vh - 250px)':'calc(100vh - 350px)')}" -->
			<div class="tree-info" ref="tree-info" :style="siteLeftHeight">
				<tree @refreshDataTree="treeHandle" ref="tree"></tree>
			</div>
			<div v-if="code == 'personnelRoster' && parentId !== '0'" class="page-info-table" style="flex: 1;margin-left: 20px;width: 70%;">
				<div ref="searchSection" style="display: flex;justify-content: space-between;">
					<div class="search-left">
						<el-form :inline="true" :model="listQuery" @keyup.enter.native="getTableList()">
							<el-form-item>
								<el-input clearable placeholder="请输入姓名" v-model="listQuery.name">
								</el-input>
							</el-form-item>
							<el-form-item>
								<el-select v-model="listQuery.status" clearable placeholder="请选择状态">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter()">查询</el-button>
							</el-form-item>
							<el-form-item v-if="integrityArchives_btn_leadingin && !$route.query.look">
								<el-upload ref="upload"
									:show-file-list="false"
									:action="importUrl"
									:before-upload="beforeUploadHandle"
									:on-error="onErrorFile"
									:on-success="onSuccessFile" 
									:file-list="fileList"
									:accepts="accepts"
									:limit="1"
									:size="size">
									<el-button class="filter-item" type="primary" v-waves icon="search">导入</el-button>
								</el-upload>
								<!-- :before-upload="beforeUploadHandle"
									:on-error="onErrorFile"
									:on-success="onSuccessFile" 
									:file-list="fileList"
									action=""
									:accepts="accepts"
									:limit="1"
									:size="size" -->
								<!-- <el-button class="filter-item" type="primary" v-waves icon="search" @click="importMemberHandle()">导入</el-button> -->
								<!-- <el-button class="filter-item" type="text" v-waves icon="search" @click="downloadFile()">下载模板</el-button>
								<el-button class="filter-item" type="primary" v-waves icon="search" @click="addOrUpdateHandle()">导出</el-button> -->
							</el-form-item>
							<el-form-item v-if="integrityArchives_btn_leadingout && !$route.query.look">
								<el-button class="filter-item" type="primary" v-waves icon="search" @click="exportHandle()">导出</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div>
						<el-button v-if="integrityArchives_btn_downloadtemplate && !$route.query.look" class="filter-item" type="text" v-waves icon="search" @click="downloadFile()">下载模板</el-button>
					</div>
				</div>
				<el-table :height="tableHeight" ref="table" :key='tableKey' :data="tableList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
					<el-table-column label="序号" width="58" align="center" type="index" />
					<el-table-column min-width="100" align="center" label="姓名">
						<template slot-scope="scope">
							{{scope.row.name}}
						</template>
					</el-table-column>
					<el-table-column min-width="100" align="center" label="性别">
						<template slot-scope="scope">
							{{scope.row.gender}}
						</template>
					</el-table-column>
					<el-table-column min-width="110" align="center" label="政治面貌">
						<template slot-scope="scope">
							{{scope.row.politicalStatus}}
						</template>
					</el-table-column>
					<el-table-column min-width="120" align="center" label="手机号码" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							{{scope.row.phoneNumber}}
						</template>
					</el-table-column>
					<el-table-column min-width="110" align="center" label="学历">
						<template slot-scope="scope">
							{{scope.row.educationalBackground}}
						</template>
					</el-table-column>
					<el-table-column min-width="150" align="center" label="部门" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.department}}</div>
						</template>
					</el-table-column>
					<el-table-column min-width="150" align="center" label="岗位" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.post}}</div>
						</template>
					</el-table-column>
					<el-table-column min-width="100" align="center" label="状态">
						<template slot-scope="scope">
							{{scope.row.status}}
						</template>
					</el-table-column>
					<el-table-column min-width="150" align="center" label="状态说明" :show-overflow-tooltip="true">
						<template slot-scope="scope">
							<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.statusDescription}}</div>
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
			<div v-if="code == 'threeimportancesonegreatness'" class="page-info-table" style="flex: 1;margin-left: 20px;width: 70%;">
				<Threeimportancesonegreatness ref="threeimportancesonegreatness"></Threeimportancesonegreatness>
			</div>
			<div v-if="code == 'incorruptTalk'" class="page-info-table" style="flex: 1;margin-left: 20px;width: 70%;">
				<IncorruptTalk ref="incorruptTalk"></IncorruptTalk>
			</div>
			<div v-if="!code || (code == 'personnelRoster' && parentId == '0')" class="page-info-img" ref="pageInfo" style="flex: 1;margin-left: 20px;">
				<div style="display: flex;width: 100%;">
					<div class="group-search-left">
						<el-radio-group class="radio-group-button" v-model="radioValue" style="margin-bottom: 30px;" @input="radioChange">
							<el-radio-button v-for="(item,index) in hiarchiList" :key="index" :label="index">{{item.submitTime}}</el-radio-button>
						</el-radio-group>
					</div>
					<div class="group-bu-right">
						<el-button v-if="integrityArchives_btn_informationnameadd && !$route.query.look && parentId !== '0' && manytimesRrp && isPresenting && oneRep && (integrityArchives_btn_untSubsidiary || (integrityArchives_btn_untInspection && archivesType == '1'))" type="primary" @click="manytimesAdd()">添加</el-button>
						<el-button v-if="integrityArchives_btn_informationnameadd && !$route.query.look && parentId == '0' && isPresenting && ((integrityArchives_btn_untSubsidiary && archivesType == '0') || (integrityArchives_btn_untInspection && archivesType == '1'))" type="primary" @click="handleAdd()">添加</el-button>
						<el-button v-if="integrityArchives_btn_informationedit && !$route.query.look && parentId !== '0' && (integrityArchives_btn_untInspection || isReport == '0')" type="primary" @click="handleEdit()">编辑</el-button>
					</div>
				</div>
				<!-- <div class="page-info-button">
					<el-button v-if="integrityArchives_btn_informationnameadd && !$route.query.look && parentId == '0' && (integrityArchives_btn_untInspection || isPresenting)" type="primary" @click="handleAdd()">添加</el-button>
					<el-button v-if="integrityArchives_btn_informationedit && !$route.query.look && parentId !== '0' && (integrityArchives_btn_untInspection || isPresenting)" type="primary" @click="handleEdit()">编辑</el-button>
				</div> -->
				 <!-- :style="{'height':(integrityArchives_btn_untSubsidiary?'calc(100vh - 340px)':'calc(100vh - 450px)')}" -->
				<div v-if="form.fileUrls.length" class="area-show" :style="siteRightHeight">
					<div v-for="(item,index) in form.fileUrls" :key="index" class="content-show">
						<!-- {{formatFileSuffix(item)}} -->
						<div class="file-name">{{item.fileUrl | formatFile}}</div>
						<div class="file-info" v-if="formatFileSuffix(item.fileUrl) == 'pdf'" style="margin-top: 20px;">
							<iframe :id="`bi_iframe${index}`" @load="adjustIframe(index)" scrolling="auto" :src="item.fileUrl" frameborder="0" height="300px" style=""></iframe>
							<!-- <div class="file-img">
								<img src="~@/assets/img/file.png" alt="图标"></img>
							</div>
							<div class="file-text">{{item | formatFile}}</div>
							<div class="file-download" @click="previewHadle(item)">预览</div> -->
						</div>
						<img v-else :src="item.fileUrl" style="margin-top: 20px;">
					</div>
				</div>
			</div>
		</div>
		<div v-if="!$route.query.look && isPresenting && integrityArchives_btn_untSubsidiary" class="footer-btn" align="right">
			<el-button class="btn-submit" type="primary" @click="createPut()" :loading="subAllLoding">整体提报</el-button>
		</div>
		<el-dialog :visible.sync="dialogFormVisible">
			<el-form ref="form" label-width="100px" :rules="rules" :model="subForm">
				<el-row>
					<el-col :span="12" :offset="0">
						<el-form-item label="文件名：" prop="value">
							<el-date-picker style="width: 100%;" type="year" format="yyyy" value-format="yyyy" v-model="subForm.value"
								align="right" placeholder="请选择年份" :readonly="yearDisabled">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="10" :offset="0">
						<el-form-item prop="updateOrNot">
							<el-radio-group v-model="subForm.updateOrNot" @change="agreeChange">
								<el-radio label="1">有变化</el-radio>
								<el-radio label="0">无变化</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="!code">
					<el-col :span="22" :offset="0">
						<el-form-item v-if="subForm.updateOrNot == '1'" prop="fileUrls">
							<span slot="label">
								<span class="formLabel">文件：</span>
							</span>
							<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
								:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
								@refreshData="getFiles"></UploadFiles>
						</el-form-item>
						<el-form-item v-if="subForm.updateOrNot == '0'">
							<span slot="label">
								<span class="formLabel">文件：</span>
							</span>
							<UploadFiles ref="uploadFiles" :btnText="uploadFile.textFirst" :url="uploadFile.url" :index="1"
								:accepts="uploadFile.accepts" :limit="uploadFile.limit" :size="uploadFile.size"
								@refreshData="getFiles"></UploadFiles>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer" align="center">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="archivesfileHandle('form')" :loading="loading">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog
			title=""
			:visible.sync="dialogVisible"
			width="30%"
			>
			<div slot="title" class="postion">
				<i class="el-icon-warning-outline"></i>
				<span>文件导入成功，但有错误。</span>
			</div>
			<div class="upload-error">
				<span>总上传行数：{{errorData.allRows}}</span>
				<span>已导入行数：{{errorData.successRows}}</span>
				<span>错误行数：{{errorData.errolRows}}</span>
			</div>
			<div class="upload-error">
				<span>具体详情请</span>
				<span class="error-download" @click="downloadTxt">点击下载</span>
			</div>
			<span slot="footer" class="dialog-footer">
				<!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 弹窗 -->
		<fuhsi-import v-if="importMemberVisible" ref="importMember" :title="importMember.title"
			:importURL="importMember.importURL" :templateURL="importMember.templateURL" @refreshData="getStatisticalData()">
		</fuhsi-import>
		<!-- 弹窗, 单位信息档案任务下发 -->
		<DistributionTaskAddOrUpdate v-if="distributionTaskAddOrUpdateVisible" ref="distributionTaskAddOrUpdate" @refreshDataList="getLeftList"></DistributionTaskAddOrUpdate>
	</div>
</template>

<script>
	import DistributionTaskAddOrUpdate from './components/infTaskDisAddOrUpdate';
	import Threeimportancesonegreatness from './components/threeimportancesonegreatness';
	import IncorruptTalk from './components/incorruptTalk';
	import UploadFiles from 'components/UploadFiles/UploadFilesBtn';
	import fuhsiImport from '@/components/fuhsi-import';
	import {
		updateArchivesfileObj,
		archivesfileInfo,
		updateUnitarchivesObj,
		personnelrosterPage,
		personnelrosterUpload,
		addUnitarchivesObj,
		subReport,
		unitriskpointsInspection
	} from 'api/archives/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import tree from "./components/folder";
	import {
		formatFile,
		// formatFileSuffix
	} from 'utils';
	// import tableMixin from '@/mixins/table/table.mixin' 
	export default {
		name: "informationCom",
		// mixins: [tableMixin],
		data() {
			this.rules = {
				value: {required: true, message: '请选择年份', trigger: 'change'},
				updateOrNot: {required: true, message: '请选择', trigger: 'change'},
				fileUrls: [{
                    required: true, validator: (rule, val, cb) => {
                        if (!val.length && this.subForm.updateOrNot == '1') return cb(new Error('请选择附件'))
                        cb()
                    } 
                }]
            }
			return {
				distributionTaskAddOrUpdateVisible: true,
				isReadonly: true,
				dialogFormVisible: false,
				popoverVisibel: false,
				loading: false,
				listLoading: true,
				archivesNum: '',
				deptName: '',
				// imageUrl: [],
				fileUrlsUpl: [],
				form: {
					fileUrls: [],
					recordId: undefined
				},
				subForm: {
					id: undefined,
					parentId: '0',
					value: '',
					updateOrNot: undefined,
					fileUrls: [],
					orgId: undefined,
					groupCode: ''
				},
				uploadFile: {
					textFirst: ' +上传文件',
					limit: 9,
					size: 30,
					url: `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=archives`,
					accepts: '.pdf'
				},
				// integrityArchives_btn_informationfilesadd: false,
				integrityArchives_btn_informationnumber: false,
				integrityArchives_btn_addCompanyarchives: false,
				integrityArchives_btn_leadingin: false,
				integrityArchives_btn_leadingout: false,
				integrityArchives_btn_downloadtemplate: false,
				integrityArchives_btn_infTaskDis: false,
				integrityArchives_btn_historicalTasks: false,
				integrityArchives_btn_untInspection: false,
				integrityArchives_btn_untSubsidiary: false,
				integrityArchives_btn_informationnameadd: false,
				integrityArchives_btn_informationedit: false,
				fileArray: [],
				fileArray1: [],
				value: '',
				baseParentId: undefined,
				parentId: undefined,
				code: undefined,
				tableKey: 0,
				tableList: [],
				listQuery: {
					page: 1,
					limit: 10,
					unitArchivesId: undefined,
					name: '',
					status: ''
				},
				total: null,
				options: [
					{ value: '在职', label: '在职' },
					{ value: '离职', label: '离职' },
					{ value: '调离', label: '调离' }
				],
				importMemberVisible: false,
				importMember: {
					title: "导入",
					importURL: "",
					templateURL: ""
				},
				fileList: undefined,
				accepts: '.xls,.xlsx',
				size: 10,
				importUrl: '',
				dialogVisible: false,
				errorData: {},
				orgId: '',
				tableHeight: 430,
				disabled: true,
				isPresenting: false,
				hiarchiList: [],
				radioValue: 0,
				isReport: undefined,
				subAllLoding: false,
				archivesType: '',
				manytimesRrp: '',
				yearDisabled: false,
				oneRep: true, // 第一条是否提报
				valRep: '',
			}
		},
		
		props: {
			tabPosition: {
				type: String
			}
		},
        
        watch: {
			'form.fileUrls'(newVal, oldVal) {
                this.form.fileUrls = newVal;
			},

			tabPosition(newVal, oldVal) {
				this.tabPosition = newVal;
			},
		},

		filters: {
			// 格式化文件名
			formatFile(url) {
				return formatFile(url);
			},
			// // 格式化文件后缀名
			// formatFileSuffix(url) {
			// 	return formatFileSuffix(url);
			// }
        },

		components: {
			tree,
			UploadFiles,
			fuhsiImport,
			Threeimportancesonegreatness,
			IncorruptTalk,
			DistributionTaskAddOrUpdate
		},

		computed: {
			...mapGetters([
				'elements'
			]),

			siteLeftHeight() {
				if(this.integrityArchives_btn_untSubsidiary) {
					return {
                        'height': 'calc(100vh - 250px)'
                    }
				} else if(this.$route.query.look && this.integrityArchives_btn_untInspection) {
					return {
                        'height': 'calc(100vh - 330px)'
                    }
				} else if(this.integrityArchives_btn_untInspection) {
					return {
                        'height': 'calc(100vh - 310px)'
                    }
				} else if(!this.integrityArchives_btn_untSubsidiary && !this.integrityArchives_btn_untInspection && this.$route.query.look) {
					return {
                        'height': 'calc(100vh - 330px)'
                    }
				} else if(!this.integrityArchives_btn_untSubsidiary && !this.integrityArchives_btn_untInspection && !this.$route.query.look) {
					return {
                        'height': 'calc(100vh - 210px)'
                    }
				}
			},

			siteRightHeight() {
				if(this.integrityArchives_btn_untSubsidiary) {
					return {
                        'height': 'calc(100vh - 340px)'
                    }
				} else if(this.$route.query.look && this.integrityArchives_btn_untInspection) {
					return {
                        'height': 'calc(100vh - 430px)'
                    }
				} else if(this.integrityArchives_btn_untInspection) {
					return {
                        'height': 'calc(100vh - 410px)'
                    }
				} else if(!this.integrityArchives_btn_untSubsidiary && !this.integrityArchives_btn_untInspection && this.$route.query.look) {
					return {
                        'height': 'calc(100vh - 425px)'
                    }
				} else if(!this.integrityArchives_btn_untSubsidiary && !this.integrityArchives_btn_untInspection && !this.$route.query.look) {
					return {
                        'height': 'calc(100vh - 300px)'
                    }
				}
			},
		},
		created() {
			// 获取权限
			// this.integrityArchives_btn_informationfilesadd = this.elements['integrityArchives:btn_informationfilesadd'];	
			this.integrityArchives_btn_informationnumber = this.elements['integrityArchives:btn_informationnumber'];
			// this.integrityArchives_btn_addCompanyarchives = this.elements['integrityArchives:btn_addCompanyarchives'];
			this.integrityArchives_btn_leadingin = this.elements['integrityArchives:btn_leadingin'];
			this.integrityArchives_btn_leadingout = this.elements['integrityArchives:btn_leadingout'];	
			this.integrityArchives_btn_downloadtemplate = this.elements['integrityArchives:btn_downloadtemplate'];
			this.integrityArchives_btn_infTaskDis = this.elements['integrityArchives:btn_infTaskDis'];
			this.integrityArchives_btn_historicalTasks = this.elements['integrityArchives:btn_historicalTasks'];
			this.integrityArchives_btn_untInspection = this.elements['integrityArchives:btn_untInspection'];
			this.integrityArchives_btn_untSubsidiary = this.elements['integrityArchives:btn_untSubsidiary'];
			this.integrityArchives_btn_informationnameadd = this.elements['integrityArchives:btn_informationnameadd'];	
			this.integrityArchives_btn_informationedit = this.elements['integrityArchives:btn_informationedit'];
			// this.$nextTick(() => {
			// 	this.getList();
			// })
		},
		methods: {
			getLeftList() {
				this.nextTick(() => {
					this.$refs.tree.getTreeInfo();
				})
			},
			// 单位信息档案任务下发
			distributionTaskHandle() {
				this.distributionTaskAddOrUpdateVisible = true
				this.$nextTick(() => {
					this.$refs.distributionTaskAddOrUpdate.init();
				})
			},
			// 单位信息档案历史记录
			historyHandle() {
				// debugger
				this.$router.push({
					path: `${this.$route.path}/history`,
					query: {
					}
				})
			},
			// 格式化文件名
			formatFiles(url) {
				return formatFile(url);
			},
			adjustIframe(index) {
				var ifm = document.getElementById("bi_iframe"+index);
				ifm.height = document.documentElement.clientHeight;
				ifm.width = document.documentElement.clientWidth;
			},
			// // 预览文件
			// previewHadle(url) {
			// 	const Base64 = require('js-base64').Base64
			// 	window.open(`${window.SITE_CONFIG['previewUrl']}/onlinePreview?url=`+encodeURIComponent(Base64.encode(url)));
			// },
			formatFileSuffix( url) {
				let index = url.lastIndexOf("/");
				let name = "";
				name = url.substring(index + 1, url.length);
				return name.substring(name.indexOf(".") + 1, name.length);
			},
			numberEditHandle() {
				this.isReadonly = false;
			},
			numberDetermineHandle() {
				let updateForm = {
					archivesNum: this.archivesNum,
					id: this.baseParentId,
					value: this.value
				}
				updateUnitarchivesObj(updateForm)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功！',
								type: 'success',
								duration: 1000
							});
							this.isReadonly = true;
							// this.nextTick(() => {
								this.$refs.tree.getTreeInfo();
							// })
							// this.getTreeInfo();
						} else {
							this.$notify({
								title: '失败',
								message: res.msg,
								type: 'error',
								duration: 1000
							});
							this.isReadonly = true;
						}
					}).catch(() => {
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 1000
						});
						this.isReadonly = true;
					})
			},
			getDeptId(deptId,departmentFullName) {
				if(deptId) {
					this.$refs.tree.form.orgId = deptId;
					this.$refs.tree.form.orgName = departmentFullName;
					this.$nextTick(() => {
						this.$refs.tree.getTreeInfo();
						// if(this.integrityArchives_btn_addCompanyarchives) this.$refs.tree.getTreeInfoCompany();
					})
				}
			},
			// 点击部门刷新列表数据
			treeHandle(val,orgId,rel) {
				// this.listQuery.deptId = val.id;
                // this.getList();
				// this.form.fileUrls = val.imageUrl;
				this.isPresenting = rel;
				if(val) {
					this.code = val.code ? val.code : undefined;
					this.form.recordId = val.id;
					this.subForm.parentId = val.id;
					this.archivesType = val.archivesType;
					if(val.crtTime) this.manytimesRrp = val.crtTime.substring(0,4) == new Date().getFullYear();
					this.importUrl = `/api/incorruptibleArchives/personnel-roster/upload/${val.id}`
					if(this.code == 'personnelRoster' && val.parentId !== '0') {
						this.listQuery.name = '';
						this.listQuery.status = '';
						this.listQuery.unitArchivesId = val.id;
						this.getTableList();
					}
					this.baseParentId = val.parentId == "0" ? val.id : val.baseParentId;
					this.parentId = val.parentId;
					this.value = val.value;
					this.valRep = val.isReport;
					this.getList(val.id);
					if(val.archivesNum) {
						this.archivesNum = val.archivesNum;
					}
					if(this.tabPosition) {
						this.$emit('tabRefreshData', val);
					}
					if(val.parentId !== '0') {
						this.subForm.parentId = val.parentId;
						this.subForm.value = val.value;
						this.subForm.updateOrNot = val.updateOrNot;
						this.subForm.orgId = val.orgId;
						this.subForm.id = val.id;
					} else {
						this.subForm = {
							parentId: '0',
							value: '',
							updateOrNot: undefined,
							fileUrls: [],
							orgId: undefined,
							id: undefined,
							groupCode: ''
						};
						this.subForm.parentId = val.id;
					}
				} else {
					this.form.fileUrls = [];
					this.archivesNum = '';
					this.$emit('tabRefreshData');
				}
				if(orgId) {
					this.subForm.orgId = orgId;
					this.orgId = orgId;
					if(val.code == 'threeimportancesonegreatness') {
						this.$nextTick(() => {
							this.$refs.threeimportancesonegreatness.listQuery.orgId = orgId;
							this.$nextTick(() => {
								this.$refs.threeimportancesonegreatness.getList();
							})
						})
					}
					if(val.code == 'incorruptTalk') {
						this.$nextTick(() => {
							this.$refs.incorruptTalk.listQuery.deptId = orgId;
							this.$nextTick(() => {
								this.$refs.incorruptTalk.getList();
							})
						})
					}
				} else {
					this.orgId = '';
				}
            },
            OptionCardClose(event) {
                var currentCli = document.getElementById("option-button-group");
                if (currentCli) {
                    if (!currentCli.contains(event.target)) { //点击到了id为option-button-group以外的区域，就隐藏菜单
                        this.$refs.tree.optionCardShow = false;
                    }
                }
            },
			// 获取数据列表
			getList(id) {
				if(this.integrityArchives_btn_untSubsidiary && this.archivesType == '1') {
					this.form.fileUrls = [];
					this.subForm.fileUrls = [];
					this.isReport = '';
					this.subForm.groupCode = '';
					this.hiarchiList = [];
					// this.oneRep = false;
				} else {
					let type = this.integrityArchives_btn_untSubsidiary ? '11' : '22';
					archivesfileInfo(this.form.recordId,type)
						.then(response => {
							if (response && response.status === 200) {
								this.hiarchiList = response.data;
								if(response.data && response.data[0]) {
									if(response.data[0].files && response.data[0].files.length) {
										this.form.fileUrls = this.hiarchiList[0].files;
										this.subForm.fileUrls = this.hiarchiList[0].files.map(item => {
											return item.fileUrl;
										});
									}
									this.isReport = this.hiarchiList[0].isReport;
									this.subForm.groupCode = this.hiarchiList[0].groupCode;
									if(this.hiarchiList[0].isReport == '0') this.oneRep = false;
									else this.oneRep = true;
								} else {
									this.form.fileUrls = [];
									this.subForm.fileUrls = [];
									this.isReport = '';
									this.subForm.groupCode = '';
								}
								if(response.data.length == 0) {
									if(this.valRep == '0') {
										this.isReport = this.valRep;
										this.oneRep = false;
									} else if(this.valRep == '1') {
										this.isReport = this.valRep;
										this.oneRep = true;
									}
								}
							} else {
								this.$message.error(response.msg);
							}
						}).catch(() => {
						})
					}
			},

			// 文件数据
			radioChange(e) {
				this.radioValue = e;
				this.form.fileUrls = this.hiarchiList[e].files
				this.isReport = this.hiarchiList[e].isReport
				this.subForm.fileUrls = this.hiarchiList[e].files.map(item => {
					return item.fileUrl;
				});
				this.subForm.groupCode = this.hiarchiList[e].groupCode
			},

			// 获取人员花名册列表
			getTableList() {
				this.listLoading = true;
				personnelrosterPage(this.listQuery,this.form.recordId)
					.then(response => {
						if (response && response.status === 200) {
							this.tableList = response.data.rows;
							this.total = parseInt(response.data.total);
						} else {
							this.total = 0;
						}
						this.tableLayout();
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			// 人员花名册查询
			handleFilter() {
				this.listQuery.page = 1;
				this.getTableList();
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getTableList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getTableList();
			},

			// 表格有合并单元格和fixed的时候会错位，需要获取完数据重新布局
			tableLayout(option) {
				const {searchRefName = 'searchSection', tableRefName = 'table', subtractVal = 270} = option || {}
				const searchHeight = this.$refs[searchRefName]?.offsetHeight || 0
				const pageHeight = window.innerHeight
				const computedHeight = pageHeight - searchHeight - subtractVal - 130
				this.tableHeight = computedHeight > 430 ? computedHeight : 430
				this.$nextTick(() => {
					this.$refs[tableRefName]?.doLayout()
				})
			},

			// 下载模板
			downloadFile() {
				window.location.href = `/api/incorruptibleArchives/personnel-roster/template?token=${getToken()}`;
			},

			inTeam(files) {
				// let formdata = new FormData();
				// formdata.append("multipartFile", files.file);
				// // 如需其他参数按照这种格式加
				// formdata.append("othersItem","123123");
				// // // 根据后端给的接口进行传参
				// // productImport(formdata).then((res) => {
				// // 	if (res.code == "0") {
				// // 	this.$message.success("导入成功！");
				// // 	//进行其他内容获取
				// // 	this.getProductPage();
				// // 	} else {
				// // 	this.$message.error("导入失败！");
				// // 	}
				// // });
			},

			 // 导入
			beforeUploadTest(file) {
				// this.fileList = file;
				// let formData = new FormData();
				// formData.append("file", file);
				// // this.$http.post("stress_daoru", formData).then((res) => {
				// // 	if (res.code === 10000) {
				// // 	this.$message({
				// // 		message: "导入成功",
				// // 		type: "success",
				// // 	});
				// // 	} else {
				// // 	this.$message.error(res.message);
				// // 	}
				// // });
				// this.importMemberHandle();
			},


			// 上传之前
			beforeUploadHandle(file) {
				if (file.size / 1024 / 1024 > this.size) {
					this.$message.error(`不支持${this.size}MB以上的文件`);
					return false;
				}
				let index = file.name.lastIndexOf('.');
				let type = file.name.substring(index, file.name.length);
				let suffixArray = this.accepts.split(",") //限制的文件类型
				if (suffixArray.indexOf(type) == -1) {
					this.$message({
						message: '文件格式错误',
						type: 'error',
						duration: 2000
					})
					return false;
				}
				// this.num++
			},

			onErrorFile() {
				this.$message("文件上传失败！"); 
   				// this.$refs.upload.clearFiles(); //去掉文件列表
			},

			onSuccessFile(response, file, fileList) {
				if (response && response.status == 200) {
					// if (this.num == this.successNum) {
						this.$message({
							message: '导入成功',
							type: 'success',
							duration: 1500,
						})
						this.$nextTick(() => {
							// this.$refs.upload.clearFiles(); //去掉文件列表
							this.getTableList();
						})
					// }
				} else {
					this.errorData = response.data;
					this.dialogVisible = true;
					// this.$message.error(response.msg);
				}
			},

			downloadTxt() {
				window.location.href = `/api/upload/download/downloadFileByBucketName?fileUrl=${this.errorData.fileUrl}&token=${getToken()}&bucketName=errorfile`;
			},

			// getStatisticalData(data) {
			// 	// personnelrosterUpload(this.form.recordId, { file: fileUrl})
			// 	// 	.then((res) => {
			// 	// 		if (res && res.status === 200) {
			// 	// 			this.$notify({
			// 	// 				title: '成功',
			// 	// 				message: '操作成功',
			// 	// 				type: 'success',
			// 	// 				duration: 2000
			// 	// 			});
			// 	// 			setTimeout(() => {
			// 	// 				this.getTableList();
			// 	// 			}, 1000)
			// 	// 		} else {
			// 	// 			this.$notify({
			// 	// 				title: '失败',
			// 	// 				message: res.msg,
			// 	// 				type: 'error',
			// 	// 				duration: 2000
			// 	// 			});
			// 	// 		}
			// 	// 	}).catch(() => {
			// 	// 		this.$notify({
			// 	// 			title: '失败',
			// 	// 			message: '操作失败',
			// 	// 			type: 'error',
			// 	// 			duration: 2000
			// 	// 		});
			// 	// 	})
			// },

			// 导出
			exportHandle() {
				window.location.href =
					`/api/incorruptibleArchives/personnel-roster/download/${this.form.recordId}`
			},

			// handleFilter(nameInf) {
			// 	if(nameInf) this.$refs.tree.value = nameInf;
			// 	else this.$refs.tree.value = this.listQuery.value;
			// 	this.$refs.tree.getTreeInfo();
			// 	if(this.integrityArchives_btn_addCompanyarchives) this.$refs.tree.getTreeInfoCompany();
			// },

			// resetQuery() {
			// 	this.listQuery.value = '';
			// 	this.$refs.tree.value = '';
			// 	this.$refs.tree.getTreeInfo();
			// 	if(this.integrityArchives_btn_addCompanyarchives) this.$refs.tree.getTreeInfoCompany();
			// },

			// 添加
			handleAdd() {
				this.subForm.id = undefined;
				this.subForm.value = '';
				this.subForm.updateOrNot = undefined;
				this.subForm.fileUrls = [];
				this.subForm.groupCode = '';
				this.dialogFormVisible = true;
				this.yearDisabled = false;
				this.$nextTick(() => {
					if(this.$refs.uploadFiles) this.$refs.uploadFiles.init([]);
					this.$refs.form.clearValidate();
				})
			},

			// 编辑
			handleEdit() {
				this.dialogFormVisible = true;
				this.yearDisabled = false;
				if (this.subForm.fileUrls && this.subForm.fileUrls.length) {
					this.fileArray = this.subForm.fileUrls.map(item => { return {name: this.formatFiles(item),
						response: {fileUrl: item}}})
					this.$nextTick(() => {
						this.$refs.uploadFiles.init(this.fileArray);
					})
				} else {
					this.$nextTick(() => {
						if(this.$refs.uploadFiles) this.$refs.uploadFiles.init([]);
						this.$refs.form.clearValidate();
					})
				}
			},

			// 多次添加
			manytimesAdd() {
				this.dialogFormVisible = true;
				// this.subForm.id = undefined;
				// this.subForm.value = new Date().getFullYear().toString();
				this.subForm.groupCode = '';
				this.subForm.updateOrNot = '';
				this.subForm.fileUrls = [];
				this.yearDisabled = true;
				this.$nextTick(() => {
					if(this.$refs.uploadFiles) this.$refs.uploadFiles.init([]);
					this.$refs.form.clearValidate();
				})
			},

			agreeChange(e) {
				this.$nextTick(() => {
					if(e == '0') this.$refs.form.clearValidate('fileUrls');
					if(this.$refs.uploadFiles && this.subForm.fileUrls.length == 0) this.$refs.uploadFiles.init([]);
				})
			},

			// 获取批量上传文件
			getFiles(data) {
				try {
					this.subForm.fileUrls = data.files.map(item => {
						return item.response ? item.response.fileUrl : item.url;
					});
				} catch (e) {
					//TODO handle the exception
					this.$message.error("获取文件失败，请重新上传");
					return
				}
			},

			archivesfileHandle(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
					this.method = this.subForm.id ? 'put' : 'post';
					let isInspect = this.integrityArchives_btn_untInspection ? true : false;
					const fn = (this.integrityArchives_btn_untSubsidiary || this.subForm.id) ? addUnitarchivesObj(this.subForm,this.method,isInspect) : unitriskpointsInspection(this.subForm,this.method,isInspect)
					this.loading = true;
						fn.then((res) => {
							if (res && res.status === 200) {
								this.$notify({
									title: '成功',
									message: '成功',
									type: 'success',
									duration: 1000
								});
								this.loading = false;
								this.$refs.tree.getTreeInfo(this.form.recordId,this.parentId);
								this.getList(this.form.recordId);
								this.dialogFormVisible = false;
							} else {
								this.$notify({
									title: '失败',
									message: res.msg,
									type: 'error',
									duration: 1000
								});
								this.loading = false;
								this.dialogFormVisible = false;
							}
						}).catch(() => {
							this.$notify({
								title: '失败',
								message: '失败',
								type: 'error',
								duration: 1000
							});
							this.loading = false;
							this.dialogFormVisible = false;
						})
					} else {
						return false;
					}
				});
			},

			// 整体提报
			createPut() {
				this.$confirm('提报后不允许修改，是否确定提报?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$nextTick(() => {
						this.subAllLoding = true;
						subReport(
								this.orgId
							).then(res => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '操作成功',
										type: 'success',
										duration: 2000
									});
									this.$refs.tree.getTreeInfo();
									this.isPresenting = false;
								} else {
									this.$notify({
										title: '失败',
										message: res.msg,
										type: 'error',
										duration: 2000
									});
									this.subAllLoding = false;
								}
							}).catch(() => {
								this.$notify({
									title: '失败',
									message: '提报失败',
									type: 'error',
									duration: 2000
								});
								this.subAllLoding = false;
							})
						})
					})
					
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-info {
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		margin-bottom: 20px;
    }
    
    .page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
	}

	.page-info-table {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
		
		>>> .el-button--text{
			color: #000000;
			text-decoration:underline
		}
		>>> .el-button--text:hover{
			color: #bc0000;
		}
	}

	.page-info-img {
		width: calc(100% - 420px);
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		// padding: 50px 120px;
		background-color: #FFFFFF;

		.group-search-left {
			flex: 1;
			width: calc(100% - 190px);
		}

		.group-bu-right {
			width: 200px;
			text-align: right;
			padding: 20px 20px 0px 0px;
		}
		
		.page-info-button {
			text-align: right;
			padding: 20px;
		}

		.area-show {
			height: calc(100vh - 450px);
			overflow: auto;
				
			.content-show {
				padding: 0px 120px;
			}
		}
        
        img {
            width: 100%;
            height: 100%;
        }

		.file-name {
			margin-top: 15px;
			margin-bottom: -10px;
		}

		.file-info {
			display: flex;
			width: 100%;

			.file-img {
				width: 30px;
				// margin-top: 5px;

				img {
					width: 25px;
					height: 25px
				}
			}

			.file-text {
				flex: 1;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: #555555;
				text-align: left;
				margin-left: 5px;
			}

			.file-download {
				width: 50px;
				text-align: center;
				color: #555555;
				text-decoration: underline;
				margin-right: 15px;
			}

			.file-download:hover {
				cursor: pointer;
				color: #888888;
			}
		}
	}

	.page-right {
		display: flex;
	}

	.radio-group-button {
		overflow-x: auto;
		white-space: nowrap;
		// max-width: calc(100vw - 730px);
		width: 100%;

		&::-webkit-scrollbar {
			width: 4px;
			height: 4px;
			display: block;
		}
		&::-webkit-scrollbar-track {
			background: rgb(239, 239, 239);
		}
		&::-webkit-scrollbar-thumb {
			background: #dadada;
			border-radius: 2px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #c3c3c3;
		}

		&.expend {
			height: calc(100% - 70px);
		}
	}

	.tree-info {
		// position: absolute;
		width: 392px;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
		height: calc(100vh - 350px);
	}

    .page-title {
		width: 180px;
		height: 30px;
		margin: 0 auto;
		margin-bottom: 20px;
		line-height: 30px;
		background-color: #bc0000;
		color: #FFFFFF;
		font-size: 15px;
		text-align: center;
		border-radius: 5px;
	}

	.query {
		// margin-left: 10px;
	}

	.postion {
		color: #000000d9;
		font-weight: 500;
		font-size: 16px;
		line-height: 1.4;

		i {
			color: #efbd47;
		}
	}

	.app-container {
		// min-height: calc(100vh - 160px);
		>>> .el-dialog__footer {
			text-align: right;
		}
	}

	.upload-error {
		color: #909399;
		margin-left: 30px;

		.error-download {
			color: #bc0000;
			cursor: pointer;
		}
	}

	.bu-right {
		>>> .el-button--text{
			color: #000000;
			text-decoration:underline
		}
		>>> .el-button--text:hover{
			color: #bc0000;
		}
	}

	.footer-btn {
		border-top: 1px solid #DCDFE6;
		z-index: 999;
		position: fixed;
		width: 100%;
		height: 66px;
		background-color: #FFFFFF;
		right: 0;
		bottom: 30px;
		padding-right: 50px;
		padding-top: 13px;

		button {
			width: 120px;
		}

		.btn-submit {
			// background-color: #005598;
			margin-left: 20px;
		}
	}
</style>