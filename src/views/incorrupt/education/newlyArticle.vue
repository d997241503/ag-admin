<template>
	<div class="tier-page content">
		<!-- <div @click="goBack()" class="go-back-img">
			<img src="~@/assets/img/go_back.png" alt="返回"></img>
		</div> -->
		<div class="page-title">新增</div>
		<el-divider></el-divider>
		<el-form :model="form" :rules="rules" ref="form" size="mini" style="font-size: 15px;" label-position="left"
		 label-width="100px">
			<el-row>
				<el-col :span="12" :offset="6">
					<el-form-item label="名称：" prop="educationName">
						<el-input class="form-item" v-model="form.educationName" maxlength="50" show-word-limit placeholder="请输入名称"
						 clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-row>
				<el-col :span="12" :offset="6">
					<el-form-item label="媒体级别：" prop="educationRank">
						<el-radio-group class="form-item" v-model="form.educationRank">
							<el-radio style="line-height: 25px;" :label="item.code" :key="item.code" v-for="(item,index) in educationRanks">{{item.value}}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row> -->
			<el-row>
				<el-col :span="12" :offset="6">
					<el-form-item label="所属分类：" prop="categoryName">
						<el-select class="form-item" v-model="form.categoryName" @change="editCategoryChange" placeholder="请选择分类">
							<el-option v-for="item in editCategories" :key="item.categoryId" :label="item.name" :value="{value:item.categoryId,label:item.name}">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.flag === '0'">
				<el-col :span="12" :offset="6">
					<el-form-item label="关联学院：" prop="deptId">
						<el-input class="form-item" v-model="form.deptName" placeholder="点击右侧按钮选择学院" readonly>
							<el-popover v-model="treeVisible" slot="append" placement="right-start" trigger="click">
								<el-tree :data="depts" :props="defaultProps" node-key="id" @node-click="handlePartyBranch" class="roll-containers">
									<span class="custom-tree-node" slot-scope="{ node, data }">
										<span v-bind:class="{'el-icon-user-solid': !node.isLeaf, 'el-icon-user': node.level > 1}">&nbsp;{{ node.label }}&nbsp;&nbsp;</span>
									</span>
								</el-tree>
								<el-button slot="reference" icon="el-icon-thumb">选择</el-button>
							</el-popover>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<!-- <el-row>
				<el-col :span="12" :offset="6">
					<el-form-item label="展示位置：" prop="sort">
						<el-input class="form-item" v-model="form.sort" :maxlength="5" @input="e => form.sort = validForbid(e)"
						 placeholder="请输入展示位置"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label-width="10px">
						<div class="form-text">* 每页展示15篇文章</div>
					</el-form-item>
				</el-col>
			</el-row> -->
			<el-row>
				<el-col :span="12" :offset="6">
					<el-form-item label="类型：" prop="educationType">
						<el-select class="form-item" v-model="form.educationType" @change="educationTypeChange" placeholder="请选择类型">
							<el-option v-for="item in educationTypes" :key="item.code" :label="item.value" :value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.educationType == '0'">
				<el-col :span="12" :offset="6">
					<el-form-item label="内容：" prop="textRules">
						<Tinymce ref="editor" v-model="form.textRules"></Tinymce>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.educationType == '1'">
				<el-col :span="12" :offset="6">
					<el-form-item label="图片文件：">
						<el-upload class="upload-demo" :action="url" :before-upload="beforeUploadHandle" :on-success="successHandle"
						 multiple :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="fileExceed" :file-list="fileList"
						 :limit="9">
							<el-button size="small">+上传图片</el-button>
							<div slot="tip" class="el-upload__tip">
								<p> 温馨提示：仅支持jpeg/jpg/png格式，且上传图片不能超过10M</p>
							</div>
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.educationType == '2'">
				<el-col :span="12" :offset="6">
					<el-form-item label="视频文件：">
						<el-upload class="upload-demo" :action="url" :before-upload="beforeUploadHandle" :on-success="successHandle"
						 :multiple="false" :on-remove="handleRemove" :before-remove="beforeRemove" :on-exceed="fileExceed" :file-list="fileList"
						 :limit="1">
							<el-button size="small">+上传视频</el-button>
							<div slot="tip" class="el-upload__tip">
								<p> 温馨提示：仅支持MP3/MP4/warm等格式，且上传视频不能超过500M</p>
							</div>
						</el-upload>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row v-if="form.educationType == '3'">
				<el-col :span="12" :offset="6">
					<el-form-item label="链接地址：" prop="linkUrl">
						<el-input class="form-item" v-model="form.linkUrl" placeholder="请输入链接地址" clearable></el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer" align="center" style="margin-top: 15px;">
			<el-button @click="goBack()">返 回</el-button>
			<el-button type="primary" @click="create('form')" :loading="loading">确 定</el-button>
		</div>
	</div>
</template>

