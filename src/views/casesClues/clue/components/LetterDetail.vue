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
                <el-form-item label="核实了解情况：" prop="situation">
                    <div class="form-text">{{data.situation}}</div>
                </el-form-item>
                <el-form-item label="处置结果：" prop="chuzhi">
                    <template v-for="(person, index) in data.member">
                        <el-row :gutter="20" class="item-content-row line-area" :key="index">
                            <div class="form-text">
                                <span v-if="person.type == '1'">{{person.name}}；</span>
                                <span v-if="person.type == '2'">{{person.orgName}}；</span>
                                <span v-if="person.punishmentType">{{letterMap[person.punishmentType]}}；</span>
                                <span v-if="person.punishmentTime">{{person.punishmentTime}}；</span>
                            </div>
                            <div class="form-text">
                                <span>{{person.punishmentDetails}}</span>
                            </div>
                        </el-row>
                    </template>
                </el-form-item>
                <el-form-item label="反馈情况：" prop="feedbackDetails">
                    <el-checkbox v-model="data.haveFeedback" disabled>向信访人反馈处理情况</el-checkbox>
                    <div class="form-text">{{data.feedbackDetails}}</div>
                </el-form-item>
            </div>
        </el-form>
	</div>
</template>

<script>
    import {getMap, LETTER_DISPOSE} from '../common'
    import emitter from '@/mixins/emitter.mixin'
    import {letterClueDetail} from 'api/clue'
	export default {
		name: "ClueMng",
        mixins: [emitter],
		data() {
            this.letterMap = getMap(LETTER_DISPOSE)
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
                letterClueDetail(this.$route.query.id).then(res => {
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