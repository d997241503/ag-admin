<template>
	<div class="content">
		<div class="title">操办婚礼事前报告表</div>
		<div class="table">
			<div style="width: 300px;height: 40px; float: right;">报告时间：{{dataObj.field0001}}</div>
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<!-- 报告人 -->
				<tr height="35">
					<td rowspan="2" width="174" class="table-border-bottom-right">报</br>告</br>人</td>
					<td width="162" class="table-border-bottom-right">姓名</td>
					<td width="155" class="table-border-bottom-right">性别</td>
					<td colspan="2" class="table-border-bottom table-row-right">工作单位及职务</td>
				</tr>
				<tr height="40">
					<td class="table-border-bottom-right">{{dataObj.field0002Str}}</td>
					<td class="table-border-bottom-right">{{dataObj.field0003Str}}</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0004}}</td>
				</tr>
				<!-- 婚礼相关当事人 -->
				<tr height="35">
					<td rowspan="7" class="table-border-bottom-right">婚</br>礼</br>相</br>关</br>当</br>事</br>人</td>
					<td width="162" class="table-border-bottom-right">当事人</td>
					<td width="155" class="table-border-bottom-right">姓名</td>
					<td colspan="2" class="table-border-bottom table-row-right">工作单位及职务</td>
				</tr>
				<tr height="35">
					<td class="table-border-bottom-right">婚礼男方</td>
					<td class="table-border-bottom-right">{{dataObj.field0005}}</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0006}}</td>
				</tr>
				<tr height="35">
					<td class="table-border-bottom-right">婚礼女方</td>
					<td class="table-border-bottom-right">{{dataObj.field0007}}</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0008}}</td>
				</tr>
				<tr height="35">
					<td class="table-border-bottom-right">男方父亲</td>
					<td class="table-border-bottom-right">{{dataObj.field0009}}</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0010}}</td>
				</tr>
				<tr height="35">
					<td class="table-border-bottom-right">男方母亲</td>
					<td class="table-border-bottom-right">{{dataObj.field0011}}</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0012}}</td>
				</tr>
				<tr height="35">
					<td class="table-border-bottom-right">女方父亲</td>
					<td class="table-border-bottom-right">{{dataObj.field0013}}</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0014}}</td>
				</tr>
				<tr height="35">
					<td class="table-border-bottom-right">女方母亲</td>
					<td class="table-border-bottom-right">{{dataObj.field0015}}</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0016}}</td>
				</tr>
				<!-- 婚礼具体事宜 -->
				<tr height="35">
					<td rowspan="5" class="table-border-bottom-right">婚</br>礼</br>具</br>体</br>事</br>宜</td>
					<td class="table-border-bottom-right">拟办时间</td>
					<td class="table-border-bottom-right">{{dataObj.field0017}}</td>
					<td width="149" class="table-border-bottom-right">拟办地点</td>
					<td class="table-border-bottom table-row-right">{{dataObj.field0018}}</td>
				</tr>
				<tr height="35">
					<td class="table-border-bottom-right">拟用车辆</td>
					<td class="table-border-bottom-right">{{dataObj.field0019}}</td>
					<td class="table-border-bottom-right">车辆来源</td>
					<td class="table-border-bottom table-row-right">{{dataObj.field0020}}</td>
				</tr>
				<tr height="60">
					<td class="table-border-bottom-right">宴请桌数</td>
					<td class="table-border-bottom-right">{{dataObj.field0021}}</td>
					<td class="table-border-bottom-right">宴席标准</td>
					<td class="table-border-bottom table-row-right">
						<div style="display: flex;">
							<div style="width: 80px;">{{dataObj.field0022}}</div>元/桌
						</div>
						<div style="font-size: 18px;">（含酒水）</div>
					</td>
				</tr>
				<tr height="35">
					<td rowspan="2" class="table-border-bottom-right">拟邀对象</td>
					<td class="table-border-bottom-right">亲戚人数</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0023}}</td>
				</tr>
				<tr height="67">
					<td class="table-border-bottom-right">非亲戚人数及邀请范围</td>
					<td colspan="2" class="table-border-bottom table-row-right">{{dataObj.field0024}}</td>
				</tr>
				<!-- 婚礼具体事宜 -->
				<tr height="250">
					<td class="table-border-bottom-right">承</br>诺</br>事</br>宜</td>
					<td colspan="4" class="value-box table-border-bottom table-row-right">
						<div class="hint-text">
							本人承诺严格遵守相关纪律，执行《关于党和国家工作人员操办婚丧喜庆事宜的暂行规定》
							。不收受或者变相收受任何单位和亲戚以外人员的礼金及贵重礼品，不由任何单位或者个人支付应由本人承担的操办费用，不违规动用公务用车。按规定报告操办情况 。
						</div>
						<div class="text-one">报告人签字：{{dataObj.field0025Str}}</div>
						<div class="text-two">（以本人身份证为准）</div>
						<div class="text-three">{{dataObj.field0026}}</div>
					</td>
				</tr>
			</table>
		</div>
		<div class="footer"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// dataObj: {
				// 	"field0001": "2022-02-02",
				// 	"field0002Str": "张珊",
				// 	"field0003Str": "男",
				// 	"field0004": "工作单位及职务",
				// 	"field0005": "李仕",
				// 	"field0006": "婚礼男方工作单位及职务",
				// 	"field0007": "王武",
				// 	"field0008": "婚礼女方工作单位及职务",
				// 	"field0009": "赵露",
				// 	"field0010": "男方父亲工作单位及职务",
				// 	"field0011": "孙琪",
				// 	"field0012": "男方母亲工作单位及职务",
				// 	"field0013": "钱岜",
				// 	"field0014": "女方父亲工作单位及职务",
				// 	"field0015": "陆玖",
				// 	"field0016": "女方母亲工作单位及职务",
				// 	"field0017": "2022-02-02",
				// 	"field0018": "拟办地点",
				// 	"field0019": "拟用车辆",
				// 	"field0020": "车辆来源",
				// 	"field0021": "宴请桌数",
				// 	"field0022": "500",
				// 	"field0023": "亲戚人数",
				// 	"field0024": "非亲戚人数及邀请范围",
				// 	"field0025Str": "张珊",
				// 	"field0026": "2022-02-02"
				// }
			}
		},
		props: {
			dataObj: {
				type: Object,
				default: {}
			}
		},
		watch: {
			dataObj(newVal, oldVal) {
				this.dataObj = newVal;
			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	@import '../../styles/tables.scss';
	@import '../../styles/tables-variables.scss';

	.content {
		font-size: $table-font-size-s;

		.table {
			text-align: center;

			.value-box {
				position: relative;
				text-align: left;
				line-height: 25px;

				.hint-text {
					position: absolute;
					padding: 0 5px;
					top: 8px;
					text-indent: 40px;
					text-align: justify;
				}

				.text-one {
					width: 330px;
					position: absolute;
					top: 130px;
					right: 0;
				}

				.text-two {
					width: 150px;
					position: absolute;
					top: 130px;
					right: 0;
				}

				.text-three {
					width: 150px;
					position: absolute;
					top: 210px;
					padding-left: 50px;
				}
			}
		}
	}
</style>
