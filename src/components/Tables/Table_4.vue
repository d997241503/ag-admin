<template>
	<div class="content">
		<div class="title">党政联席会“三重一大”事项集体决策情况</div>
		<div class="table">
			<table width="100%" class="table-border" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td width="157" class="label table-border-bottom-right">党组织</td>
					<td width="200" class="label table-border-bottom-right">{{dataObj.field0001}}</td>
					<td width="116" class="label table-border-bottom-right">主持人</td>
					<td colspan="2" class="label table-border-bottom table-row-right">{{dataObj.field0002}}</td>
				</tr>
				<tr height="60">
					<td width="157" class="label table-border-bottom-right">会议时间</td>
					<td width="200" class="label table-border-bottom-right">{{dataObj.field0003 | filterTime}}</td>
					<td width="116" class="label table-border-bottom-right">地点</td>
					<td colspan="2" class="label table-border-bottom table-row-right">{{dataObj.field0004}}</td>
				</tr>
				<tr height="60">
					<td width="157" class="label table-border-bottom-right">参会人员</td>
					<td colspan="2" class="label table-border-bottom-right">{{dataObj.field0005}}</td>
					<td width="131" class="label table-border-bottom-right">决策事项</td>
					<td class="label table-border-bottom table-row-right">{{dataObj.field0006}}</td>
				</tr>
				<tr height="706">
					<td colspan="5" style="position: relative;padding: 40px 10px;" class="value table-border-bottom table-row-right">
						<div class="hint-text">决策程序及主要内容（可粘贴会议记录、纪要、新闻报道等图片）</div>
						<div class="file-info" v-if="dataObj.field0007Array && dataObj.field0007Array.length" v-for="(item, index) in dataObj.field0007Array" :key="index">{{item.fileName}}</div>
					</td>
				</tr>
				<tr height="78">
					<td width="157" class="label table-border-bottom-right">决策结果</td>
					<td colspan="4" class="value table-border-bottom table-row-right">
						<div class="file-info" v-if="dataObj.field0008Array && dataObj.field0008Array.length" v-for="(item, index) in dataObj.field0008Array" :key="index">{{item.fileName}}</div>
					</td>
				</tr>
				<tr height="78">
					<td width="157" class="label table-border-bottom-right">签字</td>
					<td colspan="4" class="value table-border-bottom table-row-right">
						<div class="file-info" v-if="dataObj.field0009Array && dataObj.field0009Array.length" v-for="(item, index) in dataObj.field0009Array" :key="index">{{item.fileName}}</div>
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
				// 	"field0001": "党组织",
				// 	"field0002": "主持人",
				// 	"field0003": "2021-08-23 15:30:00",
				// 	"field0004": "地点",
				// 	"field0005": "参会人员",
				// 	"field0006": "决策事项",
				// 	"field0010": "决策程序及主要内容",
				// 	"field0007Array": [
				// 		"xxxx"
				// 	],
				// 	"field0008Array": [
				// 		"决策结果"
				// 	],
				// 	"field0009Array": [
				// 		"签字"
				// 	]
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
