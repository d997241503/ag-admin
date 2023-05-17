<template>
	<div class="app-container">
        <div class="other-info">
            <span class="click-text" @click="handleOther">线索及案件其他信息</span>
        </div>
        <el-form label-width="150px" :rules="rules" ref="form" :model="formData">
            <div class="content-form">
                <el-form-item label="承办主体：" prop="zhuti">
                    <SelectDept class="row-gap" ref="selDept" @check="handleDeptCheck" showDept/>
                    <el-select v-model="formData.siteGroup" placeholder="请选择派驻组" multiple="">
                        <el-option v-for="item in siteList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签批时间：" prop="signatureTime">
                    <el-date-picker
                        v-model="formData.signatureTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="核实了解情况：" prop="situation">
                    <el-input type="textarea" :rows="4" placeholder="请输入详情" v-model="formData.situation"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-checkbox v-model="formData.toProblemClue">转问题线索</el-checkbox>
                </el-form-item>
                <template v-if="!formData.toProblemClue">
                    <el-form-item label="处置结果：" prop="chuzhi">
                        <template v-for="(person, index) in formData.member">
                            <el-row v-if="person.userId" :gutter="20" class="item-content-row line-area" :key="index">
                                <el-col :span="3">
                                    <span>{{person.name}}：</span>
                                </el-col>
                                <el-col :span="14">
                                    <el-select v-model="person.punishmentType" placeholder="请选择处置方式">
                                        <el-option v-for="item in LETTER_DISPOSE" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="7">
                                    <el-date-picker
                                        v-model="person.punishmentTime"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择处置日期">
                                    </el-date-picker>
                                </el-col>
                            </el-row>
                            <div v-else class="line-area" :key="index">
                                <el-row :gutter="20" class="item-content-row row-gap">
                                    <el-col :span="12">
                                        <span>{{person.orgName}}：</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-date-picker
                                            v-model="person.punishmentTime"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择处置日期">
                                        </el-date-picker>
                                    </el-col>
                                </el-row>
                                <el-input type="textarea" :rows="4" placeholder="请输入处置详情" v-model="person.punishmentDetails"></el-input>
                            </div>
                        </template>
                    </el-form-item>
                    <el-form-item label="反馈情况：" prop="feedbackDetails">
                        <el-checkbox v-model="formData.haveFeedback">向信访人反馈处理情况</el-checkbox>
                        <el-input type="textarea" :rows="4" placeholder="请输入反馈情况" v-model="formData.feedbackDetails"></el-input>
                    </el-form-item>
                </template>
            </div>
            <div class="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save" :loading="btnLoading">确定并保存</el-button>
            </div>
        </el-form>
	</div>
</template>

<script>
    import {LETTER_DISPOSE} from '../common'
    import emitter from '@/mixins/emitter.mixin'
    import SelectDept from 'components/formItem/SelectDept'
    import {
		getAccreditGroup, taskarchives
	} from 'api/archives/index';
    import {letterClueAdd, letterClueDetail, letterClueUpdate} from 'api/clue'
	export default {
		name: "ClueMng",
        mixins: [emitter],
        components: {SelectDept},
		data() {
            this.rules = {
                zhuti: {required: true, validator: (rule, val, cb) => {
                    const {undertakerOrg} = this.formData
                    let params = undefined
                    if (!undertakerOrg.length) params = new Error('请选择承办单位')
                    cb(params)
                }},
                signatureTime: {required: true, message: '请选择签批时间', trigger: 'blur'},
                situation: {required: true, message: '请输入情况', trigger: 'blur'},
                chuzhi: {required: true, validator: (rule, val, cb) => {
                    const {member} = this.formData
                    let params = undefined
                    member.forEach(item => {
                            if (item.type === '1') {
                                if (!item.punishmentTime || !item.punishmentType) params = new Error('请填写人员处置信息')
                            }
                            else {
                                if (!item.punishmentTime || !item.punishmentDetails) params = new Error('请填写单位处置信息')
                            }
                        })
                        cb(params)
                }},
                feedbackDetails: {required: true, validator: (rule, val, cb) => {
                    let params = undefined
                    if (!this.formData.feedbackDetails) params = new Error('请输入反馈情况')
                        cb(params)
                }, trigger: 'blur'},
            }
            this.LETTER_DISPOSE = LETTER_DISPOSE
			return {
                formData: {
                    siteGroup: [],
                    signatureTime: '',
                    situation: '',
                    feedbackDetails: '',
                    member: [],
                    undertakerOrg: [],
                    toProblemClue: false
                },
                siteList: [],
                btnLoading: false
			}
		},
        created() {
            this.dispatch('AddClue', 'getParent', this)
            this.getSiteGroup()
            this.getDetail()
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
            postData() {
                if (this.formData.toProblemClue) this.clearDispose()
                let data = {
                    ...this.formData
                }
                data.undertakerGroup = this.formData.siteGroup.map(id => {
                    const site = this.siteList.find(siteOpt => siteOpt.value === id)
                    return {
                        groupId: site.value,
                        groupName: site.label
                    }
                })
                const isEdit = this.sParent.isEdit && this.formData.id
                const fn = isEdit ? letterClueUpdate(data) : letterClueAdd(this.sParent.id, data)
                this.btnLoading = true
                fn.then(res => {
                    if (res?.status === 200) {
                        this.$notify.success('操作成功')
                        if (data.toProblemClue) {
                            if (!isEdit) {
                                this.sParent.setTab('3')
                                this.sParent.setAvaiTab(['3'])
                            } else {
                                this.sParent.available.push('3')
                                this.sParent.setTab('3')
                            }
                        } else {
                            !isEdit && this.cancel()
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                }).finally(() => this.btnLoading = false)
            },
            getDetail() {
                letterClueDetail(this.sParent.id).then(res => {
                    if (res?.status === 200) {
                        this.initData(res.data)
                    }
                })
            },
            initData(data) {
                const {member} = data
                if (this.sParent.isEdit) {
                    this.formData = {
                        ...data,
                        siteGroup: (data.undertakerGroup || []).map(item => item.groupId)
                    }
                    this.$refs['selDept'].deptIds = (data.undertakerOrg || []).map(item => item.orgId)
                } else {
                    this.formData.member = member
                }
            },
            handleOther() {
                this.sParent.handleOtherInfo()
            },
            getSiteGroup() {
                getAccreditGroup({limit: 999, page: 1}).then(data => {
					if (data && data.status === 200) {
                        this.siteList = data.data.rows.map(item => ({
                            label: item.name,
                            value: item.id
                        }))
					}
				})
            },
            handleDeptCheck(data) {
                const {checkedNodes} = data
                this.formData.undertakerOrg = checkedNodes.map(node => {
                    return {
                            orgId: node.id,
                            orgName: node.departmentFullName
                        }
                })
                this.$refs['form'].validateField('zhuti')
            },
            clearDispose() {
                this.formData.feedbackDetails = ''
                this.formData.haveFeedback = false
                this.formData.member.forEach(member => {
                    if (member.type === '1') {
                        member.punishmentType = ''
                    } else {
                        member.punishmentDetails = ''
                    }
                    member.punishmentTime = ''
                })
            }
        }
	}
</script>

<style lang="scss" scoped>
    @import '../form-common.scss';
    
</style>