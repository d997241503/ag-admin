<template>
	<div class="content">
		<div class="title">常规监督事项报备表</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="80">
					<td class="label table-border-bottom-right">工作事项名称</td>
					<td colspan="3" class="value table-border-bottom table-row-right">{{dataObj.field0001}}</td>
				</tr>
				<tr height="91">
					<td class="label table-border-bottom-right">牵头责任单位</td>
					<td colspan="3" class="value table-border-bottom table-row-right">{{dataObj.field0002Str}}</td>
				</tr>
				<tr height="106">
					<td width="182" class="label table-border-bottom-right">工作负责人</td>
					<td width="182" class="label table-border-bottom-right">{{dataObj.field0003Str}}</td>
					<td width="130" class="label table-border-bottom-right">报备时间</td>
					<td class="label label table-border-bottom table-row-right">
						<!-- <div class="value-text">
							<div style="width: 85px;"></div>
							<div>年</div>
							<div style="width: 60px;"></div>
							<div>月</div>
							<div style="width: 55px;"></div>
							<div>日</div>
						</div> -->
						{{dataObj.field0004 | filterTime}}
					</td>
				</tr>
				<tr height="361">
					<td class="label table-border-bottom-right">工作内容概要</td>
					<td colspan="3" style="position: relative;" class="value table-border-bottom table-row-right">
						<div class="hint-text">（简要说明工作事项的内容、时间、地点及范围等）</div>
						<div class="text-info">{{dataObj.field0005}}</div>
					</td>
				</tr>
				<tr height="160">
					<td class="label table-border-bottom-right">备注</td>
					<td colspan="3" style="position: relative;" class="value table-border-bottom table-row-right">
						<div class="hint-text">（其它需说明的情况，或主要的工作文件等）</div>
						<div class="text-info">{{dataObj.field0006}}</div>
					</td>
				</tr>
			</table>
		</div>
		<div class="footer">注：此表由工作责任（或牵头）单位提前3天填写。</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// dataObj: {
					// "field0001": "工作事项名称",
					// "field0002Str": "牵头责任单位",
					// "field0003Str": "工作负责人",
					// "field0004": "2021-01-14",
					// "field0005": "工作内容概要",
					// "field0006": "备注"
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
				return time && time.length > 10 ? time.substr(0, 10) : time
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
