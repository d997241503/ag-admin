<template>
	<div class="app-container">
        <div class="other-info">
            <span class="click-text" @click="handleOther">线索及案件其他信息</span>
        </div>
        <el-form label-width="150px" ref="form" :model="formData" :rules="rules">
            <div class="content-form">
                <el-form-item label="承办主体：" prop="zhuti">
                    <SelectDept class="row-gap" ref="selDept" @check="handleDeptCheck" showDept/>
                    <el-select v-model="formData.siteGroup" placeholder="请选择派驻组" multiple="">
                        <el-option v-for="item in siteList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="立案时间：" prop="registerTime">
                    <el-date-picker
                        v-model="formData.registerTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="立案类型：" prop="registerType">
                    <el-row :gutter="20" class="item-content-row">
                        <el-col :span="16">
                            <el-select v-model="formData.registerType" multiple="" placeholder="请选择立案类型">
                                <el-option v-for="item in RECORD_TYPE_OPTIONS" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            <el-checkbox v-model="formData.registerSuperiorDealWith">立案后移交上级纪委监委</el-checkbox>
                        </el-col>
                    </el-row>
                    <el-checkbox v-model="formData.superiorDealWith" @change="handleInspect">由上级纪委监委处理</el-checkbox>
                </el-form-item>
                <template v-if="!formData.superiorDealWith">
                    <el-form-item label="移交审理：" prop="transferTrialTime">
                        <el-date-picker
                            v-model="formData.transferTrialTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="办理状态：" prop="handlingStatus">
                        <el-select v-model="formData.handlingStatus" placeholder="请选择办理状态">
                            <el-option v-for="item in MANAGE_STATUS_OPTIONS" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </template>
            </div>
            <template v-if="!formData.superiorDealWith">
                <div class="content-title" v-if="formData.handlingStatus === MANAGE_STATUS.CONCLUSION">处理处分结果：</div>
                <div class="content-form" v-if="formData.handlingStatus === MANAGE_STATUS.CONCLUSION">
                    <el-form-item label="处理处分：" prop="chuli">
                        <template v-for="(member, mIndex) in formData.member">
                            <div v-if="member.userId" :key="mIndex" class="line-area">
                                <el-row v-for="(punishment, pIndex) in member.punishment" :gutter="20" class="item-content-row row-gap" :key="punishment.key">
                                    <el-col :span="4" style="height: 40px">
                                        <span v-if="pIndex === 0">{{member.name}}：</span>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-select v-model="punishment.punishmentTypeId" @change="handleTypeChange(arguments[0], punishment)" placeholder="请选择处置类型">
                                            <el-option v-for="item in personDisposeType" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-select v-model="punishment.secendPunishmentTypeId" @change="handleDisposeChange(arguments[0], punishment)" placeholder="请选择处置方式">
                                            <el-option v-for="item in personDispose[punishment.punishmentTypeId]" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-date-picker
                                            v-model="punishment.effectiveTime"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择生效日期">
                                        </el-date-picker>
                                    </el-col>
                                    <p class="item-btn">
                                        <span class="btn-info" v-show="pIndex == member.punishment.length - 1"
                                                @click="itemAdd(mIndex, member)"><i
                                                    class="el-icon-circle-plus-outline"></i></span>
                                            <span class="btn-info" v-show="member.punishment.length > 1"
                                                @click="itemDel(mIndex, pIndex)"><i
                                            class="el-icon-remove-outline"></i></span>
                                    </p>
                                </el-row>
                                <el-row :gutter="20" class="item-content-row">
                                    <el-col :span="4">
                                        <el-checkbox v-model="member.havePostChange">职务调整</el-checkbox>
                                    </el-col>
                                    <el-col :span="20">
                                        <el-input v-model="member.punishmentRemark" placeholder="请输入详情"></el-input>
                                    </el-col>
                                </el-row>
                            </div>
                            <div v-else class="line-area" :key="mIndex">
                                <el-row :gutter="20" class="item-content-row row-gap">
                                    <el-col :span="12">
                                        <span>{{member.orgName}}：</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-select v-model="member.punishment[0].punishmentTypeId" @change="handleUnitDisposeChange(arguments[0], member.punishment[0])" placeholder="请选择处置方式">
                                            <el-option v-for="item in unitDispose" :label="item.label" :value="item.value" :key="item.value"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <el-input v-model="member.punishmentRemark" type="textarea" :rows="4" placeholder="请输入详情" class="row-gap"></el-input>
                                <el-input v-model="member.punishmentNum" placeholder="请输入文书编号"></el-input>
                            </div>
                        </template>
                    </el-form-item>
                </div>
                <div class="content-form">
                    <el-form-item label="备注：" prop="remark">
                        <el-input type="textarea" :rows="4" v-model="formData.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </div>
            </template>
            <div class="footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save" :loading="btnLoading">确定并保存</el-button>
            </div>
        </el-form>
	</div>
