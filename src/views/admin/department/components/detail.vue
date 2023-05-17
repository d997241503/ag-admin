<template>
	<div>
		<el-form :model="form" ref="form" label-width="100px">
			<div style="font-size: 18px;font-weight: 600;border-left: 5px solid #bc0000;padding-left: 20px;">
				基本信息
			</div>
			<el-divider></el-divider>
			<el-row>
				<el-form-item label="上级部门">
					<el-input v-model="form.parentName" readonly>
					</el-input>
				</el-form-item>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="部门名称">
						<el-input v-model="form.departmentName" readonly></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="部门编码">
						<el-input v-model="form.departmentCode" readonly></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="部门全称">
						<el-input v-model="form.departmentFullName" readonly></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="部门属性">
						<el-select v-model="form.departmentAttribute" placeholder="请选择" readonly style="width: 100%;">
							<el-option v-for="item in departments" :key="item.code" :label="item.value"
								:value="item.code">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<div class="select-form">
				<!-- 联系信息 -->
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="部门负责人" name="first">
						<el-row v-if="baseDepartmentManager_btn_adduserfirst">
							<el-col :span="11">
								<el-form label-width="150px">
									<el-form-item label="部门负责人：" prop="userFirst" class="box-form">
										<!-- <el-select v-model="userFirst" value-key="userId" filterable placeholder="请选择" style="width: 100%;" @change="userChange" clearable>
											<el-option v-for="item in userDataList" :key="item.userId" :label="item.name" :value="item"> </el-option>
										</el-select> -->
										<el-button @click="personnelFistHandle('部门负责人')" type="text"
											class="but-css">
											选择人员
											<span v-if="!userFirstForm.user.name">(未选择)</span>
											<span v-else>(已选择{{userFirstForm.user.name ? userFirstForm.user.name : ''}})</span>
										</el-button>
										<el-select class="form-item-content input-item input-select elinput" v-model="userFirstForm.user.userId" @focus="closeIt" ref="selectIt"
											placeholder="">
										</el-select>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="11" :offset="1">
									<el-button type="primary" @click="create" :loading="loading">
										确 定
									</el-button>
							</el-col>
						</el-row>
					</el-tab-pane>
					<!-- <el-tab-pane label="两个责任落实用户" name="second">
						<el-row v-if="baseDepartmentManager_btn_adduserimplement">
							<el-col :span="11">
								<el-form label-width="150px">
									<el-form-item label="两个责任落实用户：" prop="userFirst">
										<el-select v-model="userFirst" value-key="userId" filterable placeholder="请选择" style="width: 100%;" @change="userChange" clearable>
											<el-option v-for="item in userDataList" :key="item.userId" :label="item.name" :value="item"> </el-option>
										</el-select>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="11" :offset="1">
									<el-button type="primary" @click="create">
										确 定
									</el-button>
							</el-col>
						</el-row>
					</el-tab-pane> -->
                    <!-- <el-tab-pane label="专项监督提报负责人" name="third">
						<el-row v-if="baseDepartmentManager_btn_addsupervise">
							<el-col :span="11">
								<el-form label-width="160px">
									<el-form-item label="专项监督提报负责人：" prop="userFirst">
										<el-select v-model="userFirst" value-key="userId" filterable placeholder="请选择" style="width: 100%;" @change="userChange" clearable>
											<el-option v-for="item in userDataList" :key="item.userId" :label="item.name" :value="item"> </el-option>
										</el-select>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="11" :offset="1">
									<el-button type="primary" @click="create">
										确 定
									</el-button>
							</el-col>
						</el-row>
					</el-tab-pane> -->
					<el-tab-pane label="联络员" name="fourth">
						<el-row v-if="baseDepartmentManager_btn_addliaison">
							<el-col :span="11">
								<el-form label-width="150px">
									<el-form-item label="联络员：" prop="userFirst" class="box-form">
										<!-- <el-select v-model="userFirst" value-key="userId" filterable placeholder="请选择" style="width: 100%;" @change="userChange" clearable>
											<el-option v-for="item in userDataList" :key="item.userId" :label="item.name" :value="item"> </el-option>
										</el-select> -->
										<el-button @click="personnelFistHandle('联络员')" type="text"
											class="but-css">
											选择人员
											<span v-if="!userFirstForm.user.name">(未选择)</span>
											<span v-else>(已选择{{userFirstForm.user.name ? userFirstForm.user.name : ''}})</span>
										</el-button>
										<el-select class="form-item-content input-item input-select elinput" v-model="userFirstForm.user.userId" @focus="closeIt1" ref="selectIt1"
											placeholder="">
										</el-select>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="11" :offset="1">
									<el-button type="primary" @click="create" :loading="loading">
										确 定
									</el-button>
							</el-col>
						</el-row>
					</el-tab-pane>
					<!-- <el-tab-pane label="纪检委员" name="fifth">
						<el-row>
							<el-col :span="11">
								<el-form label-width="150px">
									<el-form-item label="纪检委员：" prop="userFirst">
										<el-select v-model="userFirst" value-key="userId" filterable placeholder="请选择" style="width: 100%;" @change="userChange" clearable>
											<el-option v-for="item in userDataList" :key="item.userId" :label="item.name" :value="item"> </el-option>
										</el-select>
									</el-form-item>
								</el-form>
							</el-col>
							<el-col :span="11" :offset="1">
									<el-button type="primary" @click="create">
										确 定
									</el-button>
							</el-col>
						</el-row>
					</el-tab-pane> -->
				</el-tabs>
				<!-- <el-row>
					<el-col :span="11">
						<el-form label-width="150px">
							<el-form-item :label="activeName == 'first' ? '部门负责人：' : '两个责任落实用户：'" prop="userFirst">
								<el-select v-model="userFirst" value-key="userId" placeholder="请选择" style="width: 100%;" @change="userChange">
									<el-option v-for="item in userDataList" :key="item.userId" :label="item.name" :value="item"> </el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</el-col>
					<el-col :span="11" :offset="1">
							<el-button type="primary" @click="create">
								确 定
							</el-button>
					</el-col>
				</el-row> -->
				<div>
					<el-table :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
						<el-table-column header-align="center" align="center" label="序号" width="50px" type="index" />
						<el-table-column min-width="200" align="center" label="用户姓名">
							<template slot-scope="scope">
								<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.name}}</div>
							</template>
						</el-table-column>
						<el-table-column min-width="200" align="center" label="用户名">
							<template slot-scope="scope">
								<div style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.username}}</div>
							</template>
						</el-table-column>
						<el-table-column fixed="right" header-align="center" align="center" width="120" label="操作">
							<template slot-scope="scope">
								<el-button type="text" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
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
			</div>
			<!-- <el-divider></el-divider>
			<el-row>
				<el-col :span="11">
					<el-form-item label="部门电话">
						<el-input v-model="form.departmentPhone" readonly></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="邮政编码">
						<el-input v-model="form.postalCode" readonly></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="传真">
						<el-input v-model="form.fax" readonly></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="联系人姓名">
						<el-input v-model="form.contactsName" readonly></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="11" :offset="2">
					<el-form-item label="联系人电话">
						<el-input v-model="form.contactsPhone" readonly></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-form-item label="备注说明">
					<el-input v-model="form.remarks" type="textarea" resize="none" readonly></el-input>
				</el-form-item>
			</el-row> -->
		</el-form>
		<div slot="footer" class="dialog-footer" align="right">
			<el-button type="primary" @click="cancel()">返 回</el-button>
		</div>
		<!-- 弹窗 选择人员 -->
        <fuhsiSelectPersonnel v-if="personnelFistVisible" :defaultChecked.sync="checkedData" :choiceSingle="true" ref="personnelFist" title="人员">
        </fuhsiSelectPersonnel>
	</div>
