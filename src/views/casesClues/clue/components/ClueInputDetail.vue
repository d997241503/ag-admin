<template>
	<div class="app-container">
        <div class="other-info">
            <span class="click-text" @click="$emit('otherInfo')">线索及案件其他信息</span>
        </div>
        <el-form label-width="150px" ref="form" :model="data">
            <div class="content-title">线索来源：</div>
            <div class="content-form">
                <el-form-item label="线索类型：">
                    <div class="form-text">{{clueSourceMap[data.clueType]}}</div>
                    <div class="form-text"><span v-if="data.secendClueType">{{turnTypeMap[data.secendClueType]}}；</span>{{data.secendClueTypeRemark}}</div>
                    <div class="form-text">{{clueTypeMap[data.clueClassification]}}</div>
                </el-form-item>
                <el-form-item label="办理时限：">
                    <div class="form-text">{{data.processTimeLimit}}</div>
                </el-form-item>
            </div>
            <div class="content-title">线索情况：</div>
            <div class="content-form">
                <el-form-item label="线索编号：">
                    <div class="form-text">{{data.clueNum}}</div>
                </el-form-item>
                <el-form-item label="被反映单位/人：">
                    <div v-for="(person, index) in data.member" :key="person.key" class="line-area">
                        <div class="form-text">
                            {{person.orgName}}；
                            <span v-if="person.name">{{person.name}}；</span>
                            <span v-if="person.rank">{{rankMap[person.rank]}}；</span>
                        </div>
                         <div class="form-text">{{person.remark}}</div>
                    </div>
                </el-form-item>
                <el-form-item label="线索情况：">
                    <div class="form-text">{{data.clueSituation}}</div>
                </el-form-item>
            </div>
        </el-form>
	</div>
</template>

<script>
    import {getMap, TURN_TYPE_OPTIONS, CLUE_TYPE_OPTIONS, RANK_OPTIONS, CLUE_SOURCE_OPTIONS} from '../common'
    import {clueDetail} from 'api/clue'
	export default {
		name: "ClueMng",
		data() {
            this.turnTypeMap = getMap(TURN_TYPE_OPTIONS)
            this.clueTypeMap = getMap(CLUE_TYPE_OPTIONS)
            this.rankMap = getMap(RANK_OPTIONS)
            this.clueSourceMap = getMap(CLUE_SOURCE_OPTIONS)
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
                clueDetail(this.$route.query.id).then(res => {
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
    .item-btn {
        position: absolute;
        left: calc(100% + 15px);
        display: flex;
        .btn-info {
            margin-right: 10px;
            cursor: pointer;
        }
    }
</style>