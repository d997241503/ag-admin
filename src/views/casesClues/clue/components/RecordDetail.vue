<template>
	<div class="app-container">
        <div class="other-info">
            <span class="click-text" @click="$emit('otherInfo')">线索及案件其他信息</span>
        </div>
        <el-form label-width="150px" ref="form">
            <div class="content-form">
                <el-form-item label="承办主体：" prop="zhuti">
                    <div class="form-text">
                        <span v-for="(item,index) in data.undertakerOrg" :key="index">{{item.orgName ? item.orgName : item.deptName}}；</span>
                    </div>
                    <div class="form-text">
                        <span v-for="(item,index) in data.undertakerGroup" :key="index">{{item.groupName}}；</span>
                    </div>
                </el-form-item>
                <el-form-item label="立案时间：" prop="registerTime">
                    <div class="form-text">{{data.registerTime}}</div>
                </el-form-item>
                <el-form-item label="立案类型：" prop="registerType">
                    <el-row :gutter="20" class="item-content-row">
                        <el-col :span="16">
                            <div class="form-text">
                                <span v-for="(item,index) in data.registerType" :key="index">{{recordTypeMap[item]}}；</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <el-checkbox v-model="data.registerSuperiorDealWith" disabled>立案后移交上级纪委监委</el-checkbox>
                        </el-col>
                    </el-row>
                    <el-checkbox v-if="data.superiorDealWith" v-model="data.superiorDealWith" @change="handleInspect" disabled>由上级纪委监委处理</el-checkbox>
                </el-form-item>
                <template v-if="!data.superiorDealWith">
                    <el-form-item label="移交审理：" prop="transferTrialTime">
                        <div class="form-text">{{data.transferTrialTime}}</div>
                    </el-form-item>
                    <el-form-item label="办理状态：" prop="handlingStatus">
                        <div class="form-text">{{manageStatusMap[data.handlingStatus]}}</div>
                    </el-form-item>
                </template>
            </div>
            <template v-if="!data.superiorDealWith">
                <div v-if="data.handlingStatus === MANAGE_STATUS.CONCLUSION" class="content-title">处理处分结果：</div>
                <div v-if="data.handlingStatus === MANAGE_STATUS.CONCLUSION" class="content-form">
                    <el-form-item label="处理处分：" prop="chuli">
                        <template v-for="(member, mIndex) in data.member">
                            <div v-if="member.type == '1'" :key="mIndex" class="line-area">
                                <el-row>
                                    <el-col :span="2">
                                        <span>{{member.name}}：</span>
                                    </el-col>
                                    <el-col :span="22" v-for="(punishment, pIndex) in member.punishment" :gutter="20" class="item-content-row row-gap" :key="pIndex">
                                        <div class="form-text">
                                            <span>{{punishment.punishmentTypeName}}；</span>
                                            <span>{{punishment.secendPunishmentTypeName}}；</span>
                                            <span>{{punishment.effectiveTime}}</span>
                                        </div>
                                    </el-col>
                                 </el-row>
                                <el-row :gutter="20" class="item-content-row">
                                    <el-col :span="24" :offset="2">
                                        <el-checkbox v-model="member.havePostChange" disabled>职务调整</el-checkbox>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" class="item-content-row">
                                    <el-col :span="24" :offset="2">
                                        <div class="form-text">{{member.punishmentRemark}}</div>
                                    </el-col>
                                </el-row>
                            </div>
                            <div v-else class="line-area" :key="mIndex">
                                <el-row :gutter="20" class="item-content-row row-gap">
                                    <el-col :span="8">
                                        <span>{{member.orgName}}：</span>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="form-text">{{member.punishmentRemark}}：</div>
                                    </el-col>
                                    <el-col :span="8">
                                        <div class="form-text">{{member.punishmentNum}}</div>
                                    </el-col>
                                </el-row>
                            </div>
                        </template>
                    </el-form-item>
                </div>
                <div class="content-form">
                    <el-form-item label="备注：" prop="remark">
                        <div class="form-text">{{data.remark}}</div>
                    </el-form-item>
                </div>
            </template>
        </el-form>
	</div>
</template>

<script>
    import {getMap, RECORD_TYPE_OPTIONS, MANAGE_STATUS_OPTIONS, MANAGE_STATUS} from '../common'
    import emitter from '@/mixins/emitter.mixin'
    import {registerDetail} from 'api/clue'
	export default {
		name: "ClueMng",
        mixins: [emitter],
		data() {
            this.recordTypeMap = getMap(RECORD_TYPE_OPTIONS)
            this.manageStatusMap = getMap(MANAGE_STATUS_OPTIONS)
            this.MANAGE_STATUS = MANAGE_STATUS
			return {
                data: {}
			}
		},
        created() {
            this.getDetail()
        },
        methods: {
            getDetail() {
                if(!this.$route.query.id) return;
                registerDetail(this.$route.query.id).then(res => {
                    if (res?.status === 200) {
                        this.data = res.data
                    }
                })
            },
        }
	}
</script>

<style lang="scss" scoped>
    @import '../form-common.scss';

</style>