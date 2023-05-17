<template>
	<div class="app-container">
        <div class="other-info" v-if="showOther">
            <span class="click-text" @click="handleOther">线索及案件其他信息</span>
        </div>
        <el-form label-width="150px" ref="form" :model="formData" :rules="rules">
            <div class="content-title">线索来源：</div>
            <div class="content-form">
                <el-form-item label="线索类型：" prop="clueType">
                    <el-select v-model="formData.clueType" class="row-gap" placeholder="请选择线索类型">
                        <el-option v-for="item in CLUE_SOURCE_OPTIONS" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                    <el-row v-if="formData.clueType === CLUE_SOURCE.OVER" :gutter="20" class="item-content-row row-gap">
                        <el-col :span="12">
                            <el-select v-model="formData.secendClueType">
                                <el-option v-for="item in TURN_TYPE_OPTIONS" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="12">
                            <el-input v-model="formData.secendClueTypeRemark" placeholder="请输入"></el-input>
                        </el-col>
                    </el-row>
                    <el-radio v-model="formData.clueClassification" :label="CLUE_TYPE.LETTER">信访举报</el-radio>
                    <el-radio v-model="formData.clueClassification" :label="CLUE_TYPE.PROBLEM">问题线索</el-radio>
                </el-form-item>
                <el-form-item label="办理时限：" prop="processTimeLimit">
                    <el-date-picker
                        v-model="formData.processTimeLimit"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="content-title">线索情况：</div>
            <div class="content-form">
                <el-form-item label="线索编号：" prop="clueNum">
                    <el-input v-model="formData.clueNum" placeholder="请输入线索编号"></el-input>
                </el-form-item>
                <el-form-item label="被反映单位/人：" prop="reactUnit">
                    <div v-for="(person, index) in formData.member" :key="person.key" class="line-area">
                        <el-row :gutter="20" class="item-content-row row-gap">
                            <el-col :span="10">
                                <SelectDeptItem ref="selDept" v-model="person.orgId" @change="handleDeptCheck(arguments[0], person)"/>
                            </el-col>
                            <el-col :span="7">
                                <el-select v-model="person.userId" placeholder="请选择被反映人" filterable clearable @change="handleUser(arguments[0], person)">
                                    <el-option v-for="item in usersOpt[person.orgId] || []" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="7">
                                <el-select v-model="person.rank" placeholder="请选择职级" clearable>
                                    <el-option v-for="item in RANK_OPTIONS" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                </el-select>
                            </el-col>
                            <p class="item-btn">
                                <span class="btn-info" v-show="index == formData.member.length - 1"
                                        @click="itemAdd()"><i
                                            class="el-icon-circle-plus-outline"></i></span>
                                    <span class="btn-info" v-show="formData.member.length > 1"
                                        @click="itemDel(index)"><i
                                    class="el-icon-remove-outline"></i></span>
                            </p>
                        </el-row>
                        <el-input v-model="person.remark" placeholder="请输入人员情况"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="线索情况：" prop="clueSituation">
                    <el-input type="textarea" :rows="4" v-model="formData.clueSituation" placeholder="请输入线索情况"></el-input>
                </el-form-item>
            </div>
            <div class="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save" :loading="btnLoading">确定并保存</el-button>
            </div>
        </el-form>
	</div>
</template>