<script>
	import {
		editCategoryList,
		addObj,
		getDepts
	} from 'api/incorrupt/education/index';
	import {
		getToken
	} from 'utils/auth';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		validateURL
	} from '@/utils/validate';
	import Tinymce from 'components/Tinymce';
	import {
		createProcessInstance
	} from "@/api/bpm/processInstance";
	export default {
		data() {
			var validateEmpty = (rule, value, callback) => {
				if (value == null || !value.trim()) {
					callback(new Error('请输入有效信息'))
				} else {
					callback()
				}
			};
			var validateUrl = (rule, value, callback) => {
				if (!validateURL(value)) {
					callback(new Error('链接地址格式错误'))
				} else {
					callback()
				}
			};
			return {
				loading: false,
				form: {
					categoryId: undefined,
					categoryName: undefined,
					educationName: undefined,
					educationRank: undefined,
					educationType: '0',
					deptId: undefined,
					deptName: undefined,
					sort:1,
					flag: undefined,
					textRules: undefined,
					linkUrl: undefined,
					files: []
				},
				rules: {
					educationName: [{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						},
						{
							validator: validateEmpty,
							trigger: 'blur'
						}
					],
					textRules: {
						required: true,
						message: '请输入文字条例',
						trigger: 'blur'
					},
					linkUrl: [{
							required: true,
							message: '请输入链接地址',
							trigger: 'blur'
						},
						{
							validator: validateUrl,
							trigger: 'blur'
						}
					],
					educationType: {
						required: true,
						message: '请选择类型',
						trigger: 'change'
					},
					categoryName: {
						required: true,
						message: '请选择所属分类',
						trigger: 'change'
					},
					// sort: {
					// 	required: true,
					// 	message: '请输入展示顺序',
					// 	trigger: 'blur'
					// },
					educationRank: {
						required: true,
						message: '请选择媒体级别',
						trigger: 'change'
					},
					deptId: {
						required: true,
						message: '请选择关联学院',
						trigger: 'change'
					}
				},
				educationTypes: [{ // 类型
					value: '文字条例',
					code: '0'
				}, {
					value: '图片图解',
					code: '1'
				}, {
					value: '音视频',
					code: '2'
				}, {
					value: '外部链接',
					code: '3'
				}],
				educationRanks: [],
				// 文件上传
				url: '',
				num: 0,
				successNum: 0,
				fileList: [],
				depts: [],
				editCategories: [],
				treeVisible: false,
				defaultProps: {
					children: 'children',
					label: 'departmentName'
				},
				operation: '',
				selectProcessInstanceId: undefined
			}
		},

		components: {
			Tinymce
		},

		created() {
			this.operation = this.$route.query.operation;
			this.selectProcessInstanceId = this.$route.query.selectProcessInstanceId;
			this.defaultProps.label = this.deptFields;
			// if (this.category == undefined) this.goBack();
			// 上传文件地址
			// this.url = `/api/upload/uploads/uploadEducationFile?token=${getToken()}`;
			this.url = `/api/upload/uploads/uploadFile?token=${getToken()}&bucketName=education`;
			// 获取媒体级别
			this.getDataDicts("mediaLevel").then((res) => {
				this.educationRanks = res;
			});
			// 获取编辑类类别
			this.getEditCategoryList();
			// 获取学院
			this.getDeptss();
		},

		mounted() {
			this.$nextTick(() => {
				this.resetTemp();
			})
		},
		computed: {
			...mapGetters([
				'category','deptFields'
			]),
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},

			//限制输入非数字
			validForbid(value) {
				value = value.replace(/[^\d]/g,"");
				return value;
			},

			// 分类监听
			editCategoryChange(data) {
				if (data.value) {
					this.form.categoryName = data.label;
					this.form.categoryId = data.value;
					let ary = [];
					ary = this.editCategories.filter(item => {
						return item.categoryId === data.value
					})
					this.form.flag = ary.length ? ary[0].flag : undefined;
				} else {
					this.form.flag = undefined;
				}
			},

			// 类型监听
			educationTypeChange(val) {
				if (val) {
					// 清除不同类型表单验证
					this.$refs.form.clearValidate('files');
					this.$refs.form.clearValidate('linkUrl');
					this.$refs.form.clearValidate('textRules');
					// 清除文字条例，链接
					this.form.textRules = undefined;
					this.form.linkUrl = undefined;
					// 清除文件信息
					this.form.files = [];
					this.fileList = [];
				}
			},

			// 获取学院信息
			getDeptss() {
				getDepts()
					.then(res => {
						if (res && res.code === 0) {
							this.depts = res.data ? res.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: "获取学院信息失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			},

			// 获取编辑类类别
			getEditCategoryList() {
				editCategoryList().then(res => {
					if (res && res.code === 0) {
						this.editCategories = res.data ? res.data : [];
					} else {
						this.$notify({
							title: '失败',
							message: '获取编辑类类别失败',
							type: 'error',
							duration: 2000
						});
					}
				});
			},

			// 选择学院
			handlePartyBranch(data) {
				this.form.deptId = data.id;
				this.form.deptName = data.departmentFullName;
				this.treeVisible = false;
			},

			// 排序监听
			sortChange(currentValue, oldValue) {
				if (currentValue === undefined) {
					this.$nextTick(() => {
						this.form.sort = oldValue;
					});
				}
			},

			// 获取字典
			getDataDicts(type) {
				if (!type) return;
				let val = null
				val = getByType({
						type: type
					})
					.then(res => {
						if (res && res.code === 0) {
							return res.data;
						} else {
							this.$notify({
								title: '失败',
								message: '获取数据字典失败',
								type: 'success',
								duration: 2000
							});
						}
					});
				return Promise.resolve(val);
			},

			// 创建前数据筛选
			filterData() {
				let val = {
					value: ""
				}
				this.form.sort = parseInt(this.form.sort);
				switch (this.form.educationType) {
					case '0':
						val.value = this.form.textRules;
						this.form.files.push(val);
						break;
					case '1':
					case '2':
						this.fileList.forEach(item => {
							var temp = {
								value: ""
							}
							temp.value = item.response.fileUrl;
							this.form.files.push(temp);
						});
						break;
					case '3':
						val.value = this.form.linkUrl;
						this.form.files.push(val);
						break;
					default:
						break;
				}
			},

			// 创建一级类别
			create(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						if ((this.form.educationType == '1' || this.form.educationType == '2') && !this.fileList.length) {
							this.$notify({
								title: '失败',
								message: '您还没有上传文件',
								type: 'error',
								duration: 2000
							});
							return;
						}
						this.filterData();
						this.loading = true;
						if(this.operation == 'process') {
							createProcessInstance({
								processDefinitionId: this.selectProcessInstanceId,
								variables: this.form
							}).then(response => {
								this.$notify({
									title: '提示',
									message: '操作成功',
									type: 'success',
									duration: 2000
								});
								this.loading = false;
								// 关闭当前窗口
								this.$router.go(-1);
							}).catch(() => {
								this.loading = false;
							})
						} else {
							addObj(this.form)
								.then((res) => {
									if (res && res.code === 0) {
										this.$notify({
											title: '成功',
											message: '操作成功',
											type: 'success',
											duration: 2000
										});
										this.resetTemp();
										set['editor'].clearContent();
										setTimeout(() => {
											this.loading = false;
											// 关闭当前窗口
											this.$router.go(-1);
										}, 2000)
									} else {
										this.$notify({
											title: '失败',
											message: res.msg,
											type: 'error',
											duration: 2000
										});
										this.loading = false;
									}
								}).catch(() => {
									this.loading = false;
								})
						}
					} else {
						return false;
					}
				});
			},

			// 重置数据
			resetTemp() {
				this.fileList = [];
				this.$refs.form.resetFields();
				this.form = {
					categoryId: undefined,
					categoryName: undefined,
					educationName: undefined,
					educationRank: undefined,
					educationType: '0',
					deptId: undefined,
					deptName: undefined,
					sort:1,
					flag: undefined,
					textRules: undefined,
					linkUrl: undefined,
					files: []
				};
			},

			// 上传之前
			beforeUploadHandle(file) {
				if (this.form.educationType == '0' && file.size / 1024 / 1024 > 10) {
					this.$message.error('不支持10M以上的文件');
					return false;
				}
				if (this.form.educationType == '2' && file.size / 1024 / 1024 > 500) {
					this.$message.error('不支持500M以上的文件');
					return false;
				}
				let index = file.name.lastIndexOf('.');
				let type = file.name.substring(index + 1, file.name.length);
				if (this.form.educationType == '0' && file.type === 'application/x-msdownload' || type === 'bat') {
					this.$message.error('图片格式错误');
					return false;
				}
				if (this.form.educationType == '2' && file.type === 'application/x-msdownload' || type === 'bat') {
					this.$message.error('视频格式错误');
					return false;
				}
				this.num++;
			},

			// 删除文件
			handleRemove(file, fileList) {
				if (!fileList.length) return;
				this.fileList.splice(this.fileList.indexOf(file), 1);
			},

			// 删除之前
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},

			// 超出最大值
			fileExceed(file, fileList) {
				var limit = 9;
				if (this.form.educationType == '2') limit = 1;
				this.$message({
					message: '最大允许上传文件数量为' + limit + '个',
					type: 'error',
					duration: 1500,
				});
			},

			// 上传成功
			successHandle(response, file, fileList) {
				this.fileList = fileList;
				this.successNum++;
				if (response && response.code === 0) {
					if (this.num === this.successNum) {
						this.$message({
							message: '上传成功',
							type: 'success',
							duration: 1500,
						})
					}
				} else {
					this.$message.error(response.msg);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		.page-title {
			width: 180px;
			height: 30px;
			margin: 0 auto;
			margin-bottom: -24px;
			line-height: 30px;
			background-color: #bc0000;
			color: #FFFFFF;
			font-size: 15px;
			text-align: center;
			border-radius: 5px;
		}

		.form-item {
			width: 100%;
			margin-bottom: 10px;
		}

		.form-text {
			color: #555555;
			text-align: left;
			word-wrap: break-word;
			word-break: normal;
		}
	}
</style>