</template>

<script>
    import {RECORD_TYPE_OPTIONS, MANAGE_STATUS_OPTIONS, MANAGE_STATUS} from '../common'
    import emitter from '@/mixins/emitter.mixin'
    import SelectDept from 'components/formItem/SelectDept'
    import {
		getAccreditGroup
	} from 'api/archives/index';
    import {registerAdd, registerUpdate, clueTypeList, registerDetail, problemClueDetail} from 'api/clue'
	export default {
		name: "ClueMng",
        mixins: [emitter],
        components: {SelectDept},
		data() {
            this.RECORD_TYPE_OPTIONS = RECORD_TYPE_OPTIONS
            this.MANAGE_STATUS_OPTIONS = MANAGE_STATUS_OPTIONS
            this.MANAGE_STATUS = MANAGE_STATUS
            this.rules = {
                zhuti: {required: true, validator: (rule, val, cb) => {
                    const {undertakerOrg} = this.formData
                    let params = undefined
                    if (!undertakerOrg.length) params = new Error('请选择承办单位')
                    cb(params)
                }},
                registerTime: {required: true, message: '请选择立案时间', trigger: 'blur'},
                registerType: {required: true, message: '请选择立案类型', trigger: 'blur'},
                transferTrialTime: {required: true, message: '请选择日期', trigger: 'blur'},
                handlingStatus: {required: true, message: '请选择办理状态', trigger: 'change'},
                chuli: {required: true, validator: (rule, val, cb) => {
                    const {member, handlingStatus} = this.formData
                    let params = undefined
                    if (handlingStatus === MANAGE_STATUS.PROCESS) cb(params)
                    else {
                        try {
                            member.forEach(item => {
                                if (item.type === '1') {
                                    item.punishment.forEach(pItem => {
                                        if (!pItem.effectiveTime || !pItem.secendPunishmentTypeId || !pItem.punishmentTypeId) throw new Error('请填写人员处理信息')
                                    })
                                    if (item.havePostChange && !item.punishmentRemark) throw new Error('请填写职务调整信息')
                                } else {
                                    if (!item.punishmentRemark || !item.punishmentNum || !item.punishment[0].punishmentTypeId) throw new Error('请填写单位处置信息')
                                }
                            })
                        } catch(err) {
                            params = err
                        }
                        cb(params)
                    }
                }}
            }
			return {
                formData: {
                    siteGroup: [],
                    registerTime: '',
                    registerType: '',
                    registerSuperiorDealWith: '',
                    superiorDealWith: '',
                    transferTrialTime: '',
                    handlingStatus: '',
                    member: [],
                    undertakerOrg: []
                },
                siteList: [],
                personDisposeType: [],
                personDispose: {},
                unitDispose: [],
                btnLoading: false
			}
		},
        created() {
            this.dispatch('AddClue', 'getParent', this)
            this.getDetail()
            this.getSiteGroup()
            this.getDisposeType()
        },
        methods: {
            cancel() {
                this.$router.go(-1)
            },
            save() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.postData()
                    }
                })
            },
            postData() {
                if (this.formData.handlingStatus === MANAGE_STATUS.PROCESS || this.formData.superiorDealWith) this.clearDispose()
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
                const fn = isEdit ? registerUpdate(data) : registerAdd(this.sParent.id, data)
                this.btnLoading = true
                fn.then(res => {
                    if (res?.status === 200) {
                        this.$notify.success('操作成功')
                        this.cancel()
                    } else {
                        this.$message.error(res.msg)
                    }
                }).finally(() => this.btnLoading = false)
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
            getDisposeType() {
                ['1', '2'].forEach(type => {
                    clueTypeList(type).then(res => {
                        if (res?.status === 200) {
                            if (type === '1') {
                                this.unitDispose = res.data.map(item => ({
                                    label: item.name,
                                    value: item.id
                                }))
                            } else {
                                res.data.forEach(pType => {
                                    this.personDisposeType.push({label: pType.name, value: pType.id})
                                    this.personDispose[pType.id] = []
                                    pType.children.forEach(pDispose => {
                                        this.personDispose[pType.id].push({label: pDispose.name, value: pDispose.id})
                                    })
                                })
                            }
                        }
                    })
                })
            },
            getDetail() {
                registerDetail(this.sParent.id).then(res => {
                    if (res?.status === 200) {
                        this.initData(res.data)
                    }
                })
            },
            initData(data) {
                const {member} = data
                member.forEach(item => {
                    item.punishment = item.punishment
                    ||  [{
                            key: 1,
                            memberRecordId: item.id,
                            punishmentTypeId: undefined,
                            secendPunishmentTypeId: undefined,
                            punishmentTypeName: '',
                            secendPunishmentTypeName: '',
                            effectiveTime: undefined
                        }]
                })
                if (this.sParent.isEdit) {
                    this.formData = {
                        ...data,
                        siteGroup: (data.undertakerGroup || []).map(item => item.groupId)
                    }
                    this.$refs['selDept'].deptIds = (data.undertakerOrg || []).map(item => item.orgId)
                } else {
                    this.formData.member = member
                }
                if (!data.id) {
                    problemClueDetail(this.sParent.id).then(res => {
                        if (res?.status === 200) {
                            this.$refs['selDept'].deptIds = (res.data.undertakerOrg || []).map(item => item.orgId)
                            this.formData.undertakerOrg = res.data.undertakerOrg.map(({orgName, orgId}) => ({orgName, orgId}))
                        }
                    })
                }
            },
            handleTypeChange(id, punishment) {
                punishment.secendPunishmentTypeId = undefined
                punishment.punishmentTypeName = this.personDisposeType.find(type => type.value === id).label
            },
            handleDisposeChange(id, punishment) {
                punishment.secendPunishmentTypeName = this.personDispose[punishment.punishmentTypeId].find(dispose => dispose.value === id).label
            },
            handleUnitDisposeChange(id, punishment) {
                punishment.punishmentTypeName = this.unitDispose.find(type => type.value === id).label
            },
            handleInspect(value) {
                if (value) {
                    this.$confirm('选择此项，该案件信息至此终止，是否继续选择？', '提示', {
                        type: 'warning'
                    }).catch(() => {
                        this.formData.superiorDealWith = !value
                    })
                } else {
                    this.formData.remark = ''
                    this.formData.handlingStatus = ''
                    this.formData.transferTrialTime = ''
                }
            },
            handleOther() {
                this.sParent.handleOtherInfo()
            },
            itemAdd(mIndex, member) {
                this.formData.member[mIndex].punishment.push({
                            key: new Date().getTime(),
                            memberRecordId: member.id,
                            punishmentTypeId: undefined,
                            secendPunishmentTypeId: undefined,
                            punishmentTypeName: '',
                            secendPunishmentTypeName: '',
                            effectiveTime: undefined
                        })
            },
            itemDel(mIndex, pIndex) {
                this.formData.member[mIndex].punishment.splice(pIndex, 1)
            },
            clearDispose() {
                const {member} = this.formData
                member.forEach(item => {
                    if (item.type === '1') {
                        item.punishmentRemark = ''
                        item.havePostChange = false
                        item.punishment.forEach(punishment => {
                            punishment.punishmentTypeId = undefined
                            punishment.secendPunishmentTypeId = undefined
                            punishment.punishmentTypeName = undefined
                            punishment.secendPunishmentTypeName = undefined
                            punishment.effectiveTime = ''
                        })
                    } else {
                        item.punishmentRemark = ''
                        item.punishmentNum = ''
                        item.punishment[0].punishmentTypeId = ''
                        item.punishment[0].punishmentTypeName = ''
                    }
                })
            }
        }
	}
</script>

<style lang="scss" scoped>
    @import '../form-common.scss';

</style>