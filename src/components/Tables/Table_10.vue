<template>
	<div class="content">
		<div class="title">重大事项请示报告制度执行情况</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td width="120" class="label table-border-bottom-right">党组织</td>
					<td colspan="2" class="label table-border-bottom-right">
						<div style="width: 280px;word-wrap:break-word">{{dataObj.field0001}}</div>
					</td>
					<td colspan="2" class="label table-border-bottom-right">报告时间</td>
					<td colspan="2" class="label table-border-bottom table-row-right">
						<div style="width: 260px;word-wrap:break-word">{{dataObj.field0002}}</div>
					</td>
				</tr>
				<tr height="60">
					<td class="label table-border-bottom-right">时间</td>
					<td width="164" class="label table-border-bottom-right">报告事项</td>
					<td colspan="2" class="label table-border-bottom-right">主要内容</td>
					<td colspan="2" class="label table-border-bottom-right">主送单位</td>
					<td width="164" class="label table-border-bottom table-row-right">备注</td>
				</tr>
				<tr v-if="dataObj.oaxtFormson1341 && dataObj.oaxtFormson1341.length" height="125" v-for="(item, index) in dataObj.oaxtFormson1341" :key="index">
					<td class="label table-border-bottom-right">{{item.field0004}}</td>
					<td width="164" class="label table-border-bottom-right">{{item.field0005}}</td>
					<td colspan="2" class="value table-border-bottom-right">{{item.field0006}}</td>
					<td colspan="2" class="label table-border-bottom-right">{{item.field0007}}</td>
					<td width="164" class="value table-border-bottom table-row-right">{{item.field0008}}</td>
				</tr>
			</table>
		</div>
		<div class="footer">
			注：至少每半年报告1次。
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// dataObj: {
				// 	"field0001": "党组织",
				// 	"field0002": "2022-02-22",
				// 	"oaxtFormson1341": [{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	},{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	},{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	},{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	},{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	},{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	},{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	},{
				// 		"field0004": "2021-04-01",
				// 		"field0005": "报告事项",
				// 		"field0006": "主要内容",
				// 		"field0007": "主送单位",
				// 		"field0008": "备注"
				// 	}]
				// },
				// list: [1, 2, 3, 4, 5, 6, 7, 8]
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
		font-size: $table-font-size-m;

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
