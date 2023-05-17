<template>
	<div class="content">
		<div class="title">党和国家工作人员操办婚丧事宜事后报告表</div>
		<div class="table">
			<div style="width: 250px;height: 40px; float: right;">报告时间：{{dataObj.field0020}}</div>
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<!-- 报告人 -->
				<tr height="40">
					<td rowspan="2" width="86" class="label table-border-bottom-right">报告人</td>
					<td width="119" class="label table-border-bottom-right">姓名</td>
					<td width="245" class="label table-border-bottom-right">{{dataObj.field0002Str}}</td>
					<td width="104" class="label table-border-bottom-right">联系电话</td>
					<td class="label table-border-bottom table-row-right">{{dataObj.field0003}}</td>
				</tr>
				<tr height="60">
					<td class="label table-border-bottom-right">工作单位</br>及职务</td>
					<td colspan="3" class="value table-border-bottom table-row-right">{{dataObj.field0004}}</td>
				</tr>
				<!-- 婚丧事宜具体操办情况 -->
				<tr height="89">
					<td rowspan="6" class="label table-border-bottom-right">婚丧事宜</br>具体操办</br>情况</td>
					<td class="label table-border-bottom-right">操办事由</td>
					<td colspan="3" class="value table-border-bottom table-row-right">{{dataObj.field0005}}</td>
				</tr>
				<tr height="40">
					<td class="label table-border-bottom-right">操办时间</td>
					<td class="label table-border-bottom-right">{{dataObj.field0006}}</td>
					<td class="label table-border-bottom-right">操办地点</td>
					<td class="label table-border-bottom table-row-right">{{dataObj.field0007}}</td>
				</tr>
				<tr height="40">
					<td class="label table-border-bottom-right">车队规模</td>
					<td class="label table-border-bottom-right">{{dataObj.field0008}}</td>
					<td class="label table-border-bottom-right">车辆来源</td>
					<td class="label table-border-bottom table-row-right">{{dataObj.field0009}}</td>
				</tr>
				<tr height="40">
					<td class="label table-border-bottom-right">宴请桌数</td>
					<td class="label table-border-bottom-right">{{dataObj.field0010}}</td>
					<td class="label table-border-bottom-right">宴席标准</td>
					<td class="label table-border-bottom table-row-right">{{dataObj.field0011}}</td>
				</tr>
				<tr height="40">
					<td rowspan="2" class="label table-border-bottom-right">来客情况</td>
					<td class="label table-border-bottom-right">亲戚人数</td>
					<td colspan="2" class="value table-border-bottom table-row-right">{{dataObj.field0012}}</td>
				</tr>
				<tr height="40">
					<td class="label table-border-bottom-right">非亲戚人数</td>
					<td colspan="2" class="value table-border-bottom table-row-right">{{dataObj.field0013}}</td>
				</tr>
				<!-- 收受非亲戚礼金和贵重礼品情况 -->
				<tr height="40">
					<td rowspan="4" class="label table-border-bottom-right">收受非亲</br>戚礼金和</br>贵重礼品</br>情况</td>
					<td rowspan="3" class="label table-border-bottom-right">礼金</td>
					<td class="label table-border-bottom-right">收受金额（元）</td>
					<td colspan="2" class="value table-border-bottom table-row-right">{{dataObj.field0014}}</td>
				</tr>
				<tr height="40">
					<td class="label table-border-bottom-right">退回金额（元）</td>
					<td colspan="2" class="value table-border-bottom table-row-right">{{dataObj.field0015}}</td>
				</tr>
				<tr height="40">
					<td class="label table-border-bottom-right">上交金额（元）</td>
					<td colspan="2" class="value table-border-bottom table-row-right">{{dataObj.field0016}}</td>
				</tr>
				<tr height="80">
					<td class="label table-border-bottom-right">贵重礼品</td>
					<td colspan="3" class="value table-border-bottom table-row-right">
						<div v-if="dataObj.oaxtFormson0290 && dataObj.oaxtFormson0290.length" v-for="(item, index) in dataObj.oaxtFormson0290">
							{{item.field0025}}{{item.field0026 ? '、' : ''}}{{item.field0026}}
						</div>
					</td>
				</tr>
				<!-- 遵守规定/承诺情况 -->
				<tr height="150">
					<td colspan="2" class="label table-border-bottom-right">遵守规定/承诺情况</td>
					<td colspan="3" class="value table-border-bottom table-row-right">
						<div style="min-height: 70px;">{{dataObj.field0017}}</div>
						<div style="width: 200px;margin: 5px auto;font-size: 18px;">报告人签字：{{dataObj.field0019Str}}</div>
					</td>
				</tr>
				<!-- 单位纪检监察机关（机构）意见 -->
				<tr height="185">
					<td colspan="2" class="label table-border-bottom-right">单位纪检监察</br>机关（机构）意见</td>
					<td colspan="3" class="value table-border-bottom table-row-right">
						<div style="min-height: 120px;">{{dataObj.field0018}}</div>
						<div style="width: 180px;margin: 0 auto;font-size: 18px;">盖章：</div>
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
				// 	"field0002Str": "张珊",
				// 	"field0003": "15566663333",
				// 	"field0004": "工作单位及职务",
				// 	"field0005": "操办事由",
				// 	"field0006": "2017-05-20",
				// 	"field0007": "操办地点",
				// 	"field0008": "车队规模",
				// 	"field0009": "车辆来源",
				// 	"field0010": "宴请桌数",
				// 	"field0011": "宴席标准",
				// 	"field0012": "亲戚人数",
				// 	"field0013": "非亲戚人数",
				// 	"field0014": "收受金额（元）",
				// 	"field0015": "退回金额（元）",
				// 	"field0016": "上交金额（元）",
				// 	"oaxtFormson0290": [{
				// 		"field0025": "",
				// 		"field0026": ""
				// 	}],
				// 	"field0017": "遵守规定/承诺情况",
				// 	"field0019Str": "张珊",
				// 	"field0020": "2020-02-02",
				// 	"field0018": "机关（机构）意见",
				// 	"field0021": "盖章（暂未确定）"
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

			.value-text {
				display: flex;
				flex-wrap: wrap;
				height: 93px;
				line-height: 93px;
			}

			.hint-text {
				width: 100%;
				height: 30px;
				position: absolute;
				text-align: center;
				top: 8px;
				left: 5px;
			}
		}
	}
</style>
