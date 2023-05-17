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
                <el-form-item label="签批时间：" prop="signatureTime">
                    <div class="form-text">{{data.signatureTime}}</div>
                </el-form-item>
                <el-form-item label="处置方式：" prop="disposalType">
                    <div class="form-text">
                        <span v-if="data.disposalType">{{problemDisposeMap[data.disposalType]}}; </span>
                        <span v-if="data.type">{{manageStatus[data.type]}}; </span>
                        <span v-if="data.secendType">{{measureMap[data.secendType]}}; </span>
                        <span v-if="data.closeTime">{{data.closeTime}};</span>
                    </div>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <div class="form-text">{{data.remark}}</div>
                </el-form-item>
            </div>
        </el-form>
	</div>
</template>

<script>
    import {
        getMap, PROBLEM_DISPOSE_OPTIONS, TALK_MEASUER_OPTIONS, VERIFY_MEASURE_OPTIONS, MANAGE_STATUS_OPTIONS
    } from '../common'
    import emitter from '@/mixins/emitter.mixin'
    import {problemClueDetail} from 'api/clue'
	export default {
		name: "ClueMng",
        mixins: [emitter],
		data() {
            this.problemDisposeMap = getMap(PROBLEM_DISPOSE_OPTIONS)
            this.measureMap = getMap(TALK_MEASUER_OPTIONS.concat(VERIFY_MEASURE_OPTIONS))
            this.manageStatus = getMap(MANAGE_STATUS_OPTIONS)
			return {
                data: {
                    undertakerGroup: [],
                    undertakerOrg: []
                }
			}
		},
        created() {
            this.getDetail()
        },
        methods: {
            getDetail() {
                if(!this.$route.query.id) return;
                problemClueDetail(this.$route.query.id).then(res => {
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