</template>

<script>
	import fuhsiSelectPersonnel from '@/components/fuhsi-select-personnel'
	import {
		getObj,
		getUser,
		addDepartmentleaderObj,
		getDepartmentleaderObj,
		delDepartmentleaderObj
	} from 'api/admin/department/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	export default {
		components: { fuhsiSelectPersonnel },
		data() {
			return {
				userFirstFormVisible: true,
				form: {
					id: undefined
				},
				baseDict: {
					type: 'department'
				},
				departments: [{}],
				isiframe: false,
				userFirstForm: {
					leaderType: '',
					user: {
						id: undefined,
						name: '',
						userId: undefined,
						username: ''
					}
				},
				leaderType: '',
				userDataList: [],
				userFirst: [],
				activeName: 'first',
				list: [],
				total: null,
				listLoading: false,
				listQuery: {
					page: 1,
					limit: 10,
					deptId: undefined,
					leaderType: ''
				},
				baseDepartmentManager_btn_adduserfirst: false,
				baseDepartmentManager_btn_addliaison: false,
				personnelFistVisible:false,
                checkedData:[],
				loading: false,
			}
		},
		watch : {
			checkedData: {
				handler(newVal, oldVal) {
					if(newVal.label == '部门负责人') {
						this.userFirstForm.user.userId = newVal.resultList[0].userId;
						this.userFirstForm.user.name = newVal.resultList[0].name;
                        //  this.$set(this.sFormData,'checkerUserId',newVal.resultList[0].userId)
                         this.$forceUpdate()
                    }
					if(newVal.label == '联络员') {
						this.userFirstForm.user.userId = newVal.resultList[0].userId;
						this.userFirstForm.user.name = newVal.resultList[0].name;
                        //  this.$set(this.sFormData,'checkerUserId',newVal.resultList[0].userId)
                         this.$forceUpdate()
                    }
                    // this.$refs['dialogFormRef'].clearValidate()
				},
				immediate: true
			},
		},
		created() {
			this.baseDepartmentManager_btn_adduserfirst = this.elements['baseDepartmentManager:btn_adduserfirst'];
			this.baseDepartmentManager_btn_addliaison = this.elements['baseDepartmentManager:btn_addliaison'];
		},
		computed: {
			...mapGetters([
				'elements'
			])
		},
		mounted() {
			this.getDataDict();
		},
		methods: {
			// 隐藏下拉框
			closeIt() {
				this.$refs.selectIt.blur();
			},
            closeIt1() {
				this.$refs.selectIt1.blur();
            },
			// 批量选择人员
            personnelFistHandle(label) {
                this.personnelFistVisible = true;
                this.$nextTick(() => {
                    this.$refs.personnelFist.label = label;
                    if(label == '部门负责人' && this.userFirstForm.user.userId && this.userFirstForm.user.name) this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify([{
                        userId: this.userFirstForm.user.userId,
                        name: this.userFirstForm.user.name ? this.userFirstForm.user.name : ''
                    }]));
					if(label == '联络员' && this.userFirstForm.user.userId && this.userFirstForm.user.name) this.$refs.personnelFist.resultList = JSON.parse(JSON.stringify([{
                        userId: this.userFirstForm.user.userId,
                        name: this.userFirstForm.user.name ? this.userFirstForm.user.name : ''
                    }]));
                    this.$refs.personnelFist.init();
                })
            },
			load() {
				activateTheme("light");
			},
			activateTheme(theme) {
			    var iframe = document.getElementById("ifm");
			    if (iframe && iframe.contentWindow) {
			        // iframe.contentWindow.postMessage(theme, "*");
			    }
			},
			init(val) {
				this.userDataList = [];
				this.form.id = val.id || 0;
				this.listQuery.deptId = val.id || 0;
				this.getDataDetail();
				this.getInfo();
				this.getDepartmentleaderInfo();
			},

			// 获取部门属性
			getDataDict() {
				getByType(this.baseDict)
					.then(response => {
						if (response && response.code === 0) {
							this.departments = response.data ? response.data : [];
						} else {
							this.$notify({
								title: '失败',
								message: '获取部门属性失败',
								type: 'success',
								duration: 2000
							});
						}
					});
			},

			// 获取部门详情
			getDataDetail() {
				if (this.form.id) {
					getObj(this.form.id)
						.then(res => {
							if (res && res.code === 0) {
								this.form = res.data ? res.data : {};
							} else {
								this.$notify({
									title: '获取部门详情失败',
									message: res.msg,
									type: 'error',
									duration: 2000
								});
							}
						});
				}
			},

			handleClick(tab, event) {
				this.userFirstForm.user.userId = undefined;
				this.userFirstForm.user.name = '';
				this.getDepartmentleaderInfo();
			},

			// 获取人员列表
			getInfo() {
				getUser(this.form.id,{ name: '' })
					.then(res => {
						if (res && res.status === 200) {
							this.userDataList = res.data;
						} else {
							this.$notify({
								title: '失败',
								message: "获取人员列表失败",
								type: 'error',
								duration: 2000
							});
						}
					});
			},

			userChange(event) {
				// this.userFirst = [];
				this.userFirstForm.user.userId = event.userId;
				this.userFirstForm.user.name = event.name;
				// this.userFirstFormVisible = true;
			},

			// 获取人员详情
			getDepartmentleaderInfo() {
				this.listLoading = true;
				// if(this.activeName == 'first') {
				// 	this.listQuery.leaderType = '1';
				// 	this.leaderType = '1';
				// } else if (this.activeName === 'second'){
				// 	this.listQuery.leaderType = '0';
				// 	this.leaderType = '0';
				// } else {
                //     this.listQuery.leaderType = '2';
				// 	this.leaderType = '2';
                // }
				switch (this.activeName) {
					case 'first':
						this.listQuery.leaderType = '1';
						this.leaderType = '1';
						break;
					case 'second':
						this.listQuery.leaderType = '0';
						this.leaderType = '0';
						break;
					case 'third':
						this.listQuery.leaderType = '2';
						this.leaderType = '2';
						break;
					case 'fourth':
						this.listQuery.leaderType = '3';
						this.leaderType = '3';
						break;
					case 'fifth':
						this.listQuery.leaderType = '4';
						this.leaderType = '4';
						break;
					default:
						break;
				}
				getDepartmentleaderObj(this.listQuery,this.form.id,this.leaderType)
					.then(res => {
						if (res && res.status === 200) {
							this.list = res.data.rows;
							this.total = parseInt(res.data.total);
						} else {
							this.total = 0;
						}
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
			},

			handleSizeChange(val) {
				this.listQuery.limit = val;
				this.getDepartmentleaderInfo();
			},
			handleCurrentChange(val) {
				this.listQuery.page = val;
				this.getDepartmentleaderInfo();
			},

			create() {
				// if(this.activeName == 'first') {
				// 	this.userFirstForm.leaderType = '1';
				// } else if(this.activeName === 'second'){
				// 	this.userFirstForm.leaderType = '0';
				// } else {
                //     this.userFirstForm.leaderType = '2'
                // }
				switch (this.activeName) {
					case 'first':
						this.userFirstForm.leaderType = '1'
						break;
					case 'second':
						this.userFirstForm.leaderType = '0'
						break;
					case 'third':
						this.userFirstForm.leaderType = '2'
						break;
					case 'fourth':
						this.userFirstForm.leaderType = '3'
						break;
					case 'fifth':
						this.userFirstForm.leaderType = '4'
						break;
					default:
						break;
				}
				this.loading = true;
				addDepartmentleaderObj(this.userFirstForm,this.form.id)
					.then((res) => {
						if (res && res.status === 200) {
							this.$notify({
								title: '成功',
								message: '操作成功',
								type: 'success',
								duration: 2000
							});
							setTimeout(() => {
								this.getDepartmentleaderInfo();
								this.userFirst = [];
								this.userFirstForm = {
									leaderType: '',
									user: {
										id: undefined,
										name: '',
										userId: undefined,
										username: ''
									}
								};
								this.loading = false;
							}, 1000)
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
						this.$notify({
							title: '失败',
							message: '操作失败',
							type: 'error',
							duration: 2000
						});
						this.loading = false;
					})
			},

			// 删除
			handleDelete(id) {
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					})
					.then(() => {
						delDepartmentleaderObj(
								id
							)
							.then(res => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '删除成功',
										type: 'success',
										duration: 2000
									});
									this.$nextTick(() => {
										this.getDepartmentleaderInfo();
									})
								} else {
									this.$notify({
										title: '失败',
										message: '删除失败',
										type: 'error',
										duration: 2000
									});
								}
							}).catch(() => {
								// this.$notify({
								// 	title: '失败',
								// 	message: '删除失败',
								// 	type: 'error',
								// 	duration: 2000
								// });
							});
					}).catch(() => {

					});
			},


			cancel() {
				this.$emit('refreshData', false)
			}
		}
	}
</script>

<style lang="scss" scoped>
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

	.input-select {
		>>> .el-select__tags {
			display: none !important;
        }
        >>> .el-input--suffix .el-input__inner {
            color: #ffffff;
        }
	}

	.select-form {
		/deep/ .el-tabs__nav-wrap {
			font-size: 18px;
			font-weight: 600;
			border-left: 5px solid #bc0000;
			padding-left: 20px;
		}
	}
</style>
