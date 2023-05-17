<template>
	<div class="content">
		<div class="title">群众来信来访问题线索处置情况</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td colspan="2" class="label table-border-bottom-right">党组织（部门）</td>
					<td colspan="3" class="label table-border-bottom-right">{{dataObj.field0001}}</td>
					<td class="label table-border-bottom-right">来信（访）人</td>
					<td class="label table-border-bottom table-row-right">{{dataObj.field0002}}</td>
				</tr>
				<tr height="60">
					<td colspan="2" class="label table-border-bottom-right">来信（访）时间</td>
					<td width="125" class="label table-border-bottom-right">{{dataObj.field0003 | filterTime}}</td>
					<td width="78" class="label table-border-bottom-right">地点</td>
					<td width="125" class="label table-border-bottom-right">{{dataObj.field0004}}</td>
					<td width="150" class="label table-border-bottom-right">接待（登记）人</td>
					<td width="135" class="label table-border-bottom table-row-right">{{dataObj.field0005}}</td>
				</tr>
				<tr height="240">
					<td width="88" class="label table-border-bottom-right" style="line-height: 40px;">
						被反</br>映个</br>人或</br>组织</td>
					<td colspan="6" class="text-info value table-border-bottom table-row-right">{{dataObj.field0006}}</td>
				</tr>
				<tr height="240">
					<td width="88" class="label table-border-bottom-right" style="line-height: 40px;">主要</br>内容</td>
					<td colspan="6" class="value table-border-bottom table-row-right">{{dataObj.field0007}}</td>
				</tr>
				<tr height="240">
					<td width="88" class="label table-border-bottom-right" style="line-height: 40px;">处理</br>意见</td>
					<td colspan="6" class="value table-border-bottom table-row-right">{{dataObj.field0008}}</td>
				</tr>
				<tr height="240">
					<td width="88" class="label table-border-bottom-right" style="line-height: 40px;">处理</br>结果</td>
					<td colspan="6" class="value table-border-bottom table-row-right">{{dataObj.field0009}}</td>
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
				// 	"field0002": "张珊",
				// 	"field0003": "2022-02-23",
				// 	"field0004": "地点",
				// 	"field0005": "李仕",
				// 	"field0006": "被反映个人或组织",
				// 	"field0007": "主要内容",
				// 	"field0008": "处理意见",
				// 	"field0009": "处理结果"
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
		filters: {
			filterTime(time) {
				return time && time.length > 16 ? time.substr(0, 16) : time
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
