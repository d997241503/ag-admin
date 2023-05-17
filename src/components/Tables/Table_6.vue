<template>
	<div class="content">
		<div class="title">约谈函询、建议通报整改落实情况</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td width="179" class="label table-border-bottom-right">党组织（部门）</td>
					<td width="262" class="value table-border-bottom-right">{{dataObj.field0001}}</td>
					<td width="88" class="label table-border-bottom-right">事项</td>
					<td class="value table-border-bottom table-row-right">{{dataObj.field0002}}</td>
				</tr>
				<tr height="60">
					<td class="label table-border-bottom-right">时间和函号</td>
					<td colspan="3" class="value table-border-bottom table-row-right">{{dataObj.field0004}}</td>
				</tr>
				<tr height="425">
					<td colspan="4" style="position: relative;" class="value table-border-bottom table-row-right">
						<div class="hint-text" style="text-align: left;">约谈函询、建议通报的重点内容：</div>
						<div class="text-info">{{dataObj.field0005}}</div>
					</td>
				</tr>
				<tr height="425">
					<td colspan="4" style="position: relative;" class="value table-border-bottom table-row-right">
						<div class="hint-text" style="text-align: left;">整改落实情况：</div>
						<div class="text-info">{{dataObj.field0006}}</div>
					</td>
				</tr>
				<tr height="115">
					<td class="label table-border-bottom-right">备注</td>
					<td colspan="3" class="value table-border-bottom table-row-right">
						<div>{{dataObj.field0007}}</div>
					</td>
				</tr>
			</table>
		</div>
		<div class="footer">
			注：包括立体巡查、纪检监察室下发的各类建议书、通报按时完结等。
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// dataObj: {
				// 	"field0001": "党组织",
				// 	"field0002": "事项",
				// 	"field0003": "时间和函号",
				// 	"field0004": "约谈函询",
				// 	"field0005": "建议通报的重点内容",
				// 	"field0006": "整改落实情况",
				// 	"field0007": "备注"
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
				left: 10px;
			}
		}
	}
</style>
