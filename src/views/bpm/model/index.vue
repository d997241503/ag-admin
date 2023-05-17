<template>
	<div class="app-container">
		<div class="page-content">
            <!-- 搜索工作栏 -->
            {{elements['bpm:model:import']}}
            <el-form :model="listQuery" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item label="流程标识" prop="key">
                    <el-input v-model="listQuery.key" placeholder="请输入流程标识" clearable style="width: 240px;"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="流程名称" prop="name">
                    <el-input v-model="listQuery.name" placeholder="请输入流程名称" clearable style="width: 240px;"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="流程分类" prop="category">
                    <el-select v-model="listQuery.category" placeholder="流程分类" clearable style="width: 240px">
                        <el-option v-for="dict in categoryDictDatas" :key="dict.code" :label="dict.value"
                            :value="dict.code" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" type="primary" @click="resetQuery">重置</el-button>
                </el-form-item>
                <!-- <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-if="!elements['bpm:model:create']">新建流程</el-button>
                    <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport"
                        v-if="!elements['bpm:model:import']">导入流程</el-button>
                </el-form-item> -->
            </el-form>

            <!-- 操作工具栏 -->
            <!-- <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-if="!elements['bpm:model:create']">新建流程</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport"
                        v-if="!elements['bpm:model:import']">导入流程</el-button>
                </el-col>
            </el-row> -->

            <!-- 列表 -->
            <el-table v-loading="loading" :data="list">
                <el-table-column label="流程标识" align="center" prop="key" />
                <el-table-column label="流程名称" align="center" prop="name" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleBpmnDetail(scope.row)">
                            <span>{{ scope.row.name }}</span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="流程分类" align="center" prop="category" width="110">
                    <template slot-scope="scope">
                        <span>
                            <!-- <el-tag v-for="(item, index) in categoryDictDatas" :key="index"
                                v-show="scope.row.category + '' === item.value" :type="item.colorType">{{item.label}}
                            </el-tag> -->
                            <el-tag>{{fomatState(scope.row.category)}}
                            </el-tag>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="表单信息" align="center" prop="formType" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.formId" type="text" @click="handleFormDetail(scope.row)">
                            <span>{{ scope.row.formName }}</span>
                        </el-button>
                        <el-button v-else-if="scope.row.formCustomCreatePath" type="text"
                            @click="handleFormDetail(scope.row)">
                            <span>{{ scope.row.formCustomCreatePath }}</span>
                        </el-button>
                        <label v-else>暂无表单</label>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最新部署的流程定义" align="center">
                    <el-table-column label="流程版本" align="center" prop="processDefinition.version" width="80">
                        <template slot-scope="scope">
                            <el-tag size="medium" v-if="scope.row.processDefinition">
                                v{{ scope.row.processDefinition.version }}</el-tag>
                            <el-tag size="medium" type="warning" v-else>未部署</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="激活状态" align="center" prop="processDefinition.version" width="80">
					<template slot-scope="scope">
						<el-switch v-if="scope.row.processDefinition"
							v-model="scope.row.processDefinition.suspensionState" :active-value="1" :inactive-value="2"
							@change="handleChangeState(scope.row)" />
					</template>
				</el-table-column>
				<el-table-column label="部署时间" align="center" width="180">
					<template slot-scope="scope">
						<span
							v-if="scope.row.processDefinition">{{ parseTime(scope.row.processDefinition.deploymentTime) }}</span>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column label="操作" align="center" width="450" fixed="right">
				<template slot-scope="scope">
					<!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-if="!elements['bpm:model:update']">修改流程</el-button>
					<el-button size="mini" type="text" icon="el-icon-setting" @click="handleDesign(scope.row)"
						v-if="!elements['bpm:model:update']">设计流程</el-button> -->
					<el-button size="mini" type="text" icon="el-icon-s-custom" @click="handleAssignRule(scope.row)"
						v-if="!elements['bpm:task-assign-rule:query']">分配规则</el-button>
					<el-button size="mini" type="text" icon="el-icon-thumb" @click="handleDeploy(scope.row)"
						v-if="!elements['bpm:model:deploy']">发布流程</el-button>
					<el-button size="mini" type="text" icon="el-icon-ice-cream-round"
						v-if="!elements['bpm:process-definition:query']" @click="handleDefinitionList(scope.row)">流程定义
					</el-button>
					<!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
						v-if="!elements['bpm:model:delete']">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页组件 -->
		<!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
			@pagination="getList" /> -->

		<div class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page.sync="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
				align="right" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
        </div>

		<!-- 流程表单配置详情 -->
