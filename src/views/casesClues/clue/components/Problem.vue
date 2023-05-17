<template>
	<div class="app-container">
        <div class="other-info">
            <span class="click-text" @click="handleOther">线索及案件其他信息</span>
        </div>
        <el-form label-width="150px" :rules="rules" :model="formData" ref="form">
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
                <el-form-item label="处置方式：" prop="disposalType">
                    <el-select v-model="formData.disposalType" @change="handleDisposalChange">
                        <el-option v-for="item in problemDisposeOptions" :label="item.label" :value="item.value" :key="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="谈话函询：" v-if="formData.disposalType === PROBLEM_DISPOSE.TANHUA" prop="tanhua">
                    <el-row :gutter="20" class="item-content-row">
                        <el-col :span="10">
                            <el-select v-model="formData.type" @change="handleStatusChange">
                                <el-option v-for="item in MANAGE_STATUS_OPTIONS" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="14" v-if="formData.type == '1'">
                            <el-select v-model="formData.secendType">
                                <el-option v-for="item in TALK_MEASUER_OPTIONS[formData.type]" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="初步核实：" v-if="formData.disposalType === PROBLEM_DISPOSE.HESHI" prop="chubu">
                    <el-row :gutter="20" class="item-content-row">
                        <el-col :span="10">
                            <el-select v-model="formData.type" @change="handleStatusChange">
                                <el-option v-for="item in MANAGE_STATUS_OPTIONS" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="14">
                            <el-select v-model="formData.secendType">
                                <el-option v-for="item in VERIFY_MEASURE_OPTIONS[formData.type]" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="办结时间：" v-if="formData.disposalType === PROBLEM_DISPOSE.HESHI" prop="closeTime">
                   <el-date-picker
                        v-model="formData.closeTime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input type="textarea" :rows="4" v-model="formData.remark"></el-input>
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
    import {
        TALK_MEASUER_OPTIONS, VERIFY_MEASURE_OPTIONS, TALK_MEASUER,
        VERIFY_MEASURE, MANAGE_STATUS_OPTIONS, MANAGE_STATUS, PROBLEM_DISPOSE_OPTIONS, PROBLEM_DISPOSE
    } from '../common'
    import emitter from '@/mixins/emitter.mixin'
    import SelectDept from 'components/formItem/SelectDept'
    import {
		getAccreditGroup
	} from 'api/archives/index';
    import {problemClueAdd, problemClueDetail, problemClueUpdate} from 'api/clue'
	export default {
		name: "ClueMng",
        mixins: [emitter],
        components: {SelectDept},
		data() {
            this.TALK_MEASUER_OPTIONS = {
                [MANAGE_STATUS.PROCESS]: TALK_MEASUER_OPTIONS.filter(item => [TALK_MEASUER.HESHI].includes(item.value)),
                [MANAGE_STATUS.CONCLUSION]: TALK_MEASUER_OPTIONS.filter(item => [TALK_MEASUER.CHULI, TALK_MEASUER.HUIFU].includes(item.value))
            }
            this.VERIFY_MEASURE_OPTIONS = {
                [MANAGE_STATUS.PROCESS]: VERIFY_MEASURE_OPTIONS.filter(item => [VERIFY_MEASURE.LIAN, VERIFY_MEASURE.ZANCUN].includes(item.value)),
                [MANAGE_STATUS.CONCLUSION]: VERIFY_MEASURE_OPTIONS.filter(item => [VERIFY_MEASURE.LIAOJIE, VERIFY_MEASURE.TANHUA, VERIFY_MEASURE.CHULI].includes(item.value))
            }
            this.MANAGE_STATUS_OPTIONS = MANAGE_STATUS_OPTIONS
            this.PROBLEM_DISPOSE_OPTIONS = PROBLEM_DISPOSE_OPTIONS
            this.PROBLEM_DISPOSE = PROBLEM_DISPOSE
            this.rules = {
                zhuti: {required: true, validator: (rule, val, cb) => {
                    const {undertakerOrg} = this.formData
                    let params = undefined
                    if (!undertakerOrg.length) params = new Error('请选择承办单位')
                    cb(params)
                }},
                signatureTime: {required: true, message: '请选择签批时间', trigger: 'blur'},
                disposalType: {required: true, message: '请选择处置方式', trigger: 'blur'},
                tanhua: {required: true, validator: (rule, val, cb) => {
                    cb(
                        (this.formData.type == '1' && this.formData.secendType) || this.formData.type == '0'
                        ? undefined
                        : new Error('请选择')
                    )
                }},
                chubu: {required: true, validator: (rule, val, cb) => 
                    cb(
                        this.formData.type && this.formData.secendType
                        ? undefined
                        : new Error('请选择')
                    )
                },
                closeTime: {required: true, message: '请选择办结时间', trigger: 'blur'},
            }
			return {
                formData: {
                    siteGroup: [],
                    undertakerOrg: [],
                    signatureTime: '',
                    disposalType: undefined,
                    type: '',
                    secendType: '',
                    remark: '',
                    closeTime: ''
                },
                siteList: [],
                isRecord: false,  // 判断是否已经进入立案阶段
                btnLoading: false
			}
		},
        created() {
            this.dispatch('AddClue', 'getParent', this)
            this.getSiteGroup()
            if (this.sParent.isEdit) this.getDetail()
            else this.$nextTick(() => {
                this.$refs['selDept'].deptIds = [100004059]
                this.formData.undertakerOrg = [{
                    orgName: '纪检监察室',
                    orgId: 100004059
                }]
            })
        },
        computed: {
            problemDisposeOptions() {
                return this.PROBLEM_DISPOSE_OPTIONS.map(item =>({
                            ...item,
                            disabled: this.isRecord && [PROBLEM_DISPOSE.DAICHA, PROBLEM_DISPOSE.LIAOJIE].includes(item.value)
                                    ? true
                                    : false
                        }))
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
            postData() {
                const isStop = [PROBLEM_DISPOSE.DAICHA, PROBLEM_DISPOSE.LIAOJIE].includes(this.formData.disposalType)
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
                if (isStop) {
                    data.type = MANAGE_STATUS.CONCLUSION
                }
                const isEdit = this.sParent.isEdit && this.formData.id
                const fn = isEdit ? problemClueUpdate(data) : problemClueAdd(this.sParent.id, data)
                this.btnLoading = true
                fn.then(res => {
                    if (res?.status === 200) {
                        this.$notify.success('操作成功')
                        if (isStop) {
                            this.cancel()
                        } else {
                            if (isEdit) {
                                this.sParent.available.push('4')
                                this.sParent.setTab('4')
                            } else {
                                this.sParent.setTab('4')
                                this.sParent.setAvaiTab(['4'])
                            }
                        }
                    } else {
                        this.$message.error(res.msg)
                    }
                }).finally(() => this.btnLoading = false)
            },
            getDetail() {
                problemClueDetail(this.sParent.id).then(res => {
                    if (res?.status === 200) {
                        this.initData(res.data)
                    }
                })
            },
            initData(data) {
                this.formData = {
                    ...data,
                    siteGroup: (data.undertakerGroup || []).map(item => item.groupId)
                }
                this.isRecord = [PROBLEM_DISPOSE.TANHUA, PROBLEM_DISPOSE.HESHI].includes(data.disposalType)
                this.$refs['selDept'].deptIds = (data.undertakerOrg || []).map(item => item.orgId)
                // // 如果直接进入问题线索页面，并且已经有新增过数据且需要立案，跳转到立案页面
                // if (this.isRecord && !this.sParent.available.includes('4')) {
                //     this.sParent.available.push('4')
                //     this.sParent.setTab('4')
                // }
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
            handleOther() {
                this.sParent.handleOtherInfo()
            },
            handleDisposalChange() {
                this.formData.type = ''
                this.formData.secendType = ''
                this.formData.closeTime = ''
            },
            handleStatusChange() {
                this.formData.secendType = ''
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
            }
        }
	}
</script>

<style lang="scss" scoped>
    @import '../form-common.scss';

</style>