<template>
	<div class="content">
		<div class="title">开展廉政约谈、工作约谈、廉政谈话情况</div>
		<div class="table">
			<table width="100%" class="table-border" style="border-bottom: 0;" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td width="130" class="label table-border-bottom-right">党组织</td>
					<td width="260" class="label table-border-bottom-right">{{dataObj.field0001}}</td>
					<td width="130" class="label table-border-bottom-right">时间范围</td>
					<td class="label table-border-bottom-right table-row-right">
						{{dataObj.field0002 | filterTime}} {{dataObj.field0002 ? '至' : ''}}
						{{dataObj.field0011 | filterTime}}
					</td>
				</tr>
			</table>
			<table v-if="dataObj.oaxtFormson1312 &&  dataObj.oaxtFormson1312.length"
				v-for="(item, index) in dataObj.oaxtFormson1312" width="100%" class="table-border"
				style="border-top: 0;" cellspacing="0" cellpadding="0">
				<tr height="60">
					<td class="label table-border-bottom-right">主谈人</td>
					<td class="label table-border-bottom-right">名字</td>
					<td class="label table-border-bottom-right">谈话对象</td>
					<td class="label table-border-bottom-right">名字</td>
					<td class="label table-border-bottom-right">谈话类型</td>
					<td class="label table-border-bottom table-row-right">类型</td>
				</tr>
				<tr height="60">
					<td width="130" class="label table-border-bottom-right">{{item.field0005}}</td>
					<td width="130" class="label table-border-bottom-right">{{item.field0006}}</td>
					<td width="130" class="label table-border-bottom-right">{{item.field0007}}</td>
					<td width="130" class="label table-border-bottom-right">{{item.field0008}}</td>
					<td width="130" class="label table-border-bottom-right">{{item.field0009}}</td>
					<td class="label table-border-bottom table-row-right">{{item.field0010}}</td>
				</tr>
			</table>
			<table width="100%" class="table-border" style="border-top: 0;" cellspacing="0" cellpadding="0">
				<tr height="800">
					<td style="position: relative;padding: 40px 10px;"
						class="value table-border-bottom table-row-right">
						<div class="hint-text" style="text-align: left;">附件：谈话记录图片</div>
						<div>{{dataObj.field0004}}</div>
						<div class="file-info" v-if="dataObj.field0003Array && dataObj.field0003Array.length"
							v-for="(item, index) in dataObj.field0003Array" :key="index">{{item.fileName}}</div>
					</td>
				</tr>
			</table>
		</div>
		<div class="footer">
			注：谈话类型：廉政约谈、工作约谈、廉政谈话。
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// dataObj: {
				// 	"field0001": "党组织",
				// 	"field0002": "2021-04-08 15:00:00",
				// 	"field0011": "2021-04-08 15:30:00",
				// 	"field0012": "主谈人",
				// 	"field0013": "谈话对象",
				// 	"field0014": "谈话类型",
				// 	"field0003": [
				// 		"附件"
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