<!-- 		<el-dialog title="表单详情" :visible.sync="detailOpen" width="50%" append-to-body>
			<parser :key="new Date().getTime()" :form-conf="detailForm" />
		</el-dialog> -->
		
		<el-dialog title="表单详情" :visible.sync="detailOpen" width="1000px">
			<div class="test-form">
				<k-form-build :key="new Date().getTime()" ref="kfb" :value="jsonData" />
			</div>
		</el-dialog>

		<!-- 流程模型图的预览 -->
		<el-dialog title="流程图" :visible.sync="showBpmnOpen" width="80%" append-to-body>
			<my-process-viewer key="designer" v-model="bpmnXML" v-bind="bpmnControlForm" />
		</el-dialog>

		<!-- 对话框(添加 / 修改) -->
		<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="110px">
				<el-form-item label="流程标识" prop="key">
					<el-input v-model="form.key" placeholder="请输入流标标识" style="width: 330px;" :disabled="!!form.id" />
					<el-tooltip v-if="!form.id" class="item" effect="light" content="新建后，流程标识不可修改！" placement="top">
						<i style="padding-left: 5px;" class="el-icon-question" />
					</el-tooltip>
					<el-tooltip v-else class="item" effect="light" content="流程标识不可修改！" placement="top">
						<i style="padding-left: 5px;" class="el-icon-question" />
					</el-tooltip>
				</el-form-item>
				<el-form-item label="流程名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入流程名称" :disabled="!!form.id" clearable />
				</el-form-item>
				<el-form-item v-if="form.id" label="流程分类" prop="category">
					<el-select v-model="form.category" placeholder="请选择流程分类" clearable style="width: 100%">
						<el-option v-for="dict in categoryDictDatas" :key="dict.code" :label="dict.value"
							:value="dict.code" />
					</el-select>
				</el-form-item>
				<el-form-item label="流程描述" prop="description">
					<el-input type="textarea" v-model="form.description" clearable />
				</el-form-item>
				<div v-if="form.id">
					<el-form-item label="表单类型" prop="formType">
						<el-radio-group v-model="form.formType">
							<el-radio v-for="dict in modelFormTypeDictDatas" :key="parseInt(dict.value)"
								:label="parseInt(dict.value)">
								{{dict.label}}
							</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item v-if="form.formType === 10" label="流程表单" prop="formId">
						<el-select v-model="form.formId" clearable style="width: 100%">
							<el-option v-for="form in forms" :key="form.id" :label="form.name" :value="form.id" />
						</el-select>
					</el-form-item>
					<el-form-item v-if="form.formType === 20" label="表单提交路由" prop="formCustomCreatePath">
						<el-input v-model="form.formCustomCreatePath" placeholder="请输入表单提交路由" style="width: 330px;" />
						<el-tooltip class="item" effect="light"
							content="自定义表单的提交路径，使用 Vue 的路由地址，例如说：bpm/oa/leave/create" placement="top">
							<i style="padding-left: 5px;" class="el-icon-question" />
						</el-tooltip>
					</el-form-item>
					<el-form-item v-if="form.formType === 20" label="表单查看路由" prop="formCustomViewPath">
						<el-input v-model="form.formCustomViewPath" placeholder="请输入表单查看路由" style="width: 330px;" />
						<el-tooltip class="item" effect="light" content="自定义表单的查看路径，使用 Vue 的路由地址，例如说：bpm/oa/leave/view"
							placement="top">
							<i style="padding-left: 5px;" class="el-icon-question" />
						</el-tooltip>
					</el-form-item>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 用户导入对话框 -->
		<el-dialog title="导入流程" :visible.sync="upload.open" width="400px" append-to-body>
			<el-upload ref="upload" :limit="1" accept=".bpmn, .xml" :headers="upload.headers" :action="upload.url"
				:disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
				:auto-upload="false" name="bpmnFile" :data="upload.form" drag>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">
					将文件拖到此处，或
					<em>点击上传</em>
				</div>
				<div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“bpm”或“xml”格式文件！</div>
				<div class="el-upload__tip" slot="tip">
					<el-form ref="uploadForm" size="mini" label-width="90px" :model="upload.form" :rules="upload.rules"
						@submit.native.prevent>
						<el-form-item label="流程标识" prop="key">
							<el-input v-model="upload.form.key" placeholder="请输入流标标识" style="width: 250px;" />
							<el-tooltip class="item" effect="light" content="新建后，流程标识不可修改！" placement="top">
								<i style="padding-left: 5px;" class="el-icon-question" />
							</el-tooltip>
						</el-form-item>
						<el-form-item label="流程名称" prop="name">
							<el-input v-model="upload.form.name" placeholder="请输入流程名称" clearable />
						</el-form-item>
						<el-form-item label="流程描述" prop="description">
							<el-input type="textarea" v-model="upload.form.description" clearable />
						</el-form-item>
					</el-form>
				</div>
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitFileForm">确 定</el-button>
				<el-button @click="uploadClose">取 消</el-button>
			</div>
		</el-dialog>

		<!-- ========== 流程任务分配规则 ========== -->
		<taskAssignRuleDialog ref="taskAssignRuleDialog" />
	</div>
