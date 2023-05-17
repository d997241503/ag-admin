<template>
	<div class="unit-list">
        <div ref="searchSection" class="page-content search-info">
			<div class="search-left">
				<el-select v-model="sTabType">
                    <el-option label="个人处理处分信息" value="personal"></el-option>
                    <el-option label="单位处理处分信息" value="unit"></el-option>
                </el-select>
			</div>
			<div>
				<el-button v-if="clueEvent_btn_add" class="filter-item" type="primary" v-waves icon="search" @click="showDialog(null)">新增</el-button>
			</div>
		</div>
        <div class="page-content">
            <el-table :height="tableHeight" ref="table" :data="list" border v-loading="listLoading">
                <el-table-column align="center" label="序号" width="50">
                    <template v-slot:default="{row}">{{row.sort}}</template>
                </el-table-column>
                <el-table-column align="center" label="处理处分类型">
                    <template slot-scope="{row}">
                        <span>{{row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="450">
                    <template slot-scope="{row}">
                        <el-button type="text" @click="showDialog(row)">编辑</el-button>
                        <el-button type="text" @click="handleDelete(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="!dataForm.id ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible">
            <el-form :model="dataForm" :rules="rules" ref="form" label-width="150px">
                <el-form-item label="处理处分类型：" prop="type">
                    <el-input style="width: 86%;" v-model="dataForm.type" placeholder="请输入处理处分类型" clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="序号：" prop="sort">
                    <el-input-number v-model="dataForm.sort" :min="1"
                    ></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" align="center">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="handleOk" :loading="btnLoading">确定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
    import tableMixin from '@/mixins/table/table.mixin'
    import {addClueType, updateClueType, deleteClueType, clueTypeList} from 'api/clue'
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: "Anonymos",
        mixins: [tableMixin],
        props: {
            tabType: String
        },
		data() {
            this.modelForm = {
                id: undefined,
                type: '',
                sort: 1
            }
            this.rules = {
                type: [
                    {required: true, message: '请输入处理处分类型', trigger: 'blur'}
                ]
            }
			return {
                clueEvent_btn_add: false,
                dataForm: {
                    ...this.modelForm
				},
                visible: false,
                btnLoading: false
			}
		},
        created() {
            // this.clueEvent_btn_add = this.elements['clueEvent_btn_add']
            this.clueEvent_btn_add = true
        },
		computed: {
			...mapGetters([
				'elements'
			]),
            sTabType: {
                get() {
                    return this.tabType
                },
                set(val) {
                    this.$emit('update:tabType', val)
                }
            }
		},
        methods: {
            getList() {
                this.listLoading = true;
                clueTypeList(1)
                .then(res => {
                    if (res?.status === 200) {
                        this.list = res.data
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = false;
                }).finally(() => {
                    this.tableLayout()
                })
            },
            showDialog(data) {
                this.visible = true
                if (data) {
                    this.dataForm = {
                        ...data,
                        type: data.name
                    }
                } else {
                    this.dataForm = {
                        ...this.modelForm
                    }
                }
            },
            handleOk() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.postData()
                    }
                })
            },
            handleDelete(id) {
				this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteClueType(id).then(res => {
                        if (res?.status === 200) {
                            this.$notify.success('删除成功')
                            this.getList()
                        }
                    })
				})
			},
            postData() {
                const fn = this.dataForm.id ? updateClueType : addClueType
                this.dataForm.name = this.dataForm.type
                this.btnLoading = true
                fn(1, this.dataForm).then(res => {
                    if (res?.status === 200) {
                        this.$notify.success('操作成功')
                        this.visible = false
                        this.getList()
                    }
                }).finally(() => this.btnLoading = false)
            }
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
</style>