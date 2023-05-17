<template>
	<div class="content">
		<div class="title">提拔任用、评先评优和表彰奖励的廉洁审核情况（总支、支部书记填）</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td width="120" class="label table-border-bottom-right">党组织</td>
					<td colspan="2" class="label table-border-bottom-right">
						<div style="width: 280px;word-wrap:break-word">{{dataObj.field0001}}</div>
					</td>
					<td colspan="2" class="label table-border-bottom-right">报告时间</td>
					<td colspan="2" class="label table-border-bottom table-row-right">
						<div style="width: 245px;word-wrap:break-word">{{dataObj.field0002}}</div>
					</td>
				</tr>
				<tr height="60">
					<td class="label table-border-bottom-right">时间</td>
					<td width="164" class="label table-border-bottom-right">审核事由</td>
					<td colspan="2" class="label table-border-bottom-right">被审人员</td>
					<td colspan="2" class="label table-border-bottom-right">审核结果</td>
					<td width="164" class="label table-border-bottom table-row-right">处理情况</td>
				</tr>
				<tr v-if="dataObj.oaxtFormson1333 && dataObj.oaxtFormson1333.length" height="172" v-for="(item, index) in dataObj.oaxtFormson1333" :key="index">
					<td class="label table-border-bottom-right">{{item.field0004}}</td>
					<td width="204" class="label table-border-bottom-right">{{item.field0005}}</td>
					<td colspan="2" class="label table-border-bottom-right">{{item.field0006}}</td>
					<td colspan="2" class="label table-border-bottom-right">{{item.field0007}}</td>
					<td width="164" class="label table-border-bottom table-row-right">{{item.field0008}}</td>
				</tr>
			</table>
		</div>
		<div class="footer">
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
				// 	"oaxtFormson1333": [{
				// 		"field0004": "2021-08-23",
				// 		"field0005": "审核事由",
				// 		"field0006": "被审人员",
				// 		"field0007": "审核结果",
				// 		"field0008": "处理情况"
				// 	},{
				// 		"field0004": "2021-08-24",
				// 		"field0005": "审核事由",
				// 		"field0006": "被审人员",
				// 		"field0007": "审核结果",
				// 		"field0008": "处理情况"
				// 	},{
				// 		"field0004": "2021-08-25",
				// 		"field0005": "审核事由",
				// 		"field0006": "被审人员",
				// 		"field0007": "审核结果",
				// 		"field0008": "处理情况"
				// 	},{
				// 		"field0004": "2021-08-26",
				// 		"field0005": "审核事由",
				// 		"field0006": "被审人员",
				// 		"field0007": "审核结果",
				// 		"field0008": "处理情况"
				// 	},{
				// 		"field0004": "2021-08-27",
				// 		"field0005": "审核事由",
				// 		"field0006": "被审人员",
				// 		"field0007": "审核结果",
				// 		"field0008": "处理情况"
				// 	}]
				// },
				// list: [1, 2, 3, 4, 5]
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
