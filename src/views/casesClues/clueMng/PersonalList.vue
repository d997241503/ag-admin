<template>
	<div class="personal-list">
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
            <el-table :height="tableHeight" ref="table" :data="dataList" border v-loading="listLoading" :span-method="arraySpanMethod()">
                <el-table-column type="index" align="center" label="序号" width="50">
                    <template slot-scope="{row}">
                        {{row.typeIndex}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="处理处分类型">
                    <template slot-scope="{row}">
                        <span>{{row.typeData.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="具体措施">
                    <template slot-scope="{row}">
                        <span>{{row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="350">
                    <template slot-scope="{row}">
                        <el-button type="text" @click="showDialog(row)">编辑</el-button>
                        <el-button type="text" @click="handleDelete(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="isAdd ? '新增' : '编辑'" :close-on-click-modal="false" :visible.sync="visible">
            <el-form :model="dataForm" ref="form" label-width="150px">
                <el-form-item v-if="!dataForm.id" label="处理处分类型：" prop="name" :rules="{required: true, message: '请选择处理处分类型', trigger: 'change'}">
                    <el-select
                        v-model="dataForm.name"
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择处理处分类型">
                        <el-option
                            v-for="item in disposeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-else label="处理处分类型：" prop="name" :rules="{required: true, message: '请输入处理处分类型', trigger: 'blur'}">
                    <el-input style="width: 86%;" v-model="dataForm.name" placeholder="请输入处理处分类型" clearable
                    ></el-input>
                </el-form-item>
                <div class="form-sign" v-for="(item, index) in dataForm.children" :key="index">
                    <el-form-item label="具体措施：" :prop="'children.' + index + '.name'" :rules="{required: true, message: '请输入具体措施', trigger: 'blur'}">
                        <div class="form-member">
                            <el-input style="width: 86%;" v-model="item.name" placeholder="请输入具体措施" clearable
                            ></el-input>
                            <div class="item-btn">
                            <span class="btn-info" v-show="index == dataForm.children.length - 1 && isAdd"
                                    @click="itemAdd()"><i
                                        class="el-icon-circle-plus-outline"></i></span>
                                <span class="btn-info" v-show="dataForm.children.length > 1 && isAdd"
                                    @click="itemDel(index)"><i
                                        class="el-icon-remove-outline"></i></span>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="序号：">
                        <el-input-number v-model="item.sort" :min="1"
                        ></el-input-number>
                    </el-form-item>
                </div>
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
	import {
		mapGetters
	} from 'vuex';
    import cloneDeep from 'lodash/cloneDeep';
    import {addClueType, updateClueType, deleteClueType, clueTypeList} from 'api/clue'
import { deepClone } from '@/utils';
	export default {
		name: "Anonymos",
        mixins: [tableMixin],
        props: {
            tabType: String
        },
		data() {
            this.measure = {
                id: undefined,
                name: '',
                sort: 1
            }
            this.modelForm = {
                id: undefined,
                name: '',
                children: [this.measure]
            }
			return {
                clueEvent_btn_add: false,
                dataForm: cloneDeep(this.modelForm),
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
            },
            dataList() {
                const { list } = this
                let resultList = []
                list.forEach((type, typeIndex) => {
                    type.children.forEach((measure, index) => {
                        if (index === 0) {
                            measure.rowSpan = type.children.length
                            measure.typeIndex = typeIndex + 1
                        }
                        measure.typeData = {
                            name: type.name,
                            id: type.id,
                            length: type.children.length
                        }
                    })
                    resultList = resultList.concat(type.children)
                })
                return resultList
            },
            disposeOptions() {
                return this.list.map(type => ({
                    label: type.name,
                    value: type.id
                }))
            },
            isAdd() {
                return !this.dataForm.id
            }
		},
        methods: {
            getList() {
                this.listLoading = true;
                clueTypeList(2)
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
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
                if (data) {
                    this.dataForm = {
                        ...data.typeData,
                        children: [{
                            ...data
                        }]
                    }
                } else {
                    this.dataForm = cloneDeep(this.modelForm)
                }
            },
            handleOk() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.postData()
                    }
                })
            },
            postData() {
                const {dataForm, disposeOptions} = this
                const data = deepClone(dataForm)
                const fn = data.id ? updateClueType : addClueType
                if (!data.id) {
                    const exist = disposeOptions.find(item => item.value === data.name)
                    if (exist) {
                        data.name = exist.label
                        data.id = exist.value
                    }
                }
                this.btnLoading = true
                fn(2, data).then(res => {
                    if (res?.status === 200) {
                        this.$notify.success('操作成功')
                        this.visible = false
                        this.getList()
                    }
                }).finally(() => this.btnLoading = false)
            },
            handleDelete({id, typeData}) {
				this.$confirm(`此操作将永久删除, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					deleteClueType(id).then(res => {
                        if (res?.status === 200) {
                            if (typeData.length === 1) {
                                return deleteClueType(typeData.id)
                            } else {
                                return Promise.resolve()
                            }
                        }
                    }).then(() => {
                        this.$notify.success('删除成功')
                        this.getList()
                    })
				})
			},
            arraySpanMethod() {
                return ({ row, column, rowIndex, columnIndex }) => {
                    if (columnIndex === 1 || columnIndex === 0) {
                        if (row.rowSpan) {
                            return [row.rowSpan, 1]
                        } else {
                            return [0, 0]
                        }
                    }
                }
            },
            itemAdd() {
                this.dataForm.children.push({
                    ...this.measure
                })
            },
            itemDel(index) {
                this.dataForm.children.splice(index, 1)
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
    .form-sign {
		border-top: 1px dashed #bc0000;
    	border-bottom: 1px dashed #bc0000;
        .el-form-item:first-child {
            margin-top: 22px;
        }
	}
    .form-member {
		display: flex;
		margin-bottom: 10px;

		.item-btn {
			// position: absolute;
			width: 5%;
    		min-width: 80px;
			// top: 11px;
			right: -25px;
			padding: 0 10px;

			.btn-info,
			.btn-info {
				font-size: 17px;
				margin-right: 10px;
			}

			.btn-info:hover {
				font-weight: bold;
				color: #000;
				cursor: pointer;
			}
		}
	}
</style>