<template>
	<div class="tier-page content">
		<!-- <div @click="goBack()" class="go-back-img">
			<img src="~@/assets/img/go_back.png" alt="返回"></img>
		</div> -->
		<!-- {{operation}}{{activeName}}{{name}} -->
		<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
			<el-tab-pane label="巡查计划" name="first" class="tab-content">
				<div style="width: 70%;margin:10px auto;">
					<PlanPatrolDetail class="content-height" v-if="operation == 'detail' || ( operation == 'add' && (name == 'second'|| name == 'third'|| name == 'fourth'|| name == 'fifth' || name == 'sixth') )"></PlanPatrolDetail>
					<PlanPatrolInfo class="content-height" v-else @refreshData="getBaseData"></PlanPatrolInfo>
				</div>
			</el-tab-pane>
			<!-- :disabled="baseData.dateId == 0 || baseData.dateId == undefined" -->
			<el-tab-pane label="实施过程" name="second" class="tab-content" :disabled="name == 'first'">
				<div style="width: 100%;margin:10px auto;">
					<ProcessImpDetail class="content-height" v-if="operation == 'detail' || ( operation == 'add' && (name == 'third'|| name == 'fourth'|| name == 'fifth' || name == 'sixth') )"></ProcessImpDetail>
					<ProcessImpInfo class="content-height" v-else @refreshData="getBaseData"></ProcessImpInfo>
				</div>
			</el-tab-pane>
			<el-tab-pane label="整改报告" name="third" class="tab-content" :disabled="name == 'first'|| name == 'second'">
				<div style="width: 70%;margin:10px auto;">
					<ReportRectificationDetail class="content-height" v-if="operation == 'detail' || ( operation == 'add' && (name == 'fourth'|| name == 'fifth' || name == 'sixth') )"></ReportRectificationDetail>
					<ReportRectificationInfo class="content-height" v-else @refreshData="getBaseData"></ReportRectificationInfo>
				</div>
			</el-tab-pane>
			<el-tab-pane label="巡查反馈" name="fourth" class="tab-content" :disabled="name == 'first'|| name == 'second'|| name == 'third'">
				<div style="width: 70%;margin:10px auto;">
					<FeedbackPatroDetail class="content-height" v-if="operation == 'detail' || ( operation == 'add' && (name == 'fifth' || name == 'sixth') )"></FeedbackPatroDetail>
					<FeedbackPatrolInfo class="content-height" v-else @refreshData="getBaseData"></FeedbackPatrolInfo>
				</div>
			</el-tab-pane>
			<el-tab-pane label="整改情况" name="fifth" class="tab-content" :disabled="name == 'first'|| name == 'second'|| name == 'third'|| name == 'fourth'">
				<div style="width: 100%;margin:10px auto;">
					<SituationRectificationDetail class="content-height" v-if="operation == 'detail' || ( operation == 'add' && (name == 'sixth') )"></SituationRectificationDetail>
					<SituationRectificationInfo class="content-height" v-else @refreshData="getBaseData"></SituationRectificationInfo>
				</div>
			</el-tab-pane>
			<el-tab-pane label="整改评价" name="sixth" class="tab-content" :disabled="name == 'first'|| name == 'second'|| name == 'third'|| name == 'fourth'|| name == 'fifth'">
				<div style="width: 70%;margin:10px auto;">
					<AssessmentDetail class="content-height" v-if="operation == 'detail'"></AssessmentDetail>
					<AssessmentInfo class="content-height" v-else @refreshData="getBaseData"></AssessmentInfo>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import PlanPatrolInfo from './components/planPatrolInfo';
	import ProcessImpInfo from './components/processImpInfo';
	import ReportRectificationInfo from './components/reportRectificationInfo';
	import FeedbackPatrolInfo from './components/feedbackPatrolInfo';
	import SituationRectificationInfo from './components/situationRectificationInfo';
	import AssessmentInfo from './components/assessmentInfo';
	import PlanPatrolDetail from './components/planPatrolDetail';
	import ProcessImpDetail from './components/processImpDetail';
	import ReportRectificationDetail from './components/reportRectificationDetail';
	import FeedbackPatroDetail from './components/feedbackPatroDetail';
	import SituationRectificationDetail from './components/situationRectificationDetail';
	import AssessmentDetail from './components/assessmentDetail';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				activeName: 'first',
				title: '',
				baseData: {
					dateId: 0
				},
				operation: '',
				name: 'first'
			}
		},
		components: {
			PlanPatrolInfo,
			ProcessImpInfo,
			ReportRectificationInfo,
			FeedbackPatrolInfo,
			SituationRectificationInfo,
			AssessmentInfo,
			PlanPatrolDetail,
			ProcessImpDetail,
			ReportRectificationDetail,
			FeedbackPatroDetail,
			SituationRectificationDetail,
			AssessmentDetail
		},
		created() {
			// this.baseData.dateId = this.$route.query.id === undefined ? 0 : this.$route.query.id;
			this.operation = this.$route.query.operation;
			this.$route.query.name ? this.name = this.$route.query.name : this.name = 'first';
			this.$route.query.name ? this.activeName = this.$route.query.name : this.activeName = 'first';
			if(this.$route.query.operation == 'detail') this.activeName = 'first';
		},
		computed: {
			...mapGetters([
				'category'
			]),
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			handleClick(tab, event) {
			},

			// // 获取基本信息
			getBaseData(data, val) {
				// if (data) {
				// 	this.baseData = data;
				// 	this.$refs.examSetTopic.init(this.baseData);
				// }
				// if (val) this.activeName = val;
			},

			// // 获取信息
			// getTopicData(data) {

			// }
		}
	}
</script>

<style lang="scss" scoped>
	.content {

		.content-body {
			width: 50%;
			margin: 0 auto;
			text-align: right;

			.form-item {
				width: 100%;
			}

			.form-text {
				color: #555555;
				text-align: left;
				word-wrap: break-word;
				word-break: normal;
			}
		}

		.content-height {
			height: calc(100vh - 280px);
			overflow: auto;
		}
	}
</style>
