<template>
	<div class="app-container calendar-list-container nav-content">
		<div class="tree-info" ref="tree-info">
			<tree @refreshData="treeHandle" ref="tree"></tree>
		</div>
		<div class="page-info" ref="pageInfo" style="margin-left:310px">
			 <div class="page-form">
                <el-form :model="filesForm" ref="filesForm" class="form" style="font-size: 16px;" label-width="120px" :label-position="labelPosition">
                    <el-form-item label="档案编号：" prop="value">
                        <el-input v-model="filesForm.value" placeholder="请输入档案编号" clearable
						></el-input>
                    </el-form-item>
                    <el-form-item label="档案描述：" prop="description">
                        <el-input type="textarea" :rows="5"
                            placeholder="请输入档案描述" v-model="filesForm.description" clearable>
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="goBack">取消</el-button> -->
                <el-button style="width: 120px;" type="primary" @click="filesHandle('filesForm')" :loading="loading">确定</el-button>
            </div>
		</div>
	</div>
</template>

<script>
	import {
        getUnitarchivesno,
		unitarchivesno
	} from 'api/archives/index';
	import {
		getByType
	} from 'api/admin/dict/index';
	import {
		mapGetters
	} from 'vuex';
	import {
		getToken
	} from 'utils/auth';
	import tree from "./components/tree";
	export default {
		name: "index",
		components: {
			tree
		},
		data() {
			return {
				list: null,
				total: null,
				listLoading: true,
				// integrityArchives_btn_first: false,
				// integrityArchives_btn_m6high: false,
				// integrityArchives_btn_inspection: false,
				// integrityArchives_btn_detail: false,
				// integrityArchives_btn_edit: false,
				// integrityArchives_btn_delete: false,
				// integrityArchives_btn_putforward: false,
				// integrityArchives_btn_examine: false,
				// integrityArchives_btn_solidification: false,
				// integrityArchives_btn_temporary: false,
				// integrityArchives_btn_personnelpool: false,
				// integrityArchives_btn_history: false,
				tableKey: 0,
				classificationTask: [], // 分类
				headLeaderList: null,
				headLeaderTotal: null,
				// page: 1,
				// limit: 10,
                labelPosition: 'left',
				filesForm: {
					id: undefined,
					description: '',
					value: '',
				},
                listQuery: {
					orgId: undefined,
					type: ''
				},
                loading: false,
			}
		},

		computed: {
			...mapGetters([
				'elements'
			]),
		},
		created() {
			// // 获取权限
			// this.integrityArchives_btn_first = this.elements['integrityArchives:btn_first'];	
			// this.integrityArchives_btn_m6high = this.elements['integrityArchives:btn_m6high'];
			// this.integrityArchives_btn_inspection = this.elements['integrityArchives:btn_inspection'];
			// this.integrityArchives_btn_detail = this.elements['integrityArchives:btn_detail'];	
			// this.integrityArchives_btn_edit = this.elements['integrityArchives:btn_edit'];
			// this.integrityArchives_btn_delete = this.elements['integrityArchives:btn_delete'];
			// this.integrityArchives_btn_putforward = this.elements['integrityArchives:btn_putforward'];	
			// this.integrityArchives_btn_examine = this.elements['integrityArchives:btn_examine'];
			// this.integrityArchives_btn_solidification = this.elements['integrityArchives:btn_solidification'];
			// this.integrityArchives_btn_temporary = this.elements['integrityArchives:btn_temporary'];	
			// this.integrityArchives_btn_personnelpool = this.elements['integrityArchives:btn_personnelpool'];
			// this.integrityArchives_btn_history = this.elements['integrityArchives:btn_history'];
			// this.$nextTick(() => {
			// 	// 获取列表
			// 	this.getList();
			// })
		},
		methods: {

			// 点击部门刷新列表数据
			treeHandle(val,type) {
				this.listQuery.orgId = val.id;
                this.listQuery.type = type;
                this.$nextTick(() => {
                    this.getList();
                })
			},

			// 获取数据详情
			getList() {
                getUnitarchivesno(this.listQuery.orgId,this.listQuery.type)
                    .then(response => {
                        if (response && response.status === 200) {
                            // this.filesForm.description = '';
                            // this.filesForm.value = '';
                           if(response.data) {
                                this.filesForm = response.data;
                           } else {
                                this.filesForm =  {
                                    id: undefined,
                                    description: '',
                                    value: '',
                                }
                           }
                        } else {
                        }
                    }).catch(() => {
                    })
			},

            filesHandle(formName) {
				const set = this.$refs;
				set[formName].validate(valid => {
					if (valid) {
						this.loading = true;
						unitarchivesno(this.filesForm,this.listQuery.orgId,this.listQuery.type)
							.then((res) => {
								if (res && res.status === 200) {
									this.$notify({
										title: '成功',
										message: '成功',
										type: 'success',
										duration: 2000
									});
									setTimeout(() => {
										this.getList();
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
									message: '失败',
									type: 'error',
									duration: 2000
								});
								this.loading = false;
							})
					} else {
						return false;
					}
				});
            }
		}
	}
</script>

<style lang="scss" scoped>
	
	.tree-info {
		position: absolute;
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;
		height: calc(100vh - 200px);
	}

	.page-info {
		border: 0.0625rem solid #EAEAEA;
		border-radius: 10px;
		padding: 20px;
		background-color: #FFFFFF;

		// 表格高度不一致，将高度撑开
		>>> .el-table__fixed-right {
			height: 100% !important;
		}

		>>> .el-table__row {
			height: 65px !important;
		}
	}

    .page-form {
        width: 60%;
        margin: 0 auto;
    }

    .dialog-footer {
        text-align: right;
    }
</style>
