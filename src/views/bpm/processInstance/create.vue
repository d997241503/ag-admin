<template>
	<div class="app-container">
		<!-- 第一步，通过流程定义的列表，选择对应的流程 -->
		<div v-if="!selectProcessInstance">
			<el-table v-loading="loading" :data="list">
				<el-table-column label="流程名称" align="center" prop="name" width="200">
					<template slot-scope="scope">
						<el-button type="text" @click="handleBpmnDetail(scope.row)">
							<span>{{ scope.row.name }}</span>
						</el-button>
					</template>
				</el-table-column>
				<el-table-column label="流程分类" align="center" prop="category" width="100">
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
				<el-table-column label="流程版本" align="center" prop="processDefinition.version" width="80">
					<template slot-scope="scope">
						<el-tag size="medium" v-if="scope.row">v{{ scope.row.version }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="流程描述" align="center" prop="description" width="300" show-overflow-tooltip />
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="text" size="small" icon="el-icon-plus" @click="handleSelect(scope.row)">选择
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 第二步，填写表单，进行流程的提交 -->
		<div v-else>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span class="el-icon-document">申请信息【{{ selectProcessInstance.name }}】</span>
					<el-button style="float: right;" type="primary" @click="selectProcessInstance = undefined">选择其它流程
					</el-button>
				</div>
				<el-col :span="16" :offset="6">
					<div>
						<!-- <parser :key="new Date().getTime()" :form-conf="detailForm" @submit="submitForm" /> -->
						<k-form-build :key="new Date().getTime()" ref="kfb" :disabled="disabled" :value="jsonData" />
						<div v-if="formBtns" style="text-align: right;margin-bottom: 30px;">
							<el-button @click="submitForm_()" type="primary" style="width: 120px;" :disabled="disabled"
								:loading="subLoding">提交</el-button>
						</div>
					</div>
				</el-col>
			</el-card>
			<el-card class="box-card">
				<div slot="header" class="clearfix">
					<span class="el-icon-picture-outline">流程图</span>
				</div>
				<my-process-viewer key="designer" v-model="bpmnXML" v-bind="bpmnControlForm" />
			</el-card>
		</div>

	</div>
</template>

<script>
	import {
		getProcessDefinitionBpmnXML,
		getProcessDefinitionList
	} from "@/api/bpm/definition";
	import {
		DICT_TYPE,
		getDictDatas
	} from "@/utils/dict";
	import {
		decodeFields
	} from "@/utils/formGenerator";
	import Parser from '@/components/parser/Parser'
	import {
		createProcessInstance
	} from "@/api/bpm/processInstance";

	// 流程实例的发起
	export default {
		name: "ProcessInstanceCreate",
		components: {
			Parser
		},
		data() {
			return {
				// 遮罩层
				loading: true,
				// 表格数据
				list: [],

				// 流程表单详情
				detailForm: {
					fields: []
				},
				jsonData: {},
				disabled: false,
				subLoding: false,
				formBtns: true,
				// BPMN 数据
				bpmnXML: null,
				bpmnControlForm: {
					prefix: "flowable"
				},

				// 流程表单
				selectProcessInstance: undefined, // 选择的流程实例

				// 数据字典
				categoryDictDatas: [{
					"value": "1",
					"label": "默认",
					"colorType": "primary",
					"cssClass": ""
				}, {
					"value": "2",
					"label": "OA",
					"colorType": "success",
					"cssClass": ""
				}]
			};
		},
		computed: {
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
			this.getList();
		},
		methods: {
			/** 查询流程定义列表 */
			getList() {
				this.loading = true;
				getProcessDefinitionList({
					suspensionState: 1
				}).then(response => {
					this.list = response.data
					this.loading = false
				});
			},
			/** 处理选择流程的按钮操作 **/
			handleSelect(row) {
				// 设置选择的流程
				this.selectProcessInstance = row;
				// 流程表单
				if (row.formId) {
					// 设置对应的表单
					// this.detailForm = {
					//   ...JSON.parse(row.formConf),
					//   fields: decodeFields(row.formFields)
					// }
					this.jsonData = {
						config: undefined,
						list: []
					}
					this.jsonData.config = JSON.parse(row.formConf);
					row.formFields.forEach(item => {
						this.jsonData.list.push(JSON.parse(item));
					})

					// 加载流程图
					getProcessDefinitionBpmnXML(row.id).then(response => {
						this.bpmnXML = response.data
					})
				} else if (row.formCustomCreatePath) {
					// if(this.$store.state.user.isBackstage) {
					// 	this.$router.push({
					// 		path: '/backstage' + row.formCustomCreatePath,
					// 		query: {
					// 			operation: 'process',
					// 			selectProcessInstanceId: this.selectProcessInstance.id
					// 		}
					// 	});
					// } else {
						this.$router.push({
							path: row.formCustomCreatePath,
							query: {
								operation: 'process',
								selectProcessInstanceId: this.selectProcessInstance.id
							}
						});
					// }
					// 这里暂时无需加载流程图，因为跳出到另外个 Tab；
				}
			},
			/** 提交按钮 */
			submitForm_() {
				// 使用getData函数获取数据
				this.$refs.kfb.getData().then(values => {
					this.subLoding = true;
					createProcessInstance({
						processDefinitionId: this.selectProcessInstance.id,
						variables: values
					}).then(response => {
						this.$notify({
							title: '提示',
							message: '发起流程成功',
							type: 'success',
							duration: 2000
						});
						// 关闭当前窗口
						this.$router.go(-1);
					}).catch(() => {
						this.disabled = false; // 表单开启
						this.formBtns = true; // 按钮展示
						this.subLoding = false;
					})
				}).catch(() => {
					this.disabled = false; // 表单开启
					this.formBtns = true; // 按钮展示
					this.subLoding = false;
				})
			},
			submitForm(params) {
				if (!params) {
					return;
				}
				// 设置表单禁用
				const conf = params.conf;
				conf.disabled = true; // 表单禁用
				conf.formBtns = false; // 按钮隐藏

				// 提交表单，创建流程
				const variables = params.values;
				createProcessInstance({
					processDefinitionId: this.selectProcessInstance.id,
					variables: variables
				}).then(response => {
					this.$notify({
						title: '提示',
						message: '发起流程成功',
						type: 'success',
						duration: 2000
					});
					// 关闭当前窗口
					this.$router.go(-1);
				}).catch(() => {
					conf.disabled = false; // 表单开启
					conf.formBtns = true; // 按钮展示
				})
			},
		}
	};
</script>

<style lang="scss">
	.my-process-designer {
		height: calc(100vh - 200px);
	}

	.box-card {
		width: 100%;
		margin-bottom: 20px;
	}
</style>