</template>

<script>
	import {
		deleteModel,
		deployModel,
		getModelPage,
		getModel,
		updateModelState,
		createModel,
		updateModel
	} from "@/api/bpm/model";
	// import {DICT_TYPE, getDictDatas} from "@/utils/dict";
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		getForm,
		getSimpleForms
	} from "@/api/bpm/form";
	import {
		decodeFields
	} from "@/utils/formGenerator";
	import Parser from '@/components/parser/Parser'
	import {
		getBaseHeader
	} from "@/utils/fetch";
	import taskAssignRuleDialog from "../taskAssignRule/taskAssignRuleDialog";
	import Treeselect from "@riophae/vue-treeselect";
	import "@riophae/vue-treeselect/dist/vue-treeselect.css";
	import {
		mapGetters
	} from 'vuex';

	export default {
		name: "model",
		components: {
			Parser,
			Treeselect,
			taskAssignRuleDialog
		},
		data() {
			return {
				// 遮罩层
				loading: true,
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 表格数据
				list: [],
				// 查询参数
				listQuery: {
					page: 1,
					limit: 10,
					category: undefined
				},

				// BPMN 数据
				showBpmnOpen: false,
				bpmnXML: null,
				bpmnControlForm: {
					prefix: "flowable"
				},

				// 流程表单详情
				detailOpen: false,
				detailForm: {
					fields: []
				},
				jsonData: {},
				// 流程表单
				title: "",
				open: false,
				form: {},
				// 表单校验
				rules: {
					key: [{
						required: true,
						message: "流程标识不能为空",
						trigger: "blur"
					}],
					name: [{
						required: true,
						message: "流程名称不能为空",
						trigger: "blur"
					}],
					formType: [{
						required: true,
						message: "流程名称不能为空",
						trigger: "blur"
					}],
					formId: [{
						required: true,
						message: "业务表单不能为空",
						trigger: "blur"
					}],
					category: [{
						required: true,
						message: "流程分类不能为空",
						trigger: "blur"
					}],
					formCustomCreatePath: [{
						required: true,
						message: "表单提交路由不能为空",
						trigger: "blur"
					}],
					formCustomViewPath: [{
						required: true,
						message: "表单查看路由不能为空",
						trigger: "blur"
					}],
				},

				// 流程导入参数
				upload: {
					// 是否显示弹出层（用户导入）
					open: false,
					// 是否禁用上传
					isUploading: false,
					// 设置上传的请求头部
					headers: getBaseHeader(),
					// 上传的地址
					url: "/api/bpm/model/import",
					// 表单
					form: {},
					// 校验规则
					rules: {
						key: [{
							required: true,
							message: "流程标识不能为空",
							trigger: "blur"
						}],
						name: [{
							required: true,
							message: "流程名称不能为空",
							trigger: "blur"
						}],
					},
				},
				// 流程表单的下拉框的数据
				forms: [],

				// 数据字典
				categoryDictDatas: [],
				// categoryDictDatas: [{}],
				modelFormTypeDictDatas: [{
						"value": "10",
						"label": "流程表单",
						"colorType": "",
						"cssClass": ""
					},
					{
						"value": "20",
						"label": "业务表单",
						"colorType": "",
						"cssClass": ""
					}
				],
				// taskAssignRuleDictDatas: getDictDatas(DICT_TYPE.BPM_TASK_ASSIGN_RULE_TYPE),
				baseDict: {
					type: 'categoryDictData'
				},
			};
		},

		computed: {
			...mapGetters([
				'elements'
			]),
			
			fomatState() {
				// 闭包
				return (val) => {
					// 获取到对应的类型
					switch (val) {
						case '1':
							return "默认"
							break;
						case '2':
							return "OA"
							break;
						case '3':
							return "廉政宣教流程"
							break;
						default:
							break;
					}
				}
			},
		},
		created() {
			// this.url = getToken
			this.getList();
			// 获得流程表单的下拉框的数据
			getSimpleForms().then(response => {
				this.forms = response.data
			})
		},
		mounted() {
			this.getDataDict();
		},
		methods: {
			// 获取流程分类
			getDataDict() {
				getByType(this.baseDict)
					.then(response => {
						if (response && response.code === 0) {
							this.categoryDictDatas = response.data ? response.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: '获取流程分类失败',
								type: 'success',
								duration: 2000
							});
						}
					});
			},
			/** 查询流程模型列表 */
			getList() {
				this.loading = true;
				getModelPage(this.listQuery).then(response => {
					this.list = response.data.list;
					this.total = response.data.totalCount;
					this.loading = false;
				});
			},
			/** 取消按钮 */
			cancel() {
				this.open = false;
				this.reset();
			},
			// 表单重置
			reset() {
				this.form = {
					id: undefined,
					key: undefined,
					name: undefined,
					description: undefined,
					category: undefined,
					formType: undefined,
					formId: undefined,
					formCustomCreatePath: undefined,
					formCustomViewPath: undefined
				};
				this.resetForm("form");
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.listQuery.page = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.dateRange = [];
				this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
				this.title = "新建模型";
				this.open = true;
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				this.title = "修改模型";
				this.open = true;
				// 设置 form
				this.$nextTick(() => {
					this.form = row;
				})
				// 触发一次校验
				// this.$refs["form"].validate();
			},
			/** 设计按钮操作 */
			handleDesign(row) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/modelDesign",
				// 		query: {
				// 			modelId: row.id
				// 		}
				// 	});
				// } else {
					this.$router.push({
						path: "/modelDesign",
						query: {
							modelId: row.id
						}
					});
				// }
			},
			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (!valid) {
						return;
					}
					// 更新
					if (this.form.id) {
						updateModel({
							...this.form,
							formId: this.form.formType === 10 ? this.form.formId : undefined,
							formCustomCreatePath: this.form.formType === 20 ? this.form
								.formCustomCreatePath : undefined,
							formCustomViewPath: this.form.formType === 20 ? this.form.formCustomViewPath :
								undefined,
						}).then(response => {
							this.$notify({
								title: '提示',
								message: '修改模型成功',
								type: 'success',
								duration: 2000
							});
							this.open = false;
							this.getList();
						});
						return;
					}
					// 创建
					createModel(this.form).then(response => {
						if (response && response.status === 200) {
							this.open = false;
							this.getList();
							this.$alert('<strong>新建模型成功！</strong>后续需要执行如下 4 个步骤：' +
								'<div>1. 点击【修改流程】按钮，配置流程的分类、表单信息</div>' +
								'<div>2. 点击【设计流程】按钮，绘制流程图</div>' +
								'<div>3. 点击【分配规则】按钮，设置每个用户任务的审批人</div>' +
								'<div>4. 点击【发布流程】按钮，完成流程的最终发布</div>' +
								'另外，每次流程修改后，都需要点击【发布流程】按钮，才能正式生效！！！',
								'重要提示', {
									dangerouslyUseHTMLString: true,
									type: 'success'
								});
						} else {
							this.$notify({
								title: '失败',
								message: response.msg,
								type: 'success',
								duration: 2000
							});
						}
					});
				});
			},
			/** 删除按钮操作 */
			handleDelete(row) {
				const that = this;
				this.$confirm('是否删除该流程！！').then(function() {
					deleteModel(row.id).then(response => {
						that.getList();
						that.$notify({
							title: '提示',
							message: '删除成功',
							type: 'success',
							duration: 2000
						});
					})
				}).catch(() => {});
			},
			/** 部署按钮操作 */
			handleDeploy(row) {
				const that = this;
				this.$confirm('是否部署该流程！！').then(function() {
					deployModel(row.id).then(response => {
						that.getList();
						that.$notify({
							title: '提示',
							message: '部署成功',
							type: 'success',
							duration: 2000
						});
					})
				}).catch(() => {});
			},
			/** 流程表单的详情按钮操作 */
			handleFormDetail(row) {
				// 流程表单
				if (row.formId) {
					getForm(row.formId).then(response => {
						// 设置值
						const data = response.data
						// this.detailForm = {
						// 	...JSON.parse(data.conf),
						// 	fields: decodeFields(data.fields)
						// }
						this.jsonData = {
							config: undefined,
							list: []
						}
						this.jsonData.config = JSON.parse(data.conf);
						data.fields.forEach(item => {
							this.jsonData.list.push(JSON.parse(item));
						})
						// 弹窗打开
						this.detailOpen = true
					})
					// 业务表单
				} else if (row.formCustomCreatePath) {
					this.$router.push({
						path: row.formCustomCreatePath
					});
				}
			},
			/** 流程图的详情按钮操作 */
			handleBpmnDetail(row) {
				getModel(row.id).then(response => {
					this.bpmnXML = response.data.bpmnXml
					// 弹窗打开
					this.showBpmnOpen = true
				})
			},
			/** 跳转流程定义的列表 */
			handleDefinitionList(row) {
				// if(this.$store.state.user.isBackstage) {
				// 	this.$router.push({
				// 		path: "/backstage/manager/definition",
				// 		query: {
				// 			key: row.key
				// 		}
				// 	});
				// } else {
					this.$router.push({
						path: "/manager/definition",
						query: {
							key: row.key
						}
					});
				// }
			},
			/** 更新状态操作 */
			handleChangeState(row) {
				const id = row.id;
				let state = row.processDefinition.suspensionState;
				let statusState = state === 1 ? '激活' : '挂起';
				this.$confirm('是否确认' + statusState + '流程名字为"' + row.name + '"的数据项?').then(function() {
					return updateModelState(id, state);
				}).then(() => {
					this.getList();
					this.$notify({
						title: '提示',
						message: statusState + "成功",
						type: 'success',
						duration: 2000
					});
				}).catch(() => {});
			},
			/** 导入按钮操作 */
			handleImport() {
				this.upload.open = true;
			},
			// 文件上传中处理
			handleFileUploadProgress(event, file, fileList) {
				this.upload.isUploading = true;
			},
			// 文件上传成功处理
			handleFileSuccess(response, file, fileList) {
				if (response.code !== 0) {
					this.$message.error(response.msg)
					return;
				}
				// 重置表单
				this.uploadClose();
				// 提示，并刷新
				this.$notify({
					title: '提示',
					message: "导入流程成功！请点击【设计流程】按钮，进行编辑保存后，才可以进行【发布流程】",
					type: 'success',
					duration: 2000
				});
				this.getList();
			},
			uploadClose() {
				// 关闭弹窗
				this.upload.open = false;
				// 重置上传状态和文件
				this.upload.isUploading = false;
				this.$refs.upload.clearFiles();
				// 重置表单
				this.upload.form = {};
				this.resetForm("uploadForm");
			},
			/** 提交上传文件 */
			submitFileForm() {
				this.$refs["uploadForm"].validate(valid => {
					if (!valid) {
						return;
					}
					this.$refs.upload.submit();
				})
			},
			/** 处理任务分配规则列表的按钮操作 */
			handleAssignRule(row) {
				this.$refs['taskAssignRuleDialog'].initModel(row.id);
			},
			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getList();
			},
			resetForm(formName) {
				this.$nextTick(() => {
					this.$refs[formName].resetFields();
				})
			}
		}
	};
</script>

<style lang="scss">
	.my-process-designer {
		height: calc(100vh - 200px);
	}
</style>
