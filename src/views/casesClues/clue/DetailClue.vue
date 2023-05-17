<template>
	<div class="add-clue app-container">
		<el-tabs v-model="activeTab" type="card">
			<el-tab-pane label="线索录入" name="1">
				<ClueInput @otherInfo="handleOtherInfo"></ClueInput>
			</el-tab-pane>
			<el-tab-pane label="信访线索" name="2">
				<Letter @otherInfo="handleOtherInfo"></Letter>
			</el-tab-pane>
			<el-tab-pane label="问题线索" name="3">
				<Problem @otherInfo="handleOtherInfo"></Problem>
			</el-tab-pane>
            <el-tab-pane label="立案" name="4">
                <Record @otherInfo="handleOtherInfo"></Record>
            </el-tab-pane>
		</el-tabs>
        <el-dialog :title="'线索及案件其他信息'" :close-on-click-modal="false" :visible.sync="dialogVisible">
            <el-form :model="data" ref="form" label-width="150px">
                <el-form-item class="content-form-item" label="线索涉及领域：" prop="field">
                    <div class="form-text">
                        <span v-for="(item,index) in data.involvedField" :key="index">{{clueFieldMap[item]}}；</span>
                    </div>
                </el-form-item>
                <el-form-item class="content-form-item" label="档案编号：" prop="number">
                    <div class="form-text">{{data.archivesNum}}</div>
                </el-form-item>
            </el-form>
        </el-dialog>
	</div>
</template>

<script>
	import ClueInput from './components/ClueInputDetail'
	import Letter from './components/LetterDetail'
	import Problem from './components/ProblemDetail'
	import Record from './components/RecordDetail'
    import {getMap, CLUE_FIELD_OPTIONS} from './common'
    import {involvedFieldDetail} from 'api/clue'
	export default {
		data() {
            this.clueFieldMap = getMap(CLUE_FIELD_OPTIONS)
			return {
				activeTab: 'first',
                step: 'first',
                dialogVisible: false,
                dialogForm: {
                    field: [],
                    number: ''
                },
                data: {}
			}
		},
		components: {
            ClueInput, Letter, Problem, Record
		},
		created() {
            this.activeTab = this.$route.query.activeTab || '1'
            this.getDetail()
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
            getDetail() {
                if(!this.$route.query.id) return;
                involvedFieldDetail(this.$route.query.id).then(res => {
                    if (res?.status === 200) {
                        this.data = res.data
                    }
                })
            },
            handleOtherInfo() {
                this.dialogVisible = true
            },
		}
	}
</script>

<style lang="scss" scoped>
    @import './form-common.scss';
    .add-clue {
        background-color: #fff;
    }
    .other-info {
        margin-bottom: 20px;
        margin-right: 100px;
        text-align: right;
    }
</style>
