<template>
	<div class="tier-page content">
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="专项监督事项" name="first" class="tab-content">
				<div style="width: 70%;margin:10px auto;">
					<PlanPatrolInfo class="content-height" v-if="name === 'first'" @refreshData="getDetailInfo" @cancel="cancel"></PlanPatrolInfo>
					<PlanPatrolDetail class="content-height" v-else :superviseOrgInfo="detailInfo"></PlanPatrolDetail>
				</div>
			</el-tab-pane>
			<el-tab-pane label="监督报告" name="second" class="tab-content" :disabled="name == 'first'">
				<div style="width: 70%;margin:10px auto;">
					<ProcessImpInfo class="content-height" ref="ProcessImpInfo" @refreshData="getDetailInfo" @finish="handleFinish" :operation="operation" @cancel="cancel"></ProcessImpInfo>
				</div>
			</el-tab-pane>
			<el-tab-pane label="整改情况" name="third" class="tab-content" :disabled="name == 'first'|| name == 'second'">
				<div style="width: 70%;margin:10px auto;">
					<ReportRectificationInfo class="content-height" ref="ReportRectificationInfo" @refreshData="getDetailInfo" @cancel="cancel"></ReportRectificationInfo>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import PlanPatrolInfo from './components/planPatrolInfo';
	import ProcessImpInfo from './components/processImpInfo';
	import ReportRectificationInfo from './components/reportRectificationInfo';
	import PlanPatrolDetail from './components/planPatrolDetail';
	import {
		getToken
	} from 'utils/auth';
	import {
		mapGetters
	} from 'vuex';
     import {supervisionOrgDetail} from 'api/special'
	export default {
		data() {
			return {
				activeName: 'first',
				title: '',
				baseData: {
					dateId: 0
				},
				operation: '',
				name: 'first',
                detailInfo: {}
			}
		},
		components: {
			PlanPatrolInfo,
			ProcessImpInfo,
			ReportRectificationInfo,
			PlanPatrolDetail,
		},
		beforeRouteLeave(to, from, next) {
			const tranferParams = {
				id: this.$route.query.pageId,
			};
		
			localStorage.setItem(
				'specialDetailParams',
				JSON.stringify(tranferParams),
			);
			
			next();
		},
		created() {
			this.operation = this.$route.query.operation;
			this.$route.query.name ? this.name = this.$route.query.name : this.name = 'first';
			this.$route.query.name ? this.activeName = this.$route.query.name : this.activeName = 'first';
			if(this.$route.query.operation == 'detail') this.activeName = 'first';
            this.getDetailInfo()
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

			// // 获取基本信息
			getBaseData(data, val) {
				if (val) this.activeName = val;
			},

            handleFinish() {
                this.name = 'third'
                this.activeName = 'third'
            },
            getDetailInfo() {
                const id = this.$route.query.id
                if (id) {
                    supervisionOrgDetail(id).then((res) => {
                        if (res?.status === 200) {
                            this.detailInfo = res.data
                            this.$nextTick(() => {
                                this.$refs['ProcessImpInfo'].init(this.detailInfo)
                                this.$refs['ReportRectificationInfo'].init(this.detailInfo)
                            })
                        }
                    })
                }
            },
            cancel() {
                this.$router.push({
                    path: '/filesImplementation/special/specialDetail',
                    query: {
                        id: this.$route.query.superviseId
                    }
                })
            }
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
