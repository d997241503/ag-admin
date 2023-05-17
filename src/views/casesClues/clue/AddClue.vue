<template>
	<div class="add-clue app-container">
		<el-tabs v-model="activeTab" type="card">
			<el-tab-pane label="线索录入" name="1" :disabled="!available.includes('1')" lazy>
				<ClueInput></ClueInput>
			</el-tab-pane>
			<el-tab-pane label="信访线索" name="2" :disabled="!available.includes('2')" lazy>
				<Letter ref="Letter"></Letter>
			</el-tab-pane>
			<el-tab-pane label="问题线索" name="3" :disabled="!available.includes('3')" lazy>
				<Problem></Problem>
			</el-tab-pane>
            <el-tab-pane label="立案" name="4" :disabled="!available.includes('4')" lazy>
                <Record ref="Record"></Record>
            </el-tab-pane>
		</el-tabs>
        <el-dialog :title="'线索及案件其他信息'" :close-on-click-modal="false" :visible.sync="dialogVisible">
            <el-form :model="dialogForm" :rules="rules" ref="form" label-width="150px">
                <el-form-item class="content-form-item" label="线索涉及领域：" prop="involvedField">
                    <el-select v-model="dialogForm.involvedField" multiple placeholder="请选择线索涉及领域">
                        <el-option v-for="item in CLUE_FIELD_OPTIONS" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="content-form-item" label="档案编号：" prop="archivesNum">
                    <el-input v-model="dialogForm.archivesNum" placeholder="请输入档案编号" clearable
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogOk" :loading="btnLoading">确定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	import ClueInput from './components/ClueInput'
	import Letter from './components/Letter'
	import Problem from './components/Problem'
	import Record from './components/Record'
    import {CLUE_FIELD_OPTIONS} from './common'
    import {involvedFieldDetail, involvedFieldEdit} from 'api/clue'
	export default {
        name: 'AddClue',
		data() {
            this.rules = {
                involvedField: {required: true, message: '请选择线索涉及领域', trigger: 'change'},
                archivesNum: {required: true, message: '请输入档案编号', trigger: 'blur'}
            }
            this.CLUE_FIELD_OPTIONS = CLUE_FIELD_OPTIONS
			return {
				activeTab: '1',
                available: ['1'],
                dialogVisible: false,
                dialogForm: {
                    involvedField: [],
                    archivesNum: ''
                },
                id: undefined, // 线索记录id
                btnLoading: false
			}
		},
		components: {
            ClueInput, Letter, Problem, Record
		},
		created() {
            const {operation, id, activeTab = '1'} = this.$route.query
			this.isEdit = operation === 'edit'
            this.id = id
            this.activeTab = activeTab
            if (this.isEdit) {
                let arr = []
                for (let i = 1; i <= +activeTab; i++){
                  arr.push(i + '')
                }
                this.available = arr
            }
            this.$on('getParent', child => {
                child.sParent = this
            })
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
            handleOtherInfo() {
                involvedFieldDetail(this.id).then(res =>{
                    if (res?.status === 200) {
                        this.dialogForm.involvedField = res.data.involvedField
                        this.dialogForm.archivesNum = res.data.archivesNum
                    }
                }).finally(() => {
                    this.dialogVisible = true
                })
            },
            dialogOk() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.btnLoading = true
                        involvedFieldEdit(this.id, this.dialogForm).then(res => {
                            if (res?.status === 200) {
                                this.$notify.success('操作成功')
                                this.dialogVisible = false
                            }
                        }).finally(() => this.btnLoading = false)
                    }
                })
            },
            setTab(active) {
                this.activeTab = active
            },
            setAvaiTab(available) {
                this.available = available
            },
            updateMember() {
                ['Letter', 'Record'].forEach(refName => {
                    const ref = this.$refs[refName]
                    ref && ref.getDetail()
                })
            }
		}
	}
</script>

<style lang="scss" scoped>
    @import './form-common.scss';
    .add-clue {
        background-color: #fff;
        min-height: 777px;
    }
    .other-info {
        margin-bottom: 20px;
        margin-right: 100px;
        text-align: right;
    }
</style>