<script>
    import {TURN_TYPE_OPTIONS, RANK_OPTIONS, CLUE_SOURCE_OPTIONS, CLUE_SOURCE, CLUE_TYPE} from '../common'
    import SelectDeptItem from 'components/formItem/SelectDeptItem'
    import {getDeptUsers} from 'api/admin/user'
    import {clueInput, clueDetail, clueUpdate} from 'api/clue'
    import emitter from '@/mixins/emitter.mixin'
	export default {
		name: "ClueMng",
        components: {SelectDeptItem},
        mixins: [emitter],
		data() {
            this.rules = {
                clueType: {required: true, validator: (rule, val, cb) => {
                    const {formData} = this
                    let params = undefined
                    if (!formData.clueType) params = new Error('请选择线索类型')
                    else if (formData.clueType === CLUE_SOURCE.OVER && !formData.secendClueType) params = new Error('请选择移交类型')
                    cb(params)
                }},
                clueNum: {required: true, message: '请输入线索编号', trigger: 'blur'},
                reactUnit: {required: true, validator: (rule, val, cb) => {
                    const {member} = this.formData
                    let params = undefined
                    member.forEach(item => {
                        if (!item.orgId) params = new Error('请选择单位')
                        else if (!item.remark) params = new Error('请输入人员情况')
                    })
                    cb(params)
                }},
                clueSituation: {required: true, message: '请输入线索情况', trigger: 'blur'},
            }
            this.TURN_TYPE_OPTIONS = TURN_TYPE_OPTIONS
            this.RANK_OPTIONS = RANK_OPTIONS
            this.CLUE_SOURCE_OPTIONS = CLUE_SOURCE_OPTIONS
            this.CLUE_SOURCE = CLUE_SOURCE
            this.CLUE_TYPE = CLUE_TYPE
			return {
                formData: {
                    clueType: '',
                    secondClueType: '',
                    secondClueTypeRemark: '',
                    clueClassification: CLUE_TYPE.LETTER,
                    clueNum: '',
                    clueSituation: '',
                    member: [],
                    processTimeLimit: ''
                },
                usersOpt: {},
                btnLoading: false
			}
		},
        created() {
            this.dispatch('AddClue', 'getParent', this)
            if (this.sParent.isEdit) {
                this.getDetail()
            } else {
                this.formData.member.push({key: 1, orgId: '', userId: '', rank: '', remark: ''})
            }
        },
        computed: {
            showOther() {
                return !!this.sParent.id
            }
        },
        methods: {
            cancel() {
                this.$router.go(-1)
            },
            save() {
                this.$refs['form'].validate(valid => {
                    if (valid) this.postData()
                })
            },
            itemAdd() {
                this.formData.member.push({key: new Date().getTime(), orgId: '', userId: '', rank: '', remark: ''})
            },
            itemDel(index) {
                this.formData.member.splice(index, 1)
            },
            handleDeptCheck({id, name}, person) {
                person.userId = undefined
                person.orgName = name
                if(!id) return;
                getDeptUsers(id).then(res => {
                    if (res?.status === 200) {
                        let map = {}
                        res.data.forEach(user => {
                            map[user.userId] = user.name
                        })
                        const userList = Object.entries(map).map(([id, name]) => ({
                            label: name,
                            value: +id
                        }))
                        this.$set(this.usersOpt, id, userList)
                    }
                })
            },
            getDetail() {
                return clueDetail(this.sParent.id).then(res => {
                    if (res?.status === 200) {
                        this.initData(res.data)
                    }
                })
            },
            initData(data) {
                data.member.forEach((item, index) => {
                    item.key = item.id
                })
                this.formData = {
                    ...data
                }
                this.$nextTick(() => {
                    data.member.forEach((item, index) => {
                        const id = item.userId
                        const name = item.orgName
                        this.$refs['selDept'][index].handleCheckChange({id: item.orgId, departmentFullName: item.orgName})
                        item.userId = id
                        item.orgName = name
                    })
                })
            },
            postData() {
                this.btnLoading = true
                if (!this.sParent.isEdit) {
                    clueInput(this.formData).then(res => {
                        if (res?.status === 200) {
                            this.$message.success('操作成功')
                            const nextTab = this.formData.clueClassification === CLUE_TYPE.LETTER ? '2' : '3'
                            this.sParent.id = res.data
                            this.sParent.setTab(nextTab)
                            this.sParent.setAvaiTab([nextTab])
                        } else {
                            this.$message.error(res.msg)
                        }
                    }).finally(() => this.btnLoading = false)
                } else {
                    clueUpdate(this.formData).then(res => {
                        if (res?.status === 200) {
                            this.$message.success('操作成功')
                            this.loading = false;
                            this.sParent.updateMember()
                            const nextTab = this.formData.clueClassification === CLUE_TYPE.LETTER ? '2' : '3'
                            this.sParent.setTab(nextTab)
                            this.sParent.available.push(nextTab)
                        } else {
                            this.loading = false;
                            this.$message.error(res.msg)
                        }
                    }).finally(() => this.btnLoading = false)
                }
            },
            handleOther() {
                this.sParent.handleOtherInfo()
            },
            handleUser(id, person) {
                person.name = this.usersOpt[person.orgId].find(user => user.value === id).label
            },
        },
	}
</script>

<style lang="scss" scoped>
    @import '../form-common.scss';
    
</style>